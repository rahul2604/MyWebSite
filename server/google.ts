/*
 * Google OAuth token handling + Google Calendar API (free/busy, events with Google Meet),
 * using the official HTTP endpoints. Server-side only.
 *
 * Logging rule: only status codes and Google's short error/reason codes are logged —
 * never authorization codes, access/refresh tokens, client secrets or event contents.
 */
import { clock } from './clock.ts';
import { decryptSecret, parseKey } from './crypto.ts';
import type { D1Like } from './bookingStore.ts';
import type { Env } from './env.ts';
import { getGoogleAuth, markGoogleAuthInvalid, tokenContext } from './googleAuthStore.ts';

export const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
export const TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const FREEBUSY_URL = 'https://www.googleapis.com/calendar/v3/freeBusy';
export const EVENTS_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

export const SCOPE_EVENTS = 'https://www.googleapis.com/auth/calendar.events';
export const SCOPE_FREEBUSY = 'https://www.googleapis.com/auth/calendar.freebusy';
/** Minimum permissions: create events (with Meet) and read free/busy; openid+email to verify the account. */
export const SCOPES = ['openid', 'email', SCOPE_EVENTS, SCOPE_FREEBUSY];
export const REQUIRED_CALENDAR_SCOPES = [SCOPE_EVENTS, SCOPE_FREEBUSY];

export const TIMEZONE = 'Asia/Kolkata';

/** Tunable in tests. */
export const timing = {
  sleep: (ms: number) => new Promise<void>((r) => setTimeout(r, ms)),
  /** Waits between checks while Google finishes creating the Meet conference. */
  meetPollDelaysMs: [600, 1200, 2000, 3000],
  requestTimeoutMs: 15_000,
};

export type GoogleErrorCode =
  | 'not_configured' // client id/secret/encryption key missing
  | 'not_connected' // no stored refresh token (or it can't be decrypted)
  | 'auth_revoked' // Google says the refresh token is no longer valid
  | 'unavailable' // network / Google 5xx / permission problems — don't confirm anything
  | 'event_failed' // Google rejected the event
  | 'meet_pending' // event exists, Meet link not ready yet
  | 'meet_failed'; // event exists, Google reported conference creation failure

export class GoogleError extends Error {
  readonly code: GoogleErrorCode;
  constructor(code: GoogleErrorCode) {
    super(`google:${code}`);
    this.code = code;
  }
}

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
  key: Uint8Array;
}

export function googleConfig(env: Env): GoogleConfig | null {
  const key = parseKey(env.GOOGLE_TOKEN_ENCRYPTION_KEY);
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !key) return null;
  return { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET, key };
}

/** Short, non-sensitive reason from a Google error body, for logs. */
function reason(data: unknown): string {
  const d = data as { error?: unknown } | null;
  if (!d) return 'no_body';
  if (typeof d.error === 'string') return d.error.slice(0, 40); // OAuth endpoints
  const e = d.error as { status?: string; errors?: { reason?: string }[] } | undefined;
  return (e?.errors?.[0]?.reason || e?.status || 'unknown').toString().slice(0, 40);
}

async function timedFetch(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timing.requestTimeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch {
    throw new GoogleError('unavailable');
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ OAuth ---- */

export function buildAuthUrl(cfg: GoogleConfig, redirectUri: string, state: string, challenge: string, loginHint: string) {
  const p = new URLSearchParams({
    response_type: 'code',
    client_id: cfg.clientId,
    redirect_uri: redirectUri,
    scope: SCOPES.join(' '),
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    access_type: 'offline', // ask for a refresh token
    prompt: 'consent', // ensures a refresh token is returned again on re-authorization
    login_hint: loginHint,
  });
  return `${AUTH_URL}?${p}`;
}

export interface CodeExchange {
  refreshToken: string | null;
  scopes: string[];
  idToken: unknown;
}

/** Exchanges the authorization code server-side (client secret + PKCE verifier). */
export async function exchangeCode(cfg: GoogleConfig, code: string, verifier: string, redirectUri: string): Promise<CodeExchange> {
  const res = await timedFetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    }),
  });
  const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (!res.ok || !data) {
    console.error('google: code exchange failed', res.status, reason(data));
    throw new GoogleError('unavailable');
  }
  return {
    refreshToken: typeof data.refresh_token === 'string' && data.refresh_token ? data.refresh_token : null,
    scopes: typeof data.scope === 'string' ? data.scope.split(/\s+/).filter(Boolean) : [],
    idToken: data.id_token,
  };
}

/* ----------------------------------------------------------- access tokens ---- */

/** Short-lived access token kept in this isolate's memory only (never stored or returned). */
let cached: { token: string; expMs: number } | null = null;
export const resetGoogleTokenCache = () => {
  cached = null;
};

async function refreshAccessToken(env: Env, db: D1Like): Promise<string> {
  const cfg = googleConfig(env);
  if (!cfg) throw new GoogleError('not_configured');
  const row = await getGoogleAuth(db);
  if (!row) throw new GoogleError('not_connected');
  if (row.status !== 'active') throw new GoogleError('auth_revoked');

  let refreshToken: string;
  try {
    refreshToken = await decryptSecret(row.enc_refresh_token, cfg.key, tokenContext(row.email));
  } catch {
    console.error('google: stored token could not be decrypted (was GOOGLE_TOKEN_ENCRYPTION_KEY changed?)');
    throw new GoogleError('not_connected');
  }

  const res = await timedFetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
    }),
  });
  const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (res.ok && data && typeof data.access_token === 'string') {
    const ttl = typeof data.expires_in === 'number' ? data.expires_in : 3600;
    cached = { token: data.access_token, expMs: clock.now().getTime() + ttl * 1000 };
    return data.access_token;
  }
  const why = reason(data);
  console.error('google: token refresh failed', res.status, why);
  if (why === 'invalid_grant') {
    // Revoked, expired (e.g. 7-day limit while the OAuth app is in Testing) or password changed.
    await markGoogleAuthInvalid(db, clock.now().toISOString()).catch(() => {});
    throw new GoogleError('auth_revoked');
  }
  throw new GoogleError('unavailable');
}

/** Calls a Google API with a valid access token; refreshes once on 401. */
async function authedFetch(env: Env, db: D1Like, url: string, init: RequestInit): Promise<Response> {
  const fresh = () => refreshAccessToken(env, db);
  let token = cached && cached.expMs - 60_000 > clock.now().getTime() ? cached.token : await fresh();
  const call = (t: string) => timedFetch(url, { ...init, headers: { ...(init.headers as Record<string, string>), Authorization: `Bearer ${t}` } });
  let res = await call(token);
  if (res.status === 401) {
    cached = null;
    token = await fresh();
    res = await call(token);
  }
  return res;
}

/* ------------------------------------------------------------- free/busy ---- */

export interface Busy {
  startMs: number;
  endMs: number;
}

/** Busy periods on the owner's primary calendar (no titles or details — Google doesn't return them here). */
export async function getBusy(env: Env, db: D1Like, fromMs: number, toMs: number): Promise<Busy[]> {
  const res = await authedFetch(env, db, FREEBUSY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timeMin: new Date(fromMs).toISOString(),
      timeMax: new Date(toMs).toISOString(),
      timeZone: TIMEZONE,
      items: [{ id: 'primary' }],
    }),
  });
  const data = (await res.json().catch(() => null)) as { calendars?: Record<string, { busy?: unknown; errors?: unknown[] }> } | null;
  const cal = data?.calendars?.primary;
  if (!res.ok || !cal || !Array.isArray(cal.busy) || (Array.isArray(cal.errors) && cal.errors.length > 0)) {
    console.error('google: free/busy failed', res.status, res.ok ? 'bad_response' : reason(data));
    throw new GoogleError('unavailable');
  }
  const busy: Busy[] = [];
  for (const b of cal.busy as { start?: string; end?: string }[]) {
    const startMs = Date.parse(b.start ?? '');
    const endMs = Date.parse(b.end ?? '');
    if (Number.isFinite(startMs) && Number.isFinite(endMs)) busy.push({ startMs, endMs });
    else throw new GoogleError('unavailable'); // never silently ignore busy data we can't read
  }
  return busy;
}

/* ----------------------------------------------------------- events + Meet ---- */

export interface CalendarEvent {
  id: string;
  htmlLink: string | null;
  meetUrl: string | null;
  conference: 'success' | 'pending' | 'failure' | 'none';
}

/** A Google Meet joining URL: https://meet.google.com/<code>. */
export function isValidMeetUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && u.hostname === 'meet.google.com' && /^\/[a-z0-9]+(-[a-z0-9]+)+$/i.test(u.pathname);
  } catch {
    return false;
  }
}

function readEvent(e: Record<string, any>): CalendarEvent {
  const entry = Array.isArray(e?.conferenceData?.entryPoints)
    ? e.conferenceData.entryPoints.find((p: Record<string, unknown>) => p?.entryPointType === 'video' && isValidMeetUrl(p.uri))
    : undefined;
  const meetUrl = entry?.uri ?? (isValidMeetUrl(e?.hangoutLink) ? e.hangoutLink : null);
  const code = e?.conferenceData?.createRequest?.status?.statusCode;
  const conference = meetUrl ? 'success' : code === 'failure' ? 'failure' : code === 'pending' ? 'pending' : code === 'success' ? 'success' : 'none';
  return { id: String(e?.id ?? ''), htmlLink: typeof e?.htmlLink === 'string' ? e.htmlLink : null, meetUrl, conference };
}

export async function getEvent(env: Env, db: D1Like, eventId: string): Promise<CalendarEvent | null> {
  const res = await authedFetch(env, db, `${EVENTS_URL}/${encodeURIComponent(eventId)}?conferenceDataVersion=1`, { method: 'GET' });
  if (res.status === 404 || res.status === 410) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    console.error('google: event lookup failed', res.status, reason(data));
    throw new GoogleError('unavailable');
  }
  return readEvent(data);
}

export interface NewEvent {
  /** Pre-assigned id (base32hex: a–v, 0–9) so retries can never create a second event. */
  id: string;
  /** Unique per booking; Google de-duplicates conference requests with the same id. */
  requestId: string;
  summary: string;
  description: string;
  startIso: string;
  endIso: string;
  attendeeEmail: string;
  attendeeName: string;
  bookingRef: string;
  sendInvites: boolean;
}

/** Creates the event with a Meet conference request. If the id already exists (a retry), returns that event. */
export async function insertEvent(env: Env, db: D1Like, ev: NewEvent): Promise<CalendarEvent> {
  const params = new URLSearchParams({ conferenceDataVersion: '1', sendUpdates: ev.sendInvites ? 'all' : 'none' });
  const res = await authedFetch(env, db, `${EVENTS_URL}?${params}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: ev.id,
      summary: ev.summary,
      description: ev.description,
      start: { dateTime: ev.startIso, timeZone: TIMEZONE },
      end: { dateTime: ev.endIso, timeZone: TIMEZONE },
      attendees: [{ email: ev.attendeeEmail, displayName: ev.attendeeName }],
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: false,
      transparency: 'opaque',
      reminders: { useDefault: true },
      extendedProperties: { private: { bookingRef: ev.bookingRef } },
      conferenceData: { createRequest: { requestId: ev.requestId, conferenceSolutionKey: { type: 'hangoutsMeet' } } },
    }),
  });
  if (res.status === 409) {
    // Already created by an earlier attempt with the same id.
    const existing = await getEvent(env, db, ev.id);
    if (existing) return existing;
    throw new GoogleError('event_failed');
  }
  const data = await res.json().catch(() => null);
  if (res.ok && data) return readEvent(data);
  console.error('google: event creation failed', res.status, reason(data));
  throw new GoogleError(res.status >= 500 || res.status === 429 || res.status === 403 ? 'unavailable' : 'event_failed');
}

/** Asks Google again for a Meet conference on an existing event (after a reported failure). */
export async function requestMeet(env: Env, db: D1Like, eventId: string, requestId: string): Promise<CalendarEvent> {
  const res = await authedFetch(env, db, `${EVENTS_URL}/${encodeURIComponent(eventId)}?conferenceDataVersion=1&sendUpdates=none`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conferenceData: { createRequest: { requestId, conferenceSolutionKey: { type: 'hangoutsMeet' } } } }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    console.error('google: meet request failed', res.status, reason(data));
    throw new GoogleError('unavailable');
  }
  return readEvent(data);
}

/** Waits (briefly) until the event has a valid Meet URL. Never invents one. */
export async function waitForMeet(env: Env, db: D1Like, event: CalendarEvent): Promise<CalendarEvent> {
  let current = event;
  for (const delay of timing.meetPollDelaysMs) {
    if (current.meetUrl || current.conference === 'failure') break;
    await timing.sleep(delay);
    current = (await getEvent(env, db, current.id)) ?? current;
  }
  if (current.meetUrl) return current;
  throw new GoogleError(current.conference === 'failure' ? 'meet_failed' : 'meet_pending');
}

/** Event ids: base32hex alphabet (a–v, 0–9), 5–1024 chars. Hex is a subset. */
export function newEventId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return 'rm' + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
