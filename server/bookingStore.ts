/*
 * Booking storage on Cloudflare D1 (SQLite), bound to the Pages project as BOOKINGS_DB.
 *
 * Double bookings are prevented by single INSERT/UPDATE … WHERE NOT EXISTS statements:
 * D1 runs each statement atomically, so two visitors racing for overlapping times
 * can't both hold them. A row blocks [start_ms, block_end_ms) — session plus buffer —
 * while it is "confirmed", or "pending" with an unexpired hold (live mode, while the
 * Google Calendar event is being created).
 *
 * The schema is created and migrated automatically and additively on first use:
 * existing rows and columns are never dropped or rewritten.
 */

/** The subset of the D1 API used here (also implemented by the test adapter). */
export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  run(): Promise<{ meta: { changes: number } }>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
}
export interface D1Like {
  prepare(sql: string): D1Statement;
}

export type BookingStatus = 'pending' | 'confirmed' | 'failed';
export type EmailStatus = 'pending' | 'sending' | 'sent' | 'failed';
export type CalendarState = 'none' | 'created';

export interface BookingRow {
  reference: string;
  idem_key: string;
  service_id: string;
  date: string;
  time: string;
  start_ms: number;
  end_ms: number;
  block_end_ms: number;
  name: string;
  email: string;
  whatsapp: string;
  purpose: string;
  heard_from: string;
  status: BookingStatus;
  owner_email: EmailStatus;
  booker_email: EmailStatus;
  created_at: string;
  // ---- added in schema v2 ----
  mode: 'mock' | 'live';
  duration_minutes: number | null;
  /** Pre-assigned Google Calendar event id (live mode), reused on every retry. */
  event_id: string | null;
  event_link: string | null;
  meet_url: string | null;
  calendar_state: CalendarState;
  hold_until_ms: number | null;
  attempts: number;
  updated_ms: number;
  /** Last internal error category (never provider text or secrets). */
  last_error: string | null;
  owner_email_issue: string | null;
  booker_email_issue: string | null;
  email_attempts: number;
  emails_updated_ms: number;
}

const BASE_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS bookings (
    reference TEXT PRIMARY KEY,
    idem_key TEXT NOT NULL UNIQUE,
    service_id TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    start_ms INTEGER NOT NULL,
    end_ms INTEGER NOT NULL,
    block_end_ms INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    purpose TEXT NOT NULL,
    heard_from TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed',
    owner_email TEXT NOT NULL DEFAULT 'pending',
    booker_email TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS bookings_start ON bookings (start_ms)`,
  `CREATE TABLE IF NOT EXISTS google_auth (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    email TEXT NOT NULL,
    enc_refresh_token TEXT NOT NULL,
    scopes TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
];

/** Schema v2 columns, added with ALTER TABLE when missing (additive only). */
const V2_COLUMNS: [string, string][] = [
  ['mode', `TEXT NOT NULL DEFAULT 'mock'`],
  ['duration_minutes', 'INTEGER'],
  ['event_id', 'TEXT'],
  ['event_link', 'TEXT'],
  ['meet_url', 'TEXT'],
  ['calendar_state', `TEXT NOT NULL DEFAULT 'none'`],
  ['hold_until_ms', 'INTEGER'],
  ['attempts', 'INTEGER NOT NULL DEFAULT 0'],
  ['updated_ms', 'INTEGER NOT NULL DEFAULT 0'],
  ['last_error', 'TEXT'],
  ['owner_email_issue', 'TEXT'],
  ['booker_email_issue', 'TEXT'],
  ['email_attempts', 'INTEGER NOT NULL DEFAULT 0'],
  ['emails_updated_ms', 'INTEGER NOT NULL DEFAULT 0'],
];

const ready = new WeakSet<object>();

/** Creates and migrates the schema on first use (idempotent, additive). */
export async function ensureSchema(db: D1Like): Promise<void> {
  if (ready.has(db)) return;
  for (const sql of BASE_SCHEMA) await db.prepare(sql).run();
  const { results } = await db.prepare(`PRAGMA table_info(bookings)`).all<{ name: string }>();
  const have = new Set(results.map((r) => r.name));
  for (const [name, ddl] of V2_COLUMNS) {
    if (have.has(name)) continue;
    try {
      await db.prepare(`ALTER TABLE bookings ADD COLUMN ${name} ${ddl}`).run();
    } catch (err) {
      // Another instance may have added it at the same moment.
      if (!/duplicate column/i.test(err instanceof Error ? err.message : '')) throw err;
    }
  }
  ready.add(db);
}

/** Rows that currently block their time range. Uses parameter ?N for "now". */
const activeAt = (nowParam: string, alias = '') =>
  `(${alias}status = 'confirmed' OR (${alias}status = 'pending' AND ${alias}hold_until_ms > ${nowParam}))`;

/** Active bookings whose blocked range touches [fromMs, toMs). */
export async function bookingsBetween(db: D1Like, fromMs: number, toMs: number, nowMs: number) {
  const { results } = await db
    .prepare(`SELECT start_ms, block_end_ms FROM bookings WHERE ${activeAt('?3')} AND start_ms < ?1 AND block_end_ms > ?2`)
    .bind(toMs, fromMs, nowMs)
    .all<{ start_ms: number; block_end_ms: number }>();
  return results.map((r) => ({ startMs: Number(r.start_ms), blockEndMs: Number(r.block_end_ms) }));
}

export async function findByIdemKey(db: D1Like, idemKey: string) {
  return db.prepare(`SELECT * FROM bookings WHERE idem_key = ?1`).bind(idemKey).first<BookingRow>();
}

export async function findByReference(db: D1Like, reference: string) {
  return db.prepare(`SELECT * FROM bookings WHERE reference = ?1`).bind(reference).first<BookingRow>();
}

export interface NewBooking {
  reference: string;
  idem_key: string;
  service_id: string;
  date: string;
  time: string;
  start_ms: number;
  end_ms: number;
  block_end_ms: number;
  duration_minutes: number;
  name: string;
  email: string;
  whatsapp: string;
  purpose: string;
  heard_from: string;
  mode: 'mock' | 'live';
  status: 'pending' | 'confirmed';
  event_id: string | null;
  hold_until_ms: number | null;
  created_at: string;
}

export type ReserveResult = { status: 'created'; row: BookingRow } | { status: 'duplicate_key'; row: BookingRow } | { status: 'conflict' };

/** Atomically inserts the booking unless an active booking overlaps its blocked range. */
export async function reserve(db: D1Like, b: NewBooking, nowMs: number): Promise<ReserveResult> {
  let changes = 0;
  try {
    const res = await db
      .prepare(
        `INSERT INTO bookings (reference, idem_key, service_id, date, time, start_ms, end_ms, block_end_ms,
           name, email, whatsapp, purpose, heard_from, created_at,
           duration_minutes, mode, status, event_id, hold_until_ms, updated_ms, attempts)
         SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, 1
         WHERE NOT EXISTS (
           SELECT 1 FROM bookings WHERE ${activeAt('?20')} AND start_ms < ?8 AND block_end_ms > ?6
         )`,
      )
      .bind(
        b.reference, b.idem_key, b.service_id, b.date, b.time, b.start_ms, b.end_ms, b.block_end_ms,
        b.name, b.email, b.whatsapp, b.purpose, b.heard_from, b.created_at,
        b.duration_minutes, b.mode, b.status, b.event_id, b.hold_until_ms, nowMs,
      )
      .run();
    changes = res.meta.changes;
  } catch (err) {
    // Same idempotency key inserted concurrently.
    const raced = await findByIdemKey(db, b.idem_key);
    if (raced) return { status: 'duplicate_key', row: raced };
    throw err;
  }
  if (changes !== 1) return { status: 'conflict' };
  const created = await findByIdemKey(db, b.idem_key);
  if (!created) throw new Error('booking insert not readable');
  return { status: 'created', row: created };
}

/**
 * Re-takes the hold for an unfinished booking (failed or stale pending) being retried with the
 * same idempotency key — atomically, and only if no other active booking now overlaps it.
 */
export async function reclaim(db: D1Like, idemKey: string, nowMs: number, holdUntilMs: number): Promise<boolean> {
  const res = await db
    .prepare(
      `UPDATE bookings SET status = 'pending', hold_until_ms = ?3, attempts = attempts + 1, updated_ms = ?2, last_error = NULL
       WHERE idem_key = ?1 AND status != 'confirmed'
         AND NOT EXISTS (
           SELECT 1 FROM bookings AS o
           WHERE o.idem_key != ?1 AND ${activeAt('?2', 'o.')}
             AND o.start_ms < bookings.block_end_ms AND o.block_end_ms > bookings.start_ms
         )`,
    )
    .bind(idemKey, nowMs, holdUntilMs)
    .run();
  return res.meta.changes === 1;
}

const UPDATABLE = new Set([
  'status', 'event_link', 'meet_url', 'calendar_state', 'hold_until_ms', 'last_error', 'updated_ms',
]);

/** Updates whitelisted columns of one booking. */
export async function updateBooking(db: D1Like, reference: string, fields: Partial<Pick<BookingRow,
  'status' | 'event_link' | 'meet_url' | 'calendar_state' | 'hold_until_ms' | 'last_error' | 'updated_ms'>>) {
  const keys = Object.keys(fields).filter((k) => UPDATABLE.has(k));
  if (!keys.length) return;
  const sets = keys.map((k, i) => `${k} = ?${i + 2}`).join(', ');
  await db
    .prepare(`UPDATE bookings SET ${sets} WHERE reference = ?1`)
    .bind(reference, ...keys.map((k) => (fields as Record<string, unknown>)[k] ?? null))
    .run();
}

export type Recipient = 'owner' | 'booker';
const EMAIL_COL: Record<Recipient, string> = { owner: 'owner_email', booker: 'booker_email' };
const ISSUE_COL: Record<Recipient, string> = { owner: 'owner_email_issue', booker: 'booker_email_issue' };
/** A "sending" claim older than this is treated as abandoned (e.g. the worker was stopped). */
export const SENDING_STALE_MS = 2 * 60 * 1000;

/** Atomically claims one email for sending, so concurrent retries can't send it twice. */
export async function claimEmail(db: D1Like, reference: string, who: Recipient, nowMs: number): Promise<boolean> {
  const col = EMAIL_COL[who];
  const res = await db
    .prepare(
      `UPDATE bookings SET ${col} = 'sending', emails_updated_ms = ?2, email_attempts = email_attempts + 1
       WHERE reference = ?1 AND (${col} IN ('pending', 'failed') OR (${col} = 'sending' AND emails_updated_ms < ?3))`,
    )
    .bind(reference, nowMs, nowMs - SENDING_STALE_MS)
    .run();
  return res.meta.changes === 1;
}

export async function setEmailResult(db: D1Like, reference: string, who: Recipient, status: 'sent' | 'failed', issue: string | null) {
  await db
    .prepare(`UPDATE bookings SET ${EMAIL_COL[who]} = ?2, ${ISSUE_COL[who]} = ?3 WHERE reference = ?1`)
    .bind(reference, status, issue)
    .run();
}
