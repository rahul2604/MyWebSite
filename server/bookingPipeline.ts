/*
 * The booking pipeline after a slot is held in D1. Every step is safe to repeat, so a retry
 * with the same idempotency key resumes where the previous attempt stopped:
 *
 *   live mode:  re-check Google busy → create event (pre-assigned id; a retry finds the same
 *               event instead of creating another) → wait for a VALID Meet URL → confirmed
 *   both modes: email owner + booker, each atomically claimed so it is never sent twice
 *   both modes: WhatsApp confirmation for opted-in bookers (server/notifications.ts), claimed the same way
 *
 * A booking is only "confirmed" once its calendar event has a real Meet link (live) — or
 * immediately in mock mode. Emails are sent only for confirmed bookings.
 */
import type { CoachingService } from '../src/coaching/data/services.ts';
import { formatDateLong, formatSlot } from '../src/coaching/lib/dates.ts';
import { stillFreeInGoogle } from './availability.ts';
import { bookerEmail, ownerEmail, type BookingEmailData } from './bookingEmails.ts';
import {
  claimEmail, findByReference, SENDING_STALE_MS, setEmailResult, updateBooking,
  type BookingRow, type D1Like, type EmailStatus, type Recipient,
} from './bookingStore.ts';
import { notificationOwner, type BookingMode, type Env } from './env.ts';
import { getEvent, GoogleError, insertEvent, requestMeet, waitForMeet, type CalendarEvent } from './google.ts';
import { notifyConfirmed } from './notifications.ts';
import { sendViaResend } from './resend.ts';

export const HOLD_MS = 10 * 60 * 1000;
/** A pending booking updated more recently than this is assumed to still be in progress. */
export const IN_PROGRESS_MS = 90 * 1000;
export const EMAIL_RETRY_GAP_MS = 30 * 1000;
export const MAX_EMAIL_ATTEMPTS = 8;
const DEFAULT_FROM = 'Rahul Mehra Bookings <onboarding@resend.dev>';

export interface PipelineCtx {
  env: Env;
  db: D1Like;
  service: CoachingService;
  now: Date;
}

export type Outcome =
  | { ok: true; row: BookingRow; emailRetryAfterSeconds?: number }
  | { ok: false; status: number; code: string; error: string };

const fail = (status: number, code: string, error: string): Outcome => ({ ok: false, status, code, error });

const MSG = {
  slotTaken: 'Sorry, that time is no longer available. Please choose another slot.',
  calendarDown: 'Booking is temporarily unavailable, so nothing has been booked. Please try again shortly or use the other contact options on this page.',
  calendarError: 'We couldn’t add this booking to the calendar, so nothing has been booked. Please try again or choose another time.',
  meetPending: 'Your time is reserved and added to the calendar, but the Google Meet link isn’t ready yet. Press Confirm again in a moment to finish — you won’t be booked twice.',
  incomplete: 'Your booking isn’t finished yet. Please press Confirm again in a moment — you won’t be booked twice.',
};

const reload = async (db: D1Like, row: BookingRow) => (await findByReference(db, row.reference)) ?? row;

function eventDescription(row: BookingRow, service: CoachingService) {
  return [
    `Booking reference: ${row.reference}`,
    `Service: ${service.title} (${row.duration_minutes} minutes)`,
    `Booked by: ${row.name} <${row.email}>`,
    `WhatsApp: ${row.whatsapp}`,
    '',
    'Purpose of the call:',
    row.purpose,
    '',
    `Heard via: ${row.heard_from}`,
    'Booked through rahulmehra.co.in',
  ].join('\n').slice(0, 7000);
}

const isoIst = (date: string, time: string) => `${date}T${time}:00+05:30`;
const endTime = (row: BookingRow) => {
  const end = new Date(row.end_ms + 5.5 * 3600_000); // shift to IST wall clock
  return `${end.toISOString().slice(0, 10)}T${end.toISOString().slice(11, 16)}:00+05:30`;
};

/** Live mode: makes sure the event exists with a valid Meet link, then marks the booking confirmed. */
async function ensureCalendar(ctx: PipelineCtx, row: BookingRow): Promise<Outcome> {
  const { env, db, service } = ctx;
  const nowMs = ctx.now.getTime();
  const resuming = row.calendar_state === 'created' || row.attempts > 1;
  let eventCreated = row.calendar_state === 'created';
  try {
    let event: CalendarEvent | null = null;
    if (resuming && row.event_id) event = await getEvent(env, db, row.event_id); // an earlier attempt may have created it

    if (!event) {
      const free = await stillFreeInGoogle({ env, db, mode: 'live', now: ctx.now, durationMinutes: row.duration_minutes ?? 15 }, row.date, row.time);
      if (!free) {
        await updateBooking(db, row.reference, { status: 'failed', hold_until_ms: null, last_error: 'slot_busy', updated_ms: nowMs });
        return fail(409, 'slot_taken', MSG.slotTaken);
      }
      event = await insertEvent(env, db, {
        id: row.event_id!,
        requestId: row.reference,
        summary: `${service.title} — ${row.name}`.slice(0, 200),
        description: eventDescription(row, service),
        startIso: isoIst(row.date, row.time),
        endIso: endTime(row),
        attendeeEmail: row.email,
        attendeeName: row.name,
        bookingRef: row.reference,
        sendInvites: env.GOOGLE_INVITE_EMAILS === 'true',
      });
    }
    eventCreated = true;
    await updateBooking(db, row.reference, {
      calendar_state: 'created', event_link: event.htmlLink, hold_until_ms: nowMs + HOLD_MS, updated_ms: nowMs,
    });

    if (!event.meetUrl && (event.conference === 'failure' || (resuming && event.conference === 'none'))) {
      event = await requestMeet(env, db, event.id, `${row.reference}-${row.attempts}`);
    }
    if (!event.meetUrl) event = await waitForMeet(env, db, event);

    await updateBooking(db, row.reference, {
      status: 'confirmed', meet_url: event.meetUrl, event_link: event.htmlLink, hold_until_ms: null, last_error: null, updated_ms: nowMs,
    });
    return { ok: true, row: await reload(db, row) };
  } catch (err) {
    const code = err instanceof GoogleError ? err.code : 'internal';
    console.error('bookings: calendar step failed', row.reference, code);
    if (code === 'meet_pending' || code === 'meet_failed') {
      // Event exists; keep the slot held and let the visitor finish with the same key.
      await updateBooking(db, row.reference, { last_error: code, hold_until_ms: nowMs + HOLD_MS, updated_ms: nowMs }).catch(() => {});
      return fail(502, 'meeting_link_pending', MSG.meetPending);
    }
    if (eventCreated || code === 'internal') {
      await updateBooking(db, row.reference, { last_error: code, hold_until_ms: nowMs + HOLD_MS, updated_ms: nowMs }).catch(() => {});
      return fail(503, 'booking_incomplete', MSG.incomplete);
    }
    // Nothing was created: release the slot. (If Google did create the event but the reply was
    // lost, a retry with the same key finds it by id instead of creating another.)
    await updateBooking(db, row.reference, { status: 'failed', hold_until_ms: null, last_error: code, updated_ms: nowMs }).catch(() => {});
    return code === 'event_failed' ? fail(502, 'calendar_error', MSG.calendarError) : fail(503, 'calendar_unavailable', MSG.calendarDown);
  }
}

function emailData(ctx: PipelineCtx, row: BookingRow): BookingEmailData {
  const minutes = row.duration_minutes ?? ctx.service.durationMinutes ?? 15;
  return {
    reference: row.reference,
    serviceTitle: ctx.service.title,
    dateLabel: formatDateLong(row.date),
    timeLabel: formatSlot(row.time, minutes),
    durationMinutes: minutes,
    name: row.name,
    email: row.email,
    whatsapp: row.whatsapp,
    purpose: row.purpose,
    heardFrom: row.heard_from,
    ownerEmail: notificationOwner(ctx.env),
    meetUrl: row.mode === 'live' ? row.meet_url : null,
    eventLink: row.mode === 'live' ? row.event_link : null,
  };
}

/** Sends whichever of the two emails still needs sending. Never re-sends an accepted email. */
async function deliverEmails(ctx: PipelineCtx, row: BookingRow): Promise<{ row: BookingRow; retryAfterSeconds?: number }> {
  const nowMs = ctx.now.getTime();
  if (row.status !== 'confirmed' || !ctx.env.RESEND_API_KEY) return { row };
  if (row.mode === 'live' && !row.meet_url) return { row }; // never email a live booking without its Meet link
  if (row.email_attempts >= MAX_EMAIL_ATTEMPTS) return { row };

  const statusOf = (who: Recipient): EmailStatus => (who === 'owner' ? row.owner_email : row.booker_email);
  let retryAfter = 0;
  const due = (who: Recipient) => {
    const s = statusOf(who);
    if (s === 'sent') return false;
    if (s === 'sending') return nowMs - row.emails_updated_ms > SENDING_STALE_MS;
    if (s === 'failed') {
      const wait = row.emails_updated_ms + EMAIL_RETRY_GAP_MS - nowMs;
      if (wait > 0) retryAfter = Math.max(retryAfter, Math.ceil(wait / 1000));
      return wait <= 0;
    }
    return true; // pending: never attempted
  };

  const data = emailData(ctx, row);
  const from = ctx.env.BOOKING_FROM_EMAIL || ctx.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
  const owner = notificationOwner(ctx.env);
  for (const who of ['owner', 'booker'] as const) {
    if (!due(who) || !(await claimEmail(ctx.db, row.reference, who, nowMs))) continue;
    const content = who === 'owner' ? ownerEmail(data) : bookerEmail(data);
    const result = await sendViaResend(ctx.env.RESEND_API_KEY, {
      from,
      to: [who === 'owner' ? owner : row.email],
      replyTo: who === 'owner' ? row.email : owner,
      ...content,
      tag: who === 'owner' ? 'booking_owner' : 'booking_booker',
    });
    await setEmailResult(ctx.db, row.reference, who, result.ok ? 'sent' : 'failed', result.ok ? null : result.code);
    console.log('bookings: email', row.reference, who, result.ok ? 'accepted' : result.code);
  }
  return { row: await reload(ctx.db, row), retryAfterSeconds: retryAfter || undefined };
}

/** Runs (or resumes) a held booking to completion as far as possible. */
export async function runBooking(ctx: PipelineCtx, held: BookingRow): Promise<Outcome> {
  let row = held;
  if (row.status !== 'confirmed') {
    if (row.mode !== 'live') return fail(500, 'server', MSG.incomplete);
    const result = await ensureCalendar(ctx, row);
    if (!result.ok) return result;
    row = result.row;
  }
  const delivered = await deliverEmails(ctx, row);
  // WhatsApp confirmation (opted-in bookings only). Only reached for a confirmed booking; it records
  // its own outcome and never throws, so a messaging problem can't undo or duplicate the booking.
  await notifyConfirmed(ctx.env, ctx.db, delivered.row, ctx.now.getTime());
  return { ok: true, row: delivered.row, emailRetryAfterSeconds: delivered.retryAfterSeconds };
}

export const publicEmailStatus = (s: EmailStatus) => (s === 'sending' ? 'pending' : s);

/** What the visitor's browser receives. No calendar links, ids or internal details. */
export function publicBooking(row: BookingRow, mode: BookingMode) {
  return {
    reference: row.reference,
    serviceId: row.service_id,
    date: row.date,
    time: row.time,
    durationMinutes: row.duration_minutes,
    createdAt: row.created_at,
    ...(mode === 'live' && row.meet_url ? { meetUrl: row.meet_url } : {}),
  };
}
