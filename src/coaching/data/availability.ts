/*
 * Booking rules and MOCK weekly availability.
 *
 * Shared by the browser and the server (functions/api/*), so the slots a visitor
 * sees are exactly the slots the server will accept. These hours are sample
 * data, not a real calendar; a future Google Calendar integration would replace
 * `weekly` with free/busy data.
 */

export const BOOKING_TIMEZONE = 'Asia/Kolkata';
export const BOOKING_TIMEZONE_LABEL = 'IST (Asia/Kolkata, UTC+05:30)';
/** IST has no daylight saving, so this offset is fixed. */
export const IST_OFFSET = '+05:30';

export interface BookingRules {
  /** Length of a bookable session, in minutes. */
  sessionMinutes: number;
  /** Gap kept free after every session, in minutes. */
  bufferMinutes: number;
  /** Slots starting sooner than this are not offered. */
  minNoticeMinutes: number;
  /** How many days ahead visitors can book, counting today (IST). */
  bookingWindowDays: number;
  /** Mock opening hours per weekday (0 = Sunday … 6 = Saturday), as IST ["HH:MM", "HH:MM") ranges. */
  weekly: Record<number, [string, string][]>;
  /** Dates ("YYYY-MM-DD") with no slots at all, e.g. holidays. */
  blockedDates: string[];
}

export const BOOKING_RULES: BookingRules = {
  sessionMinutes: 15,
  bufferMinutes: 15,
  minNoticeMinutes: 120,
  bookingWindowDays: 30,
  weekly: {
    0: [['10:00', '13:00']],
    1: [['19:00', '22:00']],
    2: [['19:00', '22:00']],
    3: [],
    4: [['19:00', '22:00']],
    5: [['19:00', '21:00']],
    6: [['10:00', '13:00'], ['15:00', '17:00']],
  },
  blockedDates: [],
};

/** Demo-only services: share of slots shown as "already booked" so the unavailable state is visible (0–1). */
export const DEMO_BOOKED_SHARE = 0.3;
