/*
 * BOOKING_MODE=live: Google Calendar availability, event + Meet creation, emails, recovery.
 * Google and Resend are in-memory fakes; any real network call fails the test.
 */
import { afterEach, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest as availability } from '../functions/api/availability.ts';
import { onRequest as bookings } from '../functions/api/bookings.ts';
import { EMAIL_RETRY_GAP_MS } from '../server/bookingPipeline.ts';
import { clock } from '../server/clock.ts';
import { encryptSecret, parseKey } from '../server/crypto.ts';
import { resetGoogleTokenCache, timing } from '../server/google.ts';
import { saveGoogleAuth, tokenContext } from '../server/googleAuthStore.ts';
import {
  captureLogs, containsSecret, ENC_KEY, FakeGoogle, FakeResend, installFetch, liveEnv, MEET_URL, memoryD1, OWNER, REFRESH_TOKEN, SITE,
} from './helpers.ts';

// Monday 19 Oct 2026, 15:30 IST. Booking hours on Mondays: 19:00–22:00 IST.
const NOW = new Date('2026-10-19T10:00:00Z');
let db: ReturnType<typeof memoryD1>;
let google: FakeGoogle;
let resend: FakeResend;
let restoreFetch: () => void;
let logs: ReturnType<typeof captureLogs>;
let ip = 0;
const realNow = clock.now;
const realTiming = { ...timing };

const details = {
  fullName: 'Asha Rao',
  whatsapp: '+91 98765 43210',
  email: 'asha@example.com',
  purpose: 'I would like advice on moving into a strategy role.',
  heardFrom: 'LinkedIn',
};

async function connectGoogle() {
  const enc = await encryptSecret(REFRESH_TOKEN, parseKey(ENC_KEY)!, tokenContext(OWNER));
  await saveGoogleAuth(db, { email: OWNER, encRefreshToken: enc, scopes: 'openid email', nowIso: NOW.toISOString() });
}

beforeEach(async () => {
  db = memoryD1();
  google = new FakeGoogle();
  resend = new FakeResend();
  restoreFetch = installFetch(google, resend);
  resetGoogleTokenCache();
  clock.now = () => NOW;
  timing.sleep = async () => {};
  timing.meetPollDelaysMs = [1, 1, 1, 1];
  logs = captureLogs();
  await connectGoogle();
});
afterEach(() => {
  logs.restore();
  restoreFetch();
  clock.now = realNow;
  Object.assign(timing, realTiming);
  assert.ok(!logs.lines.some(containsSecret), `secret in logs:\n${logs.lines.join('\n')}`);
});

async function book(body: Record<string, unknown> = {}, env = liveEnv(db)) {
  const res = await bookings({
    request: new Request(`${SITE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: SITE, 'CF-Connecting-IP': `10.1.0.${++ip}` },
      body: JSON.stringify({ serviceId: 'lets-connect', date: '2026-10-19', time: '19:00', details, idempotencyKey: crypto.randomUUID(), ...body }),
    }),
    env,
  });
  const text = await res.text();
  assert.ok(!containsSecret(text), 'secret in response');
  return { status: res.status, data: JSON.parse(text) };
}

async function slots(date = '2026-10-19', env = liveEnv(db), service = 'lets-connect') {
  const res = await availability({ request: new Request(`${SITE}/api/availability?from=${date}&to=${date}&service=${service}`), env });
  const data = await res.json();
  return { status: res.status, data, times: res.ok ? data.days[0].slots.map((s: { time: string }) => s.time) : [] };
}

const row = () => db.raw.prepare('SELECT * FROM bookings').get() as Record<string, any> | undefined;
const rows = () => db.raw.prepare('SELECT * FROM bookings').all() as Record<string, any>[];

describe('live availability', () => {
  test('returns only bookable slots, minus Google busy times with the 15-minute buffer on both sides', async () => {
    google.busy = [
      { start: '2026-10-19T13:05:00Z', end: '2026-10-19T13:20:00Z' }, // 18:35–18:50 IST → blocks 19:00 (needs 15 min gap)
      { start: '2026-10-19T14:50:00Z', end: '2026-10-19T15:00:00Z' }, // 20:20–20:30 IST → blocks 20:00 (19:00+…: 20:00 slot needs free until 20:30) and 20:30
    ];
    const { status, data, times } = await slots();
    assert.equal(status, 200);
    assert.equal(data.mode, 'live');
    assert.deepEqual(times, ['19:30', '21:00', '21:30']);
    assert.ok(data.days[0].slots.every((s: { status: string }) => s.status === 'available'), 'no busy details exposed');
    assert.ok(!JSON.stringify(data).includes('2026-10-19T13'), 'busy periods not exposed');
  });

  test('free/busy is queried for the right IST day on the owner’s primary calendar', async () => {
    const calls: Record<string, any>[] = [];
    const handle = google.handle.bind(google);
    google.handle = async (url, init) => {
      if (url.pathname.endsWith('/freeBusy')) calls.push(JSON.parse(String(init.body)));
      return handle(url, init);
    };
    await slots();
    assert.equal(calls[0].timeZone, 'Asia/Kolkata');
    assert.deepEqual(calls[0].items, [{ id: 'primary' }]);
    assert.equal(calls[0].timeMin, '2026-10-18T18:15:00.000Z'); // 00:00 IST minus the buffer
    assert.equal(calls[0].timeMax, '2026-10-19T18:45:00.000Z'); // next 00:00 IST plus the buffer
  });

  test('minimum notice: slots under 2 hours away are not offered', async () => {
    clock.now = () => new Date('2026-10-19T12:00:00Z'); // 17:30 IST
    assert.deepEqual((await slots()).times, ['19:30', '20:00', '20:30', '21:00', '21:30']);
  });

  test('if Google can’t be reached, or isn’t connected, no slots (mock or otherwise) are shown', async () => {
    google.freeBusyFails = true;
    const down = await slots();
    assert.equal(down.status, 503);
    assert.equal(down.data.code, 'calendar_unavailable');
    db.raw.prepare('DELETE FROM google_auth').run();
    resetGoogleTokenCache();
    google.freeBusyFails = false;
    assert.equal((await slots()).status, 503);
  });

  test('missing Google configuration is reported, not replaced with mock slots', async () => {
    const res = await slots('2026-10-19', liveEnv(db, { GOOGLE_CLIENT_SECRET: undefined }));
    assert.equal(res.status, 503);
    assert.equal(res.data.code, 'not_configured');
  });
});

describe('live booking', () => {
  test('creates a 15-minute IST event with a valid Meet link, then emails both parties', async () => {
    const { status, data } = await book();
    assert.equal(status, 200);
    assert.equal(data.mode, 'live');
    assert.equal(data.booking.meetUrl, MEET_URL);
    assert.equal(data.booking.durationMinutes, 15);
    assert.deepEqual(data.emails, { owner: 'sent', booker: 'sent' });
    assert.ok(!('eventLink' in data.booking) && !JSON.stringify(data).includes('calendar/event'), 'no calendar link to visitors');

    const ev = google.eventBodies[0];
    assert.deepEqual(ev.start, { dateTime: '2026-10-19T19:00:00+05:30', timeZone: 'Asia/Kolkata' });
    assert.deepEqual(ev.end, { dateTime: '2026-10-19T19:15:00+05:30', timeZone: 'Asia/Kolkata' });
    assert.equal(ev.summary, 'Need Advice? Let’s Talk — Asha Rao');
    assert.deepEqual(ev.attendees, [{ email: 'asha@example.com', displayName: 'Asha Rao' }]);
    assert.equal(ev.conferenceData.createRequest.conferenceSolutionKey.type, 'hangoutsMeet');
    assert.equal(ev.conferenceData.createRequest.requestId, data.booking.reference);
    assert.match(ev.id, /^[a-v0-9]{5,1024}$/);
    assert.match(ev.description, /Purpose of the call:\nI would like advice/);
    assert.equal(google.insertQuery!.get('conferenceDataVersion'), '1');
    assert.equal(google.insertQuery!.get('sendUpdates'), 'none');

    const [owner, booker] = resend.sent;
    assert.deepEqual(owner.to, [OWNER]);
    assert.equal(owner.reply_to, 'asha@example.com');
    assert.deepEqual(booker.to, ['asha@example.com']);
    assert.equal(booker.reply_to, OWNER);
    for (const m of [owner, booker]) {
      assert.ok(m.html.includes(MEET_URL) && m.text.includes(MEET_URL));
      assert.ok(m.text.includes('Monday, 19 October 2026') && m.text.includes('7:00 – 7:15 PM IST (15 minutes)'));
      assert.ok(m.text.includes(data.booking.reference));
      assert.ok(!/demo booking/i.test(m.text), 'live emails are not labelled demo');
    }
    assert.match(booker.text, /How to join/);
    assert.ok(owner.html.includes('Open in Google Calendar'));
    assert.ok(!booker.html.includes('calendar/event'));

    const r = row()!;
    assert.equal(r.status, 'confirmed');
    assert.equal(r.meet_url, MEET_URL);
    assert.equal(r.event_id, ev.id);
    assert.equal(r.calendar_state, 'created');
    assert.equal(r.owner_email, 'sent');
    assert.equal(r.booker_email, 'sent');
  });

  test('GOOGLE_INVITE_EMAILS=true lets Google email the invite as well', async () => {
    await book({}, liveEnv(db, { GOOGLE_INVITE_EMAILS: 'true' }));
    assert.equal(google.insertQuery!.get('sendUpdates'), 'all');
  });

  test('busy slot: rejected at the server re-check even if it looked free earlier', async () => {
    google.busy = [{ start: '2026-10-19T13:30:00Z', end: '2026-10-19T14:00:00Z' }]; // 19:00–19:30 IST
    const { status, data } = await book();
    assert.equal(status, 409);
    assert.equal(data.code, 'slot_taken');
    assert.equal(google.insertCalls, 0);
    assert.equal(resend.sent.length, 0);
    assert.equal(row()!.status, 'failed', 'slot released');
  });

  test('two simultaneous bookings for the same slot: exactly one event and one confirmation', async () => {
    const results = await Promise.all([book(), book({ details: { ...details, email: 'b@example.com' } }), book({ details: { ...details, email: 'c@example.com' } })]);
    assert.deepEqual(results.map((r) => r.status).sort(), [200, 409, 409]);
    assert.equal(google.insertCalls, 1);
    assert.equal(google.events.size, 1);
    assert.equal(rows().filter((r) => r.status === 'confirmed').length, 1);
  });

  test('buffer: the next booking can start 15 minutes after a session ends, not sooner', async () => {
    assert.equal((await book({ time: '19:00' })).status, 200);
    const { times } = await slots();
    assert.ok(!times.includes('19:00'));
    assert.ok(times.includes('19:30'), '19:15 end + 15 min buffer = 19:30');
  });

  test('duplicate submission: same key concurrently → one booking; replay → same result, no new event or email', async () => {
    const key = crypto.randomUUID();
    const [a, b] = await Promise.all([book({ idempotencyKey: key }), book({ idempotencyKey: key })]);
    const ok = [a, b].find((r) => r.status === 200)!;
    const other = [a, b].find((r) => r !== ok)!;
    assert.equal(other.status, 409);
    assert.equal(other.data.code, 'in_progress');
    const again = await book({ idempotencyKey: key });
    assert.equal(again.status, 200);
    assert.equal(again.data.replayed, true);
    assert.equal(again.data.booking.reference, ok.data.booking.reference);
    assert.equal(again.data.booking.meetUrl, MEET_URL);
    assert.equal(google.insertCalls, 1);
    assert.equal(resend.sent.length, 2);
  });

  test('a key reused for a different slot is refused', async () => {
    const key = crypto.randomUUID();
    await book({ idempotencyKey: key });
    const res = await book({ idempotencyKey: key, time: '20:00' });
    assert.equal(res.status, 409);
    assert.equal(res.data.code, 'idempotency_conflict');
  });

  test('event creation failure: no confirmation, no email, slot released; retry with the same key succeeds once', async () => {
    const key = crypto.randomUUID();
    google.insertFailures = [500];
    const first = await book({ idempotencyKey: key });
    assert.equal(first.status, 503);
    assert.equal(first.data.code, 'calendar_unavailable');
    assert.ok(!first.data.ok && !first.data.booking);
    assert.equal(resend.sent.length, 0);
    assert.equal(row()!.status, 'failed');

    google.insertFailures = [400];
    const second = await book({ idempotencyKey: key });
    assert.equal(second.data.code, 'calendar_error');

    const third = await book({ idempotencyKey: key });
    assert.equal(third.status, 200);
    assert.equal(third.data.booking.meetUrl, MEET_URL);
    assert.equal(google.events.size, 1);
  });

  test('lost reply after Google created the event: retry adopts it instead of creating another', async () => {
    const key = crypto.randomUUID();
    google.insertFailures = [503];
    await book({ idempotencyKey: key });
    const id = row()!.event_id;
    // Simulate: Google actually created it before the error reached us.
    google.events.set(id, { id, htmlLink: 'https://www.google.com/calendar/event?eid=x', conferenceData: {}, _gets: 0 });
    google.meetMode = 'pending-then-ready';
    google.pollsBeforeReady = 1;
    const retry = await book({ idempotencyKey: key });
    assert.equal(retry.status, 200);
    assert.equal(google.insertCalls, 1, 'no second insert');
    assert.equal(retry.data.booking.meetUrl, MEET_URL);
  });

  test('Meet link slow: polls until Google returns it', async () => {
    google.meetMode = 'pending-then-ready';
    google.pollsBeforeReady = 3;
    const { status, data } = await book();
    assert.equal(status, 200);
    assert.equal(data.booking.meetUrl, MEET_URL);
  });

  test('Meet link never ready: no confirmation, no emails, no invented link; slot stays held; retry completes', async () => {
    const key = crypto.randomUUID();
    google.meetMode = 'pending-forever';
    const first = await book({ idempotencyKey: key });
    assert.equal(first.status, 502);
    assert.equal(first.data.code, 'meeting_link_pending');
    assert.ok(!JSON.stringify(first.data).includes('meet.google.com'));
    assert.equal(resend.sent.length, 0);
    const r = row()!;
    assert.equal(r.status, 'pending');
    assert.equal(r.meet_url, null);
    assert.equal(r.calendar_state, 'created');
    assert.ok(!(await slots()).times.includes('19:00'), 'slot still held for this visitor');

    // Still "in progress" immediately afterwards; finishes once retried later.
    clock.now = () => new Date(NOW.getTime() + 2 * 60_000);
    google.meetMode = 'pending-then-ready';
    google.pollsBeforeReady = 1;
    const retry = await book({ idempotencyKey: key });
    assert.equal(retry.status, 200);
    assert.equal(retry.data.booking.meetUrl, MEET_URL);
    assert.equal(google.insertCalls, 1);
    assert.equal(resend.sent.length, 2);
  });

  test('Meet creation reported as failed: a new conference is requested on the same event (no second event)', async () => {
    google.meetMode = 'failure';
    const res = await book();
    assert.equal(res.status, 200);
    assert.equal(res.data.booking.meetUrl, MEET_URL);
    assert.equal(google.insertCalls, 1);
    assert.equal(google.patchCalls, 1);
  });

  test('calendar disconnected (refresh token revoked): booking refused, nothing confirmed', async () => {
    google.revoked = true;
    const { status, data } = await book();
    assert.equal(status, 503);
    assert.equal(data.code, 'calendar_unavailable');
    assert.equal(google.insertCalls, 0);
    assert.equal(rows().filter((r) => r.status === 'confirmed').length, 0);
  });

  test('booker email rejected: booking stays confirmed; a later retry sends only the failed email', async () => {
    const key = crypto.randomUUID();
    resend.reject = (to) => (to === 'asha@example.com' ? 403 : null);
    const first = await book({ idempotencyKey: key });
    assert.equal(first.status, 200);
    assert.deepEqual(first.data.emails, { owner: 'sent', booker: 'failed' });
    assert.equal(first.data.bookerEmailIssue, 'provider_sender');
    assert.equal(first.data.booking.meetUrl, MEET_URL, 'the visitor still gets the link on screen');

    resend.reject = () => null;
    const tooSoon = await book({ idempotencyKey: key });
    assert.equal(tooSoon.data.emails.booker, 'failed');
    assert.ok(tooSoon.data.emailRetryAfterSeconds > 0);

    clock.now = () => new Date(NOW.getTime() + EMAIL_RETRY_GAP_MS + 1000);
    const retry = await book({ idempotencyKey: key });
    assert.deepEqual(retry.data.emails, { owner: 'sent', booker: 'sent' });
    assert.equal(resend.sent.length, 2, 'owner email not sent twice');
    assert.deepEqual(resend.sent.map((m) => m.to[0]), [OWNER, 'asha@example.com']);
  });

  test('Resend down for both: booking confirmed with the Meet link, emails reported as not sent', async () => {
    resend.reject = () => 'network';
    const { status, data } = await book();
    assert.equal(status, 200);
    assert.deepEqual(data.emails, { owner: 'failed', booker: 'failed' });
    assert.equal(data.booking.meetUrl, MEET_URL);
  });

  test('30-minute paid service stays a browser demo (not bookable through the server)', async () => {
    const { data } = await book({ serviceId: 'strategy-interview' });
    assert.equal(data.code, 'service_not_bookable');
  });
});
