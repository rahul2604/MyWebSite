/*
 * Environment for the Pages Functions. Locally: .dev.vars. Production: Cloudflare Pages →
 * Settings → Variables and Secrets (secrets) and Bindings (D1).
 */
import type { D1Like } from './bookingStore.ts';

export interface Env {
  /** D1 database binding. */
  BOOKINGS_DB?: D1Like;
  /** Secret. */
  RESEND_API_KEY?: string;
  /** "live" = Google Calendar availability + events with Meet. Anything else = mock hours (default). */
  BOOKING_MODE?: string;
  BOOKING_OWNER_EMAIL?: string;
  BOOKING_FROM_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
  /** Secret. OAuth Web client ID. */
  GOOGLE_CLIENT_ID?: string;
  /** Secret. OAuth Web client secret. */
  GOOGLE_CLIENT_SECRET?: string;
  /** Secret. 32 random bytes, base64 — encrypts the stored refresh token and signs OAuth state. */
  GOOGLE_TOKEN_ENCRYPTION_KEY?: string;
  /** "true" only while authorizing; otherwise /api/google/* return 404. */
  GOOGLE_SETUP_ENABLED?: string;
  /** The only Google account allowed to connect (default rahul.a.mehra@gmail.com). */
  GOOGLE_CALENDAR_OWNER?: string;
  /** "true" = Google also emails the calendar invite to the booker (sendUpdates=all). Default: off. */
  GOOGLE_INVITE_EMAILS?: string;
}

export const DEFAULT_OWNER = 'rahul.a.mehra@gmail.com';

export type BookingMode = 'mock' | 'live';
export const bookingMode = (env: Env): BookingMode => (env.BOOKING_MODE === 'live' ? 'live' : 'mock');

export const calendarOwner = (env: Env) => (env.GOOGLE_CALENDAR_OWNER || DEFAULT_OWNER).trim().toLowerCase();
export const notificationOwner = (env: Env) => env.BOOKING_OWNER_EMAIL || DEFAULT_OWNER;
