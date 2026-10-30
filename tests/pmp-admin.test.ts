/*
 * Administrator access and role separation for the PMP platform. Real SQL (node:sqlite),
 * no network. The bootstrap password used here is a test value, not a real credential.
 */
import { beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/pmp/[[path]].ts';
import { clock } from '../server/clock.ts';
import { MODULES } from '../server/pmp/course.ts';
import { memoryD1 } from './helpers.ts';

const SITE = 'https://rahulmehra.co.in';
const ADMIN = 'rahul.a.mehra@gmail.com';
const BOOT = 'test-bootstrap-123';
const NEW_ADMIN_PW = 'a much better admin pass 2026';
let db: ReturnType<typeof memoryD1>;
let n = 0;
let nowMs = Date.parse('2026-10-21T09:00:00Z');

type Res = { status: number; body: any; headers: Headers };
const env = (extra: Record<string, unknown> = {}) => ({ PMP_DB: db, PMP_ADMIN_BOOTSTRAP_PASSWORD: BOOT, PMP_COURSE_LAUNCHED: 'true', ...extra });

async function call(path: string, o: { method?: string; body?: unknown; cookie?: string; env?: Record<string, unknown>; origin?: string } = {}): Promise<Res> {
  const method = o.method ?? (o.body !== undefined ? 'POST' : 'GET');
  const headers: Record<string, string> = { 'CF-Connecting-IP': `10.9.${Math.floor(++n / 200)}.${n % 200}` };
  if (o.body !== undefined) headers['Content-Type'] = 'application/json';
  if (o.cookie) headers.Cookie = o.cookie;
  if (method !== 'GET') headers.Origin = o.origin ?? SITE;
  const res = await onRequest({ request: new Request(`${SITE}/api/pmp/${path}`, { method, headers, body: o.body !== undefined ? JSON.stringify(o.body) : undefined }), env: (o.env ?? env()) as never });
  const type = res.headers.get('Content-Type') || '';
  return { status: res.status, body: type.includes('json') ? await res.json() : new Uint8Array(await res.arrayBuffer()), headers: res.headers };
}
const cookieOf = (r: Res) => (r.headers.get('Set-Cookie') || '').split(';')[0];

async function bootstrapAdmin(): Promise<string> {
  const r = await call('auth/login', { body: { email: ADMIN, password: BOOT } });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.equal(r.body.user.role, 'admin');
  assert.equal(r.body.user.mustChangePassword, true);
  const c = await call('auth/change-password', { body: { currentPassword: BOOT, newPassword: NEW_ADMIN_PW }, cookie: cookieOf(r) });
  assert.equal(c.status, 200, JSON.stringify(c.body));
  return cookieOf(c);
}

async function learner(email = 'learner@example.com') {
  const r = await call('auth/signup', { body: { name: 'Asha Rao', email, password: 'correct horse 42' } });
  assert.equal(r.status, 201);
  return cookieOf(r);
}

beforeEach(() => {
  db = memoryD1();
  nowMs = Date.parse('2026-10-21T09:00:00Z');
  clock.now = () => new Date(nowMs);
});

describe('administrator bootstrap and password', () => {
  test('bootstrap only works for the admin email, with the server secret, and requires a password change', async () => {
    // Wrong password: generic failure, nothing created.
    assert.equal((await call('auth/login', { body: { email: ADMIN, password: 'not-the-secret-1' } })).status, 401);
    // Without the env secret there is no bootstrap at all.
    assert.equal((await call('auth/login', { body: { email: ADMIN, password: BOOT }, env: { PMP_DB: db } })).status, 401);
    // Another email cannot bootstrap with the secret.
    assert.equal((await call('auth/login', { body: { email: 'someone@example.com', password: BOOT } })).status, 401);

    const r = await call('auth/login', { body: { email: ADMIN, password: BOOT } });
    assert.equal(r.status, 200);
    const cookie = cookieOf(r);
    assert.match(r.headers.get('Set-Cookie') || '', /HttpOnly/);
    // Until the password is changed, admin and content APIs are refused; /me works.
    assert.equal((await call('me', { cookie })).body.user.mustChangePassword, true);
    assert.equal((await call('admin/overview', { cookie })).body.code, 'password_change_required');
    assert.equal((await call(`lessons/${MODULES[5].lessons[0].id}`, { cookie })).body.code, 'password_change_required');
    // The temporary password and short passwords are rejected as the new password.
    assert.equal((await call('auth/change-password', { body: { currentPassword: BOOT, newPassword: BOOT }, cookie })).status, 400);
    assert.equal((await call('auth/change-password', { body: { currentPassword: BOOT, newPassword: 'short pass 1' }, cookie })).status, 400);
    assert.equal((await call('auth/change-password', { body: { currentPassword: 'wrong-current-1', newPassword: NEW_ADMIN_PW }, cookie })).status, 400);
    const ok = await call('auth/change-password', { body: { currentPassword: BOOT, newPassword: NEW_ADMIN_PW }, cookie });
    assert.equal(ok.status, 200);
    // Old session is signed out everywhere; the new cookie works.
    assert.equal((await call('me', { cookie })).status, 401);
    assert.equal((await call('admin/overview', { cookie: cookieOf(ok) })).status, 200);
    // The bootstrap secret no longer works once the admin exists.
    assert.equal((await call('auth/login', { body: { email: ADMIN, password: BOOT } })).status, 401);
    assert.equal((await call('auth/login', { body: { email: ADMIN, password: NEW_ADMIN_PW } })).status, 200);
    // Nothing secret was stored in plain text.
    const row = db.raw.prepare('SELECT pw_hash, role FROM pmp_users WHERE email = ?').get(ADMIN) as { pw_hash: string; role: string };
    assert.equal(row.role, 'admin');
    assert.ok(!row.pw_hash.includes(NEW_ADMIN_PW));
    const log = db.raw.prepare('SELECT action, detail FROM pmp_audit').all() as { action: string; detail: string | null }[];
    assert.ok(log.some((l) => l.action === 'admin_bootstrap') && log.some((l) => l.action === 'password_changed'));
    assert.ok(!JSON.stringify(log).includes(BOOT) && !JSON.stringify(log).includes(NEW_ADMIN_PW), 'no passwords in the audit log');
  });

  test('the admin email cannot be registered as a learner', async () => {
    const r = await call('auth/signup', { body: { name: 'Impostor', email: 'Rahul.A.Mehra@gmail.com', password: 'longenough123' } });
    assert.equal(r.status, 403);
    assert.equal(r.body.code, 'reserved_email');
  });

  test('admin sessions expire after 12 hours', async () => {
    const cookie = await bootstrapAdmin();
    nowMs += 13 * 60 * 60 * 1000;
    assert.equal((await call('admin/overview', { cookie })).status, 401);
  });
});

describe('role separation', () => {
  test('learners and signed-out users cannot reach admin endpoints', async () => {
    assert.equal((await call('admin/overview')).status, 401);
    const l = await learner();
    for (const p of ['admin/overview', 'admin/modules', 'admin/assessments/M04', 'admin/learners', 'admin/topics', 'admin/audit', 'admin/certificate-sample.pdf']) {
      const r = await call(p, { cookie: l });
      assert.equal(r.status, 403, p);
      assert.ok(!JSON.stringify(r.body).includes('"answer"'), p);
    }
    assert.equal((await call(`admin/lessons/${MODULES[1].lessons[0].id}/draft`, { method: 'PUT', body: { patch: { title: 'Hacked title' } }, cookie: l })).status, 403);
    assert.equal((await call('admin/preview/M04/start', { body: {}, cookie: l })).status, 403);
  });

  test('a forged cookie or client-supplied role grants nothing', async () => {
    assert.equal((await call('admin/overview', { cookie: 'pmp_session=forged-token-value' })).status, 401);
    const l = await learner();
    const r = await call('auth/signup', { body: { name: 'Eve', email: 'eve@example.com', password: 'longenough123', role: 'admin' } });
    assert.equal(r.body.user.role, 'learner');
    assert.equal((await call('admin/overview', { cookie: cookieOf(r) })).status, 403);
    assert.equal((await call('me', { cookie: l })).body.user.role, 'learner');
  });

  test('learners still cannot skip ahead by URL or API', async () => {
    const l = await learner();
    assert.equal((await call(`lessons/${MODULES[3].lessons[0].id}`, { cookie: l })).status, 403);
    assert.equal((await call(`lessons/${MODULES[3].lessons[0].id}/complete`, { body: {}, cookie: l })).status, 403);
    assert.equal((await call('assessments/M03/start', { body: {}, cookie: l })).status, 403);
    assert.equal((await call('assessments/final/start', { body: {}, cookie: l })).status, 403);
    assert.equal((await call('certificate', { body: {}, cookie: l })).status, 403);
  });

  test('the admin can open every lesson and see every assessment, without creating any records', async () => {
    const a = await bootstrapAdmin();
    const me = await call('me', { cookie: a });
    assert.equal(me.body.user.role, 'admin');
    assert.ok(me.body.state.modules.every((m: { status: string }) => m.status !== 'locked'));
    assert.ok(me.body.state.exams.every((e: { status: string }) => e.status !== 'locked'));
    assert.equal(me.body.state.progress.lessonsDone, 0, 'viewing does not mark anything complete');

    for (const m of MODULES) {
      const r = await call(`lessons/${m.lessons[m.lessons.length - 1].id}`, { cookie: a });
      assert.equal(r.status, 200, m.id);
      assert.equal(r.body.preview, true);
    }
    const final = await call('admin/assessments/final', { cookie: a });
    assert.equal(final.status, 200);
    assert.ok(final.body.questions.length > 50);
    assert.ok(final.body.questions.every((q: { answer: number; explanation: string }) => q.answer >= 0 && q.explanation));

    // Learner write paths refuse the admin account, so previews cannot create progress or results.
    assert.equal((await call(`lessons/${MODULES[0].lessons[0].id}/complete`, { body: {}, cookie: a })).body.code, 'admin_preview');
    assert.equal((await call('assessments/M00/start', { body: {}, cookie: a })).body.code, 'admin_preview');
    assert.equal((await call('certificate', { body: {}, cookie: a })).body.code, 'admin_preview');

    // Preview an exam the admin has "not reached": scored, nothing stored.
    const start = await call('admin/preview/final/start', { body: {}, cookie: a });
    assert.equal(start.status, 200);
    assert.ok(!JSON.stringify(start.body.attempt).includes('"answer"'));
    const answers: Record<string, number> = {};
    for (const item of start.body.layout) answers[item.q] = 0;
    const scored = await call('admin/preview/final/score', { body: { layout: start.body.layout, answers }, cookie: a });
    assert.equal(scored.status, 200);
    assert.equal(scored.body.result.total, start.body.layout.length);
    const counts = db.raw.prepare('SELECT (SELECT COUNT(*) FROM pmp_attempts) a, (SELECT COUNT(*) FROM pmp_lesson_progress) p, (SELECT COUNT(*) FROM pmp_certificates) c').get() as Record<string, number>;
    assert.deepEqual({ ...counts }, { a: 0, p: 0, c: 0 });
    // A tampered preview layout is rejected.
    assert.equal((await call('admin/preview/final/score', { body: { layout: start.body.layout.slice(1), answers }, cookie: a })).status, 400);
  });

  test('admin overview, modules, topics, learners and certificate sample use real data', async () => {
    const l = await learner('progress@example.com');
    await call(`lessons/${MODULES[0].lessons[0].id}/complete`, { body: {}, cookie: l });
    const a = await bootstrapAdmin();
    const o = await call('admin/overview', { cookie: a });
    assert.equal(o.body.curriculum.modules, MODULES.length);
    assert.equal(o.body.source.manifestRecords, 976);
    assert.equal(o.body.learners.total, 1);
    const mods = await call('admin/modules', { cookie: a });
    assert.equal(mods.body.modules.length, MODULES.length);
    assert.ok(mods.body.modules[4].sources.some((s: { pdf: string }) => s.pdf));
    const topics = await call('admin/topics', { cookie: a });
    assert.equal(topics.body.topics.length, 160);
    const learners = await call('admin/learners', { cookie: a });
    assert.equal(learners.body.learners.length, 1, 'the admin is not listed as a learner');
    assert.equal(learners.body.learners[0].lessonsDone, 1);
    assert.ok(!JSON.stringify(learners.body).includes('pw_'));
    const detail = await call(`admin/learners/${learners.body.learners[0].id}`, { cookie: a });
    assert.equal(detail.body.progress.lessonsDone, 1);
    const pdf = await call('admin/certificate-sample.pdf', { cookie: a });
    assert.equal(pdf.headers.get('Content-Type'), 'application/pdf');
  });
});

describe('schema migration', () => {
  test('an existing v1 database gains the role columns without losing learners or sessions', async () => {
    // Learner created under the current schema, then the v2 columns are removed to mimic a v1 table.
    const cookie = await learner('old@example.com');
    db.raw.exec(`CREATE TABLE pmp_users_v1 AS SELECT id, email, name, pw_hash, pw_salt, pw_iter, failed_logins, locked_until_ms, created_ms FROM pmp_users;
      DROP TABLE pmp_users; ALTER TABLE pmp_users_v1 RENAME TO pmp_users;`);
    // A fresh isolate runs ensurePmpSchema again on a new binding object over the same database.
    const raw = db.raw;
    const again = memoryD1();
    (again as { prepare: unknown }).prepare = (sql: string) => {
      const run = (params: unknown[] = []): any => ({
        bind: (...v: unknown[]) => run(v),
        run: async () => ({ meta: { changes: Number(raw.prepare(sql).run(...(params as never[])).changes) } }),
        first: async () => raw.prepare(sql).get(...(params as never[])) ?? null,
        all: async () => ({ results: raw.prepare(sql).all(...(params as never[])) }),
      });
      return run();
    };
    const me = await call('me', { cookie, env: { PMP_DB: again, PMP_COURSE_LAUNCHED: 'true' } });
    assert.equal(me.status, 200);
    assert.equal(me.body.user.role, 'learner');
    const cols = (raw.prepare('PRAGMA table_info(pmp_users)').all() as { name: string }[]).map((c) => c.name);
    assert.ok(['role', 'must_change_password', 'password_changed_ms'].every((c) => cols.includes(c)));
  });
});

describe('content editing', () => {
  test('drafts are invisible to learners until published, and revert needs confirmation', async () => {
    const a = await bootstrapAdmin();
    const l = await learner();
    const lessonId = MODULES[0].lessons[0].id;

    const bad = await call(`admin/lessons/${lessonId}/draft`, { method: 'PUT', body: { patch: { topics: ['made-up-topic'] } }, cookie: a });
    assert.equal(bad.status, 400);
    const saved = await call(`admin/lessons/${lessonId}/draft`, { method: 'PUT', body: { patch: { title: 'How this course works (revised)' } }, cookie: a });
    assert.equal(saved.status, 200);
    assert.equal((await call(`lessons/${lessonId}`, { cookie: l })).body.lesson.title, MODULES[0].lessons[0].title, 'draft not shown to learners');
    const view = await call(`admin/lessons/${lessonId}`, { cookie: a });
    assert.equal(view.body.draftView.title, 'How this course works (revised)');

    assert.equal((await call(`admin/lessons/${lessonId}/publish`, { body: {}, cookie: a })).status, 200);
    assert.equal((await call(`lessons/${lessonId}`, { cookie: l })).body.lesson.title, 'How this course works (revised)');

    assert.equal((await call(`admin/lessons/${lessonId}/revert`, { body: {}, cookie: a })).body.code, 'confirm_required');
    assert.equal((await call(`admin/lessons/${lessonId}/revert`, { body: { confirm: true }, cookie: a })).status, 200);
    assert.equal((await call(`lessons/${lessonId}`, { cookie: l })).body.lesson.title, MODULES[0].lessons[0].title);
    const actions = (db.raw.prepare('SELECT action FROM pmp_audit').all() as { action: string }[]).map((r) => r.action);
    assert.ok(['lesson_draft_saved', 'lesson_published', 'lesson_reverted'].every((x) => actions.includes(x)));
  });

  test('published question edits change server-side scoring; invalid edits are refused', async () => {
    const a = await bootstrapAdmin();
    const q = MODULES[0].quiz[0];
    assert.equal((await call(`admin/questions/${q.id}/draft`, { method: 'PUT', body: { patch: { options: ['a', 'a', 'b', 'c'] } }, cookie: a })).status, 400);
    assert.equal((await call(`admin/questions/${q.id}/draft`, { method: 'PUT', body: { patch: { answer: 7 } }, cookie: a })).status, 400);
    const newAnswer = ((q.answer + 1) % 4) as 0 | 1 | 2 | 3;
    assert.equal((await call(`admin/questions/${q.id}/draft`, { method: 'PUT', body: { patch: { answer: newAnswer } }, cookie: a })).status, 200);
    assert.equal((await call(`admin/questions/${q.id}/publish`, { body: {}, cookie: a })).status, 200);
    const check = await call('admin/assessments/M00', { cookie: a });
    assert.equal(check.body.questions[0].answer, newAnswer);
    assert.equal(check.body.questions[0].edit.published, true);

    const l = await learner();
    for (const les of MODULES[0].lessons) await call(`lessons/${les.id}/complete`, { body: {}, cookie: l });
    const start = await call('assessments/M00/start', { body: {}, cookie: l });
    const layout = JSON.parse((db.raw.prepare('SELECT layout FROM pmp_attempts').get() as { layout: string }).layout) as { q: string; o: number[] }[];
    const item = layout.find((x) => x.q === q.id)!;
    const sub = await call('assessments/M00/submit', { body: { attemptId: start.body.attempt.id, answers: { [q.id]: item.o.indexOf(newAnswer) } }, cookie: l });
    assert.equal(sub.body.result.results.find((r: { id: string }) => r.id === q.id).isCorrect, true);
  });
});
