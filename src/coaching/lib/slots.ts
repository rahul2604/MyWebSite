/*
 * Slot rules shared by the browser and the server. Pure functions — pass `now`
 * explicitly so the server (and tests) decide what "now" is.
 *
 * Slots start every (session + buffer) minutes inside each opening range, so a
 * 15-minute session is always followed by at least 15 free minutes.
 */
import { BOOKING_RULES, IST_OFFSET, type BookingRules } from '../data/availability.ts';
import { addDays, todayKey, weekday } from './dates.ts';

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const toHHMM = (mins: number) => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

/** The booking rules for a service of the given length (buffer, notice and hours unchanged). */
export const rulesFor = (sessionMinutes: number, rules: BookingRules = BOOKING_RULES): BookingRules => ({ ...rules, sessionMinutes });

/** UTC milliseconds for an IST date and time. */
export const istToMs = (date: string, time: string) => Date.parse(`${date}T${time}:00${IST_OFFSET}`);

/** First and last bookable dates (IST), counting today. */
export function bookingWindow(now: Date, rules: BookingRules = BOOKING_RULES) {
  const first = todayKey(now);
  return { first, last: addDays(first, rules.bookingWindowDays - 1) };
}

/** Every start time the opening hours allow on a date, before notice and bookings are applied. */
export function scheduledTimes(date: string, rules: BookingRules = BOOKING_RULES): string[] {
  if (rules.blockedDates.includes(date)) return [];
  const step = rules.sessionMinutes + rules.bufferMinutes;
  const times: string[] = [];
  for (const [from, to] of rules.weekly[weekday(date)] ?? []) {
    const end = toMinutes(to);
    for (let t = toMinutes(from); t + rules.sessionMinutes <= end; t += step) times.push(toHHMM(t));
  }
  return times;
}

/** The time range a booking blocks: the session itself plus the buffer after it. */
export function slotRange(date: string, time: string, rules: BookingRules = BOOKING_RULES) {
  const startMs = istToMs(date, time);
  const endMs = startMs + rules.sessionMinutes * 60_000;
  return { startMs, endMs, blockEndMs: endMs + rules.bufferMinutes * 60_000 };
}

export type SlotCheck = 'ok' | 'malformed' | 'outside_window' | 'not_offered' | 'too_soon';

/** Whether a date/time is a slot the schedule offers right now (ignoring existing bookings). */
export function checkSlot(date: string, time: string, now: Date, rules: BookingRules = BOOKING_RULES): SlotCheck {
  if (!DATE_RE.test(date) || !TIME_RE.test(time) || Number.isNaN(istToMs(date, time))) return 'malformed';
  const { first, last } = bookingWindow(now, rules);
  if (date < first || date > last) return 'outside_window';
  if (!scheduledTimes(date, rules).includes(time)) return 'not_offered';
  if (istToMs(date, time) < now.getTime() + rules.minNoticeMinutes * 60_000) return 'too_soon';
  return 'ok';
}

/** Ranges ([start, blockEnd) in ms) overlap? Used to keep the buffer between bookings. */
export const overlaps = (a: { startMs: number; blockEndMs: number }, b: { startMs: number; blockEndMs: number }) =>
  a.startMs < b.blockEndMs && b.startMs < a.blockEndMs;
