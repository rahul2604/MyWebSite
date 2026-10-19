/*
 * POST /api/contact — Cloudflare Pages Function for the "Chat with Rahul" widget.
 *
 * Sends the visitor's message by email through Resend (https://resend.com).
 * Replies { ok: true } ONLY after Resend accepts the email and returns its id.
 *
 * Environment (Cloudflare Pages → Settings → Variables and Secrets):
 *   RESEND_API_KEY      required, SECRET  — Resend API key ("re_…")
 *   CONTACT_TO_EMAIL    optional          — recipient (default: rahul.a.mehra@gmail.com)
 *   CONTACT_FROM_EMAIL  optional          — sender  (default: Resend's shared test sender, see README)
 */

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

interface Context {
  request: Request;
  env: Env;
}

const DEFAULT_TO = 'rahul.a.mehra@gmail.com';
/** Resend's shared sender. Works without verifying a domain, but only delivers to the Resend account owner's address. */
const DEFAULT_FROM = 'Rahul Mehra Website <onboarding@resend.dev>';

const LIMITS = { name: 100, email: 254, whatsapp: 24, message: 2000 };
const MESSAGE_MIN = 10;
/** Forms submitted faster than this after opening are treated as bots. */
const MIN_FILL_MS = 3000;

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
const WHATSAPP_RE = /^\+\d{7,17}$/;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

const fail = (status: number, error: string) => json(status, { ok: false, error });

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Strips control characters (incl. CR/LF) from single-line fields. */
const oneLine = (s: unknown) => (typeof s === 'string' ? s.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim() : '');

const sameSite = (origin: string | null, requestUrl: string) => {
  if (!origin) return true; // non-browser clients; the other checks still apply
  try {
    return new URL(origin).host === new URL(requestUrl).host;
  } catch {
    return false;
  }
};

export const onRequest = async ({ request, env }: Context): Promise<Response> => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    });
  }

  // Only accept submissions from this site.
  if (!sameSite(request.headers.get('Origin'), request.url)) return fail(403, 'Request not allowed.');

  if (!(request.headers.get('Content-Type') || '').includes('application/json')) return fail(415, 'Unsupported request.');

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return fail(400, 'Invalid request.');
  }

  // Spam checks: honeypot must be empty; the form can't be completed implausibly fast.
  if (oneLine(body.website)) return fail(400, 'Your message could not be accepted.');
  const elapsed = Number(body.elapsedMs);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return fail(400, 'That was quick! Please take a moment and try again.');
  }

  const name = oneLine(body.name);
  const email = oneLine(body.email);
  const whatsapp = oneLine(body.whatsapp).replace(/[\s()-]/g, '');
  const message = typeof body.message === 'string' ? body.message.replace(/\r\n?/g, '\n').trim() : '';

  if (name.length < 2 || name.length > LIMITS.name) return fail(400, 'Please enter your name.');
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) return fail(400, 'Please enter a valid email address.');
  if (whatsapp && whatsapp !== '+' && (!WHATSAPP_RE.test(whatsapp) || whatsapp.length > LIMITS.whatsapp)) {
    return fail(400, 'Please enter a valid WhatsApp number with country code, or leave it blank.');
  }
  if (message.length < MESSAGE_MIN || message.length > LIMITS.message) {
    return fail(400, `Please write a message between ${MESSAGE_MIN} and ${LIMITS.message} characters.`);
  }

  if (!env.RESEND_API_KEY) {
    console.error('contact: RESEND_API_KEY is not set');
    return fail(503, 'Messaging is temporarily unavailable. Please use the other contact options on this page.');
  }

  const now = new Date();
  const ist = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'long',
  }).format(now);
  const wa = whatsapp && whatsapp !== '+' ? whatsapp : 'Not provided';

  const text = [
    'New enquiry from rahulmehra.co.in',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `WhatsApp: ${wa}`,
    `Submitted: ${ist} (${now.toISOString()})`,
    '',
    'Message:',
    message,
  ].join('\n');

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#5b6b82;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#0b1b33">${value}</td></tr>`;
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f1f5fa;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e3e8ef;border-radius:12px;padding:24px">
<h2 style="margin:0 0 4px;font-size:18px;color:#0b1b33">New enquiry from your website</h2>
<p style="margin:0 0 16px;font-size:13px;color:#5b6b82">Sent from the "Chat with Rahul" form on rahulmehra.co.in. Reply to this email to answer ${escapeHtml(name)} directly.</p>
<table style="border-collapse:collapse;font-size:14px">
${row('Name', escapeHtml(name))}
${row('Email', `<a href="mailto:${escapeHtml(email)}" style="color:#2557d6">${escapeHtml(email)}</a>`)}
${row('WhatsApp', escapeHtml(wa))}
${row('Submitted', escapeHtml(ist))}
</table>
<div style="margin-top:16px;padding:14px 16px;background:#f5f8fd;border-radius:8px;font-size:14px;line-height:1.55;color:#14233d;white-space:pre-wrap">${escapeHtml(message)}</div>
</div></body></html>`;

  let res: Response;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
        to: [env.CONTACT_TO_EMAIL || DEFAULT_TO],
        reply_to: email,
        subject: `Website enquiry from ${name}`.slice(0, 150),
        text,
        html,
      }),
    });
  } catch (err) {
    console.error('contact: could not reach Resend', err);
    return fail(502, 'Your message could not be sent. Please try again later.');
  }

  const result = (await res.json().catch(() => null)) as { id?: string; message?: string } | null;
  if (!res.ok || !result?.id) {
    // Log the provider's reason for the site owner; don't reveal it to visitors.
    console.error('contact: Resend rejected the email', res.status, result?.message);
    return fail(502, 'Your message could not be sent. Please try again later.');
  }

  return json(200, { ok: true });
};
