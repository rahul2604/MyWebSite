/*
 * WhatsApp booking confirmations and reminders, free-service enforcement and phone validation.
 * The WhatsApp Cloud API and Resend are in-memory fakes: any other network call fails the test,
 * so no real message or email can ever be sent. D1 is real SQL (node:sqlite).
 */
import { afterEach, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest as bookings } from '../functions/api/bookings.ts';
import { onRequest as runNotifications } from '../functions/api/notifications/run.ts';
import { onRequest as pmpApi } from '../functions/api/pmp/[[path]].ts';
import { COACHING_SERVICES } from '../src/coaching/data/services.ts';
import { normaliseWhatsapp, whatsappProblem } from '../src/coaching/lib/validation.ts';
import { clock } from '../server/clock.ts';
import { meetingLink, RETRY_GAP_MS } from '../server/notifications.ts';
import { NO_LINK_NOTE, templateParams, toCloudApiNumber } from '../server/whatsapp.ts';
import { captureLogs, memoryD1 } from './helpers.ts';

const SITE = 'https://rahulmehra.co.in';
// Monday 19 Oct 2026, 15:30 IST. Mock booking hours on Mondays: 19:00–22:00 IST.
const NOW = Date.parse('2026-10-19T10:00:00Z');
const START_1900_IST = Date.parse('2026-10-19T13:30:00Z');
const TOKEN = 'SENTINEL-WHATSAPP-TOKEN-EAAG123';
const CRON = 'SENTINEL-CRON-SECRET-0123456789abcdef';
const PHONE_ID = '123456789012345';

let db: ReturnType<typeof memoryD1>;
let nowMs = NOW;
let wa: { url: string; auth: string; body: any }[];
let waStatus: number | 'network';
let emails: any[];
let logs: ReturnType<typeof captureLogs>;
let ip = 0;
const realFetch = globalThis.fetch;
const realNow = clock.now;

const details = {
  fullName: 'Asha Rao',
  whatsapp: '+91 98765 43210',
  email: 'asha@example.com',
  purpose: 'I would like advice on moving into a strategy role.',
  heardFrom: 'LinkedIn',
  whatsappOptIn: true,
};

const liveWa = (extra: Record<string, unknown> = {}) => ({
  BOOKINGS_DB: db,
  RESEND_API_KEY: 're_test_not_real',
  WHATSAPP_MODE: 'live',
  WHATSAPP_ACCESS_TOKEN: TOKEN,
  WHATSAPP_PHONE_NUMBER_ID: PHONE_ID,
  NOTIFICATIONS_CRON_SECRET: CRON,
  ...extra,
});

async function book(body: Record<string, unknown> = {}, env: Record<string, unknown> = liveWa()) {
  const res = await bookings({
    request: new Request(`${SITE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: SITE, 'CF-Connecting-IP': `10.7.0.${++ip}` },
      body: JSON.stringify({ serviceId: 'lets-connect', date: '2026-10-19', time: '19:00', details, idempotencyKey: crypto.randomUUID(), ...body }),
    }),
    env: env as never,
  });
  return { status: res.status, data: (await res.json()) as any, text: '' };
}

async function cron(env: Record<string, unknown> = liveWa(), auth = `Bearer ${CRON}`) {
  const res = await runNotifications({
    request: new Request(`${SITE}/api/notifications/run`, { method: 'POST', headers: auth ? { Authorization: auth } : {} }),
    env: env as never,
  });
  return { status: res.status, data: (await res.json()) as any };
}

const notes = () => db.raw.prepare(`SELECT * FROM booking_notifications ORDER BY kind`).all() as any[];
const bookingCount = () => Number((db.raw.prepare('SELECT COUNT(*) AS n FROM bookings').get() as any).n);

beforeEach(() => {
  db = memoryD1();
  nowMs = NOW;
  clock.now = () => new Date(nowMs);
  wa = [];
  waStatus = 200;
  emails = [];
  logs = captureLogs();
  globalThis.fetch = (async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = new URL(String(input instanceof Request ? input.url : input));
    if (url.host === 'graph.facebook.com') {
      wa.push({ url: url.toString(), auth: new Headers(init.headers).get('Authorization') || '', body: JSON.parse(String(init.body)) });
      if (waStatus === 'network') throw new TypeError('fetch failed');
      if (waStatus !== 200) return new Response(JSON.stringify({ error: { code: 131000, message: `Something went wrong for +919876543210 ${TOKEN}` } }), { status: waStatus });
      return new Response(JSON.stringify({ messaging_product: 'whatsapp', contacts: [{ wa_id: '919876543210' }], messages: [{ id: `wamid.TEST${wa.length}` }] }), { status: 200 });
    }
    if (url.host === 'api.resend.com') {
      emails.push(JSON.parse(String(init.body)));
      return new Response(JSON.stringify({ id: `email_${emails.length}` }), { status: 200 });
    }
    throw new Error(`Unexpected network call in tests: ${url.host}`);
  }) as typeof fetch;
});
afterEach(() => {
  logs.restore();
  globalThis.fetch = realFetch;
  clock.now = realNow;
  assert.ok(!logs.lines.some((l) => l.includes(TOKEN) || l.includes(CRON) || l.includes('9876543210')), `secret or full phone number in logs:\n${logs.lines.join('\n')}`);
});

/* ---------------------------------------------------------------- */
describe('free services', () => {
  test('every currently offered service is free and bookable through the server', () => {
    assert.ok(COACHING_SERVICES.length >= 3);
    for (const s of COACHING_SERVICES) {
      assert.equal(s.free, true, `${s.id} should be free`);
      assert.equal(s.price, 'Free', `${s.id} should show "Free"`);
      assert.equal(s.booking, 'server', `${s.id} should be bookable`);
      assert.ok(!/₹|\brs\.?\s?\d|\binr\b|\$\d/i.test(JSON.stringify(s)), `${s.id} still mentions a price`);
    }
  });

  test('the server refuses a service that is not marked free, even if the request claims a price', async () => {
    const s = COACHING_SERVICES.find((x) => x.id === 'lets-connect')!;
    s.free = false;
    try {
      const { data } = await book({ price: 0, free: true });
      assert.equal(data.code, 'service_not_bookable');
    } finally {
      s.free = true;
    }
    assert.equal(wa.length, 0);
  });

  test('a booking request cannot add a charge: price fields are ignored and the booking is recorded as free', async () => {
    const { status, data } = await book({ price: 299, amount: 29900, currency: 'INR' });
    assert.equal(status, 200);
    assert.equal(data.booking.free, true);
    assert.ok(!('price' in data.booking) && !('amount' in data.booking));
  });
});

/* ---------------------------------------------------------------- */
describe('phone number validation', () => {
  test('accepts real international mobile numbers and normalises them', () => {
    assert.equal(whatsappProblem('+91 98765 43210'), null);
    assert.equal(whatsappProblem('+44 7700 900123'), null);
    assert.equal(whatsappProblem('+1 (415) 555-0123'), null);
    assert.equal(normaliseWhatsapp('+91 98765-43210'), '+919876543210');
    assert.equal(toCloudApiNumber('+919876543210'), '919876543210');
  });

  test('rejects numbers that cannot receive a message', () => {
    for (const bad of ['', '+91', '9876543210', '+91 98765 4321', '+91 58765 43210', '+0 123456789', '+12', '+1234567890123456', '+91 98765 4321a']) {
      assert.ok(whatsappProblem(bad), `should reject "${bad}"`);
    }
  });

  test('an invalid number is rejected on the server: nothing stored, nothing sent', async () => {
    const { status, data } = await book({ details: { ...details, whatsapp: '+91 12345' } });
    assert.equal(status, 400);
    assert.ok(data.fields.whatsapp);
    assert.equal(wa.length, 0);
    assert.equal(emails.length, 0);
  });
});

/* ---------------------------------------------------------------- */
describe('WhatsApp booking confirmation', () => {
  test('sent after the booking is stored, to the booker’s own number, with the right details', async () => {
    const { status, data } = await book();
    assert.equal(status, 200);
    assert.equal(bookingCount(), 1);
    assert.equal(data.whatsapp.confirmation, 'sent');
    assert.equal(data.whatsapp.reminder, 'pending');
    assert.equal(data.whatsapp.reminderAt, new Date(START_1900_IST - 30 * 60_000).toISOString());

    assert.equal(wa.length, 1);
    const call = wa[0];
    assert.equal(call.url, `https://graph.facebook.com/v21.0/${PHONE_ID}/messages`);
    assert.equal(call.auth, `Bearer ${TOKEN}`);
    assert.equal(call.body.messaging_product, 'whatsapp');
    assert.equal(call.body.to, '919876543210');
    assert.notEqual(call.body.to, '919537784427', 'customer notifications never go to Rahul’s support number');
    assert.equal(call.body.type, 'template');
    assert.equal(call.body.template.name, 'booking_confirmation');
    assert.equal(call.body.template.language.code, 'en');
    const params = call.body.template.components[0].parameters.map((p: any) => p.text);
    assert.equal(params.length, 6);
    assert.equal(params[0], 'Asha');
    assert.equal(params[1], 'Need Advice? Let’s Talk');
    assert.match(params[2], /19/);
    assert.match(params[3], /IST$/);
    assert.equal(params[4], NO_LINK_NOTE, 'mock mode has no meeting link, so none is invented');
    assert.equal(params[5], data.booking.reference);
    for (const p of params) assert.ok(!/[\n\t]/.test(p), 'template parameters must be single-line');

    // Response never exposes provider ids or the token.
    assert.ok(!JSON.stringify(data).includes('wamid') && !JSON.stringify(data).includes(TOKEN));
    const [conf] = notes().filter((n) => n.kind === 'confirmation');
    assert.equal(conf.status, 'sent');
    assert.equal(conf.provider_message_id, 'wamid.TEST1');
  });

  test('without opt-in no WhatsApp message is sent or planned', async () => {
    const { status, data } = await book({ details: { ...details, whatsappOptIn: false } });
    assert.equal(status, 200);
    assert.deepEqual(data.whatsapp, { confirmation: 'not_requested' });
    assert.equal(wa.length, 0);
    assert.equal(notes().length, 0);
  });

  test('consent must be an explicit true (a string "true" is not consent)', async () => {
    const { data } = await book({ details: { ...details, whatsappOptIn: 'true' } });
    assert.equal(data.whatsapp.confirmation, 'not_requested');
    assert.equal(wa.length, 0);
  });

  test('WhatsApp off by default: nothing sent, status says so, booking unaffected', async () => {
    const { status, data } = await book({}, { BOOKINGS_DB: db, RESEND_API_KEY: 're_test_not_real' });
    assert.equal(status, 200);
    assert.equal(data.whatsapp.confirmation, 'skipped');
    assert.equal(data.whatsapp.confirmationReason, 'disabled');
    assert.equal(wa.length, 0);
  });

  test('live mode without credentials: clear safe status, no call, booking kept', async () => {
    const { status, data } = await book({}, liveWa({ WHATSAPP_ACCESS_TOKEN: '' }));
    assert.equal(status, 200);
    assert.equal(data.whatsapp.confirmation, 'skipped');
    assert.equal(data.whatsapp.confirmationReason, 'not_configured');
    assert.equal(wa.length, 0);
    assert.equal(bookingCount(), 1);
  });

  test('simulate mode records the message but never calls WhatsApp', async () => {
    const { data } = await book({}, liveWa({ WHATSAPP_MODE: 'simulate' }));
    assert.equal(data.whatsapp.confirmation, 'simulated');
    assert.equal(wa.length, 0);
    const [conf] = notes().filter((n) => n.kind === 'confirmation');
    assert.match(conf.preview, /Hi Asha, your booking for Need Advice\? Let’s Talk is confirmed\./);
    assert.match(conf.preview, /Fee: Free/);
    assert.ok(logs.lines.some((l) => l.includes('SIMULATED') && l.includes('+91•••••3210')));
  });

  test('provider failure never undoes the booking; retries are spaced and never duplicate', async () => {
    waStatus = 500;
    const key = crypto.randomUUID();
    const first = await book({ idempotencyKey: key });
    assert.equal(first.status, 200);
    assert.equal(first.data.whatsapp.confirmation, 'failed');
    assert.equal(bookingCount(), 1);
    assert.equal(wa.length, 1);

    // Immediate retry with the same key: same booking, no second attempt yet (retry gap).
    waStatus = 200;
    const again = await book({ idempotencyKey: key });
    assert.equal(again.data.replayed, true);
    assert.equal(again.data.booking.reference, first.data.booking.reference);
    assert.equal(wa.length, 1);
    assert.equal(bookingCount(), 1);

    // After the gap the scheduled run retries once; later runs never resend.
    nowMs += RETRY_GAP_MS + 1000;
    const run = await cron();
    assert.equal(run.status, 200);
    assert.equal(run.data.sent, 1);
    assert.equal(wa.length, 2);
    await cron();
    await book({ idempotencyKey: key });
    assert.equal(wa.filter((c) => c.body.template.name === 'booking_confirmation').length, 2);
    assert.equal(notes().find((n) => n.kind === 'confirmation').status, 'sent');
  });

  test('repeating a successful booking request never sends a second confirmation', async () => {
    const key = crypto.randomUUID();
    await book({ idempotencyKey: key });
    await book({ idempotencyKey: key });
    await book({ idempotencyKey: key });
    assert.equal(wa.length, 1);
  });

  test('invalid booking requests generate no notifications', async () => {
    await book({ time: '18:00' }); // not an offered slot
    await book({ serviceId: 'nope' });
    assert.equal(wa.length, 0);
    assert.equal(emails.length, 0);
  });
});

/* ---------------------------------------------------------------- */
describe('meeting links in messages', () => {
  const row = (o: Record<string, unknown>) =>
    ({ mode: 'live', status: 'confirmed', meet_url: 'https://meet.google.com/abc-defg-hij', ...o }) as never;

  test('only a confirmed live booking’s own verified Meet link is used', () => {
    assert.equal(meetingLink(row({})), 'https://meet.google.com/abc-defg-hij');
    assert.equal(meetingLink(row({ status: 'pending' })), null, 'not confirmed yet');
    assert.equal(meetingLink(row({ mode: 'mock' })), null, 'mock mode shares links separately');
    assert.equal(meetingLink(row({ meet_url: 'https://evil.example/meet' })), null, 'never an unverified URL');
    assert.equal(meetingLink(row({ meet_url: null })), null);
  });

  test('the template gets the link when available, otherwise an honest note', () => {
    const base = { firstName: 'Asha', serviceTitle: 'X', dateLabel: 'D', timeLabel: 'T', reference: 'R' };
    assert.equal(templateParams({ ...base, meetingUrl: 'https://meet.google.com/abc-defg-hij' })[4], 'https://meet.google.com/abc-defg-hij');
    assert.equal(templateParams({ ...base, meetingUrl: null })[4], NO_LINK_NOTE);
  });
});

/* ---------------------------------------------------------------- */
describe('meeting reminders', () => {
  test('sent once at the reminder time with the reminder template, never early, never twice', async () => {
    const { data } = await book();
    const ref = data.booking.reference;

    nowMs = START_1900_IST - 31 * 60_000; // 1 minute before the reminder is due
    assert.equal((await cron()).data.due, 0);
    assert.equal(wa.length, 1);

    nowMs = START_1900_IST - 30 * 60_000;
    const run = await cron();
    assert.equal(run.data.sent, 1);
    assert.equal(wa.length, 2);
    const reminder = wa[1].body;
    assert.equal(reminder.template.name, 'booking_reminder');
    assert.equal(reminder.to, '919876543210');
    assert.equal(reminder.template.components[0].parameters[5].text, ref);

    nowMs += 5 * 60_000;
    await cron();
    assert.equal(wa.length, 2, 'no duplicate reminder');
    assert.equal(notes().find((n) => n.kind === 'reminder').status, 'sent');
  });

  test('the interval is configurable and computed from the booking start (IST)', async () => {
    await book({}, liveWa({ REMINDER_MINUTES_BEFORE: '60' }));
    assert.equal(notes().find((n) => n.kind === 'reminder').due_ms, START_1900_IST - 60 * 60_000);
  });

  test('a reminder that would be in the past is not scheduled', async () => {
    // 19:00 IST booked at 15:30 IST with a 4-hour reminder: the reminder time has already passed.
    const { data } = await book({}, liveWa({ REMINDER_MINUTES_BEFORE: '240' }));
    assert.equal(data.whatsapp.reminder, 'skipped');
    assert.equal(data.whatsapp.reminderReason, 'too_late');
    nowMs = START_1900_IST - 60_000;
    await cron(liveWa({ REMINDER_MINUTES_BEFORE: '240' }));
    assert.equal(wa.filter((c) => c.body.template.name === 'booking_reminder').length, 0);
  });

  test('cancelled (no longer confirmed) bookings get no reminder', async () => {
    const { data } = await book();
    db.raw.prepare(`UPDATE bookings SET status = 'failed' WHERE reference = ?`).run(data.booking.reference);
    nowMs = START_1900_IST - 30 * 60_000;
    await cron();
    assert.equal(wa.length, 1);
    assert.equal(notes().find((n) => n.kind === 'reminder').issue, 'booking_not_confirmed');
  });

  test('nothing is sent once the session has started', async () => {
    waStatus = 500;
    await book();
    nowMs = START_1900_IST + 60_000;
    waStatus = 200;
    await cron();
    assert.equal(wa.length, 1, 'only the original failed attempt');
    assert.ok(notes().every((n) => n.status === 'skipped' && n.issue === 'expired'));
  });
});

/* ---------------------------------------------------------------- */
describe('scheduled run endpoint and admin view', () => {
  test('does not exist without a secret, rejects a wrong secret, and returns counts only', async () => {
    assert.equal((await cron(liveWa({ NOTIFICATIONS_CRON_SECRET: '' }))).status, 404);
    assert.equal((await cron(liveWa(), 'Bearer wrong-secret')).status, 401);
    assert.equal((await cron(liveWa(), '')).status, 401);
    await book();
    const ok = await cron();
    assert.equal(ok.status, 200);
    const text = JSON.stringify(ok.data);
    assert.ok(!/asha|9876|wamid|meet\.google/i.test(text), `run response leaks data: ${text}`);
  });

  test('admin bookings view: refused when signed out, refused for learners', async () => {
    const get = (cookie?: string) =>
      pmpApi({
        request: new Request(`${SITE}/api/pmp/admin/bookings`, { headers: { 'CF-Connecting-IP': '10.8.0.1', ...(cookie ? { Cookie: cookie } : {}) } }),
        env: { BOOKINGS_DB: db, PMP_COURSE_LAUNCHED: 'true' } as never,
      });
    assert.equal((await get()).status, 401);
    const signup = await pmpApi({
      request: new Request(`${SITE}/api/pmp/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Origin: SITE, 'CF-Connecting-IP': '10.8.0.2' },
        body: JSON.stringify({ name: 'Asha Rao', email: 'learner@example.com', password: 'correct horse 42' }),
      }),
      env: { BOOKINGS_DB: db, PMP_COURSE_LAUNCHED: 'true' } as never,
    });
    const cookie = (signup.headers.get('Set-Cookie') || '').split(';')[0];
    assert.equal((await get(cookie)).status, 403);
  });
});
