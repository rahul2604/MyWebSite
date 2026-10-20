/*
 * Slot computation shared by GET /api/availability and the booking re-check.
 *
 * mock mode: booking hours minus held/confirmed bookings in D1 (statuses shown for the demo UI).
 * live mode: booking hours minus Google Calendar busy periods minus D1 holds, and ONLY bookable
 *            slots are returned (no busy details are exposed). If Google can't be reached, this
 *            throws — mock slots are never presented as real availability.
 *
 * Buffer: a slot needs `bufferMinutes` free after it, and must start at least `bufferMinutes`
 * after any busy period ends — i.e. busy periods are treated as [start, end + buffer).
 */
import { BOOKING_RULES } from '../src/coaching/data/availability.ts';
import { addDays } from '../src/coaching/lib/dates.ts';
import { checkSlot, istToMs, overlaps, rulesFor, scheduledTimes, slotRange } from '../src/coaching/lib/slots.ts';
import { bookingsBetween, ensureSchema, type D1Like } from './bookingStore.ts';
import type { BookingMode, Env } from './env.ts';
import { getBusy } from './google.ts';

export interface DaySlots {
  date: string;
  slots: { time: string; status: 'available' | 'booked' | 'past' }[];
}

interface Ctx {
  env: Env;
  db: D1Like;
  mode: BookingMode;
  now: Date;
  durationMinutes: number;
}

type Range = { startMs: number; blockEndMs: number };

/** Everything that blocks time in [fromMs, toMs): D1 holds, plus Google busy periods in live mode. */
async function blockers(ctx: Ctx, fromMs: number, toMs: number): Promise<Range[]> {
  const bufferMs = BOOKING_RULES.bufferMinutes * 60_000;
  await ensureSchema(ctx.db);
  const held = await bookingsBetween(ctx.db, fromMs - bufferMs, toMs + bufferMs, ctx.now.getTime());
  if (ctx.mode !== 'live') return held;
  const busy = await getBusy(ctx.env, ctx.db, fromMs - bufferMs, toMs + bufferMs);
  return [...held, ...busy.map((b) => ({ startMs: b.startMs, blockEndMs: b.endMs + bufferMs }))];
}

export async function computeDays(ctx: Ctx, from: string, to: string): Promise<DaySlots[]> {
  const rules = rulesFor(ctx.durationMinutes);
  const blocked = await blockers(ctx, istToMs(from, '00:00'), istToMs(addDays(to, 1), '00:00'));
  const days: DaySlots[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) {
    const slots: DaySlots['slots'] = [];
    for (const time of scheduledTimes(d, rules)) {
      const tooSoon = checkSlot(d, time, ctx.now, rules) === 'too_soon';
      const taken = !tooSoon && blocked.some((b) => overlaps(slotRange(d, time, rules), b));
      const status = tooSoon ? 'past' : taken ? 'booked' : 'available';
      if (ctx.mode === 'live' && status !== 'available') continue; // live: only bookable slots
      slots.push({ time, status });
    }
    days.push({ date: d, slots });
  }
  return days;
}

/** Live re-check right before creating the calendar event: is this exact slot still free in Google? */
export async function stillFreeInGoogle(ctx: Ctx, date: string, time: string): Promise<boolean> {
  const bufferMs = BOOKING_RULES.bufferMinutes * 60_000;
  const range = slotRange(date, time, rulesFor(ctx.durationMinutes));
  const busy = await getBusy(ctx.env, ctx.db, range.startMs - bufferMs, range.blockEndMs);
  return !busy.some((b) => overlaps(range, { startMs: b.startMs, blockEndMs: b.endMs + bufferMs }));
}
