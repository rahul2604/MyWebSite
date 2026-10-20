/*
 * PMP learning platform tests. D1 is a real in-memory SQLite database (node:sqlite), so the
 * SQL runs for real. No network is used.
 */
import { beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/pmp/[[path]].ts';
import { clock } from '../server/clock.ts';
import { EXAMS, MODULES } from '../server/pmp/course.ts';
import { courseState, newLayout, score } from '../server/pmp/engine.ts';
import { certificatePdf, pdfSafe } from '../server/pmp/certificatePdf.ts';
import { memoryD1 } from './helpers.ts';

const SITE = 'https://rahulmehra.co.in';
let db: ReturnType<typeof memoryD1>;
let nowMs = Date.parse('2026-10-20T09:00:00Z');
let ipCounter = 0;

function setNow(ms: number) {
  nowMs = ms;
  clock.now = () => new Date(nowMs);
}

type Res = { status: number; body: any; headers: Headers };

async function call(path: string, opts: { method?: string; body?: unknown; cookie?: string; origin?: string | null; env?: Record<string, unknown> } = {}): Promise<Res> {
  const method = opts.method ?? (opts.body !== undefined ? 'POST' : 'GET');
  const headers: Record<string, string> = { 'CF-Connecting-IP': `10.1.${Math.floor(++ipCounter / 250)}.${ipCounter % 250}` };
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.cookie) headers.Cookie = opts.cookie;
  if (opts.origin !== null && method !== 'GET') headers.Origin = opts.origin ?? SITE;
  const res = await onRequest({
    request: new Request(`${SITE}/api/pmp/${path}`, { method, headers, body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined }),
    env: (opts.env ?? { PMP_DB: db }) as never,
  });
  const type = res.headers.get('Content-Type') || '';
  const body = type.includes('json') ? await res.json() : new Uint8Array(await res.arrayBuffer());
  return { status: res.status, body, headers: res.headers };
}

const cookieFrom = (r: Res) => (r.headers.get('Set-Cookie') || '').split(';')[0];

async function signup(email = 'learner@example.com', name = 'Asha Rao', password = 'correct horse 42') {
  const r = await call('auth/signup', { body: { name, email, password } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  return cookieFrom(r);
}

/** Answers every question correctly (or wrongly for the first `wrong` questions) using the stored layout. */
async function takeAssessment(cookie: string, id: string, wrong = 0) {
  const start = await call(`assessments/${id}/start`, { body: {}, cookie });
  assert.equal(start.status, 200, JSON.stringify(start.body));
  const attemptId: string = start.body.attempt.id;
  const row = db.raw.prepare('SELECT layout FROM pmp_attempts WHERE id = ?').get(attemptId) as { layout: string };
  const layout: { q: string; o: number[] }[] = JSON.parse(row.layout);
  const all = [...MODULES.flatMap((m) => m.quiz), ...EXAMS.flatMap((e) => e.questions)];
  const answers: Record<string, number> = {};
  layout.forEach((item, i) => {
    const qn = all.find((x) => x.id === item.q)!;
    const correctDisplay = item.o.indexOf(qn.answer);
    answers[item.q] = i < wrong ? (correctDisplay + 1) % 4 : correctDisplay;
  });
  return call(`assessments/${id}/submit`, { body: { attemptId, answers }, cookie });
}

async function completeModule(cookie: string, moduleIndex: number) {
  for (const l of MODULES[moduleIndex].lessons) {
    const r = await call(`lessons/${l.id}/complete`, { body: {}, cookie });
    assert.equal(r.status, 200, `${l.id}: ${JSON.stringify(r.body)}`);
  }
  const q = await takeAssessment(cookie, MODULES[moduleIndex].id);
  assert.equal(q.body.result.passed, true);
}

beforeEach(() => {
  db = memoryD1();
  setNow(Date.parse('2026-10-20T09:00:00Z'));
});

/* ---------------- content integrity ---------------- */
describe('course content', () => {
  test('every module has lessons and an 8-15 question knowledge check', () => {
    for (const m of MODULES) {
      assert.ok(m.lessons.length > 0, m.id);
      assert.ok(m.quiz.length >= 8 && m.quiz.length <= 15, `${m.id} has ${m.quiz.length}`);
    }
  });
  test('two distinct mock tests of about 100 questions and a final assessment', () => {
    const [m1, m2, fin] = EXAMS;
    assert.ok(m1.questions.length >= 90 && m2.questions.length >= 90);
    const ids1 = new Set(m1.questions.map((q) => q.stem));
    assert.equal(m2.questions.filter((q) => ids1.has(q.stem)).length, 0);
    assert.ok(fin.questions.length >= 50);
  });
});

/* ---------------- authentication ---------------- */
describe('authentication', () => {
  test('sign-up sets an HttpOnly session cookie and never returns secrets', async () => {
    const r = await call('auth/signup', { body: { name: 'Asha Rao', email: 'Asha@Example.com ', password: 'correct horse 42' } });
    assert.equal(r.status, 201);
    const setCookie = r.headers.get('Set-Cookie') || '';
    assert.match(setCookie, /pmp_session=/);
    assert.match(setCookie, /HttpOnly/);
    assert.match(setCookie, /Secure/);
    assert.match(setCookie, /SameSite=Lax/);
    const text = JSON.stringify(r.body);
    assert.ok(!/pw_|hash|salt|token/i.test(text), text);
    assert.equal(r.body.user.email, 'asha@example.com');
    const stored = db.raw.prepare('SELECT pw_hash, pw_salt FROM pmp_users').get() as { pw_hash: string; pw_salt: string };
    assert.notEqual(stored.pw_hash, 'correct horse 42');
    const session = db.raw.prepare('SELECT token_hash FROM pmp_sessions').get() as { token_hash: string };
    assert.notEqual(session.token_hash, cookieFrom(r).split('=')[1], 'only the hash of the token is stored');
  });

  test('rejects weak passwords, bad emails, short names and duplicates', async () => {
    assert.equal((await call('auth/signup', { body: { name: 'A B', email: 'a@b.co', password: 'short1' } })).body.code, 'weak_password');
    assert.equal((await call('auth/signup', { body: { name: 'A B', email: 'nope', password: 'longenough123' } })).body.code, 'invalid_email');
    assert.equal((await call('auth/signup', { body: { name: 'A', email: 'a@b.co', password: 'longenough123' } })).body.code, 'invalid_name');
    await signup('dup@example.com');
    assert.equal((await call('auth/signup', { body: { name: 'Other', email: 'DUP@example.com', password: 'longenough123' } })).status, 409);
  });

  test('login uses a generic error and locks after repeated failures', async () => {
    await signup('lock@example.com');
    const unknown = await call('auth/login', { body: { email: 'nobody@example.com', password: 'whatever123' } });
    const wrong = await call('auth/login', { body: { email: 'lock@example.com', password: 'wrong password 1' } });
    assert.equal(unknown.status, 401);
    assert.equal(wrong.status, 401);
    assert.equal(unknown.body.error, wrong.body.error);
    for (let i = 0; i < 7; i++) await call('auth/login', { body: { email: 'lock@example.com', password: 'wrong password 1' } });
    const locked = await call('auth/login', { body: { email: 'lock@example.com', password: 'correct horse 42' } });
    assert.equal(locked.status, 423);
    setNow(nowMs + 16 * 60 * 1000);
    const ok = await call('auth/login', { body: { email: 'lock@example.com', password: 'correct horse 42' } });
    assert.equal(ok.status, 200);
    assert.match(ok.headers.get('Set-Cookie') || '', /pmp_session=/);
  });

  test('signed-out requests are refused; logout ends the session', async () => {
    assert.equal((await call('me')).status, 401);
    const cookie = await signup();
    assert.equal((await call('me', { cookie })).status, 200);
    const out = await call('auth/logout', { body: {}, cookie });
    assert.match(out.headers.get('Set-Cookie') || '', /Max-Age=0/);
    assert.equal((await call('me', { cookie })).status, 401);
  });

  test('sessions expire', async () => {
    const cookie = await signup();
    setNow(nowMs + 31 * 24 * 60 * 60 * 1000);
    assert.equal((await call('me', { cookie })).status, 401);
  });

  test('cross-site POSTs are rejected', async () => {
    const r = await call('auth/signup', { body: { name: 'Eve', email: 'eve@example.com', password: 'longenough123' }, origin: 'https://evil.example' });
    assert.equal(r.status, 403);
  });

  test('sign-up can be closed by configuration', async () => {
    const r = await call('auth/signup', { body: { name: 'Asha', email: 'x@example.com', password: 'longenough123' }, env: { PMP_DB: db, PMP_SIGNUP_OPEN: 'false' } });
    assert.equal(r.status, 403);
  });
});

/* ---------------- sequential unlocking ---------------- */
describe('sequential unlocking (server-enforced)', () => {
  test('only the first lesson is open for a new learner', async () => {
    const cookie = await signup();
    const me = await call('me', { cookie });
    const [m0, m1] = me.body.state.modules;
    assert.equal(m0.lessons[0].status, 'available');
    assert.equal(m0.lessons[1].status, 'locked');
    assert.equal(m0.quiz.status, 'locked');
    assert.equal(m1.status, 'locked');
    assert.equal((await call(`lessons/${MODULES[0].lessons[1].id}`, { cookie })).status, 403);
    assert.equal((await call(`lessons/${MODULES[0].lessons[1].id}/complete`, { body: {}, cookie })).status, 403);
    assert.equal((await call(`lessons/${MODULES[1].lessons[0].id}`, { cookie })).status, 403);
    assert.equal((await call(`assessments/${MODULES[0].id}/start`, { body: {}, cookie })).status, 403);
    assert.equal((await call('assessments/mock-1/start', { body: {}, cookie })).status, 403);
    assert.equal((await call('assessments/final/start', { body: {}, cookie })).status, 403);
  });

  test('lesson content includes objectives and source references', async () => {
    const cookie = await signup();
    const r = await call(`lessons/${MODULES[0].lessons[0].id}`, { cookie });
    assert.equal(r.status, 200);
    assert.ok(r.body.lesson.objectives.length > 0);
    assert.ok(r.body.lesson.sources.length > 0);
    assert.ok(r.body.lesson.sources[0].book);
  });

  test('completing lessons opens the knowledge check; failing it keeps the next module locked', async () => {
    const cookie = await signup();
    for (const l of MODULES[0].lessons) assert.equal((await call(`lessons/${l.id}/complete`, { body: {}, cookie })).status, 200);
    const total = MODULES[0].quiz.length;
    const wrongToFail = total - Math.ceil(total * 0.8) + 1;
    const failed = await takeAssessment(cookie, MODULES[0].id, wrongToFail);
    assert.equal(failed.body.result.passed, false);
    let me = await call('me', { cookie });
    assert.equal(me.body.state.modules[1].status, 'locked');
    const passed = await takeAssessment(cookie, MODULES[0].id, 0);
    assert.equal(passed.body.result.passed, true);
    me = await call('me', { cookie });
    assert.equal(me.body.state.modules[1].status, 'available');
    assert.equal(me.body.state.modules[1].lessons[0].status, 'available');
  });

  test('exactly 80% passes', () => {
    const qs = MODULES[4].quiz.slice(0, 10);
    const layout = newLayout(qs, false);
    const answers: Record<string, number> = {};
    layout.forEach((item, i) => {
      const correct = item.o.indexOf(qs.find((q) => q.id === item.q)!.answer);
      answers[item.q] = i < 2 ? (correct + 1) % 4 : correct;
    });
    const r = score(qs, layout, answers);
    assert.equal(r.score, 8);
    assert.equal(r.passed, true);
    answers[layout[2].q] = (layout[2].o.indexOf(qs.find((q) => q.id === layout[2].q)!.answer) + 1) % 4;
    assert.equal(score(qs, layout, answers).passed, false);
  });

  test('state machine opens mocks and final in order', () => {
    const done = new Set(MODULES.flatMap((m) => m.lessons.map((l) => l.id)));
    const passedQuiz = (id: string) => ({ id: `a-${id}`, user_id: 'u', assessment_id: id, started_ms: 1, deadline_ms: null, submitted_ms: 2, status: 'submitted' as const, layout: '[]', answers: '{}', score: 10, total: 10, passed: 1 });
    const quizzes = MODULES.map((m) => passedQuiz(m.id));
    let s = courseState(done, quizzes, 10);
    assert.deepEqual(s.exams.map((e) => e.status), ['available', 'locked', 'locked']);
    s = courseState(done, [...quizzes, { ...passedQuiz('mock-1'), passed: 0, score: 40, total: 100 }], 10);
    assert.deepEqual(s.exams.map((e) => e.status), ['completed', 'available', 'locked']);
    s = courseState(done, [...quizzes, passedQuiz('mock-1'), passedQuiz('mock-2')], 10);
    assert.equal(s.exams[2].status, 'available');
    const missingOneQuiz = quizzes.slice(0, -1);
    s = courseState(done, missingOneQuiz, 10);
    assert.equal(s.exams[0].status, 'locked');
  });
});

/* ---------------- assessments ---------------- */
describe('assessments', () => {
  test('questions are sent without answers or explanations, and options are shuffled per attempt', async () => {
    const cookie = await signup();
    for (const l of MODULES[0].lessons) await call(`lessons/${l.id}/complete`, { body: {}, cookie });
    const start = await call(`assessments/${MODULES[0].id}/start`, { body: {}, cookie });
    const text = JSON.stringify(start.body);
    assert.ok(!/"answer"|"explanation"|"correct"/.test(text), 'no answer key before submission');
    assert.equal(start.body.attempt.questions.length, MODULES[0].quiz.length);
    for (const qn of start.body.attempt.questions) {
      const src = MODULES[0].quiz.find((x) => x.id === qn.id)!;
      assert.deepEqual([...qn.options].sort(), [...src.options].sort());
    }
    // Starting again resumes the same open attempt.
    const again = await call(`assessments/${MODULES[0].id}/start`, { body: {}, cookie });
    assert.equal(again.body.attempt.id, start.body.attempt.id);
  });

  test('submitted answers are scored on the server and replays do not double-count', async () => {
    const cookie = await signup();
    for (const l of MODULES[0].lessons) await call(`lessons/${l.id}/complete`, { body: {}, cookie });
    const r = await takeAssessment(cookie, MODULES[0].id);
    assert.equal(r.body.result.score, MODULES[0].quiz.length);
    assert.ok(r.body.result.results.every((x: { isCorrect: boolean; explanation: string }) => x.isCorrect && x.explanation));
    const attemptId = (db.raw.prepare('SELECT id FROM pmp_attempts').get() as { id: string }).id;
    const replay = await call(`assessments/${MODULES[0].id}/submit`, { body: { attemptId, answers: {} }, cookie });
    assert.equal(replay.body.replayed, true);
    assert.equal(replay.body.result.score, MODULES[0].quiz.length);
    const review = await call(`attempts/${attemptId}`, { cookie });
    assert.equal(review.body.result.score, MODULES[0].quiz.length);
  });

  test('a learner cannot read or submit another learner\'s attempt', async () => {
    const a = await signup('a@example.com');
    const b = await signup('b@example.com');
    for (const l of MODULES[0].lessons) await call(`lessons/${l.id}/complete`, { body: {}, cookie: a });
    const start = await call(`assessments/${MODULES[0].id}/start`, { body: {}, cookie: a });
    const id = start.body.attempt.id;
    assert.equal((await call(`assessments/${MODULES[0].id}/submit`, { body: { attemptId: id, answers: {} }, cookie: b })).status, 404);
  });

  test('malformed answers are ignored rather than trusted', async () => {
    const cookie = await signup();
    for (const l of MODULES[0].lessons) await call(`lessons/${l.id}/complete`, { body: {}, cookie });
    const start = await call(`assessments/${MODULES[0].id}/start`, { body: {}, cookie });
    const answers: Record<string, unknown> = { notAQuestion: 1 };
    for (const qn of start.body.attempt.questions) answers[qn.id] = 9;
    const r = await call(`assessments/${MODULES[0].id}/submit`, { body: { attemptId: start.body.attempt.id, answers }, cookie });
    assert.equal(r.body.result.score, 0);
  });
});

/* ---------------- full path, exams and certificate ---------------- */
describe('full learning path', () => {
  test('mocks, timed final, certificate, PDF and public verification', async () => {
    const cookie = await signup('full@example.com', 'Zoë Fernández');
    for (let i = 0; i < MODULES.length; i++) await completeModule(cookie, i);
    let me = await call('me', { cookie });
    assert.equal(me.body.state.exams[0].status, 'available');
    assert.equal(me.body.state.exams[1].status, 'locked');

    // Not eligible for a certificate yet.
    assert.equal((await call('certificate', { body: {}, cookie })).status, 403);

    // Mock 1: failing still counts as "submitted" for unlocking Mock 2.
    const m1 = await takeAssessment(cookie, 'mock-1', 60);
    assert.equal(m1.body.result.passed, false);
    me = await call('me', { cookie });
    assert.equal(me.body.state.exams[1].status, 'available');

    // Mock 2: an expired attempt does not count.
    const started = await call('assessments/mock-2/start', { body: {}, cookie });
    assert.ok(started.body.attempt.deadline);
    assert.equal(started.body.attempt.questions.length, EXAMS[1].questions.length);
    setNow(nowMs + (EXAMS[1].minutes + 3) * 60_000);
    const late = await call('assessments/mock-2/submit', { body: { attemptId: started.body.attempt.id, answers: {} }, cookie });
    assert.equal(late.status, 410);
    me = await call('me', { cookie });
    assert.equal(me.body.state.exams[2].status, 'locked');
    await takeAssessment(cookie, 'mock-2');

    // Final: fail, cooldown, then pass.
    const failFinal = await takeAssessment(cookie, 'final', 30);
    assert.equal(failFinal.body.result.passed, false);
    assert.equal((await call('assessments/final/start', { body: {}, cookie })).status, 403);
    setNow(nowMs + 25 * 60 * 60 * 1000);
    const passFinal = await takeAssessment(cookie, 'final', 2);
    assert.equal(passFinal.body.result.passed, true);
    assert.equal((await call('assessments/final/start', { body: {}, cookie })).status, 409);

    // Certificate issued once, idempotently.
    const cert = await call('certificate', { body: {}, cookie });
    assert.equal(cert.status, 201);
    const code: string = cert.body.certificate.code;
    assert.match(code, /^PMP-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    const again = await call('certificate', { body: {}, cookie });
    assert.equal(again.body.certificate.code, code);

    // PDF download (signed in only).
    const pdf = await call('certificate.pdf', { cookie });
    assert.equal(pdf.status, 200);
    assert.equal(pdf.headers.get('Content-Type'), 'application/pdf');
    const head = new TextDecoder().decode((pdf.body as Uint8Array).slice(0, 8));
    assert.equal(head, '%PDF-1.4');
    const pdfText = new TextDecoder('latin1').decode(pdf.body as Uint8Array);
    assert.match(pdfText, /not a PMI credential/);
    assert.match(pdfText, new RegExp(code));
    assert.equal((await call('certificate.pdf')).status, 401);

    // Public verification shows the name exactly as registered, with the disclaimer.
    const v = await call(`verify/${code}`);
    assert.equal(v.status, 200);
    assert.equal(v.body.certificate.name, 'Zoë Fernández');
    assert.match(v.body.notice, /Not a PMI credential/);
    assert.ok(!JSON.stringify(v.body).includes('full@example.com'), 'verification never exposes the email');
    assert.equal((await call('verify/PMP-AAAA-BBBB-CCCC')).status, 404);
    assert.equal((await call('verify/<script>')).status, 404);

    me = await call('me', { cookie });
    assert.equal(me.body.state.progress.percent, 100);
    assert.equal(me.body.certificate.code, code);
  });
});

/* ---------------- certificate PDF unit ---------------- */
describe('certificate PDF', () => {
  test('produces a valid single-page PDF with a correct xref table', () => {
    const bytes = certificatePdf({ name: 'Asha (Test) Rao\\', courseTitle: 'Course', issuedOn: '20 October 2026', code: 'PMP-AAAA-BBBB-CCCC', verifyUrl: 'https://x/#pmp/verify/PMP-AAAA-BBBB-CCCC', scoreText: 'Final assessment score: 90%' });
    const text = new TextDecoder('latin1').decode(bytes);
    assert.ok(text.startsWith('%PDF-1.4'));
    assert.ok(text.trimEnd().endsWith('%%EOF'));
    const startxref = Number(/startxref\n(\d+)/.exec(text)![1]);
    assert.ok(text.slice(startxref).startsWith('xref'));
    const offsets = [...text.slice(startxref).matchAll(/(\d{10}) 00000 n/g)].map((m) => Number(m[1]));
    offsets.forEach((off, i) => assert.ok(text.slice(off).startsWith(`${i + 1} 0 obj`), `object ${i + 1} offset`));
    assert.match(text, /Asha \\\(Test\\\) Rao\\\\/);
  });
  test('transliterates names for the PDF', () => {
    assert.equal(pdfSafe('Zoë Fernández'), 'Zoe Fernandez');
    assert.equal(pdfSafe('राहुल'), '?????'.slice(0, pdfSafe('राहुल').length));
  });
});
