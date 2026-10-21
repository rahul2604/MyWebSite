/*
 * Booking API boundary. The UI only calls `apiFor(service)`:
 *
 *   - "server" services → `serverBookingApi` → Pages Functions /api/availability and
 *     /api/bookings. The server decides the mode:
 *       "mock": sample booking hours, D1 holds, emails ("demo booking", link shared later)
 *       "live": Google Calendar busy times, calendar event with a Google Meet link, emails
 *   - "demo" services → `mockBookingApi`, an in-browser prototype: nothing is stored or sent.
 *
 * No credentials or tokens ever reach this code; the server never returns them.
 */
import { BOOKING_RULES, DEMO_BOOKED_SHARE } from '../data/availability';
import { findService, type CoachingService, type ServiceId } from '../data/services';
import { addDays } from '../lib/dates';
import { bookingWindow, checkSlot, rulesFor, scheduledTimes } from '../lib/slots';
import { generateDemoReference } from '../lib/reference';
import { normaliseWhatsapp, validateDetails, type AspirantDetails } from '../lib/validation';

export type SlotStatus = 'available' | 'booked' | 'past';

export interface Slot {
  time: string; // "HH:MM" IST
  status: SlotStatus;
}

export interface DayAvailability {
  date: string; // "YYYY-MM-DD" IST
  slots: Slot[];
}

/** "demo": browser prototype · "mock": server with sample hours · "live": Google Calendar + Meet. */
export type BookingMode = 'demo' | 'mock' | 'live';

export interface Availability {
  days: DayAvailability[];
  mode: BookingMode;
}

export interface BookingRequest {
  serviceId: ServiceId;
  date: string;
  time: string;
  details: AspirantDetails;
  /** One key per confirmation attempt; repeating it never creates a second booking. */
  idempotencyKey: string;
}

/** "sent" = the email provider accepted it (not proof of inbox delivery). "pending" = outcome unknown. */
export type EmailOutcome = 'sent' | 'failed' | 'pending';

export interface BookingConfirmation {
  reference: string;
  serviceId: ServiceId;
  date: string;
  time: string;
  details: AspirantDetails;
  createdAt: string;
  mode: BookingMode;
  /** Live mode only: the verified Google Meet joining URL. */
  meetUrl?: string;
  emails?: { owner: EmailOutcome; booker: EmailOutcome };
  /** Why the booker's confirmation email failed, if it did (category only). */
  bookerEmailIssue?: string;
  /** Set when an email retry was asked for too soon. */
  emailRetryAfterSeconds?: number;
  /** The original request, so unsent emails can be retried with the same idempotency key. */
  request?: BookingRequest;
}

export type BookingErrorCode =
  | 'slot_unavailable' // choose another slot
  | 'invalid_details'
  | 'unavailable' // booking or calendar not available right now — nothing booked
  | 'unfinished' // booking held but not complete (e.g. Meet link pending) — press Confirm again
  | 'in_progress'
  | 'rate_limited'
  | 'network'
  | 'server';

export class BookingError extends Error {
  readonly code: BookingErrorCode;
  constructor(message: string, code: BookingErrorCode) {
    super(message);
    this.code = code;
  }
}

export interface BookingApi {
  /** Slots for every date from `from` to `to` inclusive, for this service's duration. */
  getAvailability(from: string, to: string, serviceId: ServiceId): Promise<Availability>;
  createBooking(request: BookingRequest): Promise<BookingConfirmation>;
  /** First and last bookable dates. */
  bookingWindow(): { first: string; last: string };
}

/* ---------------- Browser demo (nothing stored or sent) ---------------- */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Stable pseudo-random 0–1 per slot, so "booked" demo slots don't move between renders. */
function demoHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

/** Slots taken by demo bookings made in this browser tab. */
const demoReserved = new Set<string>();

const durationOf = (serviceId: ServiceId) => findService(serviceId)?.durationMinutes ?? BOOKING_RULES.sessionMinutes;

function slotsFor(date: string, now: Date, minutes: number): Slot[] {
  const rules = rulesFor(minutes);
  const range = bookingWindow(now, rules);
  if (date < range.first || date > range.last) return [];
  return scheduledTimes(date, rules).map((time) => {
    if (checkSlot(date, time, now, rules) === 'too_soon') return { time, status: 'past' as const };
    const taken = demoReserved.has(`${date}T${time}`) || demoHash(`${date}T${time}`) < DEMO_BOOKED_SHARE;
    return { time, status: taken ? ('booked' as const) : ('available' as const) };
  });
}

export const mockBookingApi: BookingApi = {
  bookingWindow() {
    return bookingWindow(new Date(), BOOKING_RULES);
  },

  async getAvailability(from, to, serviceId) {
    await delay(250);
    const now = new Date();
    const days: DayAvailability[] = [];
    for (let d = from; d <= to; d = addDays(d, 1)) days.push({ date: d, slots: slotsFor(d, now, durationOf(serviceId)) });
    return { days, mode: 'demo' };
  },

  async createBooking(req) {
    await delay(700);
    if (Object.keys(validateDetails(req.details)).length) {
      throw new BookingError('Some of your details need attention.', 'invalid_details');
    }
    const slot = slotsFor(req.date, new Date(), durationOf(req.serviceId)).find((s) => s.time === req.time);
    if (!slot || slot.status !== 'available') {
      throw new BookingError('That slot is no longer available. Please choose another.', 'slot_unavailable');
    }
    demoReserved.add(`${req.date}T${req.time}`);
    return {
      reference: generateDemoReference(req.date),
      serviceId: req.serviceId,
      date: req.date,
      time: req.time,
      details: { ...req.details, whatsapp: normaliseWhatsapp(req.details.whatsapp), email: req.details.email.trim() },
      createdAt: new Date().toISOString(),
      mode: 'demo',
    };
  },
};

/* ---------------- Server (mock or live mode) ---------------- */

const TIMEOUT_MS = 45_000; // a live booking waits for Google to create the Meet link

async function call(url: string, init: RequestInit): Promise<{ res: Response; data: Record<string, any> | null }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    const data = (await res.json().catch(() => null)) as Record<string, any> | null;
    return { res, data };
  } catch {
    throw new BookingError(
      controller.signal.aborted
        ? 'The server took too long to respond, so we can’t confirm your booking yet. Press Confirm again — you won’t be booked twice.'
        : 'Could not reach the server. Check your connection and try again.',
      'network',
    );
  } finally {
    clearTimeout(timer);
  }
}

function toError(res: Response, data: Record<string, any> | null): BookingError {
  const code = data?.code as string | undefined;
  const message = (data?.error as string) || 'Something went wrong and nothing has been confirmed. Please try again.';
  switch (code) {
    case 'slot_taken':
    case 'slot_too_soon':
    case 'slot_invalid':
      return new BookingError(message, 'slot_unavailable');
    case 'invalid':
      return new BookingError(message, 'invalid_details');
    case 'rate_limited':
      return new BookingError(message, 'rate_limited');
    case 'in_progress':
      return new BookingError(message, 'in_progress');
    case 'meeting_link_pending':
    case 'booking_incomplete':
      return new BookingError(message, 'unfinished');
    case 'not_configured':
    case 'service_not_bookable':
    case 'calendar_unavailable':
    case 'calendar_error':
      return new BookingError(message, 'unavailable');
  }
  if (!data && (res.status === 404 || res.status === 405)) {
    return new BookingError('Online booking is temporarily unavailable. Please use the other contact options on this page.', 'unavailable');
  }
  return new BookingError(message, 'server');
}

export const serverBookingApi: BookingApi = {
  bookingWindow() {
    return bookingWindow(new Date(), BOOKING_RULES);
  },

  async getAvailability(from, to, serviceId) {
    const q = new URLSearchParams({ from, to, service: serviceId });
    const { res, data } = await call(`/api/availability?${q}`, { method: 'GET' });
    if (!res.ok || data?.ok !== true) throw toError(res, data);
    return { days: data.days as DayAvailability[], mode: data.mode === 'live' ? 'live' : 'mock' };
  },

  async createBooking(req) {
    const { res, data } = await call('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: req.serviceId, date: req.date, time: req.time, details: req.details, idempotencyKey: req.idempotencyKey }),
    });
    if (!res.ok || data?.ok !== true) throw toError(res, data);
    const b = data.booking;
    const mode: BookingMode = data.mode === 'live' ? 'live' : 'mock';
    // Live bookings are only "confirmed" with a real Meet link; refuse to show one without it.
    if (mode === 'live' && !(typeof b.meetUrl === 'string' && b.meetUrl.startsWith('https://meet.google.com/'))) {
      throw new BookingError('Your booking isn’t finished yet. Please press Confirm again in a moment — you won’t be booked twice.', 'unfinished');
    }
    return {
      reference: b.reference,
      serviceId: b.serviceId,
      date: b.date,
      time: b.time,
      details: { ...req.details, whatsapp: normaliseWhatsapp(req.details.whatsapp), email: req.details.email.trim() },
      createdAt: b.createdAt,
      mode,
      meetUrl: mode === 'live' ? b.meetUrl : undefined,
      emails: data.emails,
      bookerEmailIssue: data.bookerEmailIssue,
      emailRetryAfterSeconds: data.emailRetryAfterSeconds,
      request: req,
    };
  },
};

/** The API for a service: "server" services go through the server, the rest stay in-browser demos. */
export const apiFor = (service: Pick<CoachingService, 'booking'>): BookingApi =>
  service.booking === 'server' ? serverBookingApi : mockBookingApi;

/** New idempotency key for one confirmation attempt. */
export const newIdempotencyKey = () =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');
