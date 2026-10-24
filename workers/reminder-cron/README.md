# Reminder cron Worker

Cloudflare Pages Functions only run when a request arrives, so they cannot send a reminder at a
set time on their own. This tiny Worker runs on a Cron Trigger (every 5 minutes) and calls the
site's `POST /api/notifications/run`, which sends due WhatsApp reminders and retries failed
WhatsApp confirmations. All booking logic, data and WhatsApp credentials stay in the Pages project.

**Not deployed by default.** Deploying it creates a new Worker in the Cloudflare account, so it
needs the owner's approval.

## Setup (owner, after approval)

1. In the Pages project (`mywebsite`) add the secret `NOTIFICATIONS_CRON_SECRET` (a long random
   value, at least 24 characters), plus the WhatsApp variables listed in the main README.
2. Confirm the production domain and update `SITE_URL` in `wrangler.toml` if needed.
3. From this folder: `npx wrangler deploy`, then `npx wrangler secret put NOTIFICATIONS_CRON_SECRET`
   with the same value.
4. Check the Worker's logs in the dashboard: each run logs the HTTP status and counts only.

## Local test

With `npm run preview:pages` running and `NOTIFICATIONS_CRON_SECRET` set in `.dev.vars`:

```bash
curl -X POST http://localhost:8788/api/notifications/run -H "Authorization: Bearer <your local secret>"
```
