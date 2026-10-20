/*
 * Learner authentication for the PMP platform.
 *  - Passwords: PBKDF2-SHA-256 (Web Crypto) with a random 16-byte salt per user. 100,000
 *    iterations is the maximum Cloudflare Workers allows for PBKDF2.
 *  - Sessions: a random 32-byte token in an HttpOnly, Secure, SameSite=Lax cookie. Only its
 *    SHA-256 hash is stored. JavaScript in the page can never read the token.
 * Nothing here logs passwords or tokens.
 */
import { b64urlDecode, b64urlEncode, randomBytes, randomToken, safeEqual, sha256b64url } from '../crypto.ts';
import type { D1Like } from '../bookingStore.ts';
import { deleteExpiredSessions, findSession, findUserById, insertSession, type UserRow } from './store.ts';

export const PBKDF2_ITERATIONS = 100_000;
export const SESSION_COOKIE = 'pmp_session';
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const MAX_FAILED_LOGINS = 8;
export const LOCKOUT_MS = 15 * 60 * 1000;

const encoder = new TextEncoder();

export async function hashPassword(password: string, salt: Uint8Array, iterations = PBKDF2_ITERATIONS): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
  return b64urlEncode(new Uint8Array(bits));
}

export async function newPasswordRecord(password: string) {
  const salt = randomBytes(16);
  return { pw_hash: await hashPassword(password, salt), pw_salt: b64urlEncode(salt), pw_iter: PBKDF2_ITERATIONS };
}

export async function verifyPassword(password: string, user: Pick<UserRow, 'pw_hash' | 'pw_salt' | 'pw_iter'>): Promise<boolean> {
  const hash = await hashPassword(password, b64urlDecode(user.pw_salt), user.pw_iter);
  return safeEqual(hash, user.pw_hash);
}

/** Runs a hash anyway when the account does not exist, so response time does not reveal registered emails. */
export async function burnPasswordCheck(password: string): Promise<void> {
  await hashPassword(password, new Uint8Array(16));
}

/* ---------------- validation ---------------- */
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
export const normaliseEmail = (v: unknown) => (typeof v === 'string' ? v.trim().toLowerCase() : '');
export const validEmail = (email: string) => email.length <= 254 && EMAIL_RE.test(email);

export function passwordProblem(pw: unknown): string | null {
  if (typeof pw !== 'string') return 'Enter a password.';
  if (pw.length < 10) return 'Use at least 10 characters.';
  if (pw.length > 128) return 'Use at most 128 characters.';
  if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) return 'Use a mix of letters and numbers.';
  return null;
}

export function cleanName(v: unknown): string {
  if (typeof v !== 'string') return '';
  return v.replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80);
}

/* ---------------- sessions ---------------- */
export async function createSession(db: D1Like, userId: string, nowMs: number): Promise<{ token: string; expiresMs: number }> {
  const token = randomToken(32);
  const expiresMs = nowMs + SESSION_TTL_MS;
  await deleteExpiredSessions(db, userId, nowMs);
  await insertSession(db, await sha256b64url(token), userId, nowMs, expiresMs);
  return { token, expiresMs };
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=') || null;
  }
  return null;
}

const isLocalhost = (url: string) => {
  const h = new URL(url).hostname;
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]';
};

export function sessionCookie(requestUrl: string, token: string, maxAgeSeconds: number): string {
  // Secure is omitted only for plain-http localhost so local development works in every browser.
  const secure = new URL(requestUrl).protocol === 'https:' || !isLocalhost(requestUrl) ? '; Secure' : '';
  return `${SESSION_COOKIE}=${token}; Path=/api/pmp; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure}`;
}

export const clearSessionCookie = (requestUrl: string) => sessionCookie(requestUrl, '', 0);

/** The signed-in learner for this request, or null. */
export async function currentUser(db: D1Like, request: Request, nowMs: number): Promise<UserRow | null> {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token || token.length > 100) return null;
  const session = await findSession(db, await sha256b64url(token), nowMs);
  if (!session) return null;
  return findUserById(db, session.user_id);
}

export const newId = () => b64urlEncode(randomBytes(12));
