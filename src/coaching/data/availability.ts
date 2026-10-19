/*
 * DEMO availability for the booking prototype.
 *
 * This is NOT a real calendar. Slots shown on the site are generated from the
 * weekly template below; nothing is reserved. When a backend is added,
 * `bookingApi.getAvailability` will return real slots instead and this file
 * can be removed.
 */

export const BOOKING_TIMEZONE = 'Asia/Kolkata';
export const BOOKING_TIMEZONE_LABEL = 'IST (Asia/Kolkata, UTC+05:30)';

export interface DemoAvailabilityConfig {
  /** How many days ahead visitors can book, counting from today (IST). */
  bookingWindowDays: number;
  /** Slots starting sooner than this many hours from now are unavailable. */
  minNoticeHours: number;
  /** Start times (24h "HH:MM", IST) offered on each weekday. 0 = Sunday … 6 = Saturday. */
  weekly: Record<number, string[]>;
  /** Specific dates ("YYYY-MM-DD") with no slots at all, e.g. holidays. */
  blockedDates: string[];
  /** Share of slots shown as "already booked" so the unavailable state can be seen (0–1). */
  demoBookedShare: number;
}

export const DEMO_AVAILABILITY: DemoAvailabilityConfig = {
  bookingWindowDays: 45,
  minNoticeHours: 12,
  weekly: {
    0: ['10:00', '11:00', '12:00'],
    1: ['19:00', '20:00', '21:00'],
    2: ['19:00', '20:00', '21:00'],
    3: [],
    4: ['19:00', '20:00', '21:00'],
    5: ['19:00', '20:00'],
    6: ['10:00', '11:00', '12:00', '15:00', '16:00'],
  },
  blockedDates: [],
  demoBookedShare: 0.3,
};
