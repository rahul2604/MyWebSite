/*
 * POST /api/bookings — books a "server" service.
 *
 *   1. validate request, service, details and slot (shared rules; service's own duration)
 *   2. hold the slot atomically in D1 (no overlap with other active bookings + buffer)
 *   3. BOOKING_MODE=live: re-check Google busy, create the Calendar event with a Google Meet
 *      link, and only then mark the booking confirmed (server/bookingPipeline.ts)
 *   4. email the owner and the booker (each at most once; failures can be retried)
 *
 * Idempotency: the browser sends one key per confirmation attempt. Repeating it never creates
 * a second booking or event; it resumes an unfinished booking or retries unsent emails.
 *
 * Environment: see server/env.ts.
 */
import { COACHING_SERVICES } from '../../src/coaching/data/services.ts';
import { generateReference } from '../../src/coaching/lib/reference.ts';
import { checkSlot, rulesFor, slotRange } from '../../src/coaching/lib/slots.ts';
import { HEARD_FROM_OPTIONS, normaliseWhatsapp, validateDetails, type AspirantDetails } from '../../src/coaching/lib/validation.ts';
import { HOLD_MS, IN_PROGRESS_MS, publicBooking, publicEmailStatus, runBooking, type Outcome } from '../../server/bookingPipeline.ts';
import { ensureSchema, findByIdemKey, findByReference, reclaim, reserve, type BookingRow, type D1Like } from '../../server/bookingStore.ts';
import { clock } from '../../server/clock.ts';
import { bookingMode, emailDeliveryOff, type Env } from '../../server/env.ts';
import { googleConfig, newEventId } from '../../server/google.ts';
import { fail, json, makeRateLimiter, sameSite } from '../../server/http.ts';
import { getNotifications, publicWhatsappStatus } from '../../server/notifications.ts';

const MAX_BODY_BYTES = 16 * 1024;
const IDEM_RE = /^[A-Za-z0-9-]{16,64}$/;
const UNAVAILABLE = 'Online booking is temporarily unavailable. Please use the other contact options on this page.';
const limited = makeRateLimiter(5, 10 * 60 * 1000);

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');

async function respond(db: D1Like, outcome: Outcome, replayed: boolean): Promise<Response> {
  if (!outcome.ok) return fail(outcome.status, outcome.code, outcome.error);
  const row = outcome.row;
  const notes = row.whatsapp_opt_in === 1 ? await getNotifications(db, row.reference).catch(() => []) : [];
  return json(200, {
    ok: true,
    mode: row.mode,
    ...(replayed ? { replayed: true } : {}),
    booking: { ...publicBooking(row, row.mode), free: true },
    emails: { owner: publicEmailStatus(row.owner_email), booker: publicEmailStatus(row.booker_email) },
    whatsapp: publicWhatsappStatus(row, notes),
    ...(row.booker_email_issue && row.booker_email !== 'sent' ? { bookerEmailIssue: row.booker_email_issue } : {}),
    ...(row.owner_email_issue && row.owner_email !== 'sent' ? { ownerEmailIssue: row.owner_email_issue } : {}),
    ...(outcome.emailRetryAfterSeconds ? { emailRetryAfterSeconds: outcome.emailRetryAfterSeconds } : {}),
  });
}

export const onRequest = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  if (request.method !== 'POST') return fail(405, 'method', 'Method not allowed.', { Allow: 'POST' });
  if (!sameSite(request.headers.get('Origin'), request.url)) return fail(403, 'forbidden', 'Request not allowed.');
  if (!(request.headers.get('Content-Type') || '').includes('application/json')) return fail(415, 'unsupported', 'Unsupported request.');
  if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY_BYTES) return fail(413, 'too_large', 'Request too large.');

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return fail(413, 'too_large', 'Request too large.');
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, 'invalid', 'Invalid request.');
  }

  // Service: must exist, be bookable through the server, have a configured duration and be free.
  // There is no payment integration, so the server only ever books free services; the request
  // carries no price, and nothing in it can add a charge.
  const service = COACHING_SERVICES.find((s) => s.id === body.serviceId);
  if (!service || service.booking !== 'server' || !service.durationMinutes || service.free !== true) {
    return fail(400, 'service_not_bookable', 'This service can’t be booked online yet.');
  }
  const rules = rulesFor(service.durationMinutes);

  const idemKey = str(body.idempotencyKey, 64);
  if (!IDEM_RE.test(idemKey)) return fail(400, 'invalid', 'Invalid request.');

  // Details: same validation as the form.
  const raw = (body.details && typeof body.details === 'object' ? body.details : {}) as Record<string, unknown>;
  const details: AspirantDetails = {
    fullName: str(raw.fullName, 100).replace(/[\u0000-\u001f\u007f]+/g, ' ').trim(),
    whatsapp: str(raw.whatsapp, 30),
    email: str(raw.email, 254).replace(/[\u0000-\u001f\u007f]+/g, '').trim(),
    purpose: str(raw.purpose, 1000).replace(/\r\n?/g, '\n').trim(),
    heardFrom: (HEARD_FROM_OPTIONS as readonly string[]).includes(str(raw.heardFrom, 40)) ? (str(raw.heardFrom, 40) as AspirantDetails['heardFrom']) : '',
    // Consent must be an explicit boolean true; anything else means no WhatsApp messages.
    whatsappOptIn: raw.whatsappOptIn === true,
  };
  const fieldErrors = validateDetails(details);
  if (Object.keys(fieldErrors).length) {
    return fail(400, 'invalid', 'Some of your details need attention.', undefined, { fields: fieldErrors });
  }

  // Slot: re-checked against the schedule, the booking window and the minimum notice.
  const date = str(body.date, 10);
  const time = str(body.time, 5);
  const now = clock.now();
  const nowMs = now.getTime();
  const check = checkSlot(date, time, now, rules);

  const mode = bookingMode(env);
  if (!env.BOOKINGS_DB || (!env.RESEND_API_KEY && !emailDeliveryOff(env)) || (mode === 'live' && !googleConfig(env))) {
    console.error('bookings: missing configuration', { db: !!env.BOOKINGS_DB, resend: !!env.RESEND_API_KEY, mode });
    return fail(503, 'not_configured', UNAVAILABLE);
  }
  const db = env.BOOKINGS_DB;

  if (limited(request.headers.get('CF-Connecting-IP') || 'unknown', nowMs)) {
    return fail(429, 'rate_limited', 'You’ve made several booking requests recently. Please wait a few minutes and try again.');
  }

  try {
    await ensureSchema(db);
    const ctx = { env, db, service, now };

    // Same key again: replay, resume or retry emails — never a second booking.
    const existing = await findByIdemKey(db, idemKey);
    if (existing) return await handleRepeat(existing);

    if (check === 'too_soon') return fail(409, 'slot_too_soon', 'That time is now less than 2 hours away. Please choose a later slot.');
    if (check !== 'ok') return fail(409, 'slot_invalid', 'That time isn’t available. Please choose another slot.');

    const { startMs, endMs, blockEndMs } = slotRange(date, time, rules);
    const reserved = await reserve(db, {
      reference: generateReference(date, 'RM'),
      idem_key: idemKey,
      service_id: service.id,
      date,
      time,
      start_ms: startMs,
      end_ms: endMs,
      block_end_ms: blockEndMs,
      duration_minutes: service.durationMinutes,
      name: details.fullName,
      email: details.email,
      whatsapp: normaliseWhatsapp(details.whatsapp),
      purpose: details.purpose,
      heard_from: details.heardFrom,
      mode,
      status: mode === 'live' ? 'pending' : 'confirmed',
      event_id: mode === 'live' ? newEventId() : null,
      hold_until_ms: mode === 'live' ? nowMs + HOLD_MS : null,
      created_at: now.toISOString(),
      whatsapp_opt_in: details.whatsappOptIn ? 1 : 0,
    }, nowMs);

    if (reserved.status === 'duplicate_key' || (reserved.status === 'conflict' && (await findByIdemKey(db, idemKey)))) {
      // The visitor's own earlier click holds this slot (e.g. a double submit) — not someone else.
      return fail(409, 'in_progress', 'Your booking is already being processed. Please wait a few seconds and press Confirm again.');
    }
    if (reserved.status === 'conflict') return fail(409, 'slot_taken', 'Sorry, that slot was just booked by someone else. Please choose another time.');
    return respond(db, await runBooking(ctx, reserved.row), false);

    async function handleRepeat(row: BookingRow): Promise<Response> {
      const sameRequest =
        row.service_id === service!.id && row.date === date && row.time === time && row.email.toLowerCase() === details.email.toLowerCase();
      if (!sameRequest) return fail(409, 'idempotency_conflict', 'This doesn’t match your original booking request. Please reload the page and try again.');
      if (row.mode === 'live' && !googleConfig(env)) return fail(503, 'not_configured', UNAVAILABLE);

      if (row.status === 'confirmed') return respond(db, await runBooking(ctx, row), true); // only unsent emails are retried
      if (row.status === 'pending' && (row.hold_until_ms ?? 0) > nowMs && nowMs - row.updated_ms < IN_PROGRESS_MS) {
        return fail(409, 'in_progress', 'Your booking is still being processed. Please wait a few seconds and press Confirm again.');
      }
      // Unfinished (failed, or stale pending): take the hold again if the slot is still free, then resume.
      if (!(await reclaim(db, row.idem_key, nowMs, nowMs + HOLD_MS))) {
        return fail(409, 'slot_taken', 'Sorry, that time is no longer available. Please choose another slot.');
      }
      const fresh = (await findByReference(db, row.reference)) ?? row;
      return respond(db, await runBooking(ctx, fresh), true);
    }
  } catch (err) {
    console.error('bookings: unexpected error', err instanceof Error ? err.message.slice(0, 120) : 'unknown');
    return fail(500, 'server', 'Something went wrong and nothing has been confirmed. Please try again — you won’t be booked twice.');
  }
};
