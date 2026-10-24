/*
 * WhatsApp booking notifications through Meta's official WhatsApp Cloud API (server-side only).
 *
 *   POST https://graph.facebook.com/{version}/{phone-number-id}/messages
 *   { messaging_product: "whatsapp", to, type: "template", template: { name, language, components } }
 *
 * Business-initiated messages must use a template approved in WhatsApp Manager, sent to someone
 * who opted in. The two templates (names configurable) take the same six body parameters:
 *
 *   {{1}} first name  {{2}} service  {{3}} date  {{4}} time (IST)  {{5}} meeting link or a note  {{6}} reference
 *
 * Suggested template text (submit these in WhatsApp Manager; TEMPLATE_PREVIEW below mirrors them
 * so the admin panel and simulate mode show what the booker would read):
 *
 *   booking_confirmation (Utility):
 *     Hi {{1}}, your booking for {{2}} is confirmed.
 *     Date: {{3}}
 *     Time: {{4}}
 *     Fee: Free
 *     Meeting link: {{5}}
 *     Reference: {{6}}
 *     We'll send you a reminder before your session. Need help? Visit rahulmehra.co.in/#support
 *
 *   booking_reminder (Utility):
 *     Hi {{1}}, a reminder that your {{2}} session starts soon.
 *     Date: {{3}}
 *     Time: {{4}}
 *     Meeting link: {{5}}
 *     Reference: {{6}}
 *
 * "sent" means the Cloud API accepted the message and returned a message id. It does NOT mean the
 * message was delivered or read (that would need the delivery-status webhook, not set up here).
 *
 * Modes (WHATSAPP_MODE): "live" sends; "simulate" records what would be sent and never calls Meta;
 * anything else (the default) is off. Tokens never leave this file and are never logged.
 */
import type { Env } from './env.ts';

export type WhatsappMode = 'off' | 'simulate' | 'live';
export type NotificationKind = 'confirmation' | 'reminder';

export const whatsappMode = (env: Env): WhatsappMode =>
  env.WHATSAPP_MODE === 'live' ? 'live' : env.WHATSAPP_MODE === 'simulate' ? 'simulate' : 'off';

/** Live mode needs a token and a phone number ID; returns null when either is missing. */
export function whatsappConfig(env: Env) {
  const token = env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  if (!token || !phoneNumberId || !/^\d{5,30}$/.test(phoneNumberId)) return null;
  const version = /^v\d{1,3}\.\d$/.test(env.WHATSAPP_GRAPH_VERSION ?? '') ? env.WHATSAPP_GRAPH_VERSION! : 'v21.0';
  return {
    token,
    url: `https://graph.facebook.com/${version}/${phoneNumberId}/messages`,
    language: (env.WHATSAPP_TEMPLATE_LANG || 'en').trim(),
    templates: {
      confirmation: (env.WHATSAPP_TEMPLATE_CONFIRMATION || 'booking_confirmation').trim(),
      reminder: (env.WHATSAPP_TEMPLATE_REMINDER || 'booking_reminder').trim(),
    } as Record<NotificationKind, string>,
  };
}

const DEFAULT_REMINDER_MINUTES = 30;
/** Minutes before the session for the reminder (REMINDER_MINUTES_BEFORE, 5–1440; default 30). */
export function reminderMinutes(env: Env): number {
  const n = Number(env.REMINDER_MINUTES_BEFORE);
  return Number.isInteger(n) && n >= 5 && n <= 1440 ? n : DEFAULT_REMINDER_MINUTES;
}

export interface MessageFacts {
  firstName: string;
  serviceTitle: string;
  dateLabel: string;
  /** e.g. "7:00 PM – 7:15 PM IST" */
  timeLabel: string;
  /** Verified meeting URL, or null when it isn't available yet. */
  meetingUrl: string | null;
  reference: string;
}

export const NO_LINK_NOTE = 'It will be shared with you separately before the session';

/**
 * Template parameters must be single-line text: newlines, tabs and runs of 4+ spaces are not
 * allowed by WhatsApp, and long values are truncated.
 */
const param = (s: string, max = 200) => s.replace(/[\r\n\t]+/g, ' ').replace(/ {4,}/g, '   ').trim().slice(0, max) || '-';

export function templateParams(f: MessageFacts): string[] {
  return [f.firstName, f.serviceTitle, f.dateLabel, f.timeLabel, f.meetingUrl ?? NO_LINK_NOTE, f.reference].map((v) => param(v));
}

/** What the booker would read, using the suggested template text above. */
export function templatePreview(kind: NotificationKind, f: MessageFacts): string {
  const [name, service, date, time, link, ref] = templateParams(f);
  return kind === 'confirmation'
    ? [
        `Hi ${name}, your booking for ${service} is confirmed.`,
        `Date: ${date}`,
        `Time: ${time}`,
        'Fee: Free',
        `Meeting link: ${link}`,
        `Reference: ${ref}`,
        `We'll send you a reminder before your session. Need help? Visit rahulmehra.co.in/#support`,
      ].join('\n')
    : [`Hi ${name}, a reminder that your ${service} session starts soon.`, `Date: ${date}`, `Time: ${time}`, `Meeting link: ${link}`, `Reference: ${ref}`].join('\n');
}

export type WhatsappFailure = 'provider_auth' | 'provider_rejected' | 'provider_recipient' | 'provider_unavailable';
export type WhatsappResult = { ok: true; id: string } | { ok: false; code: WhatsappFailure };

/** "+919876543210" → "919876543210" (the Cloud API takes digits only). */
export const toCloudApiNumber = (e164: string) => e164.replace(/\D/g, '');

/** Sends one approved template message. Never throws; never returns provider text. */
export async function sendTemplate(config: NonNullable<ReturnType<typeof whatsappConfig>>, toE164: string, kind: NotificationKind, params: string[]): Promise<WhatsappResult> {
  let res: Response;
  try {
    res = await fetch(config.url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: toCloudApiNumber(toE164),
        type: 'template',
        template: {
          name: config.templates[kind],
          language: { code: config.language },
          components: [{ type: 'body', parameters: params.map((text) => ({ type: 'text', text })) }],
        },
      }),
    });
  } catch {
    console.error('whatsapp: could not reach the Cloud API');
    return { ok: false, code: 'provider_unavailable' };
  }
  const body = (await res.json().catch(() => null)) as { messages?: { id?: string }[]; error?: { code?: number; type?: string } } | null;
  const id = body?.messages?.[0]?.id;
  if (res.ok && typeof id === 'string' && id) return { ok: true, id };

  const code = body?.error?.code;
  let failure: WhatsappFailure = 'provider_rejected';
  if (res.status === 401 || code === 190 || body?.error?.type === 'OAuthException') failure = 'provider_auth';
  else if (res.status === 429 || res.status >= 500 || code === 4 || code === 80007 || code === 130429) failure = 'provider_unavailable';
  else if (code === 131026 || code === 131030 || code === 131021) failure = 'provider_recipient';
  // Error category and numeric code only; provider messages may echo personal data.
  console.error('whatsapp: message not accepted', res.status, typeof code === 'number' ? code : 'no_code');
  return { ok: false, code: failure };
}

/** "+919876543210" → "+91•••••3210", for logs. */
export const maskNumber = (e164: string) => (e164.length > 7 ? `${e164.slice(0, 3)}•••••${e164.slice(-4)}` : '•••');
