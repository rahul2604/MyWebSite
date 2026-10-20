/*
 * Google OAuth (start + callback), encrypted token storage and token refresh.
 * Google and Resend are fakes (tests/helpers.ts); no network access is possible.
 */
import { afterEach, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest as callback } from '../functions/api/google/callback.ts';
import { onRequest as start } from '../functions/api/google/start.ts';
import { clock } from '../server/clock.ts';
import { decryptSecret, encryptSecret, parseKey } from '../server/crypto.ts';
import { getBusy, GoogleError, resetGoogleTokenCache, SCOPES } from '../server/google.ts';
import { getGoogleAuth, tokenContext } from '../server/googleAuthStore.ts';
import {
  AUTH_CODE, captureLogs, CLIENT_ID, containsSecret, ENC_KEY, FakeGoogle, FakeResend, installFetch, liveEnv, LOCAL, memoryD1,
  OWNER, REFRESH_TOKEN, SITE,
} from './helpers.ts';

let db: ReturnType<typeof memoryD1>;
let google: FakeGoogle;
let restoreFetch: () => void;
let logs: ReturnType<typeof captureLogs>;
const realNow = clock.now;

beforeEach(() => {
  db = memoryD1();
  google = new FakeGoogle();
  restoreFetch = installFetch(google, new FakeResend());
  resetGoogleTokenCache();
  clock.now = () => new Date('2026-10-19T10:00:00Z');
  logs = captureLogs();
});
afterEach(() => {
  logs.restore();
  restoreFetch();
  clock.now = realNow;
  // Every test: nothing secret was logged.
  assert.ok(!logs.lines.some(containsSecret), `secret in logs:\n${logs.lines.join('\n')}`);
});

const get = (fn: typeof start, url: string, env: unknown, cookie?: string) =>
  fn({ request: new Request(url, { headers: cookie ? { Cookie: cookie } : {} }), env: env as never });

/** Runs /start and returns what the browser would carry to Google and back. */
async function begin(origin = SITE, env = liveEnv(db)) {
  const res = await get(start, `${origin}/api/google/start`, env);
  assert.equal(res.status, 302);
  const location = new URL(res.headers.get('Location')!);
  const setCookie = res.headers.get('Set-Cookie')!;
  const cookie = setCookie.split(';')[0];
  google.expectedChallenge = location.searchParams.get('code_challenge');
  google.expectedRedirectUri = location.searchParams.get('redirect_uri');
  return { location, setCookie, cookie, state: location.searchParams.get('state')! };
}

const finish = (s: { cookie: string; state: string }, origin = SITE, params: Record<string, string> = {}, env = liveEnv(db)) =>
  get(callback, `${origin}/api/google/callback?${new URLSearchParams({ code: AUTH_CODE, state: s.state, ...params })}`, env, s.cookie);

async function body(res: Response) {
  const text = await res.text();
  assert.ok(!containsSecret(text), 'secret in response body');
  return text;
}

const stored = () => db.raw.prepare(`SELECT name FROM sqlite_master WHERE name = 'google_auth'`).get()
  ? (db.raw.prepare('SELECT * FROM google_auth').get() as Record<string, string> | undefined) ?? null
  : null;

describe('GET /api/google/start', () => {
  test('disabled unless GOOGLE_SETUP_ENABLED=true (both routes)', async () => {
    const env = liveEnv(db, { GOOGLE_SETUP_ENABLED: undefined });
    assert.equal((await get(start, `${SITE}/api/google/start`, env)).status, 404);
    assert.equal((await get(callback, `${SITE}/api/google/callback?code=x&state=y`, env)).status, 404);
  });

  test('production: exact redirect URI, minimal scopes, offline access, PKCE S256, secure state cookie', async () => {
    const { location, setCookie } = await begin();
    assert.equal(location.origin + location.pathname, 'https://accounts.google.com/o/oauth2/v2/auth');
    const p = location.searchParams;
    assert.equal(p.get('redirect_uri'), 'https://rahulmehra.co.in/api/google/callback');
    assert.equal(p.get('client_id'), CLIENT_ID);
    assert.equal(p.get('response_type'), 'code');
    assert.deepEqual(p.get('scope')!.split(' '), SCOPES);
    assert.equal(p.get('access_type'), 'offline');
    assert.equal(p.get('prompt'), 'consent');
    assert.equal(p.get('code_challenge_method'), 'S256');
    assert.match(p.get('code_challenge')!, /^[A-Za-z0-9_-]{43}$/);
    assert.match(p.get('state')!, /^[A-Za-z0-9_-]{43}$/);
    assert.equal(p.get('login_hint'), OWNER);
    for (const attr of ['HttpOnly', 'SameSite=Lax', 'Secure', 'Path=/api/google', 'Max-Age=600']) assert.ok(setCookie.includes(attr), attr);
    assert.ok(!setCookie.includes(p.get('code_challenge')!), 'only the signed blob is in the cookie');
  });

  test('local: exact localhost redirect URI, cookie without Secure (http)', async () => {
    const { location, setCookie } = await begin(LOCAL);
    assert.equal(location.searchParams.get('redirect_uri'), 'http://localhost:8788/api/google/callback');
    assert.ok(!setCookie.includes('Secure'));
  });

  test('refuses unregistered origins (www, 127.0.0.1) and missing configuration', async () => {
    assert.equal((await get(start, 'https://www.rahulmehra.co.in/api/google/start', liveEnv(db))).status, 400);
    assert.equal((await get(start, 'http://127.0.0.1:8788/api/google/start', liveEnv(db))).status, 400);
    assert.equal((await get(start, `${SITE}/api/google/start`, liveEnv(db, { GOOGLE_TOKEN_ENCRYPTION_KEY: 'too-short' }))).status, 503);
  });
});

describe('GET /api/google/callback', () => {
  test('valid state + owner account: refresh token stored encrypted, cookie cleared, no secrets shown', async () => {
    const s = await begin();
    const res = await finish(s);
    assert.equal(res.status, 200);
    assert.match(await body(res), /Google Calendar connected/);
    assert.match(res.headers.get('Set-Cookie')!, /rm_google_oauth=;.*Max-Age=0/);
    const row = stored()!;
    assert.equal(row.email, OWNER);
    assert.equal(row.status, 'active');
    assert.ok(!row.enc_refresh_token.includes(REFRESH_TOKEN), 'not stored in plaintext');
    assert.equal(await decryptSecret(row.enc_refresh_token, parseKey(ENC_KEY)!, tokenContext(OWNER)), REFRESH_TOKEN);
  });

  test('local callback works with the localhost redirect URI', async () => {
    const s = await begin(LOCAL);
    assert.equal((await finish(s, LOCAL)).status, 200);
  });

  test('invalid, tampered, missing and expired state are rejected; nothing stored', async () => {
    const s = await begin();
    assert.equal((await finish({ ...s, state: 'wrong-state' })).status, 400);
    const [name, value] = s.cookie.split('=');
    const [payload, sig] = value.split('.');
    assert.equal((await finish({ ...s, cookie: `${name}=${payload}.${sig.slice(0, -2)}xx` })).status, 400);
    assert.equal((await finish({ ...s, cookie: '' })).status, 400);
    clock.now = () => new Date('2026-10-19T10:11:00Z'); // 11 minutes later
    const expired = await finish(s);
    assert.equal(expired.status, 400);
    assert.match(await body(expired), /Link expired/);
    assert.equal(stored(), null);
  });

  test('cancellation and Google errors: friendly page, raw error not echoed, nothing stored', async () => {
    const s = await begin();
    const denied = await get(callback, `${SITE}/api/google/callback?error=access_denied&state=${s.state}`, liveEnv(db), s.cookie);
    assert.equal(denied.status, 400);
    assert.match(await body(denied), /Authorization cancelled/);
    const weird = await get(callback, `${SITE}/api/google/callback?error=%3Cscript%3Ealert(1)%3C/script%3E`, liveEnv(db), s.cookie);
    assert.ok(!(await body(weird)).includes('<script>alert'));
    assert.equal((await finish({ ...s }, SITE, { code: '' })).status, 400);
    assert.equal(stored(), null);
  });

  test('token exchange failure (e.g. reused code): 502, no secrets, nothing stored', async () => {
    google.exchangeFails = true;
    const res = await finish(await begin());
    assert.equal(res.status, 502);
    await body(res);
    assert.equal(stored(), null);
  });

  test('a different or unverified Google account is rejected', async () => {
    google.claims = { ...google.claims, email: 'someone.else@gmail.com' };
    const other = await finish(await begin());
    assert.equal(other.status, 403);
    assert.match(await body(other), /Wrong Google account/);
    google.claims = { ...google.claims, email: OWNER, email_verified: false };
    assert.equal((await finish(await begin())).status, 403);
    google.claims = { ...google.claims, email_verified: true, aud: 'another-client' };
    assert.equal((await finish(await begin())).status, 400);
    assert.equal(stored(), null);
  });

  test('missing calendar permission or missing refresh token is reported, nothing stored', async () => {
    google.scope = 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.events';
    assert.match(await body(await finish(await begin())), /Calendar permission missing/);
    google.scope = new FakeGoogle().scope;
    google.issueRefreshToken = false;
    assert.match(await body(await finish(await begin())), /No offline access/);
    assert.equal(stored(), null);
  });
});

describe('token refresh', () => {
  async function connect() {
    assert.equal((await finish(await begin())).status, 200);
  }

  test('access token is refreshed from the stored token and reused while valid', async () => {
    await connect();
    const env = liveEnv(db);
    assert.deepEqual(await getBusy(env, db, 0, 1), []);
    assert.deepEqual(await getBusy(env, db, 0, 1), []);
    assert.equal(google.refreshCalls, 1, 'cached between calls');
  });

  test('a 401 (token revoked server-side) triggers exactly one refresh and retry', async () => {
    await connect();
    const env = liveEnv(db);
    await getBusy(env, db, 0, 1);
    google.validAccess.clear();
    await getBusy(env, db, 0, 1);
    assert.equal(google.refreshCalls, 2);
  });

  test('invalid_grant marks the connection invalid; later calls fail fast as auth_revoked', async () => {
    await connect();
    google.revoked = true;
    await assert.rejects(getBusy(liveEnv(db), db, 0, 1), (e) => e instanceof GoogleError && e.code === 'auth_revoked');
    assert.equal((await getGoogleAuth(db))!.status, 'invalid');
    const calls = google.refreshCalls;
    await assert.rejects(getBusy(liveEnv(db), db, 0, 1), (e) => e instanceof GoogleError && e.code === 'auth_revoked');
    assert.equal(google.refreshCalls, calls, 'no further Google calls');
  });

  test('not connected / wrong encryption key fail closed', async () => {
    await assert.rejects(getBusy(liveEnv(db), db, 0, 1), (e) => e instanceof GoogleError && e.code === 'not_connected');
    await connect();
    resetGoogleTokenCache();
    const otherKey = Buffer.from(Array.from({ length: 32 }, (_, i) => 200 - i)).toString('base64');
    await assert.rejects(getBusy(liveEnv(db, { GOOGLE_TOKEN_ENCRYPTION_KEY: otherKey }), db, 0, 1), (e) => e instanceof GoogleError && e.code === 'not_connected');
  });
});

describe('crypto', () => {
  test('AES-GCM: wrong key, tampering or a different context are rejected', async () => {
    const key = parseKey(ENC_KEY)!;
    const blob = await encryptSecret('secret-value', key, 'ctx-a');
    assert.equal(await decryptSecret(blob, key, 'ctx-a'), 'secret-value');
    await assert.rejects(decryptSecret(blob, key, 'ctx-b'));
    await assert.rejects(decryptSecret(blob.slice(0, -3) + 'AAA', key, 'ctx-a'));
    await assert.rejects(decryptSecret(blob, parseKey(Buffer.alloc(32, 1).toString('base64'))!, 'ctx-a'));
    assert.equal(parseKey('dG9vLXNob3J0'), null);
  });
});
