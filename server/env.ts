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
  /**
   * Local development only: "off" lets bookings be made without RESEND_API_KEY (emails stay
   * unsent and the confirmation page says so). Never set this in production.
   */
  EMAIL_DELIVERY?: string;

  /* ---------------- WhatsApp booking notifications (server/whatsapp.ts) ---------------- */
  /** "live" = WhatsApp Cloud API · "simulate" = record + log, never send · anything else = off (default). */
  WHATSAPP_MODE?: string;
  /** Secret. Permanent (system-user) access token for the WhatsApp Cloud API. */
  WHATSAPP_ACCESS_TOKEN?: string;
  /** The Cloud API phone number ID of the business sender number (not the phone number itself). */
  WHATSAPP_PHONE_NUMBER_ID?: string;
  /** Approved template names. Defaults: booking_confirmation, booking_reminder. */
  WHATSAPP_TEMPLATE_CONFIRMATION?: string;
  WHATSAPP_TEMPLATE_REMINDER?: string;
  /** Template language code, as approved in WhatsApp Manager. Default: en. */
  WHATSAPP_TEMPLATE_LANG?: string;
  /** Graph API version. Default: v21.0 — set this to the version your app is configured for. */
  WHATSAPP_GRAPH_VERSION?: string;
  /** Minutes before the session when the reminder is sent. Default 30 (allowed 5–1440). */
  REMINDER_MINUTES_BEFORE?: string;
  /** Secret. Bearer token the scheduled reminder worker sends to POST /api/notifications/run. */
  NOTIFICATIONS_CRON_SECRET?: string;
}

export const DEFAULT_OWNER = 'rahul.a.mehra@gmail.com';

export type BookingMode = 'mock' | 'live';
export const bookingMode = (env: Env): BookingMode => (env.BOOKING_MODE === 'live' ? 'live' : 'mock');

export const calendarOwner = (env: Env) => (env.GOOGLE_CALENDAR_OWNER || DEFAULT_OWNER).trim().toLowerCase();
export const notificationOwner = (env: Env) => env.BOOKING_OWNER_EMAIL || DEFAULT_OWNER;

/** Whether booking emails are switched off for local development (EMAIL_DELIVERY=off). */
export const emailDeliveryOff = (env: Env) => env.EMAIL_DELIVERY === 'off';
