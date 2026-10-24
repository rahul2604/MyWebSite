/*
 * POST /api/notifications/run — sends due WhatsApp reminders and retries failed confirmations.
 *
 * Cloudflare Pages Functions only run on requests, so a separate scheduled Worker
 * (workers/reminder-cron) calls this every few minutes with
 *   Authorization: Bearer <NOTIFICATIONS_CRON_SECRET>
 * Without that secret configured the endpoint does not exist (404). The response holds counts
 * only — never names, numbers, links or provider details.
 */
import { ensureSchema } from '../../../server/bookingStore.ts';
import { clock } from '../../../server/clock.ts';
import type { Env } from '../../../server/env.ts';
import { fail, json } from '../../../server/http.ts';
import { runDueNotifications } from '../../../server/notifications.ts';
import { reminderMinutes, whatsappMode } from '../../../server/whatsapp.ts';

/** Constant-time comparison so the secret can't be guessed byte by byte from response timing. */
async function sameSecret(given: string, expected: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(given)), crypto.subtle.digest('SHA-256', enc.encode(expected))]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export const onRequest = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  const secret = env.NOTIFICATIONS_CRON_SECRET;
  if (!secret || secret.length < 24) return fail(404, 'not_found', 'Not found.');
  if (request.method !== 'POST') return fail(405, 'method', 'Method not allowed.', { Allow: 'POST' });
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ') || !(await sameSecret(auth.slice(7), secret))) return fail(401, 'unauthorized', 'Unauthorized.');
  if (!env.BOOKINGS_DB) return fail(503, 'not_configured', 'Not configured.');

  try {
    await ensureSchema(env.BOOKINGS_DB);
    const counts = await runDueNotifications(env, env.BOOKINGS_DB, clock.now().getTime());
    console.log('notifications: run', JSON.stringify(counts));
    return json(200, { ok: true, mode: whatsappMode(env), reminderMinutesBefore: reminderMinutes(env), ...counts });
  } catch (err) {
    console.error('notifications: run failed', err instanceof Error ? err.name : 'unknown');
    return fail(500, 'server', 'Run failed.');
  }
};
