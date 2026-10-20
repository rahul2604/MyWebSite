/*
 * Minimal Resend client for Cloudflare Pages Functions (server-side only).
 * Success means Resend accepted the email and returned its id — not that it reached the inbox.
 */

export type ResendFailure = 'provider_auth' | 'provider_sender' | 'provider_rejected' | 'provider_unavailable';
export type ResendResult = { ok: true; id: string } | { ok: false; code: ResendFailure };

export interface EmailPayload {
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  tag?: string;
}

export async function sendViaResend(apiKey: string, email: EmailPayload): Promise<ResendResult> {
  let res: Response;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: email.from,
        to: email.to,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
        subject: email.subject,
        text: email.text,
        html: email.html,
        ...(email.tag ? { tags: [{ name: 'source', value: email.tag }] } : {}),
      }),
    });
  } catch {
    console.error('resend: could not reach Resend');
    return { ok: false, code: 'provider_unavailable' };
  }

  const result = (await res.json().catch(() => null)) as { id?: string; name?: string; message?: string } | null;
  if (res.ok && result?.id) return { ok: true, id: result.id };

  const reason = `${result?.name ?? ''} ${result?.message ?? ''}`.toLowerCase();
  let code: ResendFailure = 'provider_rejected';
  if (res.status === 401 || /api key|api_key|unauthori[sz]ed/.test(reason)) code = 'provider_auth';
  else if (/domain|testing emails|own email|not verified|from/.test(reason) && (res.status === 403 || res.status === 422)) code = 'provider_sender';
  else if (res.status === 429 || res.status >= 500) code = 'provider_unavailable';
  // Provider text stays in the logs only; never returned to visitors.
  console.error('resend: email not accepted', res.status, result?.name ?? 'unknown_error');
  return { ok: false, code };
}
