/*
 * Date helpers for the booking flow.
 *
 * Calendar dates are plain "YYYY-MM-DD" strings and times are "HH:MM" strings,
 * both in the booking timezone (IST). Weekday and month maths use UTC so the
 * visitor's own timezone never shifts a date.
 */
import { BOOKING_TIMEZONE } from '../data/availability';

const IST_OFFSET = '+05:30';

const pad = (n: number) => String(n).padStart(2, '0');

export const toDateKey = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

export function parseDateKey(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  return { y, m: m - 1, d };
}

const utcDate = (key: string) => {
  const { y, m, d } = parseDateKey(key);
  return new Date(Date.UTC(y, m, d));
};

/** Today's date in IST. */
export function todayKey(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: BOOKING_TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function addDays(key: string, days: number): string {
  const dt = utcDate(key);
  dt.setUTCDate(dt.getUTCDate() + days);
  return toDateKey(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate());
}

export const weekday = (key: string) => utcDate(key).getUTCDay();

/** The exact instant a slot starts. */
export const slotInstant = (date: string, time: string) => new Date(`${date}T${time}:00${IST_OFFSET}`);

/** Weeks for a month grid starting on Monday; `null` pads days outside the month. */
export function monthGrid(year: number, month: number): (string | null)[][] {
  const first = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7;
  const cells: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(toDateKey(year, month, d));
  while (cells.length % 7) cells.push(null);
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export const formatMonth = (year: number, month: number) =>
  new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month, 1)));

export const formatDateLong = (key: string) =>
  new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(utcDate(key));

export const formatDateShort = (key: string) =>
  new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(utcDate(key));

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${pad(m)} ${suffix}`;
}

/** "7:00 – 7:10 PM" when the session length is known, otherwise just "7:00 PM". */
export function formatSlot(time: string, minutes?: number): string {
  if (!minutes) return formatTime(time);
  const [h, m] = time.split(':').map(Number);
  const end = h * 60 + m + minutes;
  const endTime = `${pad(Math.floor(end / 60) % 24)}:${pad(end % 60)}`;
  const [start, startSuffix] = formatTime(time).split(' ');
  const [finish, endSuffix] = formatTime(endTime).split(' ');
  return startSuffix === endSuffix ? `${start} – ${finish} ${endSuffix}` : `${start} ${startSuffix} – ${finish} ${endSuffix}`;
}

/** The visitor's local equivalent of an IST slot, or null when they're already on IST. */
export function localEquivalent(date: string, time: string): string | null {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!zone || zone === BOOKING_TIMEZONE || zone === 'Asia/Calcutta') return null;
  const label = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short',
  }).format(slotInstant(date, time));
  return label;
}

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
