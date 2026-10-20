/*
 * PMP learning platform storage on Cloudflare D1 (SQLite).
 *
 * Binding: PMP_DB if present, otherwise the existing BOOKINGS_DB. Tables are prefixed
 * "pmp_" so they never touch booking data. The schema is created on first use and only
 * ever extended (CREATE ... IF NOT EXISTS); nothing is dropped or rewritten.
 *
 * Secrets: passwords are stored only as PBKDF2 hashes with a per-user salt; session
 * tokens are stored only as SHA-256 hashes. Raw tokens exist only in the HttpOnly cookie.
 */
import type { D1Like } from '../bookingStore.ts';

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS pmp_users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    pw_hash TEXT NOT NULL,
    pw_salt TEXT NOT NULL,
    pw_iter INTEGER NOT NULL,
    failed_logins INTEGER NOT NULL DEFAULT 0,
    locked_until_ms INTEGER NOT NULL DEFAULT 0,
    created_ms INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS pmp_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_ms INTEGER NOT NULL,
    expires_ms INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS pmp_sessions_user ON pmp_sessions (user_id)`,
  `CREATE TABLE IF NOT EXISTS pmp_lesson_progress (
    user_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    completed_ms INTEGER NOT NULL,
    PRIMARY KEY (user_id, lesson_id)
  )`,
  `CREATE TABLE IF NOT EXISTS pmp_attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    assessment_id TEXT NOT NULL,
    started_ms INTEGER NOT NULL,
    deadline_ms INTEGER,
    submitted_ms INTEGER,
    status TEXT NOT NULL DEFAULT 'open',
    layout TEXT NOT NULL,
    answers TEXT,
    score INTEGER,
    total INTEGER NOT NULL,
    passed INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE INDEX IF NOT EXISTS pmp_attempts_user ON pmp_attempts (user_id, assessment_id)`,
  `CREATE TABLE IF NOT EXISTS pmp_certificates (
    code TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    issued_ms INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    course_version TEXT NOT NULL
  )`,
];

const ready = new WeakSet<object>();

export async function ensurePmpSchema(db: D1Like): Promise<void> {
  if (ready.has(db)) return;
  for (const sql of SCHEMA) await db.prepare(sql).run();
  ready.add(db);
}

export const pmpDb = (env: { PMP_DB?: D1Like; BOOKINGS_DB?: D1Like }): D1Like | undefined => env.PMP_DB ?? env.BOOKINGS_DB;

/* ---------------- rows ---------------- */
export interface UserRow {
  id: string;
  email: string;
  name: string;
  pw_hash: string;
  pw_salt: string;
  pw_iter: number;
  failed_logins: number;
  locked_until_ms: number;
  created_ms: number;
}

export type AttemptStatus = 'open' | 'submitted' | 'expired';

export interface AttemptRow {
  id: string;
  user_id: string;
  assessment_id: string;
  started_ms: number;
  deadline_ms: number | null;
  submitted_ms: number | null;
  status: AttemptStatus;
  /** JSON: [{ q: questionId, o: [original option indexes in display order] }] */
  layout: string;
  /** JSON: { [questionId]: displayed option index } */
  answers: string | null;
  score: number | null;
  total: number;
  passed: number;
}

export interface CertificateRow {
  code: string;
  user_id: string;
  name: string;
  issued_ms: number;
  score: number;
  total: number;
  course_version: string;
}

/* ---------------- users ---------------- */
export const findUserByEmail = (db: D1Like, email: string) =>
  db.prepare(`SELECT * FROM pmp_users WHERE email = ?1`).bind(email).first<UserRow>();

export const findUserById = (db: D1Like, id: string) => db.prepare(`SELECT * FROM pmp_users WHERE id = ?1`).bind(id).first<UserRow>();

/** Returns false if the email is already registered. */
export async function insertUser(db: D1Like, u: Omit<UserRow, 'failed_logins' | 'locked_until_ms'>): Promise<boolean> {
  const res = await db
    .prepare(
      `INSERT INTO pmp_users (id, email, name, pw_hash, pw_salt, pw_iter, created_ms)
       SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7 WHERE NOT EXISTS (SELECT 1 FROM pmp_users WHERE email = ?2)`,
    )
    .bind(u.id, u.email, u.name, u.pw_hash, u.pw_salt, u.pw_iter, u.created_ms)
    .run();
  return res.meta.changes === 1;
}

export const recordLoginFailure = (db: D1Like, id: string, lockUntilMs: number, maxFailures: number) =>
  db
    .prepare(
      `UPDATE pmp_users SET failed_logins = failed_logins + 1,
         locked_until_ms = CASE WHEN failed_logins + 1 >= ?3 THEN ?2 ELSE locked_until_ms END
       WHERE id = ?1`,
    )
    .bind(id, lockUntilMs, maxFailures)
    .run();

export const resetLoginFailures = (db: D1Like, id: string) =>
  db.prepare(`UPDATE pmp_users SET failed_logins = 0, locked_until_ms = 0 WHERE id = ?1`).bind(id).run();

/* ---------------- sessions ---------------- */
export const insertSession = (db: D1Like, tokenHash: string, userId: string, nowMs: number, expiresMs: number) =>
  db.prepare(`INSERT INTO pmp_sessions (token_hash, user_id, created_ms, expires_ms) VALUES (?1, ?2, ?3, ?4)`).bind(tokenHash, userId, nowMs, expiresMs).run();

export const findSession = (db: D1Like, tokenHash: string, nowMs: number) =>
  db
    .prepare(`SELECT user_id FROM pmp_sessions WHERE token_hash = ?1 AND expires_ms > ?2`)
    .bind(tokenHash, nowMs)
    .first<{ user_id: string }>();

export const deleteSession = (db: D1Like, tokenHash: string) => db.prepare(`DELETE FROM pmp_sessions WHERE token_hash = ?1`).bind(tokenHash).run();

export const deleteExpiredSessions = (db: D1Like, userId: string, nowMs: number) =>
  db.prepare(`DELETE FROM pmp_sessions WHERE user_id = ?1 AND expires_ms <= ?2`).bind(userId, nowMs).run();

/* ---------------- progress ---------------- */
export async function completedLessons(db: D1Like, userId: string): Promise<Set<string>> {
  const { results } = await db.prepare(`SELECT lesson_id FROM pmp_lesson_progress WHERE user_id = ?1`).bind(userId).all<{ lesson_id: string }>();
  return new Set(results.map((r) => r.lesson_id));
}

export const markLessonComplete = (db: D1Like, userId: string, lessonId: string, nowMs: number) =>
  db
    .prepare(`INSERT INTO pmp_lesson_progress (user_id, lesson_id, completed_ms) VALUES (?1, ?2, ?3) ON CONFLICT (user_id, lesson_id) DO NOTHING`)
    .bind(userId, lessonId, nowMs)
    .run();

/* ---------------- attempts ---------------- */
export async function attemptsFor(db: D1Like, userId: string): Promise<AttemptRow[]> {
  const { results } = await db.prepare(`SELECT * FROM pmp_attempts WHERE user_id = ?1 ORDER BY started_ms`).bind(userId).all<AttemptRow>();
  return results;
}

export const findAttempt = (db: D1Like, id: string, userId: string) =>
  db.prepare(`SELECT * FROM pmp_attempts WHERE id = ?1 AND user_id = ?2`).bind(id, userId).first<AttemptRow>();

/** Creates an attempt unless one is already open for this assessment (returns false then). */
export async function insertAttempt(db: D1Like, a: Pick<AttemptRow, 'id' | 'user_id' | 'assessment_id' | 'started_ms' | 'deadline_ms' | 'layout' | 'total'>): Promise<boolean> {
  const res = await db
    .prepare(
      `INSERT INTO pmp_attempts (id, user_id, assessment_id, started_ms, deadline_ms, layout, total, status)
       SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7, 'open'
       WHERE NOT EXISTS (SELECT 1 FROM pmp_attempts WHERE user_id = ?2 AND assessment_id = ?3 AND status = 'open')`,
    )
    .bind(a.id, a.user_id, a.assessment_id, a.started_ms, a.deadline_ms, a.layout, a.total)
    .run();
  return res.meta.changes === 1;
}

/** Closes an open attempt exactly once (returns false if it was already closed). */
export async function closeAttempt(
  db: D1Like,
  id: string,
  userId: string,
  status: 'submitted' | 'expired',
  nowMs: number,
  answers: string | null,
  score: number | null,
  passed: boolean,
): Promise<boolean> {
  const res = await db
    .prepare(
      `UPDATE pmp_attempts SET status = ?3, submitted_ms = ?4, answers = ?5, score = ?6, passed = ?7
       WHERE id = ?1 AND user_id = ?2 AND status = 'open'`,
    )
    .bind(id, userId, status, nowMs, answers, score, passed ? 1 : 0)
    .run();
  return res.meta.changes === 1;
}

/* ---------------- certificates ---------------- */
export const findCertificateByUser = (db: D1Like, userId: string) =>
  db.prepare(`SELECT * FROM pmp_certificates WHERE user_id = ?1`).bind(userId).first<CertificateRow>();

export const findCertificateByCode = (db: D1Like, code: string) =>
  db.prepare(`SELECT * FROM pmp_certificates WHERE code = ?1`).bind(code).first<CertificateRow>();

/** Inserts the certificate unless the user already has one (one per learner). */
export const insertCertificate = (db: D1Like, c: CertificateRow) =>
  db
    .prepare(
      `INSERT INTO pmp_certificates (code, user_id, name, issued_ms, score, total, course_version)
       SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7 WHERE NOT EXISTS (SELECT 1 FROM pmp_certificates WHERE user_id = ?2)`,
    )
    .bind(c.code, c.user_id, c.name, c.issued_ms, c.score, c.total, c.course_version)
    .run();
