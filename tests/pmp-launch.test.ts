/*
 * Launch control for the PMP platform (PMP_COURSE_LAUNCHED). Before launch the course is
 * private: visitors and learners are refused on the server, the administrator keeps full
 * access, and nothing stored is touched. Real SQL (node:sqlite), no network. The passwords
 * used here are test values, not real credentials.
 */
import { beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/pmp/[[path]].ts';
import { clock } from '../server/clock.ts';
import { EXAMS, MODULES } from '../server/pmp/course.ts';
import { memoryD1 } from './helpers.ts';

const SITE = 'https://rahulmehra.co.in';
const ADMIN = 'rahul.a.mehra@gmail.com';
const BOOT = 'test-bootstrap-123';
const ADMIN_PW = 'a much better admin pass 2026';
const LEARNER = { name: 'Asha Rao', email: 'learner@example.com', password: 'correct horse 42' };
let db: ReturnType<typeof memoryD1>;
let n = 0;

type Res = { status: number; body: any; headers: Headers };
const privateEnv = () => ({ PMP_DB: db, PMP_ADMIN_BOOTSTRAP_PASSWORD: BOOT });
const launchedEnv = () => ({ ...privateEnv(), PMP_COURSE_LAUNCHED: 'true' });

async function call(path: string, o: { method?: string; body?: unknown; cookie?: string; env?: Record<string, unknown> } = {}): Promise<Res> {
  const method = o.method ?? (o.body !== undefined ? 'POST' : 'GET');
  const headers: Record<string, string> = { 'CF-Connecting-IP': `10.7.${Math.floor(++n / 200)}.${n % 200}` };
  if (o.body !== undefined) headers['Content-Type'] = 'application/json';
  if (o.cookie) headers.Cookie = o.cookie;
  if (method !== 'GET') headers.Origin = SITE;
  const res = await onRequest({ request: new Request(`${SITE}/api/pmp/${path}`, { method, headers, body: o.body !== undefined ? JSON.stringify(o.body) : undefined }), env: (o.env ?? privateEnv()) as never });
  const type = res.headers.get('Content-Type') || '';
  return { status: res.status, body: type.includes('json') ? await res.json() : new Uint8Array(await res.arrayBuffer()), headers: res.headers };
}
const cookieOf = (r: Res) => (r.headers.get('Set-Cookie') || '').split(';')[0];
const isComingSoon = (r: Res) => r.status === 403 && r.body.code === 'coming_soon';

async function adminCookie(): Promise<string> {
  const r = await call('auth/login', { body: { email: ADMIN, password: BOOT } });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  const c = await call('auth/change-password', { body: { currentPassword: BOOT, newPassword: ADMIN_PW }, cookie: cookieOf(r) });
  assert.equal(c.status, 200, JSON.stringify(c.body));
  return cookieOf(c);
}

/** A learner who signed up and finished the first lesson while the course was open. */
async function existingLearner(): Promise<string> {
  const r = await call('auth/signup', { body: LEARNER, env: launchedEnv() });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  const cookie = cookieOf(r);
  assert.equal((await call(`lessons/${MODULES[0].lessons[0].id}/complete`, { body: {}, cookie, env: launchedEnv() })).status, 200);
  return cookie;
}

const counts = () =>
  ['pmp_users', 'pmp_lesson_progress', 'pmp_attempts', 'pmp_certificates', 'pmp_content_overrides'].map(
    (t) => (db.raw.prepare(`SELECT COUNT(*) AS c FROM ${t}`).get() as { c: number }).c,
  );

beforeEach(() => {
  db = memoryD1();
  clock.now = () => new Date(Date.parse('2026-10-21T09:00:00Z'));
});

describe('launch flag', () => {
  test('the course is private unless PMP_COURSE_LAUNCHED is exactly "true"', async () => {
    assert.deepEqual((await call('status')).body, { ok: true, launched: false });
    for (const v of ['false', 'TRUE', '1', 'yes', '']) assert.equal((await call('status', { env: { ...privateEnv(), PMP_COURSE_LAUNCHED: v } })).body.launched, false, v);
    const r = await call('status', { env: launchedEnv() });
    assert.equal(r.body.launched, true);
    assert.equal(r.headers.get('Cache-Control'), 'no-store');
    // The status needs no database and no sign-in.
    assert.equal((await call('status', { env: {} })).body.launched, false);
  });
});

describe('before launch: visitors and learners', () => {
  test('sign-up is refused and creates nothing', async () => {
    const r = await call('auth/signup', { body: LEARNER });
    assert.ok(isComingSoon(r), JSON.stringify(r.body));
    assert.equal(r.headers.get('Set-Cookie'), null);
    assert.equal(counts()[0], 0);
  });

  test('learner sign-in is refused, with or without the right password', async () => {
    await existingLearner();
    assert.ok(isComingSoon(await call('auth/login', { body: { email: LEARNER.email, password: LEARNER.password } })));
    assert.ok(isComingSoon(await call('auth/login', { body: { email: LEARNER.email, password: 'wrong password 1' } })));
    assert.ok(isComingSoon(await call('auth/login', { body: { email: 'nobody@example.com', password: 'anything 12345' } })));
    // A refused sign-in is not a failed attempt: the learner is not locked out at launch.
    const row = db.raw.prepare('SELECT failed_logins FROM pmp_users WHERE email = ?').get(LEARNER.email) as { failed_logins: number };
    assert.equal(row.failed_logins, 0);
  });

  test('an existing learner session reaches no course endpoint', async () => {
    const cookie = await existingLearner();
    const quiz = MODULES[0].id;
    const blocked: Res[] = [
      await call('me', { cookie }),
      await call(`lessons/${MODULES[0].lessons[0].id}`, { cookie }),
      await call(`lessons/${MODULES[0].lessons[1].id}/complete`, { body: {}, cookie }),
      await call(`assessments/${quiz}/start`, { body: {}, cookie }),
      await call(`assessments/${quiz}/submit`, { body: { attemptId: 'x', answers: {} }, cookie }),
      await call('attempts/anything', { cookie }),
      await call('certificate', { body: {}, cookie }),
      await call('certificate.pdf', { cookie }),
      await call('admin/overview', { cookie }),
      await call('auth/change-password', { body: { currentPassword: LEARNER.password, newPassword: 'another horse 43' }, cookie }),
    ];
    for (const r of blocked) assert.ok(isComingSoon(r), JSON.stringify(r.body));
  });

  test('signed-out requests stay signed out and certificate verification is closed', async () => {
    assert.equal((await call('me')).status, 401);
    assert.equal((await call(`lessons/${MODULES[0].lessons[0].id}`)).status, 401);
    assert.equal((await call('admin/overview')).status, 401);
    assert.ok(isComingSoon(await call('verify/PMP-ABCD-EFGH-JKLM')));
  });
});

describe('before launch: the administrator', () => {
  test('signs in and opens every module, lesson, check, mock, the final and all admin areas', async () => {
    const cookie = await adminCookie();
    const me = await call('me', { cookie });
    assert.equal(me.status, 200);
    assert.equal(me.body.user.role, 'admin');
    assert.equal(me.body.state.modules.length, 18);

    let lessons = 0;
    for (const m of MODULES) {
      for (const l of m.lessons) {
        const r = await call(`lessons/${l.id}`, { cookie });
        assert.equal(r.status, 200, `${l.id}: ${JSON.stringify(r.body)}`);
        lessons++;
      }
    }
    assert.equal(lessons, 69);

    for (const id of [...MODULES.map((m) => m.id), ...EXAMS.map((e) => e.id)]) {
      const r = await call(`admin/preview/${id}/start`, { body: {}, cookie });
      assert.equal(r.status, 200, `${id}: ${JSON.stringify(r.body)}`);
      assert.ok(r.body.attempt.questions.length > 0, id);
    }
    assert.deepEqual(EXAMS.map((e) => e.id).sort(), ['final', 'mock-1', 'mock-2']);

    for (const section of ['overview', 'modules', 'assessments', 'topics', 'learners', 'audit']) {
      assert.equal((await call(`admin/${section}`, { cookie })).status, 200, section);
    }
    assert.equal((await call('admin/certificate-sample.pdf', { cookie })).status, 200);
    // Learner-only write paths still refuse admins, exactly as after launch.
    assert.equal((await call('certificate', { body: {}, cookie })).body.code, 'admin_preview');
    assert.equal((await call('auth/logout', { body: {}, cookie })).status, 200);
  });
});

describe('launch', () => {
  test('stored data is untouched while private, and switching the flag on restores the learner experience', async () => {
    await existingLearner();
    await adminCookie();
    const before = counts();
    const userRow = JSON.stringify(db.raw.prepare('SELECT * FROM pmp_users ORDER BY email').all());

    // A round of refused requests while private changes nothing.
    await call('auth/signup', { body: { ...LEARNER, email: 'new@example.com' } });
    await call('auth/login', { body: { email: LEARNER.email, password: LEARNER.password } });
    assert.deepEqual(counts(), before);
    assert.equal(JSON.stringify(db.raw.prepare('SELECT * FROM pmp_users ORDER BY email').all()), userRow);

    // Launch: the same learner signs in and finds their progress; new sign-ups work.
    const login = await call('auth/login', { body: { email: LEARNER.email, password: LEARNER.password }, env: launchedEnv() });
    assert.equal(login.status, 200, JSON.stringify(login.body));
    const me = await call('me', { cookie: cookieOf(login), env: launchedEnv() });
    assert.equal(me.status, 200);
    assert.equal(me.body.state.progress.lessonsDone, 1);
    assert.equal(me.body.state.modules[0].lessons[1].status, 'available');
    assert.equal((await call('auth/signup', { body: { ...LEARNER, email: 'new@example.com' }, env: launchedEnv() })).status, 201);
    assert.equal((await call('verify/PMP-ABCD-EFGH-JKLM', { env: launchedEnv() })).status, 404);
  });
});
