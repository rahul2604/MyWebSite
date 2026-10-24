/*
 * Booking tests. D1 is replaced by a real in-memory SQLite database (node:sqlite),
 * so the reservation SQL runs for real. Resend is always MOCKED here: these tests
 * never send email.
 */
import { afterEach, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest as availability } from '../functions/api/availability.ts';
import { onRequest as bookings } from '../functions/api/bookings.ts';
import { ensureSchema, reserve } from '../server/bookingStore.ts';
import { clock } from '../server/clock.ts';
import { bookingWindow, checkSlot, istToMs, overlaps, scheduledTimes, slotRange } from '../src/coaching/lib/slots.ts';
import { memoryD1 } from './helpers.ts';

/* ---------- helpers ---------- */
const SITE = 'https://rahulmehra.co.in';
// Monday 19 Oct 2026, 15:30 IST. Mock hours on Mondays: 19:00–22:00 IST.
const MONDAY_1530_IST = new Date('2026-10-19T10:00:00Z');
const realFetch = globalThis.fetch;
let db: ReturnType<typeof memoryD1>;
let sent: { to: string[]; reply_to?: string; subject: string; text: string; from: string }[];
let ip = 0;

function setNow(d: Date) {
  clock.now = () => d;
}

/** Mock Resend. `reject` decides per recipient whether to fail and how. */
function mockResend(reject: (to: string) => null | { status: number; body: unknown } | 'network' = () => null) {
  globalThis.fetch = (async (_url: string, init: RequestInit) => {
    const payload = JSON.parse(String(init.body));
    const r = reject(payload.to[0]);
    if (r === 'network') throw new TypeError('fetch failed');
    if (r) return new Response(JSON.stringify(r.body), { status: r.status });
    sent.push(payload);
    return new Response(JSON.stringify({ id: `email_${sent.length}` }), { status: 200 });
  }) as typeof fetch;
}

const details = {
  fullName: 'Asha Rao',
  whatsapp: '+91 98765 43210',
  email: 'asha@example.com',
  purpose: 'I would like advice on moving into a strategy role.',
  heardFrom: 'LinkedIn',
};

function book(body: Record<string, unknown>, env: Record<string, unknown> = { BOOKINGS_DB: db, RESEND_API_KEY: 're_test_not_real' }) {
  return bookings({
    request: new Request(`${SITE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: SITE, 'CF-Connecting-IP': `10.0.0.${++ip}` },
      body: JSON.stringify({ serviceId: 'lets-connect', date: '2026-10-19', time: '19:00', details, idempotencyKey: crypto.randomUUID(), ...body }),
    }),
    env: env as never,
  });
}

const getAvailability = (from: string, to: string, env: Record<string, unknown> = { BOOKINGS_DB: db }) =>
  availability({ request: new Request(`${SITE}/api/availability?from=${from}&to=${to}`), env: env as never });

/** Rows stored. Rejected requests may never create the table, which also means nothing was stored. */
const count = () => {
  const table = db.raw.prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'bookings'`).get();
  return table ? Number((db.raw.prepare('SELECT COUNT(*) AS n FROM bookings').get() as { n: number }).n) : 0;
};

beforeEach(() => {
  db = memoryD1();
  sent = [];
  setNow(MONDAY_1530_IST);
  mockResend();
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

/* ---------- rules ---------- */
describe('slot rules', () => {
  test('IST conversion and booking window use IST dates', () => {
    assert.equal(istToMs('2026-10-19', '19:00'), Date.UTC(2026, 9, 19, 13, 30));
    // 20:00 UTC on 19 Oct is already 01:30 on 20 Oct in IST.
    assert.equal(bookingWindow(new Date('2026-10-19T20:00:00Z')).first, '2026-10-20');
    assert.equal(bookingWindow(MONDAY_1530_IST).last, '2026-11-17'); // 30 days counting today
  });

  test('15-minute sessions start every 30 minutes (15-minute buffer)', () => {
    assert.deepEqual(scheduledTimes('2026-10-19'), ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30']);
    assert.deepEqual(scheduledTimes('2026-10-21'), [], 'no mock hours on Wednesdays');
    const r = slotRange('2026-10-19', '19:00');
    assert.equal(r.endMs - r.startMs, 15 * 60_000);
    assert.equal(r.blockEndMs - r.endMs, 15 * 60_000);
  });

  test('minimum notice is 2 hours', () => {
    const at1730 = new Date('2026-10-19T12:00:00Z'); // 17:30 IST
    assert.equal(checkSlot('2026-10-19', '19:00', at1730), 'too_soon'); // 1h30 away
    assert.equal(checkSlot('2026-10-19', '19:30', at1730), 'ok'); // exactly 2h away
    assert.equal(checkSlot('2026-10-19', '19:15', at1730), 'not_offered');
    assert.equal(checkSlot('2026-12-01', '19:00', at1730), 'outside_window');
    assert.equal(checkSlot('2026-10-19', '7pm', at1730), 'malformed');
  });

  test('buffer: a booking blocks the 15 minutes after it', async () => {
    await ensureSchema(db);
    const row = (time: string, key: string) => {
      const r = slotRange('2026-10-19', time);
      return {
        reference: `R-${key}`, idem_key: key, service_id: 'lets-connect', date: '2026-10-19', time,
        start_ms: r.startMs, end_ms: r.endMs, block_end_ms: r.blockEndMs, name: 'A', email: 'a@x.com',
        whatsapp: '+911234567890', purpose: 'p', heard_from: 'Other', created_at: 'now',
        duration_minutes: 15, mode: 'mock' as const, status: 'confirmed' as const, event_id: null, hold_until_ms: null,
      };
    };
    const now = MONDAY_1530_IST.getTime();
    assert.equal((await reserve(db, row('19:00', 'k1'), now)).status, 'created');
    // Off-grid times can't come from the UI, but the database still refuses anything inside session + buffer.
    const r = slotRange('2026-10-19', '19:20');
    assert.equal((await reserve(db, { ...row('19:00', 'k2'), time: '19:20', start_ms: r.startMs, end_ms: r.endMs, block_end_ms: r.blockEndMs }, now)).status, 'conflict');
    assert.equal((await reserve(db, row('19:30', 'k3'), now)).status, 'created', 'first slot after the buffer is free');
    assert.ok(overlaps(slotRange('2026-10-19', '19:00'), { startMs: istToMs('2026-10-19', '19:29'), blockEndMs: istToMs('2026-10-19', '20:00') }));
  });
});

/* ---------- availability endpoint ---------- */
describe('GET /api/availability', () => {
  test('returns IST slots, marks too-soon and booked ones', async () => {
    setNow(new Date('2026-10-19T12:00:00Z')); // 17:30 IST
    assert.equal((await (await book({ time: '20:00' })).json()).ok, true);
    const res = await getAvailability('2026-10-19', '2026-10-19');
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.deepEqual(
      data.days[0].slots.map((s: { time: string; status: string }) => `${s.time}:${s.status}`),
      ['19:00:past', '19:30:available', '20:00:booked', '20:30:available', '21:00:available', '21:30:available'],
    );
  });

  test('without the D1 binding it says booking is unavailable', async () => {
    const res = await getAvailability('2026-10-19', '2026-10-19', {});
    assert.equal(res.status, 503);
    assert.equal((await res.json()).code, 'not_configured');
  });
});

/* ---------- bookings endpoint ---------- */
describe('POST /api/bookings', () => {
  test('valid booking: stored, both emails sent with the right details', async () => {
    const res = await book({});
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.ok, true);
    assert.match(data.booking.reference, /^RM-261019-[A-Z2-9]{6}$/);
    assert.deepEqual(data.emails, { owner: 'sent', booker: 'sent' });
    assert.equal(count(), 1);

    const [owner, booker] = sent;
    assert.deepEqual(owner.to, ['rahul.a.mehra@gmail.com']);
    assert.equal(owner.reply_to, 'asha@example.com');
    assert.deepEqual(booker.to, ['asha@example.com']);
    assert.equal(booker.reply_to, 'rahul.a.mehra@gmail.com');
    for (const m of [owner, booker]) {
      assert.ok(m.subject.includes(data.booking.reference));
      assert.ok(m.subject.includes('Monday, 19 October 2026, 7:00 – 7:15 PM IST'));
      assert.match(m.text, /15 minutes/);
      assert.match(m.text, /demo booking/i);
      assert.match(m.text, /meeting link will be shared separately/i);
      assert.match(m.from, /onboarding@resend\.dev/);
    }
    assert.match(owner.text, /\+919876543210/);
    assert.match(owner.text, /advice on moving into a strategy role/);
    const stored = db.raw.prepare('SELECT owner_email, booker_email FROM bookings').get() as Record<string, string>;
    assert.deepEqual({ ...stored }, { owner_email: 'sent', booker_email: 'sent' });
  });

  test('duplicate: a second booking for the same slot is refused', async () => {
    assert.equal((await book({})).status, 200);
    const second = await book({ details: { ...details, email: 'other@example.com' } });
    assert.equal(second.status, 409);
    assert.equal((await second.json()).code, 'slot_taken');
    assert.equal(count(), 1);
  });

  test('concurrent requests for one slot: exactly one succeeds', async () => {
    const results = await Promise.all([book({}), book({}), book({})]);
    assert.deepEqual(results.map((r) => r.status).sort(), [200, 409, 409]);
    assert.equal(count(), 1);
  });

  test('retry with the same idempotency key returns the same booking and sends no new emails', async () => {
    const key = crypto.randomUUID();
    const first = await (await book({ idempotencyKey: key })).json();
    const again = await (await book({ idempotencyKey: key })).json();
    assert.equal(again.ok, true);
    assert.equal(again.replayed, true);
    assert.equal(again.booking.reference, first.booking.reference);
    assert.equal(sent.length, 2, 'emails sent once only');
    assert.equal(count(), 1);
  });

  test('slot re-validated on the server: too soon, off-grid, closed day, outside window', async () => {
    setNow(new Date('2026-10-19T12:00:00Z')); // 17:30 IST
    assert.equal((await (await book({ time: '19:00' })).json()).code, 'slot_too_soon');
    assert.equal((await (await book({ time: '19:15' })).json()).code, 'slot_invalid');
    assert.equal((await (await book({ date: '2026-10-21' })).json()).code, 'slot_invalid');
    assert.equal((await (await book({ date: '2027-01-04' })).json()).code, 'slot_invalid');
    assert.equal(count(), 0);
  });

  test('details validated on the server', async () => {
    const res = await book({ details: { ...details, email: 'nope', whatsapp: '98765', heardFrom: 'Billboard' } });
    const data = await res.json();
    assert.equal(res.status, 400);
    assert.equal(data.code, 'invalid');
    assert.ok(data.fields.email && data.fields.whatsapp && data.fields.heardFrom);
    assert.equal(count(), 0);
  });

  test('every offered service is free and bookable through the server; unknown services are refused', async () => {
    // 30-minute mock interview (formerly a paid browser demo) at 19:00; 15-minute call after its buffer.
    const interview = await (await book({ serviceId: 'strategy-interview' })).json();
    assert.equal(interview.ok, true);
    assert.equal(interview.booking.durationMinutes, 30);
    assert.equal(interview.booking.free, true);
    const call = await (await book({ serviceId: 'pmp-discovery', time: '20:30' })).json();
    assert.equal(call.ok, true);
    assert.equal(call.booking.free, true);
    assert.equal((await (await book({ serviceId: 'paid-masterclass', time: '21:00' })).json()).code, 'service_not_bookable');
    assert.equal(count(), 2);
  });

  test('booker email rejected (e.g. unverified sender): booking kept, status reported', async () => {
    mockResend((to) =>
      to === 'asha@example.com'
        ? { status: 403, body: { name: 'validation_error', message: 'You can only send testing emails to your own email address.' } }
        : null,
    );
    const data = await (await book({})).json();
    assert.equal(data.ok, true);
    assert.deepEqual(data.emails, { owner: 'sent', booker: 'failed' });
    assert.equal(data.bookerEmailIssue, 'provider_sender');
    assert.ok(!JSON.stringify(data).includes('testing emails'), 'provider text not exposed');
    const stored = db.raw.prepare('SELECT booker_email FROM bookings').get() as Record<string, string>;
    assert.equal(stored.booker_email, 'failed');
  });

  test('owner email fails / network down: booking kept, nothing claimed as sent', async () => {
    mockResend((to) => (to === 'rahul.a.mehra@gmail.com' ? { status: 500, body: { name: 'internal_server_error' } } : null));
    assert.deepEqual((await (await book({ time: '19:00' })).json()).emails, { owner: 'failed', booker: 'sent' });
    mockResend(() => 'network');
    assert.deepEqual((await (await book({ time: '19:30' })).json()).emails, { owner: 'failed', booker: 'failed' });
    assert.equal(count(), 2);
  });

  test('missing configuration refuses the booking before anything is stored', async () => {
    const noKey = await book({}, { BOOKINGS_DB: db });
    assert.equal(noKey.status, 503);
    assert.equal((await noKey.json()).code, 'not_configured');
    const noDb = await book({}, { RESEND_API_KEY: 're_test' });
    assert.equal(noDb.status, 503);
    assert.equal(count(), 0);
    assert.equal(sent.length, 0);
  });

  test('rejects wrong method, other origins, bad JSON and missing idempotency key', async () => {
    const env = { BOOKINGS_DB: db, RESEND_API_KEY: 'x' } as never;
    assert.equal((await bookings({ request: new Request(`${SITE}/api/bookings`), env })).status, 405);
    const post = (headers: Record<string, string>, body: string) =>
      bookings({ request: new Request(`${SITE}/api/bookings`, { method: 'POST', headers, body }), env });
    assert.equal((await post({ 'Content-Type': 'application/json', Origin: 'https://evil.example' }, '{}')).status, 403);
    assert.equal((await post({ 'Content-Type': 'application/json', Origin: SITE }, '{bad')).status, 400);
    assert.equal((await (await book({ idempotencyKey: 'short' })).json()).code, 'invalid');
  });
});
