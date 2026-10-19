/*
 * Contact-message API boundary for the "Chat with Rahul" widget.
 *
 * The widget only calls `sendContactMessage`, which posts to the Cloudflare
 * Pages Function in functions/api/contact.ts. That function holds the email
 * provider's key as a server-side secret — no credentials live in this file —
 * and answers { ok: true } only once the provider has accepted the email.
 */

export interface ContactMessage {
  name: string;
  email: string;
  whatsapp: string;
  message: string;
  /** Honeypot: real visitors leave this empty. */
  website: string;
}

export type ContactErrors = Partial<Record<'name' | 'email' | 'whatsapp' | 'message', string>>;

/** Client-side failure kinds plus the server's error codes (see functions/api/contact.ts). */
export type ContactFailure =
  | 'network' | 'timeout' | 'no_endpoint' | 'server'
  | 'invalid' | 'too_fast' | 'rate_limited' | 'too_large' | 'spam' | 'forbidden'
  | 'not_configured' | 'provider_auth' | 'provider_sender' | 'provider_rejected' | 'provider_unavailable';

export class ContactError extends Error {
  readonly code: ContactFailure;
  constructor(message: string, code: ContactFailure) {
    super(message);
    this.code = code;
  }
}

const isLocalhost = () => ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);

/** Set-up help shown only on localhost, so the site owner knows what to fix. Visitors never see it. */
export function devHint(code: ContactFailure): string | null {
  if (!isLocalhost()) return null;
  switch (code) {
    case 'network':
      return 'Developer note: the local server is not reachable. Start "npm run preview:pages" and reload http://localhost:8788.';
    case 'no_endpoint':
      return 'Developer note: /api/contact is not running. "npm run dev" and "npm run preview" serve the frontend only — start "npm run preview:pages" (http://localhost:8788) as well.';
    case 'not_configured':
      return 'Developer note: RESEND_API_KEY is not set. Copy .dev.vars.example to .dev.vars, add your Resend API key, then restart "npm run preview:pages".';
    case 'provider_auth':
      return 'Developer note: Resend rejected the API key. Check RESEND_API_KEY in .dev.vars (no quotes or spaces), then restart "npm run preview:pages".';
    case 'provider_sender':
      return 'Developer note: Resend refused the sender. With onboarding@resend.dev you can only send to the email that owns the Resend account; otherwise verify your domain and set CONTACT_FROM_EMAIL.';
    case 'provider_rejected':
    case 'provider_unavailable':
      return 'Developer note: Resend did not accept the email. See the terminal running "npm run preview:pages" and Resend → Logs for the reason.';
    default:
      return null;
  }
}

const CONTACT_ENDPOINT = '/api/contact';
const TIMEOUT_MS = 20_000;

export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;

export function validateContact(m: ContactMessage): ContactErrors {
  const e: ContactErrors = {};
  if (m.name.trim().length < 2) e.name = 'Enter your name.';
  if (!m.email.trim()) e.email = 'Enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.email.trim())) e.email = 'Enter a valid email address.';
  const wa = m.whatsapp.replace(/[\s()-]/g, '');
  if (wa && wa !== '+' && !/^\+\d{7,17}$/.test(wa)) e.whatsapp = 'Use your country code, e.g. +91 98765 43210, or leave this blank.';
  const msg = m.message.trim();
  if (!msg) e.message = 'Write a message.';
  else if (msg.length < MESSAGE_MIN) e.message = `Add a little more detail (at least ${MESSAGE_MIN} characters).`;
  else if (msg.length > MESSAGE_MAX) e.message = `Keep your message under ${MESSAGE_MAX} characters.`;
  return e;
}

const SERVER_CODES: ContactFailure[] = [
  'invalid', 'too_fast', 'rate_limited', 'too_large', 'spam', 'forbidden',
  'not_configured', 'provider_auth', 'provider_sender', 'provider_rejected', 'provider_unavailable',
];

/**
 * Resolves only when the server confirms the email provider accepted the message.
 * `elapsedMs` is how long the form has been open (used by the server's spam check).
 * Never retries automatically, so a slow request can't produce duplicate emails.
 */
export async function sendContactMessage(m: ContactMessage, elapsedMs: number): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        name: m.name.trim(),
        email: m.email.trim(),
        whatsapp: m.whatsapp.replace(/[\s()-]/g, ''),
        message: m.message.trim(),
        website: m.website,
        elapsedMs: Math.round(elapsedMs),
      }),
    });
  } catch {
    if (controller.signal.aborted) {
      throw new ContactError(
        'The server took too long to respond, so your message may not have been sent. Please try again in a moment.',
        'timeout',
      );
    }
    throw new ContactError('Could not reach the server. Check your connection and try again.', 'network');
  } finally {
    clearTimeout(timer);
  }

  const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; code?: string } | null;
  if (res.ok && data?.ok === true) return;

  if (data && SERVER_CODES.includes(data.code as ContactFailure)) {
    throw new ContactError(data.error || 'Your message could not be sent. Please try again later.', data.code as ContactFailure);
  }
  // No JSON from our function: the endpoint isn't there (e.g. a frontend-only dev server).
  if (!data && (res.status === 404 || res.status === 405 || res.status >= 500)) {
    throw new ContactError('Messaging is unavailable right now. Please use the other contact options on this page.', 'no_endpoint');
  }
  throw new ContactError(data?.error || 'Your message could not be sent. Please try again later.', 'server');
}
