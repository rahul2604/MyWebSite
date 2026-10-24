/*
 * Read-only coaching booking overview for the administrator panel (GET /api/pmp/admin/bookings).
 * Only reachable through the admin router, which checks the administrator role in D1 on every
 * request. Never returns provider message ids, tokens or calendar event links.
 */
import { COACHING_SERVICES } from '../src/coaching/data/services.ts';
import { ensureSchema, type BookingRow, type D1Like } from './bookingStore.ts';
import type { NotificationRow } from './notifications.ts';

const ATTENTION = new Set(['failed']);

export async function listBookingsForAdmin(db: D1Like, nowMs: number, limit = 200) {
  await ensureSchema(db);
  const { results: rows } = await db
    .prepare(`SELECT * FROM bookings ORDER BY start_ms DESC LIMIT ?1`)
    .bind(limit)
    .all<BookingRow>();
  // A subquery rather than a list of references: D1 limits the number of bound parameters.
  const { results: notes } = await db
    .prepare(`SELECT * FROM booking_notifications WHERE reference IN (SELECT reference FROM bookings ORDER BY start_ms DESC LIMIT ?1)`)
    .bind(limit)
    .all<NotificationRow>();

  const note = (ref: string, kind: string) => {
    const n = notes.find((x) => x.reference === ref && x.kind === kind);
    return n
      ? {
          status: n.status,
          issue: n.issue,
          attempts: n.attempts,
          due: new Date(n.due_ms).toISOString(),
          sentAt: n.sent_ms ? new Date(n.sent_ms).toISOString() : null,
          withMeetingLink: n.has_meeting_link === 1,
          preview: n.preview,
        }
      : null;
  };

  const bookings = rows.map((r) => {
    const service = COACHING_SERVICES.find((s) => s.id === r.service_id);
    const confirmation = r.whatsapp_opt_in === 1 ? note(r.reference, 'confirmation') : null;
    const reminder = r.whatsapp_opt_in === 1 ? note(r.reference, 'reminder') : null;
    return {
      reference: r.reference,
      service: service?.title ?? r.service_id,
      free: service ? service.free === true : true,
      date: r.date,
      time: r.time,
      durationMinutes: r.duration_minutes,
      upcoming: r.start_ms > nowMs,
      status: r.status,
      mode: r.mode,
      name: r.name,
      email: r.email,
      whatsapp: r.whatsapp,
      meetingLinkAvailable: !!r.meet_url,
      emails: { owner: r.owner_email, booker: r.booker_email },
      whatsappOptIn: r.whatsapp_opt_in === 1,
      whatsappConfirmation: confirmation,
      whatsappReminder: reminder,
      needsAttention:
        r.owner_email === 'failed' || r.booker_email === 'failed' || ATTENTION.has(confirmation?.status ?? '') || ATTENTION.has(reminder?.status ?? ''),
      createdAt: r.created_at,
    };
  });
  return {
    bookings,
    totals: {
      bookings: bookings.length,
      upcoming: bookings.filter((b) => b.upcoming && b.status === 'confirmed').length,
      needsAttention: bookings.filter((b) => b.needsAttention).length,
    },
  };
}
