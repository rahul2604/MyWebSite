/*
 * Tests for the "Chat with Rahul" email function and its frontend client.
 * Run with `npm test` (Node's built-in test runner; Resend is always mocked here,
 * so these tests never send a real email).
 */
import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { buildEmail, onRequest } from '../functions/api/contact.ts';
import { ContactError, sendContactMessage } from '../src/contact/contactApi.ts';

const SITE = 'https://rahulmehra.co.in';
const FAKE_KEY = 're_test_key_not_real';
const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

let ipCounter = 0;
const valid = {
  name: 'Asha Rao',
  email: 'asha@example.com',
  whatsapp: '+91 98765 43210',
  message: 'Hello Rahul, I would like to know more about coaching.',
  website: '',
  elapsedMs: 8000,
};

/** Calls the Pages Function the way Cloudflare does. Each call gets its own IP unless one is given. */
function call(body: unknown, opts: { method?: string; origin?: string; ip?: string; key?: string | null; raw?: string; type?: string } = {}) {
  const init: RequestInit = {
    method: opts.method ?? 'POST',
    headers: {
      'Content-Type': opts.type ?? 'application/json',
      Origin: opts.origin ?? SITE,
      'CF-Connecting-IP': opts.ip ?? `10.0.0.${++ipCounter}`,
    },
  };
  if (init.method !== 'GET') init.body = opts.raw ?? JSON.stringify(body);
  const env = opts.key === null ? {} : { RESEND_API_KEY: opts.key ?? FAKE_KEY };
  return onRequest({ request: new Request(`${SITE}/api/contact`, init), env });
}

/** Replaces fetch with a fake Resend and records what was sent. */
function mockResend(status: number, body: unknown) {
  const calls: { url: string; init: RequestInit }[] = [];
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url: String(url), init });
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  }) as typeof fetch;
  return calls;
}

describe('POST /api/contact', () => {
  test('valid submission is sent to Resend and reports success only after acceptance', async () => {
    const calls = mockResend(200, { id: 'email_123' });
    const res = await call(valid);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://api.resend.com/emails');
    const sent = JSON.parse(String(calls[0].init.body));
    assert.deepEqual(sent.to, ['rahul.a.mehra@gmail.com']);
    assert.equal(sent.reply_to, 'asha@example.com');
    assert.match(sent.from, /onboarding@resend\.dev/);
    assert.match(sent.subject, /^New Website Enquiry — Chat with Rahul: Asha Rao$/);
    assert.match(sent.text, /Source:\s+Chat with Rahul contact form/);
    assert.match(sent.text, /\+919876543210/);
    assert.equal((calls[0].init.headers as Record<string, string>).Authorization, `Bearer ${FAKE_KEY}`);
  });

  test('recipient and sender can be configured separately from the key', async () => {
    const calls = mockResend(200, { id: 'email_456' });
    const res = await onRequest({
      request: new Request(`${SITE}/api/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Origin: SITE, 'CF-Connecting-IP': '10.9.9.9' }, body: JSON.stringify(valid),
      }),
      env: { RESEND_API_KEY: FAKE_KEY, CONTACT_TO_EMAIL: 'other@example.com', CONTACT_FROM_EMAIL: 'Site <hi@send.example.com>' },
    });
    assert.equal(res.status, 200);
    const sent = JSON.parse(String(calls[0].init.body));
    assert.deepEqual(sent.to, ['other@example.com']);
    assert.equal(sent.from, 'Site <hi@send.example.com>');
  });

  test('missing required fields are rejected without calling Resend', async () => {
    const calls = mockResend(200, { id: 'x' });
    for (const field of ['name', 'email', 'message'] as const) {
      const res = await call({ ...valid, [field]: '' });
      assert.equal(res.status, 400, field);
      assert.equal((await res.json()).code, 'invalid');
    }
    assert.equal(calls.length, 0);
  });

  test('invalid email and invalid WhatsApp are rejected', async () => {
    mockResend(200, { id: 'x' });
    assert.equal((await call({ ...valid, email: 'not-an-email' })).status, 400);
    assert.equal((await call({ ...valid, whatsapp: '98765' })).status, 400);
    assert.equal((await call({ ...valid, whatsapp: '' })).status, 200, 'WhatsApp is optional');
  });

  test('malformed, non-object, wrong type and oversized bodies are rejected', async () => {
    mockResend(200, { id: 'x' });
    assert.equal((await call(null, { raw: '{not json' })).status, 400);
    assert.equal((await call(null, { raw: '[1,2,3]' })).status, 400);
    assert.equal((await call(null, { raw: 'name=x', type: 'application/x-www-form-urlencoded' })).status, 415);
    assert.equal((await call({ ...valid, message: 'x'.repeat(20_000) })).status, 413);
  });

  test('unsupported methods and other origins are rejected', async () => {
    const get = await call(null, { method: 'GET' });
    assert.equal(get.status, 405);
    assert.equal(get.headers.get('Allow'), 'POST');
    assert.equal((await call(valid, { origin: 'https://evil.example' })).status, 403);
  });

  test('spam protection: honeypot and too-fast submissions', async () => {
    const calls = mockResend(200, { id: 'x' });
    assert.equal((await (await call({ ...valid, website: 'http://spam' })).json()).code, 'spam');
    assert.equal((await (await call({ ...valid, elapsedMs: 500 })).json()).code, 'too_fast');
    assert.equal(calls.length, 0);
  });

  test('rate limit: the 6th message from one visitor within 10 minutes is refused', async () => {
    mockResend(200, { id: 'x' });
    for (let i = 0; i < 5; i++) assert.equal((await call(valid, { ip: '10.1.1.1' })).status, 200);
    const sixth = await call(valid, { ip: '10.1.1.1' });
    assert.equal(sixth.status, 429);
    assert.equal((await sixth.json()).code, 'rate_limited');
  });

  test('missing API key reports not_configured and never calls Resend', async () => {
    const calls = mockResend(200, { id: 'x' });
    const res = await call(valid, { key: null });
    assert.equal(res.status, 503);
    assert.equal((await res.json()).code, 'not_configured');
    assert.equal(calls.length, 0);
  });

  test('provider rejections map to clear codes and never report success or leak details', async () => {
    const cases: [number, unknown, string][] = [
      [401, { name: 'validation_error', message: 'API key is invalid' }, 'provider_auth'],
      [403, { name: 'validation_error', message: 'You can only send testing emails to your own email address (owner@x.com).' }, 'provider_sender'],
      [422, { name: 'validation_error', message: 'The domain is not verified.' }, 'provider_sender'],
      [422, { name: 'validation_error', message: 'Invalid `to` field.' }, 'provider_rejected'],
      [429, { name: 'rate_limit_exceeded', message: 'Too many requests' }, 'provider_unavailable'],
      [500, { name: 'internal_server_error', message: 'oops' }, 'provider_unavailable'],
      [200, {}, 'provider_rejected'], // accepted status but no id: not treated as sent
    ];
    for (const [status, body, code] of cases) {
      mockResend(status, body);
      const res = await call(valid);
      const json = await res.json();
      assert.equal(res.status, 502, `${status} ${code}`);
      assert.equal(json.ok, false);
      assert.equal(json.code, code);
      const raw = JSON.stringify(json);
      assert.ok(!raw.includes(FAKE_KEY) && !raw.includes('owner@x.com') && !raw.includes('oops'), 'no provider details or key in response');
    }
  });

  test('network failure reaching Resend is reported as provider_unavailable', async () => {
    globalThis.fetch = (async () => {
      throw new TypeError('fetch failed');
    }) as typeof fetch;
    const res = await call(valid);
    assert.equal(res.status, 502);
    assert.equal((await res.json()).code, 'provider_unavailable');
  });
});

describe('email content', () => {
  test('escapes HTML and includes every field, timestamp and source', () => {
    const { subject, html, text } = buildEmail({
      name: 'Eve <b>', email: 'eve@example.com', whatsapp: '', message: 'Hi <script>alert(1)</script>\nLine two',
      submittedAt: new Date('2026-10-20T10:30:00Z'),
    });
    assert.match(subject, /Chat with Rahul: Eve <b>$/);
    assert.ok(!html.includes('<script>alert(1)</script>'));
    assert.ok(html.includes('&lt;script&gt;'));
    assert.ok(html.includes('Eve &lt;b&gt;'));
    assert.match(text, /Tuesday, 20 October 2026 at 4:00 pm IST/i);
    assert.match(html, /Not provided/);
    assert.match(html, /Chat with Rahul contact form/);
    assert.match(html, /mailto:eve@example\.com/);
  });
});

describe('frontend client (sendContactMessage)', () => {
  const form = { name: 'Asha Rao', email: 'asha@example.com', whatsapp: '', message: 'Hello there, testing.', website: '' };
  const respond = (status: number, body: string, type = 'application/json') => {
    globalThis.fetch = (async () => new Response(body, { status, headers: { 'Content-Type': type } })) as typeof fetch;
  };
  const failure = async () => {
    try {
      await sendContactMessage(form, 5000);
    } catch (e) {
      assert.ok(e instanceof ContactError);
      return e;
    }
    assert.fail('expected an error');
  };

  test('resolves only on { ok: true }', async () => {
    respond(200, '{"ok":true}');
    await sendContactMessage(form, 5000);
    respond(200, '{"ok":false}');
    assert.equal((await failure()).code, 'server');
  });

  test('passes server error codes and messages through', async () => {
    respond(503, '{"ok":false,"code":"not_configured","error":"Messaging is temporarily unavailable."}');
    const e = await failure();
    assert.equal(e.code, 'not_configured');
    assert.equal(e.message, 'Messaging is temporarily unavailable.');
    respond(502, '{"ok":false,"code":"provider_sender","error":"x"}');
    assert.equal((await failure()).code, 'provider_sender');
  });

  test('detects a missing endpoint (frontend-only dev server)', async () => {
    respond(404, '<!doctype html><p>Not found</p>', 'text/html');
    assert.equal((await failure()).code, 'no_endpoint');
    respond(500, '');
    assert.equal((await failure()).code, 'no_endpoint');
  });

  test('network failure', async () => {
    globalThis.fetch = (async () => {
      throw new TypeError('Failed to fetch');
    }) as typeof fetch;
    assert.equal((await failure()).code, 'network');
  });
});
