/*
 * /api/pmp/* — the learning platform API (mounted by functions/api/pmp/[[path]].ts).
 *
 *   POST /auth/signup  {name, email, password}      create a learner account, start session
 *   POST /auth/login   {email, password}            start session (also the one-time admin bootstrap)
 *   POST /auth/logout                               end session
 *   POST /auth/change-password {currentPassword, newPassword}
 *   GET  /me                                        user + course state (locks enforced here)
 *   GET  /lessons/:id                               lesson content, only when unlocked (admins: always)
 *   POST /lessons/:id/complete                      mark complete (learners only, only when unlocked)
 *   POST /assessments/:id/start                     start or resume an attempt (learners only)
 *   POST /assessments/:id/submit {attemptId, answers}  score on the server (learners only)
 *   GET  /attempts/:id                              review of a submitted attempt
 *   POST /certificate                               issue the certificate once the final is passed
 *   GET  /certificate.pdf                           the learner's certificate as a PDF
 *   GET  /verify/:code                              public verification (no sign-in)
 *   *    /admin/*                                   administrator API (server/pmp/admin.ts)
 *
 * Roles: the role lives only in pmp_users.role and is read from the database on every
 * request. Administrators bypass learner *progression* checks for reading content, never
 * authentication; learner write paths refuse admin accounts so previews cannot create
 * progress, attempts or certificates.
 *
 * Every state-changing request must be same-origin JSON. Responses never contain password
 * hashes, session tokens or answer keys for unsubmitted learner attempts.
 */
import type { D1Like } from '../bookingStore.ts';
import { clock } from '../clock.ts';
import { randomBytes, safeEqual, sha256b64url } from '../crypto.ts';
import { fail, json, makeRateLimiter, sameSite } from '../http.ts';
import { handleAdmin } from './admin.ts';
import {
  ADMIN_SESSION_TTL_MS,
  DEFAULT_ADMIN_EMAIL,
  LOCKOUT_MS,
  MAX_FAILED_LOGINS,
  SESSION_COOKIE,
  SESSION_TTL_MS,
  adminPasswordProblem,
  burnPasswordCheck,
  cleanName,
  clearSessionCookie,
  createSession,
  currentUser,
  newId,
  newPasswordRecord,
  normaliseEmail,
  passwordProblem,
  readCookie,
  sessionCookie,
  validEmail,
  verifyPassword,
} from './auth.ts';
import { certificatePdf } from './certificatePdf.ts';
import { loadCourse, type Course } from './content.ts';
import { COURSE_TITLE, COURSE_VERSION } from './course.ts';
import {
  EXAM_GRACE_MS,
  assessmentStatus,
  cleanAnswers,
  courseState,
  findAssessment,
  findLesson,
  lessonPayload,
  lessonStatus,
  newLayout,
  parseLayout,
  presentQuestions,
  score,
  unlockedForAdmin,
} from './engine.ts';
import {
  attemptsFor,
  audit,
  closeAttempt,
  completedLessons,
  deleteSession,
  deleteSessionsForUser,
  ensurePmpSchema,
  findAttempt,
  findCertificateByCode,
  findCertificateByUser,
  findUserByEmail,
  insertAttempt,
  insertCertificate,
  insertUser,
  markLessonComplete,
  pmpDb,
  recordLoginFailure,
  resetLoginFailures,
  updatePassword,
  upsertAdmin,
  type AttemptRow,
  type UserRow,
} from './store.ts';

export interface PmpEnv {
  PMP_DB?: D1Like;
  BOOKINGS_DB?: D1Like;
  /** "false" closes new sign-ups (existing learners can still sign in). Default: open. */
  PMP_SIGNUP_OPEN?: string;
  /** The administrator account's email. Default: rahul.a.mehra@gmail.com. Reserved from public sign-up. */
  PMP_ADMIN_EMAIL?: string;
  /**
   * Secret. One-time bootstrap password for the administrator account. Only used while no
   * administrator exists for PMP_ADMIN_EMAIL; the account must change it on first sign-in.
   * Remove it once the administrator has set their own password.
   */
  PMP_ADMIN_BOOTSTRAP_PASSWORD?: string;
}

const MAX_BODY = 64 * 1024;
const authLimiter = makeRateLimiter(10, 10 * 60 * 1000);
const signupLimiter = makeRateLimiter(5, 60 * 60 * 1000);

const ip = (r: Request) => r.headers.get('CF-Connecting-IP') || 'local';
export const formatDate = (ms: number) => new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const adminEmail = (env: PmpEnv) => normaliseEmail(env.PMP_ADMIN_EMAIL) || DEFAULT_ADMIN_EMAIL;
const bootstrapPassword = (env: PmpEnv) => (env.PMP_ADMIN_BOOTSTRAP_PASSWORD && env.PMP_ADMIN_BOOTSTRAP_PASSWORD.length >= 10 ? env.PMP_ADMIN_BOOTSTRAP_PASSWORD : undefined);
export const isAdmin = (u: UserRow) => u.role === 'admin';

export async function readJson(request: Request): Promise<Record<string, unknown> | Response> {
  if (!(request.headers.get('Content-Type') || '').includes('application/json')) return fail(415, 'unsupported', 'Unsupported request.');
  if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY) return fail(413, 'too_large', 'Request too large.');
  const raw = await request.text();
  if (raw.length > MAX_BODY) return fail(413, 'too_large', 'Request too large.');
  if (!raw) return {};
  try {
    const v: unknown = JSON.parse(raw);
    if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error('not an object');
    return v as Record<string, unknown>;
  } catch {
    return fail(400, 'bad_json', 'Invalid request.');
  }
}

const publicUser = (u: UserRow) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  joined: new Date(u.created_ms).toISOString(),
  role: isAdmin(u) ? 'admin' : 'learner',
  mustChangePassword: isAdmin(u) && u.must_change_password === 1,
});

async function stateFor(db: D1Like, userId: string, nowMs: number, course: Course) {
  const [done, attempts] = await Promise.all([completedLessons(db, userId), attemptsFor(db, userId)]);
  return { state: courseState(done, attempts, nowMs, course), attempts };
}

/** Closes any exam attempt whose deadline (plus grace) has passed; it does not count. */
async function expireStale(db: D1Like, attempts: AttemptRow[], nowMs: number): Promise<boolean> {
  let changed = false;
  for (const a of attempts) {
    if (a.status === 'open' && a.deadline_ms && nowMs > a.deadline_ms + EXAM_GRACE_MS) {
      changed = (await closeAttempt(db, a.id, a.user_id, 'expired', nowMs, a.answers, null, false)) || changed;
    }
  }
  return changed;
}

const adminPreviewOnly = () =>
  fail(403, 'admin_preview', 'Administrator accounts preview the course without recording progress, attempts or certificates. Use a learner account to take the course.');

const sessionTtl = (u: Pick<UserRow, 'role'>) => (u.role === 'admin' ? ADMIN_SESSION_TTL_MS : SESSION_TTL_MS);

export async function handlePmp(request: Request, env: PmpEnv, path: string): Promise<Response> {
  const db = pmpDb(env);
  if (!db) return fail(503, 'unavailable', 'The learning platform is not available right now.');
  await ensurePmpSchema(db);
  const now = clock.now().getTime();
  const method = request.method;
  const parts = path.split('/').filter(Boolean);

  if (method !== 'GET' && method !== 'HEAD') {
    if (!sameSite(request.headers.get('Origin'), request.url)) return fail(403, 'forbidden', 'Request not allowed.');
  }

  /* ---------------- public ---------------- */
  if (parts[0] === 'verify' && parts.length === 2 && method === 'GET') {
    const code = parts[1];
    if (!/^[A-Z0-9-]{8,32}$/.test(code)) return fail(404, 'not_found', 'Certificate not found.');
    const cert = await findCertificateByCode(db, code);
    if (!cert) return fail(404, 'not_found', 'No certificate with this ID was found.');
    return json(200, {
      ok: true,
      certificate: { code: cert.code, name: cert.name, issued: new Date(cert.issued_ms).toISOString(), course: COURSE_TITLE, courseVersion: cert.course_version },
      notice: 'Independent course certificate. Not a PMI credential and not affiliated with or endorsed by PMI.',
    });
  }

  /* ---------------- auth ---------------- */
  if (parts[0] === 'auth') {
    if (method !== 'POST') return fail(405, 'method', 'Method not allowed.', { Allow: 'POST' });
    const action = parts[1];

    if (action === 'logout') {
      const token = readCookie(request, SESSION_COOKIE);
      if (token && token.length <= 100) await deleteSession(db, await sha256b64url(token));
      return json(200, { ok: true }, { 'Set-Cookie': clearSessionCookie(request.url) });
    }

    if (authLimiter(ip(request), now)) return fail(429, 'rate_limited', 'Too many attempts. Please wait a few minutes and try again.');
    const body = await readJson(request);
    if (body instanceof Response) return body;

    if (action === 'change-password') {
      const me = await currentUser(db, request, now);
      if (!me) return fail(401, 'signed_out', 'Please sign in.');
      const current = typeof body.currentPassword === 'string' ? body.currentPassword : '';
      const next = body.newPassword;
      if (!current || current.length > 128 || !(await verifyPassword(current, me))) {
        await recordLoginFailure(db, me.id, now + LOCKOUT_MS, MAX_FAILED_LOGINS);
        return fail(400, 'wrong_password', 'Your current password is incorrect.');
      }
      const issue = isAdmin(me) ? adminPasswordProblem(next, bootstrapPassword(env)) : passwordProblem(next);
      if (issue) return fail(400, 'weak_password', issue);
      if (next === current) return fail(400, 'weak_password', 'Choose a password different from your current one.');
      await updatePassword(db, me.id, await newPasswordRecord(next as string), now);
      await deleteSessionsForUser(db, me.id); // sign out every other device
      await audit(db, now, me, 'password_changed', me.id);
      const s = await createSession(db, me.id, now, sessionTtl(me));
      return json(200, { ok: true }, { 'Set-Cookie': sessionCookie(request.url, s.token, sessionTtl(me) / 1000) });
    }

    const email = normaliseEmail(body.email);
    const password = typeof body.password === 'string' ? body.password : '';

    if (action === 'signup') {
      if (env.PMP_SIGNUP_OPEN === 'false') return fail(403, 'signup_closed', 'New registrations are closed at the moment.');
      if (signupLimiter(ip(request), now)) return fail(429, 'rate_limited', 'Too many sign-ups from this network. Please try again later.');
      const name = cleanName(body.name);
      if (name.length < 2) return fail(400, 'invalid_name', 'Enter your name as it should appear on your certificate.');
      if (!validEmail(email)) return fail(400, 'invalid_email', 'Enter a valid email address.');
      if (email === adminEmail(env)) return fail(403, 'reserved_email', 'This email cannot be used for a learner account.');
      const pwIssue = passwordProblem(body.password);
      if (pwIssue) return fail(400, 'weak_password', pwIssue);
      const rec = await newPasswordRecord(password);
      const id = newId();
      const created = await insertUser(db, { id, email, name, ...rec, created_ms: now });
      if (!created) return fail(409, 'email_taken', 'An account with this email already exists. Please sign in.');
      const s = await createSession(db, id, now);
      return json(201, { ok: true, user: { id, name, email, role: 'learner' } }, { 'Set-Cookie': sessionCookie(request.url, s.token, SESSION_TTL_MS / 1000) });
    }

    if (action === 'login') {
      const generic = () => fail(401, 'invalid_credentials', 'Email or password is incorrect.');
      if (!validEmail(email) || !password || password.length > 128) return generic();
      let user = await findUserByEmail(db, email);

      // One-time administrator bootstrap: only for the configured admin email, only while no
      // administrator account exists for it, and only with the server-side secret.
      const boot = bootstrapPassword(env);
      if (email === adminEmail(env) && boot && (!user || !isAdmin(user)) && !(user && user.locked_until_ms > now)) {
        if (safeEqual(password, boot)) {
          await upsertAdmin(db, { id: newId(), email, name: user?.name || 'Rahul Mehra', ...(await newPasswordRecord(password)), created_ms: now });
          user = (await findUserByEmail(db, email))!;
          await deleteSessionsForUser(db, user.id);
          await audit(db, now, user, 'admin_bootstrap', user.id, 'Administrator account created or promoted with the bootstrap password; password change required.');
          const s = await createSession(db, user.id, now, ADMIN_SESSION_TTL_MS);
          return json(200, { ok: true, user: publicUser(user) }, { 'Set-Cookie': sessionCookie(request.url, s.token, ADMIN_SESSION_TTL_MS / 1000) });
        }
        if (!user) {
          await burnPasswordCheck(password);
          return generic();
        }
      }

      if (!user) {
        await burnPasswordCheck(password);
        return generic();
      }
      if (user.locked_until_ms > now) return fail(423, 'locked', 'Too many failed attempts. Please try again in 15 minutes.');
      if (!(await verifyPassword(password, user))) {
        await recordLoginFailure(db, user.id, now + LOCKOUT_MS, MAX_FAILED_LOGINS);
        if (isAdmin(user)) await audit(db, now, null, 'admin_login_failed', user.id);
        return generic();
      }
      await resetLoginFailures(db, user.id);
      if (isAdmin(user)) await audit(db, now, user, 'admin_login', user.id);
      const s = await createSession(db, user.id, now, sessionTtl(user));
      return json(200, { ok: true, user: publicUser(user) }, { 'Set-Cookie': sessionCookie(request.url, s.token, sessionTtl(user) / 1000) });
    }
    return fail(404, 'not_found', 'Not found.');
  }

  /* ---------------- signed-in ---------------- */
  const user = await currentUser(db, request, now);
  if (!user) return fail(401, 'signed_out', 'Please sign in.');
  const admin = isAdmin(user);

  if (parts[0] === 'me' && parts.length === 1 && method === 'GET') {
    const { course } = await loadCourse(db);
    let { state, attempts } = await stateFor(db, user.id, now, course);
    if (await expireStale(db, attempts, now)) ({ state } = await stateFor(db, user.id, now, course));
    const cert = admin ? null : await findCertificateByUser(db, user.id);
    return json(200, {
      ok: true,
      user: publicUser(user),
      course: { title: COURSE_TITLE, version: COURSE_VERSION, passMark: 80 },
      state: admin ? unlockedForAdmin(state) : state,
      certificate: cert ? { code: cert.code, issued: new Date(cert.issued_ms).toISOString(), name: cert.name } : null,
    });
  }

  // A bootstrapped administrator must set their own password before doing anything else.
  if (admin && user.must_change_password === 1) return fail(403, 'password_change_required', 'Change the temporary password before continuing.');

  if (parts[0] === 'admin') {
    if (!admin) return fail(403, 'forbidden', 'You do not have access to this area.');
    return handleAdmin(request, db, user, parts.slice(1), now);
  }

  if (parts[0] === 'lessons' && parts[1]) {
    const { course } = await loadCourse(db);
    const found = findLesson(parts[1], course);
    if (!found) return fail(404, 'not_found', 'Lesson not found.');
    const { state } = await stateFor(db, user.id, now, course);
    const status = lessonStatus(state, found.lesson.id);
    if (parts.length === 2 && method === 'GET') {
      // Admins may read any lesson; learners only unlocked ones.
      if (!admin && status === 'locked') return fail(403, 'locked', 'This lesson unlocks after you complete the previous step.');
      return json(200, { ok: true, lesson: lessonPayload(found.module, found.lesson, found.index), completed: status === 'completed', preview: admin });
    }
    if (parts[2] === 'complete' && parts.length === 3 && method === 'POST') {
      if (admin) return adminPreviewOnly();
      if (status === 'locked') return fail(403, 'locked', 'This lesson unlocks after you complete the previous step.');
      await markLessonComplete(db, user.id, found.lesson.id, now);
      const after = await stateFor(db, user.id, now, course);
      return json(200, { ok: true, state: after.state });
    }
    return fail(405, 'method', 'Method not allowed.');
  }

  if (parts[0] === 'assessments' && parts[1] && parts.length === 3 && method === 'POST') {
    if (admin) return adminPreviewOnly();
    const { course } = await loadCourse(db);
    const a = findAssessment(parts[1], course);
    if (!a) return fail(404, 'not_found', 'Assessment not found.');
    let { state, attempts } = await stateFor(db, user.id, now, course);
    if (await expireStale(db, attempts, now)) ({ state, attempts } = await stateFor(db, user.id, now, course));
    const st = assessmentStatus(state, parts[1])!;

    if (parts[2] === 'start') {
      const open = attempts.find((x) => x.assessment_id === parts[1] && x.status === 'open');
      if (!open) {
        if (st.status === 'locked') return fail(403, 'locked', st.lockReason || 'This assessment is locked.');
        if (parts[1] === 'final' && st.passed) return fail(409, 'already_passed', 'You have already passed the final assessment.');
      }
      let attempt = open ?? null;
      if (!attempt) {
        const layout = newLayout(a.questions, a.kind === 'exam');
        const minutes = a.kind === 'exam' ? a.exam.minutes : null;
        const id = newId();
        const created = await insertAttempt(db, {
          id,
          user_id: user.id,
          assessment_id: parts[1],
          started_ms: now,
          deadline_ms: minutes ? now + minutes * 60_000 : null,
          layout: JSON.stringify(layout),
          total: layout.length,
        });
        attempt = created ? await findAttempt(db, id, user.id) : (await attemptsFor(db, user.id)).find((x) => x.assessment_id === parts[1] && x.status === 'open') ?? null;
        if (!attempt) return fail(409, 'conflict', 'Please try again.');
      }
      const layout = parseLayout(attempt.layout);
      return json(200, {
        ok: true,
        attempt: {
          id: attempt.id,
          assessmentId: parts[1],
          kind: a.kind,
          title: a.kind === 'exam' ? a.exam.title : `Module ${a.module.number} knowledge check`,
          startedAt: new Date(attempt.started_ms).toISOString(),
          deadline: attempt.deadline_ms ? new Date(attempt.deadline_ms).toISOString() : null,
          serverNow: new Date(now).toISOString(),
          passMark: 80,
          questions: presentQuestions(a.questions, layout),
        },
      });
    }

    if (parts[2] === 'submit') {
      const body = await readJson(request);
      if (body instanceof Response) return body;
      const attemptId = typeof body.attemptId === 'string' ? body.attemptId : '';
      const attempt = attemptId ? await findAttempt(db, attemptId, user.id) : null;
      if (!attempt || attempt.assessment_id !== parts[1]) return fail(404, 'not_found', 'Attempt not found.');
      if (attempt.status === 'expired') return fail(410, 'expired', 'The time limit for this attempt has passed. Start a new attempt.');
      const layout = parseLayout(attempt.layout);
      if (attempt.status === 'submitted') {
        // Idempotent replay of an already-submitted attempt.
        const answers = attempt.answers ? (JSON.parse(attempt.answers) as Record<string, number>) : {};
        return json(200, { ok: true, replayed: true, result: score(a.questions, layout, answers), state });
      }
      if (attempt.deadline_ms && now > attempt.deadline_ms + EXAM_GRACE_MS) {
        await closeAttempt(db, attempt.id, user.id, 'expired', now, null, null, false);
        return fail(410, 'expired', 'The time limit for this attempt has passed. Start a new attempt.');
      }
      const answers = cleanAnswers(body.answers, layout);
      const result = score(a.questions, layout, answers);
      const closed = await closeAttempt(db, attempt.id, user.id, 'submitted', now, JSON.stringify(answers), result.score, result.passed);
      if (!closed) {
        const again = await findAttempt(db, attempt.id, user.id);
        const prior = again?.answers ? (JSON.parse(again.answers) as Record<string, number>) : {};
        return json(200, { ok: true, replayed: true, result: score(a.questions, layout, prior), state });
      }
      const after = await stateFor(db, user.id, now, course);
      return json(200, { ok: true, result, state: after.state });
    }
    return fail(404, 'not_found', 'Not found.');
  }

  if (parts[0] === 'attempts' && parts[1] && parts.length === 2 && method === 'GET') {
    const attempt = await findAttempt(db, parts[1], user.id);
    if (!attempt) return fail(404, 'not_found', 'Attempt not found.');
    if (attempt.status !== 'submitted') return fail(409, 'not_submitted', 'This attempt has not been submitted.');
    const { course } = await loadCourse(db);
    const a = findAssessment(attempt.assessment_id, course);
    if (!a) return fail(404, 'not_found', 'Assessment not found.');
    const answers = attempt.answers ? (JSON.parse(attempt.answers) as Record<string, number>) : {};
    return json(200, {
      ok: true,
      attempt: { id: attempt.id, assessmentId: attempt.assessment_id, submittedAt: new Date(attempt.submitted_ms ?? 0).toISOString() },
      result: score(a.questions, parseLayout(attempt.layout), answers),
    });
  }

  if (parts[0] === 'certificate' && parts.length === 1 && method === 'POST') {
    if (admin) return adminPreviewOnly();
    const existing = await findCertificateByUser(db, user.id);
    if (existing) return json(200, { ok: true, certificate: { code: existing.code, issued: new Date(existing.issued_ms).toISOString(), name: existing.name } });
    const attempts = await attemptsFor(db, user.id);
    const passedFinal = attempts
      .filter((x) => x.assessment_id === 'final' && x.status === 'submitted' && x.passed === 1)
      .sort((x, y) => (y.score ?? 0) / y.total - (x.score ?? 0) / x.total)[0];
    if (!passedFinal) return fail(403, 'not_eligible', 'Pass the final assessment to earn your certificate.');
    const code = certificateCode();
    await insertCertificate(db, { code, user_id: user.id, name: user.name, issued_ms: now, score: passedFinal.score ?? 0, total: passedFinal.total, course_version: COURSE_VERSION });
    const cert = (await findCertificateByUser(db, user.id))!;
    return json(201, { ok: true, certificate: { code: cert.code, issued: new Date(cert.issued_ms).toISOString(), name: cert.name } });
  }

  if (parts[0] === 'certificate.pdf' && parts.length === 1 && method === 'GET') {
    if (admin) return adminPreviewOnly();
    const cert = await findCertificateByUser(db, user.id);
    if (!cert) return fail(404, 'not_found', 'No certificate has been issued yet.');
    return pdfResponse(request, {
      name: cert.name,
      code: cert.code,
      issuedMs: cert.issued_ms,
      scoreText: `Final assessment score: ${Math.round((cert.score / cert.total) * 1000) / 10}%`,
      filename: `certificate-${cert.code}.pdf`,
    });
  }

  return fail(404, 'not_found', 'Not found.');
}

export function pdfResponse(request: Request, c: { name: string; code: string; issuedMs: number; scoreText: string; filename: string }): Response {
  const origin = new URL(request.url).origin;
  const pdf = certificatePdf({
    name: c.name,
    courseTitle: COURSE_TITLE,
    issuedOn: formatDate(c.issuedMs),
    code: c.code,
    verifyUrl: `${origin}/#pmp/verify/${c.code}`,
    scoreText: c.scoreText,
  });
  return new Response(pdf, {
    status: 200,
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${c.filename}"`, 'Cache-Control': 'no-store' },
  });
}

/** Human-friendly, unguessable certificate ID, e.g. "PMP-7K2Q-9XMD-4TBA". */
function certificateCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(12);
  let s = '';
  for (let i = 0; i < 12; i++) s += alphabet[bytes[i] % alphabet.length];
  return `PMP-${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`;
}
