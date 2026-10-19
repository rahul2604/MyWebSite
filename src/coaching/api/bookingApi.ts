/*
 * Booking API boundary.
 *
 * The UI only talks to `bookingApi`. Today it is a mock that runs in the
 * browser. To go live, implement `BookingApi` against a server (e.g. a
 * Cloudflare Pages Function) that stores bookings, checks and reserves slots
 * atomically (preventing double bookings), creates the Google Calendar event
 * and Meet link, and sends WhatsApp / email confirmations — then swap the
 * export at the bottom of this file. Secrets must live on that server, never here.
 */
import { DEMO_AVAILABILITY } from '../data/availability';
import type { ServiceId } from '../data/services';
import { addDays, slotInstant, todayKey, weekday } from '../lib/dates';
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

export interface BookingRequest {
  serviceId: ServiceId;
  date: string;
  time: string;
  details: AspirantDetails;
}

export interface BookingConfirmation {
  reference: string;
  serviceId: ServiceId;
  date: string;
  time: string;
  details: AspirantDetails;
  createdAt: string;
  /** "demo" until a real backend reserves the slot. */
  status: 'demo';
}

export class BookingError extends Error {
  constructor(
    message: string,
    readonly code: 'slot_unavailable' | 'invalid_details' | 'network',
  ) {
    super(message);
  }
}

export interface BookingApi {
  /** Slots for every date from `from` to `to` inclusive. */
  getAvailability(from: string, to: string): Promise<DayAvailability[]>;
  createBooking(request: BookingRequest): Promise<BookingConfirmation>;
  /** First and last bookable dates. */
  bookingWindow(): { first: string; last: string };
}

/* ---------------- Mock implementation (demo only) ---------------- */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Stable pseudo-random 0–1 per slot, so "booked" demo slots don't move between renders. */
function demoHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

/** Slots taken by demo bookings made in this browser tab. */
const demoReserved = new Set<string>();

function slotsFor(date: string, now: Date): Slot[] {
  const cfg = DEMO_AVAILABILITY;
  const range = mockBookingApi.bookingWindow();
  if (date < range.first || date > range.last || cfg.blockedDates.includes(date)) return [];
  const minStart = now.getTime() + cfg.minNoticeHours * 3600_000;
  return (cfg.weekly[weekday(date)] ?? []).map((time) => {
    if (slotInstant(date, time).getTime() < minStart) return { time, status: 'past' as const };
    const taken = demoReserved.has(`${date}T${time}`) || demoHash(`${date}T${time}`) < cfg.demoBookedShare;
    return { time, status: taken ? ('booked' as const) : ('available' as const) };
  });
}

export const mockBookingApi: BookingApi = {
  bookingWindow() {
    const first = todayKey();
    return { first, last: addDays(first, DEMO_AVAILABILITY.bookingWindowDays - 1) };
  },

  async getAvailability(from, to) {
    await delay(250);
    const now = new Date();
    const days: DayAvailability[] = [];
    for (let d = from; d <= to; d = addDays(d, 1)) days.push({ date: d, slots: slotsFor(d, now) });
    return days;
  },

  async createBooking(req) {
    await delay(700);
    if (Object.keys(validateDetails(req.details)).length) {
      throw new BookingError('Some of your details need attention.', 'invalid_details');
    }
    const slot = slotsFor(req.date, new Date()).find((s) => s.time === req.time);
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
      status: 'demo',
    };
  },
};

/** The implementation the UI uses. Swap for a real API client when the backend exists. */
export const bookingApi: BookingApi = mockBookingApi;
