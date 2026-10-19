/*
 * Contact-message API boundary for the "Chat with Rahul" widget.
 *
 * The widget only calls `sendContactMessage`, which posts to the Cloudflare
 * Pages Function in functions/api/contact.ts. That function holds the email
 * provider's key as a Cloudflare secret — no credentials live in this file —
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

export class ContactError extends Error {
  constructor(
    message: string,
    readonly code: 'not_configured' | 'invalid' | 'server' | 'network',
  ) {
    super(message);
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

/**
 * Resolves only when the server confirms the email was accepted for delivery.
 * `elapsedMs` is how long the form has been open (used by the server's spam check).
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
    throw new ContactError('Could not reach the server. Check your connection and try again.', 'network');
  } finally {
    clearTimeout(timer);
  }
  const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!res.ok || data?.ok !== true) {
    const code = res.status === 400 ? 'invalid' : res.status === 503 ? 'not_configured' : 'server';
    throw new ContactError(data?.error || 'Your message could not be sent. Please try again later.', code);
  }
}
