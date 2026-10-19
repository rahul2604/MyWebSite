/*
 * POST /api/contact — Cloudflare Pages Function for the "Chat with Rahul" widget.
 *
 * Emails each enquiry through Resend (https://resend.com) and replies { ok: true }
 * ONLY after Resend accepts the email and returns its id.
 *
 * Environment (local: .dev.vars · production: Cloudflare Pages → Settings → Variables and Secrets):
 *   RESEND_API_KEY      required, SECRET — Resend API key ("re_…")
 *   CONTACT_TO_EMAIL    optional         — recipient (default: rahul.a.mehra@gmail.com)
 *   CONTACT_FROM_EMAIL  optional         — sender (default: Resend's shared test sender, see README)
 */

export interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

interface Context {
  request: Request;
  env: Env;
}

const DEFAULT_TO = 'rahul.a.mehra@gmail.com';
/** Resend's shared sender: no domain setup needed, but it only delivers to the Resend account owner's address. */
const DEFAULT_FROM = 'Chat with Rahul <onboarding@resend.dev>';
const SITE = 'rahulmehra.co.in';
const SOURCE = 'Chat with Rahul contact form';

const LIMITS = { name: 100, email: 254, whatsapp: 24, message: 2000 };
const MESSAGE_MIN = 10;
const MAX_BODY_BYTES = 16 * 1024;
/** Forms submitted faster than this after opening are treated as bots. */
const MIN_FILL_MS = 3000;
/** Best-effort per-visitor limit. Counters live per Cloudflare isolate, so add a WAF rate-limit rule for a hard limit. */
const RATE = { max: 5, windowMs: 10 * 60 * 1000 };
const recent = new Map<string, number[]>();

const EMAIL_RE = /^[^\s@<>"(),;:]+@[^\s@<>"(),;:]+\.[^\s@<>"(),;:]{2,}$/;
const WHATSAPP_RE = /^\+\d{7,17}$/;

/** Error categories the frontend understands. Never contains provider text or secrets. */
export type ContactErrorCode =
  | 'method' | 'forbidden' | 'unsupported' | 'too_large' | 'invalid' | 'spam' | 'too_fast' | 'rate_limited'
  | 'not_configured' | 'provider_auth' | 'provider_sender' | 'provider_rejected' | 'provider_unavailable';

const json = (status: number, body: Record<string, unknown>, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra },
  });

const fail = (status: number, code: ContactErrorCode, error: string, extra?: Record<string, string>) =>
  json(status, { ok: false, code, error }, extra);

const UNDELIVERED = "Your message couldn't be delivered right now. Please try again later or use the other contact options on this page.";

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Strips control characters (incl. CR/LF) from single-line fields. */
const oneLine = (s: unknown) => (typeof s === 'string' ? s.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim() : '');

const sameSite = (origin: string | null, requestUrl: string) => {
  if (!origin) return true; // non-browser clients; every other check still applies
  try {
    return new URL(origin).host === new URL(requestUrl).host;
  } catch {
    return false;
  }
};

function rateLimited(key: string, now: number): boolean {
  const hits = (recent.get(key) ?? []).filter((t) => now - t < RATE.windowMs);
  if (hits.length >= RATE.max) {
    recent.set(key, hits);
    return true;
  }
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5000) recent.clear(); // keep memory bounded
  return false;
}

export interface Enquiry {
  name: string;
  email: string;
  whatsapp: string; // "" when not supplied
  message: string;
  submittedAt: Date;
}

/* ---------------------------------------------------------------- email ---- */

const istFormat = (d: Date) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(d) + ' IST';

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join('') || '?';

export function buildEmail(q: Enquiry) {
  const when = istFormat(q.submittedAt);
  const first = q.name.split(/\s+/)[0] || q.name;
  const waDigits = q.whatsapp.replace(/\D/g, '');
  const replySubject = encodeURIComponent('Re: Your enquiry on rahulmehra.co.in');
  const preview = q.message.replace(/\s+/g, ' ').slice(0, 110);

  const subject = `New Website Enquiry — Chat with Rahul: ${q.name}`.slice(0, 160);

  const text = [
    'NEW WEBSITE ENQUIRY — Chat with Rahul',
    '',
    `Name:      ${q.name}`,
    `Email:     ${q.email}`,
    `WhatsApp:  ${q.whatsapp || 'Not provided'}`,
    `Submitted: ${when}`,
    `Source:    ${SOURCE} (${SITE})`,
    '',
    'Message:',
    q.message,
    '',
    `Reply to this email to respond to ${q.name} directly.`,
  ].join('\n');

  const e = escapeHtml;
  const btn = (href: string, label: string, bg: string) =>
    `<a href="${e(href)}" style="display:inline-block;padding:12px 20px;margin:0 8px 8px 0;background:${bg};color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;border-radius:10px;font-family:Arial,Helvetica,sans-serif">${label}</a>`;
  const detail = (label: string, value: string) =>
    `<tr><td style="padding:10px 0;border-top:1px solid #e6eaf0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#64748b;width:120px;vertical-align:top">${label}</td>` +
    `<td style="padding:10px 0;border-top:1px solid #e6eaf0;font-size:14px;color:#0b1b33;vertical-align:top">${value}</td></tr>`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><title>${e(subject)}</title></head>
<body style="margin:0;padding:0;background:#eef2f8;-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#eef2f8">${e(q.name)}: ${e(preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f8">
<tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #dfe5ee;font-family:Arial,Helvetica,sans-serif">

  <tr><td style="background:#0b1b33;background-image:linear-gradient(135deg,#0b1b33 0%,#15274a 60%,#2557d6 140%);padding:26px 28px 24px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:22px;letter-spacing:-.5px;color:#ffffff">RM<span style="color:#5b85f0">.</span></td>
      <td align="right"><span style="display:inline-block;padding:5px 12px;border-radius:99px;background:rgba(91,133,240,.22);border:1px solid rgba(169,194,242,.45);color:#cfe0ff;font-size:11px;font-weight:700;letter-spacing:.14em">NEW ENQUIRY</span></td>
    </tr></table>
    <div style="margin-top:18px;font-size:24px;line-height:1.25;font-weight:700;color:#ffffff">Someone reached out through Chat with Rahul</div>
    <div style="margin-top:6px;font-size:14px;color:#a9c2f2">${e(when)}</div>
  </td></tr>

  <tr><td style="padding:24px 28px 8px">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="vertical-align:middle;padding-right:14px">
        <div style="width:48px;height:48px;border-radius:99px;background:#eaf0fd;color:#2557d6;font-weight:700;font-size:17px;line-height:48px;text-align:center">${e(initials(q.name))}</div>
      </td>
      <td style="vertical-align:middle">
        <div style="font-size:18px;font-weight:700;color:#0b1b33">${e(q.name)}</div>
        <div style="margin-top:2px;font-size:14px"><a href="mailto:${e(q.email)}" style="color:#2557d6;text-decoration:none">${e(q.email)}</a></div>
      </td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:12px 28px 4px">
    ${btn(`mailto:${q.email}?subject=${replySubject}`, `Reply to ${e(first)}`, '#2557d6')}${waDigits ? btn(`https://wa.me/${waDigits}`, 'Message on WhatsApp', '#1a8f4c') : ''}
  </td></tr>

  <tr><td style="padding:16px 28px 4px">
    <div style="font-size:12px;letter-spacing:.14em;font-weight:700;color:#2557d6">MESSAGE</div>
    <div style="margin-top:10px;padding:18px 20px;background:#f5f8fd;border:1px solid #e3e9f4;border-radius:12px;font-size:15px;line-height:1.65;color:#14233d;white-space:pre-wrap;word-break:break-word">${e(q.message)}</div>
  </td></tr>

  <tr><td style="padding:18px 28px 8px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${detail('Name', e(q.name))}
      ${detail('Email', `<a href="mailto:${e(q.email)}" style="color:#2557d6;text-decoration:none">${e(q.email)}</a>`)}
      ${detail('WhatsApp', q.whatsapp ? `<a href="https://wa.me/${waDigits}" style="color:#2557d6;text-decoration:none">${e(q.whatsapp)}</a>` : '<span style="color:#64748b">Not provided</span>')}
      ${detail('Submitted', e(when))}
      ${detail('Source', `${e(SOURCE)} · <a href="https://${SITE}" style="color:#2557d6;text-decoration:none">${SITE}</a>`)}
    </table>
  </td></tr>

  <tr><td style="padding:16px 28px 26px">
    <div style="padding:14px 16px;background:#f1f5fa;border-radius:10px;font-size:13px;line-height:1.5;color:#475569">
      Just hit <strong>Reply</strong> — your response goes straight to ${e(q.email)}.
    </div>
  </td></tr>

</table>
<div style="max-width:600px;margin:14px auto 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8a97ab;text-align:center">Sent automatically by the contact form on ${SITE}</div>
</td></tr></table>
</body></html>`;

  return { subject, text, html };
}

/* -------------------------------------------------------------- handler ---- */

export const onRequest = async ({ request, env }: Context): Promise<Response> => {
  if (request.method !== 'POST') return fail(405, 'method', 'Method not allowed.', { Allow: 'POST' });

  if (!sameSite(request.headers.get('Origin'), request.url)) return fail(403, 'forbidden', 'Request not allowed.');
  if (!(request.headers.get('Content-Type') || '').includes('application/json')) {
    return fail(415, 'unsupported', 'Unsupported request.');
  }
  if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY_BYTES) {
    return fail(413, 'too_large', 'Your message is too long.');
  }

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return fail(413, 'too_large', 'Your message is too long.');
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, 'invalid', 'Invalid request.');
  }

  // Spam checks: honeypot must be empty; the form can't be completed implausibly fast.
  if (oneLine(body.website)) return fail(400, 'spam', 'Your message could not be accepted.');
  const elapsed = Number(body.elapsedMs);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return fail(400, 'too_fast', 'That was quick! Please take a moment and try again.');
  }

  const name = oneLine(body.name);
  const email = oneLine(body.email);
  const whatsappRaw = oneLine(body.whatsapp).replace(/[\s()-]/g, '');
  const whatsapp = whatsappRaw === '+' ? '' : whatsappRaw;
  const message = typeof body.message === 'string' ? body.message.replace(/\r\n?/g, '\n').trim() : '';

  if (name.length < 2 || name.length > LIMITS.name) return fail(400, 'invalid', 'Please enter your name.');
  if (email.length > LIMITS.email || !EMAIL_RE.test(email)) return fail(400, 'invalid', 'Please enter a valid email address.');
  if (whatsapp && (whatsapp.length > LIMITS.whatsapp || !WHATSAPP_RE.test(whatsapp))) {
    return fail(400, 'invalid', 'Please enter a valid WhatsApp number with country code, or leave it blank.');
  }
  if (message.length < MESSAGE_MIN || message.length > LIMITS.message) {
    return fail(400, 'invalid', `Please write a message between ${MESSAGE_MIN} and ${LIMITS.message} characters.`);
  }

  const now = Date.now();
  const visitor = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (rateLimited(visitor, now)) {
    return fail(429, 'rate_limited', "You've sent several messages recently. Please wait a few minutes and try again.", {
      'Retry-After': String(Math.ceil(RATE.windowMs / 1000)),
    });
  }

  if (!env.RESEND_API_KEY) {
    console.error('contact: RESEND_API_KEY is not set');
    return fail(503, 'not_configured', 'Messaging is temporarily unavailable. Please use the other contact options on this page.');
  }

  const { subject, text, html } = buildEmail({ name, email, whatsapp, message, submittedAt: new Date(now) });

  let res: Response;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
        to: [env.CONTACT_TO_EMAIL || DEFAULT_TO],
        reply_to: email,
        subject,
        text,
        html,
        tags: [{ name: 'source', value: 'chat_with_rahul' }],
      }),
    });
  } catch {
    console.error('contact: could not reach Resend');
    return fail(502, 'provider_unavailable', UNDELIVERED);
  }

  const result = (await res.json().catch(() => null)) as { id?: string; name?: string; message?: string } | null;
  if (res.ok && result?.id) {
    // Log only the provider id (look it up in Resend → Emails); no personal data.
    console.log('contact: accepted by Resend', result.id);
    return json(200, { ok: true });
  }

  // Map Resend's error to a category. Its raw text stays in the logs only.
  const reason = `${result?.name ?? ''} ${result?.message ?? ''}`.toLowerCase();
  let code: ContactErrorCode = 'provider_rejected';
  if (res.status === 401 || /api key|api_key|unauthori[sz]ed/.test(reason)) code = 'provider_auth';
  else if (/domain|testing emails|own email|not verified|from/.test(reason) && (res.status === 403 || res.status === 422)) code = 'provider_sender';
  else if (res.status === 429 || res.status >= 500) code = 'provider_unavailable';
  console.error('contact: Resend did not accept the email', res.status, result?.name ?? 'unknown_error');
  return fail(502, code, UNDELIVERED);
};
