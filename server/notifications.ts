/*
 * WhatsApp booking notifications: one confirmation and one reminder per opted-in booking.
 *
 * Rows live in booking_notifications (see bookingStore.ts). The primary key (reference, kind,
 * channel) means a booking can never get two confirmations or two reminders, and every send is
 * claimed atomically first (status "sending"), so concurrent retries can't both send.
 *
 *   planned when the booking is CONFIRMED (never before): confirmation due now, reminder due
 *     REMINDER_MINUTES_BEFORE (default 30) before the start — skipped if that is already past
 *   confirmation: sent right after the booking response is ready (failures never undo the booking)
 *   reminder + retries: POST /api/notifications/run, called every few minutes by the cron worker
 *
 * Statuses: pending · sending · sent (provider accepted it) · failed (will be retried, up to
 * MAX_ATTEMPTS) · simulated (WHATSAPP_MODE=simulate, nothing sent) · skipped (with an issue:
 * disabled, not_configured, too_late, expired, booking_not_confirmed, max_attempts).
 */
import { COACHING_SERVICES } from '../src/coaching/data/services.ts';
import { formatDateLong, formatSlot } from '../src/coaching/lib/dates.ts';
import type { BookingRow, D1Like } from './bookingStore.ts';
import type { Env } from './env.ts';
import {
  maskNumber, reminderMinutes, sendTemplate, templateParams, templatePreview, whatsappConfig, whatsappMode,
  type MessageFacts, type NotificationKind,
} from './whatsapp.ts';

export type NotificationStatus = 'pending' | 'sending' | 'sent' | 'failed' | 'simulated' | 'skipped';

export interface NotificationRow {
  reference: string;
  kind: NotificationKind;
  channel: 'whatsapp';
  status: NotificationStatus;
  due_ms: number;
  attempts: number;
  provider_message_id: string | null;
  issue: string | null;
  has_meeting_link: number;
  preview: string | null;
  created_ms: number;
  updated_ms: number;
  sent_ms: number | null;
}

export const MAX_ATTEMPTS = 5;
/** Wait at least this long before retrying a failed message. */
export const RETRY_GAP_MS = 60 * 1000;
/** A "sending" claim older than this is treated as abandoned. */
export const SENDING_STALE_MS = 2 * 60 * 1000;
const MEET_RE = /^https:\/\/meet\.google\.com\/[a-z0-9-]+$/i;

/** The booking's verified meeting link, or null (mock mode has none; live mode only once confirmed). */
export const meetingLink = (row: Pick<BookingRow, 'mode' | 'meet_url' | 'status'>) =>
  row.mode === 'live' && row.status === 'confirmed' && row.meet_url && MEET_RE.test(row.meet_url) ? row.meet_url : null;

function facts(row: BookingRow): MessageFacts {
  const service = COACHING_SERVICES.find((s) => s.id === row.service_id);
  const minutes = row.duration_minutes ?? service?.durationMinutes ?? 15;
  return {
    firstName: row.name.trim().split(/\s+/)[0] || row.name,
    serviceTitle: service?.title ?? 'your session',
    dateLabel: formatDateLong(row.date),
    timeLabel: `${formatSlot(row.time, minutes)} IST`,
    meetingUrl: meetingLink(row),
    reference: row.reference,
  };
}

export async function getNotifications(db: D1Like, reference: string) {
  const { results } = await db.prepare(`SELECT * FROM booking_notifications WHERE reference = ?1`).bind(reference).all<NotificationRow>();
  return results;
}

async function setSkipped(db: D1Like, reference: string, kind: NotificationKind, issue: string, nowMs: number) {
  await db
    .prepare(`UPDATE booking_notifications SET status = 'skipped', issue = ?3, updated_ms = ?4 WHERE reference = ?1 AND kind = ?2 AND status != 'sent'`)
    .bind(reference, kind, issue, nowMs)
    .run();
}

/**
 * Creates the confirmation and reminder rows for a confirmed, opted-in booking. Safe to repeat
 * (INSERT OR IGNORE): an existing row, whatever its status, is never replaced.
 */
export async function planNotifications(env: Env, db: D1Like, row: BookingRow, nowMs: number): Promise<void> {
  if (row.status !== 'confirmed' || row.whatsapp_opt_in !== 1) return;
  const mode = whatsappMode(env);
  const blocked = mode === 'off' ? 'disabled' : mode === 'live' && !whatsappConfig(env) ? 'not_configured' : null;
  const reminderDue = row.start_ms - reminderMinutes(env) * 60_000;
  const insert = (kind: NotificationKind, due: number, issue: string | null) =>
    db
      .prepare(
        `INSERT OR IGNORE INTO booking_notifications (reference, kind, channel, status, due_ms, issue, created_ms, updated_ms)
         VALUES (?1, ?2, 'whatsapp', ?3, ?4, ?5, ?6, ?6)`,
      )
      .bind(row.reference, kind, issue ? 'skipped' : 'pending', due, issue, nowMs)
      .run();
  await insert('confirmation', nowMs, blocked);
  // Never schedule a reminder in the past (or once the session has started).
  await insert('reminder', reminderDue, blocked ?? (reminderDue <= nowMs ? 'too_late' : null));
}

/** Atomically claims one due message for sending. */
async function claim(db: D1Like, reference: string, kind: NotificationKind, nowMs: number): Promise<boolean> {
  const res = await db
    .prepare(
      `UPDATE booking_notifications SET status = 'sending', attempts = attempts + 1, updated_ms = ?3
       WHERE reference = ?1 AND kind = ?2 AND channel = 'whatsapp' AND due_ms <= ?3 AND attempts < ?4
         AND (status = 'pending' OR (status = 'failed' AND updated_ms <= ?5) OR (status = 'sending' AND updated_ms < ?6))`,
    )
    .bind(reference, kind, nowMs, MAX_ATTEMPTS, nowMs - RETRY_GAP_MS, nowMs - SENDING_STALE_MS)
    .run();
  return res.meta.changes === 1;
}

async function record(db: D1Like, reference: string, kind: NotificationKind, fields: { status: NotificationStatus; issue: string | null; id?: string | null; preview?: string | null; link: boolean; nowMs: number }) {
  await db
    .prepare(
      `UPDATE booking_notifications SET status = ?3, issue = ?4, provider_message_id = COALESCE(?5, provider_message_id),
         preview = COALESCE(?6, preview), has_meeting_link = ?7, updated_ms = ?8,
         sent_ms = CASE WHEN ?3 IN ('sent', 'simulated') THEN ?8 ELSE sent_ms END
       WHERE reference = ?1 AND kind = ?2`,
    )
    .bind(reference, kind, fields.status, fields.issue, fields.id ?? null, fields.preview ?? null, fields.link ? 1 : 0, fields.nowMs)
    .run();
}

/**
 * Sends one message for a booking if it is due and claimable. Never throws: a failure is recorded
 * on the notification row and the booking itself is never touched.
 */
export async function deliver(env: Env, db: D1Like, row: BookingRow, kind: NotificationKind, nowMs: number): Promise<NotificationStatus | null> {
  try {
    if (row.whatsapp_opt_in !== 1) return null;
    if (row.status !== 'confirmed') {
      await setSkipped(db, row.reference, kind, 'booking_not_confirmed', nowMs);
      return 'skipped';
    }
    if (row.start_ms <= nowMs) {
      await setSkipped(db, row.reference, kind, 'expired', nowMs); // never message after the session has started
      return 'skipped';
    }
    if (!(await claim(db, row.reference, kind, nowMs))) return null;

    const mode = whatsappMode(env);
    const f = facts(row);
    const preview = templatePreview(kind, f);
    const link = !!f.meetingUrl;
    if (mode === 'off') {
      await record(db, row.reference, kind, { status: 'skipped', issue: 'disabled', link, nowMs });
      return 'skipped';
    }
    if (mode === 'simulate') {
      await record(db, row.reference, kind, { status: 'simulated', issue: null, preview, link, nowMs });
      console.log(`whatsapp [SIMULATED — nothing sent] ${kind} ${row.reference} to ${maskNumber(row.whatsapp)}:\n${preview}`);
      return 'simulated';
    }
    const config = whatsappConfig(env);
    if (!config) {
      await record(db, row.reference, kind, { status: 'skipped', issue: 'not_configured', link, nowMs });
      return 'skipped';
    }
    const result = await sendTemplate(config, row.whatsapp, kind, templateParams(f));
    if (result.ok) {
      await record(db, row.reference, kind, { status: 'sent', issue: null, id: result.id, preview, link, nowMs });
      console.log('whatsapp: accepted', kind, row.reference);
      return 'sent';
    }
    const last = (await getNotifications(db, row.reference)).find((n) => n.kind === kind);
    const exhausted = (last?.attempts ?? MAX_ATTEMPTS) >= MAX_ATTEMPTS;
    await record(db, row.reference, kind, { status: exhausted ? 'skipped' : 'failed', issue: exhausted ? `max_attempts:${result.code}` : result.code, preview, link, nowMs });
    return exhausted ? 'skipped' : 'failed';
  } catch (err) {
    console.error('whatsapp: notification step failed', row.reference, kind, err instanceof Error ? err.name : 'unknown');
    return null;
  }
}

/** Plans (if needed) and sends the confirmation for a just-confirmed booking. Never throws. */
export async function notifyConfirmed(env: Env, db: D1Like, row: BookingRow, nowMs: number): Promise<void> {
  try {
    await planNotifications(env, db, row, nowMs);
    await deliver(env, db, row, 'confirmation', nowMs);
  } catch (err) {
    console.error('whatsapp: could not plan notifications', row.reference, err instanceof Error ? err.name : 'unknown');
  }
}

/**
 * The scheduled run (POST /api/notifications/run): closes out messages that can no longer be sent,
 * then sends every due reminder and retries failed confirmations. Returns counts only.
 */
export async function runDueNotifications(env: Env, db: D1Like, nowMs: number, limit = 50) {
  const open = `status IN ('pending', 'failed', 'sending')`;
  // Bookings that are no longer confirmed (e.g. cancelled) get no further messages.
  await db
    .prepare(`UPDATE booking_notifications SET status = 'skipped', issue = 'booking_not_confirmed', updated_ms = ?1
              WHERE ${open} AND reference IN (SELECT reference FROM bookings WHERE status != 'confirmed')`)
    .bind(nowMs)
    .run();
  // Nothing is sent once the session has started.
  await db
    .prepare(`UPDATE booking_notifications SET status = 'skipped', issue = 'expired', updated_ms = ?1
              WHERE ${open} AND reference IN (SELECT reference FROM bookings WHERE start_ms <= ?1)`)
    .bind(nowMs)
    .run();
  await db
    .prepare(`UPDATE booking_notifications SET status = 'skipped', issue = 'max_attempts', updated_ms = ?1 WHERE ${open} AND attempts >= ?2`)
    .bind(nowMs, MAX_ATTEMPTS)
    .run();

  const { results } = await db
    .prepare(
      `SELECT n.kind AS n_kind, b.* FROM booking_notifications AS n JOIN bookings AS b ON b.reference = n.reference
       WHERE n.channel = 'whatsapp' AND n.status IN ('pending', 'failed', 'sending') AND n.due_ms <= ?1
         AND b.status = 'confirmed' AND b.start_ms > ?1 AND b.whatsapp_opt_in = 1
       ORDER BY n.due_ms LIMIT ?2`,
    )
    .bind(nowMs, limit)
    .all<BookingRow & { n_kind: NotificationKind }>();

  const counts: Record<string, number> = { due: results.length, sent: 0, simulated: 0, failed: 0, skipped: 0, notClaimed: 0 };
  for (const r of results) {
    const outcome = await deliver(env, db, r, r.n_kind, nowMs);
    counts[outcome && outcome !== 'pending' && outcome !== 'sending' ? outcome : 'notClaimed']++;
  }
  return counts;
}

/** What the booker's browser may see about the confirmation message: a status and a safe reason. */
export function publicWhatsappStatus(row: Pick<BookingRow, 'whatsapp_opt_in'>, notes: NotificationRow[]) {
  if (row.whatsapp_opt_in !== 1) return { confirmation: 'not_requested' as const };
  const c = notes.find((n) => n.kind === 'confirmation');
  const r = notes.find((n) => n.kind === 'reminder');
  const pub = (n?: NotificationRow) => (!n ? 'pending' : n.status === 'sending' ? 'pending' : n.status);
  const reason = (n?: NotificationRow) => (n?.status === 'skipped' || n?.status === 'failed' ? (n.issue ?? '').split(':')[0] || undefined : undefined);
  return {
    confirmation: pub(c),
    ...(reason(c) ? { confirmationReason: reason(c) } : {}),
    reminder: pub(r),
    ...(r && r.status !== 'skipped' ? { reminderAt: new Date(r.due_ms).toISOString() } : {}),
    ...(reason(r) ? { reminderReason: reason(r) } : {}),
  };
}
