/*
 * GET /api/availability?from=YYYY-MM-DD&to=YYYY-MM-DD&service=<id>
 *
 * Times are IST. `service` selects the session length (default: the standard 15 minutes).
 * BOOKING_MODE=live → Google Calendar busy times are applied and only bookable slots are
 * returned; if Google is unreachable the request fails (no mock fallback).
 * Otherwise (mock) → booking hours minus held bookings, with "booked"/"past" statuses.
 */
import { BOOKING_RULES } from '../../src/coaching/data/availability.ts';
import { COACHING_SERVICES } from '../../src/coaching/data/services.ts';
import { bookingWindow } from '../../src/coaching/lib/slots.ts';
import { computeDays } from '../../server/availability.ts';
import { clock } from '../../server/clock.ts';
import { bookingMode, type Env } from '../../server/env.ts';
import { googleConfig, GoogleError } from '../../server/google.ts';
import { fail, json } from '../../server/http.ts';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const UNAVAILABLE = 'Online booking is temporarily unavailable. Please use the other contact options on this page.';

export const onRequest = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  if (request.method !== 'GET') return fail(405, 'method', 'Method not allowed.', { Allow: 'GET' });

  const url = new URL(request.url);
  const now = clock.now();
  const mode = bookingMode(env);
  const range = bookingWindow(now);
  let from = url.searchParams.get('from') || range.first;
  let to = url.searchParams.get('to') || range.last;
  if (!DATE_RE.test(from) || !DATE_RE.test(to) || from > to) return fail(400, 'invalid', 'Invalid date range.');

  const serviceId = url.searchParams.get('service');
  const service = serviceId ? COACHING_SERVICES.find((s) => s.id === serviceId && s.booking === 'server') : null;
  if (serviceId && !service) return fail(400, 'service_not_bookable', 'This service can’t be booked online.');
  const durationMinutes = service?.durationMinutes ?? BOOKING_RULES.sessionMinutes;

  if (from < range.first) from = range.first;
  if (to > range.last) to = range.last;
  if (from > to) return json(200, { ok: true, mode, days: [], window: range });

  if (!env.BOOKINGS_DB || (mode === 'live' && !googleConfig(env))) {
    console.error('availability: missing configuration', { db: !!env.BOOKINGS_DB, mode });
    return fail(503, 'not_configured', UNAVAILABLE);
  }

  try {
    const days = await computeDays({ env, db: env.BOOKINGS_DB, mode, now, durationMinutes }, from, to);
    return json(200, { ok: true, mode, days, window: range });
  } catch (err) {
    if (err instanceof GoogleError) {
      console.error('availability: calendar unavailable', err.code);
      return fail(503, 'calendar_unavailable', 'Live availability couldn’t be loaded right now. Please try again shortly or use the other contact options on this page.');
    }
    console.error('availability: database error', err instanceof Error ? err.message : 'unknown');
    return fail(500, 'server', 'Availability could not be loaded. Please try again.');
  }
};
