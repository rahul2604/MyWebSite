/*
 * Scheduled companion Worker for the Pages site: every few minutes it asks the site to send due
 * WhatsApp reminders (and retry failed confirmations) by calling POST /api/notifications/run.
 *
 * It holds no booking data and no WhatsApp credentials; it only knows the site URL and the shared
 * NOTIFICATIONS_CRON_SECRET. Deploying it is a separate, owner-approved production step — see
 * workers/reminder-cron/README.md.
 */
export default {
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(run(env));
  },
};

async function run(env) {
  if (!env.SITE_URL || !env.NOTIFICATIONS_CRON_SECRET) {
    console.error('reminder-cron: SITE_URL or NOTIFICATIONS_CRON_SECRET is not set');
    return;
  }
  const res = await fetch(new URL('/api/notifications/run', env.SITE_URL), {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.NOTIFICATIONS_CRON_SECRET}` },
  });
  const body = await res.text();
  // Counts only (the endpoint never returns personal data).
  console.log('reminder-cron:', res.status, body.slice(0, 300));
}
