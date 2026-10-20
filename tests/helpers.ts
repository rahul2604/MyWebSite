/*
 * Test doubles. Nothing here talks to the network: `installFetch` routes Google and
 * Resend URLs to in-memory fakes and FAILS any other request, so automated tests can
 * never create real calendar events or send real emails.
 */
import { DatabaseSync } from 'node:sqlite';
import type { D1Like, D1Statement } from '../server/bookingStore.ts';
import { sha256b64url } from '../server/crypto.ts';

/* ---------------- D1 over node:sqlite (real SQL semantics) ---------------- */
export function memoryD1(): D1Like & { raw: DatabaseSync } {
  const raw = new DatabaseSync(':memory:');
  const stmt = (sql: string, params: unknown[] = []): D1Statement => ({
    bind: (...v: unknown[]) => stmt(sql, v),
    run: async () => ({ meta: { changes: Number(raw.prepare(sql).run(...(params as never[])).changes) } }),
    first: async <T,>() => (raw.prepare(sql).get(...(params as never[])) as T) ?? null,
    all: async <T,>() => ({ results: raw.prepare(sql).all(...(params as never[])) as T[] }),
  });
  return { raw, prepare: (sql: string) => stmt(sql) };
}

/* ---------------- sentinel secrets (must never appear in responses or logs) ---------------- */
export const CLIENT_ID = 'test-client-123.apps.googleusercontent.com';
export const CLIENT_SECRET = 'SENTINEL-CLIENT-SECRET-9f8e7d';
export const AUTH_CODE = 'SENTINEL-AUTH-CODE-4/0AbCdEf';
export const REFRESH_TOKEN = 'SENTINEL-REFRESH-TOKEN-1//0gXyZ';
export const ACCESS_PREFIX = 'SENTINEL-ACCESS-';
export const RESEND_KEY = 're_SENTINEL_resend_key';
export const ENC_KEY = Buffer.from(Array.from({ length: 32 }, (_, i) => i + 7)).toString('base64');
export const SECRETS = [CLIENT_SECRET, AUTH_CODE, REFRESH_TOKEN, ACCESS_PREFIX, RESEND_KEY, ENC_KEY];

export const OWNER = 'rahul.a.mehra@gmail.com';
export const SITE = 'https://rahulmehra.co.in';
export const LOCAL = 'http://localhost:8788';

export function liveEnv(db: D1Like, overrides: Record<string, unknown> = {}) {
  return {
    BOOKINGS_DB: db,
    RESEND_API_KEY: RESEND_KEY,
    BOOKING_MODE: 'live',
    GOOGLE_CLIENT_ID: CLIENT_ID,
    GOOGLE_CLIENT_SECRET: CLIENT_SECRET,
    GOOGLE_TOKEN_ENCRYPTION_KEY: ENC_KEY,
    GOOGLE_SETUP_ENABLED: 'true',
    ...overrides,
  } as never;
}

const b64url = (s: string) => Buffer.from(s).toString('base64url');
export const fakeIdToken = (claims: Record<string, unknown>) => `${b64url('{"alg":"RS256"}')}.${b64url(JSON.stringify(claims))}.sig`;

/* ---------------- fake Google ---------------- */
export const MEET_URL = 'https://meet.google.com/abc-defg-hij';

export class FakeGoogle {
  // OAuth
  expectedChallenge: string | null = null;
  expectedRedirectUri: string | null = null;
  claims: Record<string, unknown> = { iss: 'https://accounts.google.com', aud: CLIENT_ID, email: OWNER, email_verified: true, exp: 4102444800 };
  scope = `openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.freebusy`;
  issueRefreshToken = true;
  exchangeFails = false;
  revoked = false;
  refreshCalls = 0;
  validAccess = new Set<string>();
  // Calendar
  busy: { start: string; end: string }[] = [];
  freeBusyFails = false;
  freeBusyCalls = 0;
  events = new Map<string, Record<string, any>>();
  insertCalls = 0;
  insertFailures: number[] = []; // HTTP statuses to return for the next inserts
  /** immediate | pending-then-ready | pending-forever | failure */
  meetMode = 'immediate';
  pollsBeforeReady = 2;
  eventBodies: Record<string, any>[] = [];
  patchCalls = 0;
  insertQuery: URLSearchParams | null = null;

  private ready(ev: Record<string, any>) {
    ev.conferenceData = {
      conferenceId: 'abc-defg-hij',
      createRequest: { requestId: ev.conferenceData?.createRequest?.requestId, status: { statusCode: 'success' } },
      entryPoints: [{ entryPointType: 'video', uri: MEET_URL }],
    };
    ev.hangoutLink = MEET_URL;
  }

  async handle(url: URL, init: RequestInit): Promise<Response> {
    const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

    if (url.host === 'oauth2.googleapis.com' && url.pathname === '/token') {
      const p = new URLSearchParams(String(init.body));
      if (p.get('client_id') !== CLIENT_ID || p.get('client_secret') !== CLIENT_SECRET) return json(401, { error: 'invalid_client' });
      if (p.get('grant_type') === 'authorization_code') {
        if (this.exchangeFails || p.get('code') !== AUTH_CODE) return json(400, { error: 'invalid_grant', error_description: 'Bad code' });
        if (this.expectedRedirectUri && p.get('redirect_uri') !== this.expectedRedirectUri) return json(400, { error: 'redirect_uri_mismatch' });
        if (this.expectedChallenge && (await sha256b64url(p.get('code_verifier') || '')) !== this.expectedChallenge) {
          return json(400, { error: 'invalid_grant', error_description: 'PKCE mismatch' });
        }
        return json(200, {
          access_token: `${ACCESS_PREFIX}initial`,
          expires_in: 3599,
          ...(this.issueRefreshToken ? { refresh_token: REFRESH_TOKEN } : {}),
          scope: this.scope,
          token_type: 'Bearer',
          id_token: fakeIdToken(this.claims),
        });
      }
      if (p.get('grant_type') === 'refresh_token') {
        this.refreshCalls++;
        if (this.revoked || p.get('refresh_token') !== REFRESH_TOKEN) return json(400, { error: 'invalid_grant', error_description: 'Token has been expired or revoked.' });
        const token = `${ACCESS_PREFIX}${this.refreshCalls}`;
        this.validAccess.add(token);
        return json(200, { access_token: token, expires_in: 3599, scope: this.scope, token_type: 'Bearer' });
      }
      return json(400, { error: 'unsupported_grant_type' });
    }

    if (url.host === 'www.googleapis.com') {
      const auth = new Headers(init.headers).get('Authorization') || '';
      if (!this.validAccess.has(auth.replace(/^Bearer /, ''))) return json(401, { error: { status: 'UNAUTHENTICATED', errors: [{ reason: 'authError' }] } });

      if (url.pathname === '/calendar/v3/freeBusy') {
        this.freeBusyCalls++;
        if (this.freeBusyFails) return json(503, { error: { status: 'UNAVAILABLE', errors: [{ reason: 'backendError' }] } });
        const body = JSON.parse(String(init.body));
        if (body.items?.[0]?.id !== 'primary' || body.timeZone !== 'Asia/Kolkata') return json(400, { error: { status: 'INVALID_ARGUMENT' } });
        return json(200, { kind: 'calendar#freeBusy', calendars: { primary: { busy: this.busy } } });
      }

      const base = '/calendar/v3/calendars/primary/events';
      if (url.pathname === base && init.method === 'POST') {
        this.insertCalls++;
        this.insertQuery = url.searchParams;
        const body = JSON.parse(String(init.body));
        this.eventBodies.push(body);
        const fail = this.insertFailures.shift();
        if (fail) return json(fail, { error: { status: 'FAILED', errors: [{ reason: 'testFailure' }] } });
        if (this.events.has(body.id)) return json(409, { error: { status: 'ALREADY_EXISTS', errors: [{ reason: 'duplicate' }] } });
        const ev: Record<string, any> = { ...body, htmlLink: `https://www.google.com/calendar/event?eid=${body.id}`, _gets: 0 };
        if (this.meetMode === 'immediate') this.ready(ev);
        else ev.conferenceData = { createRequest: { ...body.conferenceData.createRequest, status: { statusCode: this.meetMode === 'failure' ? 'failure' : 'pending' } } };
        this.events.set(body.id, ev);
        return json(200, ev);
      }
      const m = url.pathname.match(/^\/calendar\/v3\/calendars\/primary\/events\/([^/]+)$/);
      if (m) {
        const ev = this.events.get(decodeURIComponent(m[1]));
        if (!ev) return json(404, { error: { status: 'NOT_FOUND', errors: [{ reason: 'notFound' }] } });
        if (init.method === 'PATCH') {
          this.patchCalls++;
          this.ready(ev);
          return json(200, ev);
        }
        ev._gets++;
        if (this.meetMode === 'pending-then-ready' && ev._gets >= this.pollsBeforeReady) this.ready(ev);
        return json(200, ev);
      }
    }
    throw new Error(`FakeGoogle: unexpected request ${init.method} ${url}`);
  }
}

/* ---------------- fake Resend ---------------- */
export class FakeResend {
  sent: Record<string, any>[] = [];
  reject: (to: string) => null | number | 'network' = () => null;
  async handle(_url: URL, init: RequestInit): Promise<Response> {
    const payload = JSON.parse(String(init.body));
    const r = this.reject(payload.to[0]);
    if (r === 'network') throw new TypeError('fetch failed');
    if (r) return new Response(JSON.stringify({ name: 'validation_error', message: 'You can only send testing emails to your own email address.' }), { status: r });
    this.sent.push(payload);
    return new Response(JSON.stringify({ id: `email_${this.sent.length}` }), { status: 200 });
  }
}

/** Routes fetch to the fakes; any other host fails the test. Returns a restore function. */
export function installFetch(google: FakeGoogle, resend: FakeResend) {
  const real = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = new URL(String(input instanceof Request ? input.url : input));
    if (url.host === 'oauth2.googleapis.com' || url.host === 'www.googleapis.com') return google.handle(url, init);
    if (url.host === 'api.resend.com') return resend.handle(url, init);
    throw new Error(`Unexpected network call in tests: ${url.host}`);
  }) as typeof fetch;
  return () => {
    globalThis.fetch = real;
  };
}

/** Captures console output so tests can assert no secrets are logged. */
export function captureLogs() {
  const lines: string[] = [];
  const orig = { log: console.log, warn: console.warn, error: console.error };
  for (const k of ['log', 'warn', 'error'] as const) console[k] = (...a: unknown[]) => void lines.push(a.map(String).join(' '));
  return {
    lines,
    restore: () => Object.assign(console, orig),
  };
}

export const containsSecret = (text: string) => SECRETS.some((s) => text.includes(s));
