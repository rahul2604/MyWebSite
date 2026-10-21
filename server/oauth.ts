/*
 * OAuth helpers for the one-time Google authorization (start + callback).
 *
 * - Redirect URIs come from a fixed allow-list that must match Google Cloud Console exactly.
 * - State and the PKCE verifier live in a short-lived, HttpOnly, SameSite=Lax cookie
 *   (Secure on https), signed with HMAC so it can't be forged or extended.
 */
import { b64urlDecode, b64urlEncode, randomToken, safeEqual, sha256b64url, sign, verify } from './crypto.ts';

/** Exactly the URIs registered in Google Cloud Console (no trailing slash). Keyed by request origin. */
export const REDIRECT_URIS: Record<string, string> = {
  'https://rahulmehra.co.in': 'https://rahulmehra.co.in/api/google/callback',
  'http://localhost:8788': 'http://localhost:8788/api/google/callback',
};

/** The registered redirect URI for this request's origin, or null (e.g. www or 127.0.0.1). */
export const redirectUriFor = (requestUrl: string): string | null => REDIRECT_URIS[new URL(requestUrl).origin] ?? null;

export const STATE_COOKIE = 'rm_google_oauth';
export const STATE_TTL_MS = 10 * 60 * 1000;

export interface OAuthStart {
  state: string;
  verifier: string;
  challenge: string;
  cookie: string;
}

const cookieAttrs = (secure: boolean, maxAgeSeconds: number) =>
  `Path=/api/google; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure ? '; Secure' : ''}`;

/** New state + PKCE pair and the Set-Cookie header carrying them. */
export async function beginOAuth(master: Uint8Array, nowMs: number, secure: boolean): Promise<OAuthStart> {
  const state = randomToken(32);
  const verifier = randomToken(48); // 64 chars, within PKCE's 43–128
  const challenge = await sha256b64url(verifier);
  const payload = b64urlEncode(new TextEncoder().encode(JSON.stringify({ s: state, v: verifier, e: nowMs + STATE_TTL_MS })));
  const signature = await sign(payload, master);
  const cookie = `${STATE_COOKIE}=${payload}.${signature}; ${cookieAttrs(secure, STATE_TTL_MS / 1000)}`;
  return { state, verifier, challenge, cookie };
}

/** Set-Cookie header that deletes the state cookie (sent on every callback response). */
export const clearStateCookie = (secure: boolean) => `${STATE_COOKIE}=; ${cookieAttrs(secure, 0)}`;

export function readCookie(header: string | null, name: string): string | null {
  for (const part of (header || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

export type StateCheck = { ok: true; verifier: string } | { ok: false; reason: 'missing' | 'invalid' | 'expired' | 'mismatch' };

/** Verifies the cookie's signature and expiry, then compares its state to the callback's in constant time. */
export async function checkState(cookieValue: string | null, returnedState: string, master: Uint8Array, nowMs: number): Promise<StateCheck> {
  if (!cookieValue) return { ok: false, reason: 'missing' };
  const [payload, signature] = cookieValue.split('.');
  if (!payload || !signature || !(await verify(payload, signature, master))) return { ok: false, reason: 'invalid' };
  let data: { s?: unknown; v?: unknown; e?: unknown };
  try {
    data = JSON.parse(new TextDecoder().decode(b64urlDecode(payload)));
  } catch {
    return { ok: false, reason: 'invalid' };
  }
  if (typeof data.s !== 'string' || typeof data.v !== 'string' || typeof data.e !== 'number') return { ok: false, reason: 'invalid' };
  if (data.e < nowMs) return { ok: false, reason: 'expired' };
  if (!safeEqual(data.s, returnedState)) return { ok: false, reason: 'mismatch' };
  return { ok: true, verifier: data.v };
}

/** Decodes an ID token's claims. Signature verification is not needed when the token comes
 *  directly from Google's token endpoint over TLS (per Google's OpenID Connect guidance). */
export function idTokenClaims(idToken: unknown): Record<string, unknown> | null {
  if (typeof idToken !== 'string') return null;
  const parts = idToken.split('.');
  if (parts.length !== 3) return null;
  try {
    const claims = JSON.parse(new TextDecoder().decode(b64urlDecode(parts[1])));
    return claims && typeof claims === 'object' ? claims : null;
  } catch {
    return null;
  }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Minimal result page for the browser after authorization. Never contains tokens. */
export function resultPage(status: number, title: string, message: string, extraHeaders: Record<string, string> = {}) {
  const ok = status < 400;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${esc(title)}</title>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#f1f5fa;color:#14233d;display:grid;place-items:center;min-height:100vh;padding:24px}
main{max-width:520px;background:#fff;border:1px solid #e3e8ef;border-radius:16px;padding:28px}
h1{margin:0 0 10px;font-size:22px;color:${ok ? '#146c43' : '#b42318'}}p{margin:0;line-height:1.6}</style></head>
<body><main><h1>${esc(title)}</h1><p>${esc(message)}</p></main></body></html>`;
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'",
      ...extraHeaders,
    },
  });
}
