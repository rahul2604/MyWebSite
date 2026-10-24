# Rahul Mehra — Portfolio

React + TypeScript + Vite site for Revenue Strategy, Aviation and Project Management, with a PMP® learning platform
(`#pmp`), its administrator panel (`#admin`) and a free-call booking page (`#coaching`), served by Cloudflare Pages
with Pages Functions and D1.

## Develop

```bash
npm install
npm run dev
```

`npm run build` type-checks and writes the static site to `dist/`. `npm run preview` serves that build locally.

## Deploy to Cloudflare Pages

**Git-connected project** (Pages dashboard → Create → Connect to Git):

| Setting | Value |
| --- | --- |
| Framework preset | Vite (or None) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | from `.node-version` (22) |

**Direct upload:** `npm run build`, then `npx wrangler pages deploy` (reads `wrangler.toml`).

`public/_headers` sets long-lived caching on hashed assets and basic security headers. The site needs no server routing:
views live at `/#pmp`, `/#admin` and `/#coaching`. Pages serves `index.html` for unknown paths, so `/admin` also works
(the app rewrites it to `/#admin`); no `_redirects` file is needed.

## "Chat with Rahul" email delivery

The chat widget posts to a Cloudflare Pages Function, [`functions/api/contact.ts`](functions/api/contact.ts), which
emails each enquiry through [Resend](https://resend.com) to `rahul.a.mehra@gmail.com` with the visitor as Reply-To.
The widget shows "Message sent" only after Resend accepts the email.

**Environment variables** (Cloudflare Pages → your project → Settings → Variables and Secrets, for Production):

| Name | Type | Required | Value |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | Secret (encrypted) | Yes | Your Resend API key (`re_…`) |
| `CONTACT_TO_EMAIL` | Text | No | Recipient; defaults to `rahul.a.mehra@gmail.com` |
| `CONTACT_FROM_EMAIL` | Text | No | Sender; defaults to `Chat with Rahul <onboarding@resend.dev>` |

**Sender address.** Resend's shared `onboarding@resend.dev` sender works without any domain setup, but only delivers
to the email address that owns the Resend account — so sign up to Resend with `rahul.a.mehra@gmail.com`. To send from
your own domain instead, add the domain in Resend (a subdomain such as `send.rahulmehra.co.in` is recommended), add the
DNS records Resend shows in Cloudflare DNS, wait for "Verified", then set `CONTACT_FROM_EMAIL` to an address on it.

**Spam protection:** a hidden honeypot field, a minimum fill time, same-site origin check, a 16 KB body limit,
server-side validation, and a best-effort limit of 5 messages per visitor per 10 minutes. For a hard limit add a
Cloudflare rate-limiting rule for `/api/contact` (Security → WAF → Rate limiting).

**Run locally with the function:** copy `.dev.vars.example` to `.dev.vars`, set `RESEND_API_KEY`, then run
`npm run preview:pages` and open http://localhost:8788. (`npm run dev` / `npm run preview` serve the frontend only and
forward `/api` to :8788 when `preview:pages` is running.) On localhost the widget adds a developer note explaining any failure.

**Tests:** `npm test` runs the function and client tests with Resend mocked (no real email is sent).

**Updating the API key** (no code changes needed):

- *Local:* edit `RESEND_API_KEY` in `.dev.vars`, then stop and restart `npm run preview:pages`.
- *Production:* Cloudflare → Workers & Pages → project → Settings → Variables and Secrets → Production →
  edit `RESEND_API_KEY` (type Secret) → Save, then **redeploy** (Deployments → latest → Retry deployment, or push a
  commit) — running deployments keep the old value. CLI alternative after `npx wrangler login`:
  `npx wrangler pages secret put RESEND_API_KEY --project-name <your-pages-project>` (prompts for the value).
- To rotate safely: create the new key in Resend, update it in both places, test, then delete the old key in Resend.

**Diagnosing delivery:** the widget shows success only when Resend returns an email id; the function logs that id
(Cloudflare: Deployments → deployment → Functions → real-time logs; locally: the `preview:pages` terminal). Look the id
up in Resend → Emails to see delivered / bounced. "Accepted" is not the same as "in the inbox" — check Gmail (and Spam).

## Free-call bookings (`#coaching`)

Services with `booking: 'server'` in [`src/coaching/data/services.ts`](src/coaching/data/services.ts) (the
"Book a Free Call" ones) are booked through the server; the rest stay in-browser demos (nothing stored or sent).

**Modes** (`BOOKING_MODE`, server only — the browser is told which one is active):

- **`mock`** (default) — sample weekly hours from [`src/coaching/data/availability.ts`](src/coaching/data/availability.ts),
  D1 reservation, Resend emails labelled "demo booking", meeting link shared separately.
- **`live`** — those weekly hours minus Rahul's Google Calendar busy times; on booking, a Google Calendar event with a
  Google Meet link is created and the link is emailed. A booking is only shown as confirmed once the Meet link exists.

**Rules** (shared by browser and server): IST, the service's own duration (15 minutes for the free calls), 15-minute
buffer, 2-hour minimum notice, 30-day window.

**Endpoints** (`functions/api`, shared code in `server/`):

- `GET /api/availability?from&to&service` — bookable slots (live mode returns available slots only).
- `POST /api/bookings` — validates, holds the slot atomically in D1, (live) re-checks Google, creates the event with
  Meet, verifies the Meet URL, then emails owner and booker. The browser sends one idempotency key per confirmation:
  repeating it never creates a second booking or event; it resumes an unfinished booking or retries unsent emails.
- `GET /api/google/start`, `GET /api/google/callback` — one-time connection of Rahul's Google account (OAuth with
  PKCE). **Disabled (404) unless `GOOGLE_SETUP_ENABLED=true`.** Only `GOOGLE_CALENDAR_OWNER` can connect; the refresh
  token is stored AES-GCM-encrypted in D1 and never leaves the server.

**Environment** (Cloudflare Pages → Settings → Variables and Secrets / Bindings):

| Name | Type | Required | Value |
| --- | --- | --- | --- |
| `BOOKINGS_DB` | D1 binding | Yes | Bookings database (tables/columns are created automatically, additively) |
| `RESEND_API_KEY` | Secret | Yes | Shared with the contact form |
| `BOOKING_MODE` | Text | No | `mock` (default) or `live` |
| `BOOKING_OWNER_EMAIL` | Text | No | Defaults to `rahul.a.mehra@gmail.com` |
| `BOOKING_FROM_EMAIL` | Text | No | Defaults to `CONTACT_FROM_EMAIL`, else `onboarding@resend.dev` |
| `GOOGLE_CLIENT_ID` | Secret | Live | OAuth Web client ID |
| `GOOGLE_CLIENT_SECRET` | Secret | Live | OAuth Web client secret |
| `GOOGLE_TOKEN_ENCRYPTION_KEY` | Secret | Live | 32 random bytes, base64 (separate key per environment) |
| `GOOGLE_SETUP_ENABLED` | Text | No | `true` only while connecting Google, then remove or set `false` |
| `GOOGLE_CALENDAR_OWNER` | Text | No | Defaults to `rahul.a.mehra@gmail.com` |
| `GOOGLE_INVITE_EMAILS` | Text | No | `true` = Google also sends its own invite to the booker |

**Connect Google (once per environment):** set the Google secrets and `GOOGLE_SETUP_ENABLED=true`, open
`/api/google/start` on that origin (`http://localhost:8788` locally, `https://rahulmehra.co.in` in production), sign
in as the owner and allow access, wait for "Google Calendar connected", then turn `GOOGLE_SETUP_ENABLED` off.
Redirect URIs registered in Google Cloud must be exactly `http://localhost:8788/api/google/callback` and
`https://rahulmehra.co.in/api/google/callback`.

**D1 setup:** the `BOOKINGS_DB` binding is declared in `wrangler.toml` (database `rahul-site-db`); see
"Production D1 binding" below.
To view bookings: D1 → the database → Console →
`SELECT reference, date, time, name, status, meet_url, owner_email, booker_email FROM bookings ORDER BY start_ms;`

**Sender for booker emails:** `onboarding@resend.dev` only delivers to the Resend account owner, so booker emails
to anyone else are rejected (the booking is kept and the page offers "Send email again"). Verify a domain in Resend
(e.g. `send.rahulmehra.co.in`), add its DNS records in Cloudflare, then set `BOOKING_FROM_EMAIL`.

**Local:** copy `.dev.vars.example` to `.dev.vars`, then `npm run preview:pages` (site + functions + local D1 in
`.wrangler/`). **Tests:** `npm test` — Google and Resend are faked; any other network call fails the test.

## Free services

Every service in [`src/coaching/data/services.ts`](src/coaching/data/services.ts) is free (`price: 'Free'`,
`free: true`) and booked through the server. There is no payment integration: `/api/bookings` only books services
marked `free: true`, ignores any price fields in a request, and returns `booking.free: true`. Topmate still lists
the mock interview at a price; this site intentionally offers it free.

## WhatsApp confirmations and reminders

Bookers can tick an **opt-in** (unticked by default) to receive a WhatsApp confirmation and a reminder before the
session on the number they entered. Messages go through Meta's official **WhatsApp Cloud API** with approved
templates ([`server/whatsapp.ts`](server/whatsapp.ts)); the workflow is in
[`server/notifications.ts`](server/notifications.ts).

- **Confirmation**: sent only after the booking is confirmed in D1 (live mode: only once the verified Meet link
  exists, and the link is included; mock mode: the message says the link will be shared separately).
- **Reminder**: `REMINDER_MINUTES_BEFORE` (default 30) before the start. Never scheduled in the past, never sent for
  bookings that are no longer confirmed, never after the session has started.
- **No duplicates**: one row per booking and message type in `booking_notifications` (created automatically and
  additively, like the rest of the schema); every send is atomically claimed first. Failed sends are retried (60 s
  apart, at most 5 attempts) and never affect the booking.
- **Status**: pending · sent (WhatsApp *accepted* it — not proof of delivery) · failed · simulated · skipped (with a
  reason). The booker sees the confirmation status; the admin panel's **Coaching bookings** page shows everything.
- **Modes** (`WHATSAPP_MODE`): `off` (default), `simulate` (local: recorded and printed with a masked number, never
  sent), `live`.

**Scheduling.** Pages Functions only run on requests, so a separate Worker,
[`workers/reminder-cron`](workers/reminder-cron/README.md), calls `POST /api/notifications/run` every 5 minutes with
`Authorization: Bearer <NOTIFICATIONS_CRON_SECRET>`. It is **not deployed** yet; deploying it is an owner step.

**Production setup (owner):**

1. A WhatsApp Business Account and a business phone number in Meta's WhatsApp Manager; note its **Phone number ID**.
2. A permanent **system-user access token** with `whatsapp_business_messaging` permission.
3. Two **Utility** templates approved in WhatsApp Manager, each with six body variables — suggested text is in the
   header comment of `server/whatsapp.ts` (`booking_confirmation`, `booking_reminder`).
4. Cloudflare Pages → Settings → Variables and Secrets (Production): `WHATSAPP_MODE=live`,
   `WHATSAPP_PHONE_NUMBER_ID`, secrets `WHATSAPP_ACCESS_TOKEN` and `NOTIFICATIONS_CRON_SECRET`; optional template
   names, language, `WHATSAPP_GRAPH_VERSION`, `REMINDER_MINUTES_BEFORE`. Redeploy.
5. Deploy `workers/reminder-cron` with the same `NOTIFICATIONS_CRON_SECRET`.

**Local:** set `WHATSAPP_MODE=simulate` (and `EMAIL_DELIVERY=off` if you have no Resend key) in `.dev.vars`, run
`npm run preview:pages`, book with the opt-in ticked, and read the simulated message in the terminal or in
`#admin` → Coaching bookings. Tests fake the WhatsApp API; any real network call fails a test.

## Support / FAQ

One FAQ, two places: the **Support** page (`#support`, linked from the header and footer) and **Help & FAQs** inside
the course (`#pmp/support`, linked from the course menu and the sign-in page; it also works when signed out).
Content lives only in [`src/support/faqData.ts`](src/support/faqData.ts); the component is
[`src/support/SupportFaq.tsx`](src/support/SupportFaq.tsx) (search, topic filters, accessible accordion). A WhatsApp
support button appears only if `SUPPORT_WHATSAPP_NUMBER` in `src/data.ts` is set to a confirmed support number.

## PMP learning platform (`#pmp`) and administrator panel (`#admin`)

### What it is

- **Learners** sign up with email and password, then work through 18 modules (69 lessons), a knowledge check per
  module, two mock tests and a final assessment, and receive a verifiable course certificate (not a PMI credential).
- **The administrator** (`rahul.a.mehra@gmail.com`) signs in at `/admin` (or `/#admin`) and can open every module,
  lesson and assessment, see answers and explanations, preview the learner experience, edit lessons and questions as
  drafts and publish them, view source coverage and learner progress, and read an audit log.

### Prerequisites and local development

- Node with built-in TypeScript support for the scripts and tests (22.18+ or 23.6+), npm, and Wrangler (a dev
  dependency).

```bash
npm install
cp .dev.vars.example .dev.vars        # fill in local values; never commit .dev.vars
npm run preview:pages                 # builds, then serves site + Functions + local D1 on http://localhost:8788
```

- Main site: `http://localhost:8788/` · learner area: `http://localhost:8788/#pmp` · admin: `http://localhost:8788/admin`
- `npm run dev` (Vite on :5173) proxies `/api` to `:8788`, so run `npm run preview:pages` alongside it when you need
  the API with hot reload.
- The local D1 database lives in `.wrangler/` (git-ignored). Delete `.wrangler/state` to start from an empty database.

### Authentication and roles

- Passwords are hashed with **PBKDF2-SHA-256, 100,000 iterations, 16-byte random salt per user** (Web Crypto).
  Argon2id or bcrypt would need a WASM or pure-JS library in Workers, and pure-JS bcrypt is slow enough to risk
  Workers CPU limits; 100,000 is the highest PBKDF2 iteration count Cloudflare Workers accepts. This is below OWASP's
  current PBKDF2 recommendation (600,000), so use a long administrator password (the admin policy requires 14+
  characters).
- Sessions: a random 32-byte token in an `HttpOnly`, `SameSite=Lax` cookie scoped to `/api/pmp`, `Secure` everywhere
  except plain-http localhost. Only the token's SHA-256 hash is stored. Learner sessions last 30 days, administrator
  sessions 12 hours. Changing a password signs out every other session.
- CSRF: every state-changing request must be same-origin (checked against `Origin`), have a JSON body, and carry the
  `SameSite=Lax` cookie.
- Brute force: per-IP rate limits on sign-in and sign-up, a 15-minute account lockout after 8 failed attempts, and one
  generic error message for unknown email and wrong password.
- **Roles live only in D1** (`pmp_users.role`, `learner` by default). The server reads the role from the database on
  every request; nothing in the browser (local storage, URL, request body) can grant it. `/api/pmp/admin/*` returns 401
  when signed out and 403 for learners.
- **Admins bypass progression, not security.** For an admin, every lesson and assessment is readable regardless of
  progress, but the learner write endpoints (complete a lesson, start or submit an attempt, issue a certificate) refuse
  admin accounts. Assessment previews use `/api/pmp/admin/preview/*`, which scores without storing anything. Viewing
  never marks anything complete.
- Learners are unchanged: lessons, checks, mocks, the final and certificates unlock only by the server rules in
  `server/pmp/engine.ts`, including for direct URL and API requests (covered by `tests/pmp.test.ts` and
  `tests/pmp-admin.test.ts`).

### Creating the administrator account (bootstrap)

The admin account is created the first time someone signs in with the admin email **and** the one-time secret
`PMP_ADMIN_BOOTSTRAP_PASSWORD`. The secret is read only on the server, is never in source code or the browser, and
stops working as soon as an administrator account exists for that email.

1. Set `PMP_ADMIN_BOOTSTRAP_PASSWORD`: locally in `.dev.vars`; in production as an encrypted **secret** with a strong
   random value (not the local temporary password, and not a password you use anywhere else).
2. Open `/admin` and sign in with the admin email and that secret.
3. Set your own password (14+ characters, letters and numbers, not the temporary one). Nothing else works until you
   do, and other sessions are signed out.
4. Remove `PMP_ADMIN_BOOTSTRAP_PASSWORD` from the environment.

The admin email is reserved: it cannot be used to register a learner account. If a learner account already exists
with that email, the bootstrap promotes it to admin and replaces its password. Bootstrap, admin sign-ins, password
changes and content edits are recorded in `pmp_audit` (never with passwords or tokens).

### Environment variables

| Name | Type | Default | Purpose |
| --- | --- | --- | --- |
| `PMP_DB` | D1 binding | falls back to `BOOKINGS_DB` | Database for the PMP platform. Not bound in production: the platform uses `BOOKINGS_DB` (`rahul-site-db`); its tables all start with `pmp_`, so they never touch booking data. If neither is bound, `/api/pmp/*` returns 503. |
| `PMP_SIGNUP_OPEN` | Text | open | `false` closes new learner registrations (existing learners and the admin can still sign in). Any other value, or unset, leaves sign-up open. |
| `PMP_ADMIN_EMAIL` | Text | `rahul.a.mehra@gmail.com` | The only email that can be bootstrapped as administrator; reserved from learner sign-up. |
| `PMP_ADMIN_BOOTSTRAP_PASSWORD` | Secret | unset | One-time bootstrap secret (10+ characters). Remove it after the first sign-in. |

Pointing `PMP_DB` at a different, empty database later hides the learners, progress, certificates and admin edits in
the old one; copy the `pmp_*` tables across first.

### Database and migrations

The schema is created and migrated **automatically and additively** on first use (`ensurePmpSchema` in
`server/pmp/store.ts`): `CREATE TABLE IF NOT EXISTS` for `pmp_users`, `pmp_sessions`, `pmp_lesson_progress`,
`pmp_attempts`, `pmp_certificates`, `pmp_content_overrides` and `pmp_audit`, and `ALTER TABLE … ADD COLUMN` for
columns added later (`role`, `must_change_password`, `password_changed_ms`). Nothing is dropped or rewritten, and
existing learner accounts and sessions keep working. There is no separate migration command.

### Production D1 binding

`wrangler.toml` is the source of truth for the Pages project (`mywebsite`) and binds one D1 database,
`rahul-site-db`, as `BOOKINGS_DB`. Bookings and the PMP platform share it (PMP tables are prefixed `pmp_`), so
`PMP_DB` does not need to be bound. Git-connected builds and `wrangler pages deploy` both read this binding, and
`wrangler pages dev` uses a local copy in `.wrangler/` (never the production data).

- To use a separate database for the PMP platform: `npx wrangler d1 create <name>`, then add a second
  `[[d1_databases]]` entry with `binding = "PMP_DB"` and its `database_name` and `database_id`, commit and deploy.
- Secrets are not in `wrangler.toml`. Set them with
  `npx wrangler pages secret put <NAME> --project-name mywebsite` (or in the dashboard): `RESEND_API_KEY`,
  `PMP_ADMIN_BOOTSTRAP_PASSWORD`, and the Google secrets if `BOOKING_MODE=live`.
- Check after deploying: `npx wrangler d1 execute rahul-site-db --remote --command "SELECT name FROM sqlite_master WHERE name LIKE 'pmp_%'"`
  (the tables appear after the first request to `/api/pmp/*`).

### Curriculum artifacts

| Path | What it is |
| --- | --- |
| `server/pmp/content/m00.ts` … `m17.ts`, `mock1.ts`, `mock2.ts`, `final.ts` | Authored lessons and questions (server only; answers never reach the browser bundle) |
| `server/pmp/sourceMap.ts`, `server/pmp/sourceStats.ts` | Generated topic → page references and source-processing summary |
| `docs/pmp-curriculum/page-processing-manifest.json` | One record per PDF page (976) |
| `docs/pmp-curriculum/source-index.json`, `topic-catalogue.json`, `process-map.json`, `ittos.json` | Source index, topics, the 49-process map, ITTOs |
| `docs/pmp-curriculum/topic-coverage-matrix.json`, `content-stats.json` | Generated coverage and statistics |
| `docs/pmp-curriculum/*.md` | Curriculum outline, source review, assessment coverage, completion and six-phase handover reports |

Admin edits are stored in D1 (`pmp_content_overrides`) as drafts and published versions layered on the authored files;
"Restore original" removes a published edit. Edits cannot add or remove lessons or questions, and page references come
only from catalogue topics. The reports describe the authored content, not D1 edits.

### Tests and validation

```bash
npm run typecheck     # app + server TypeScript
npm test              # all tests (D1 is real in-memory SQLite; Google and Resend are faked)
npm run build         # production build
npm run pmp:check     # content validation, source stats and the five reports
```

### Deploying (only after approval)

1. Merge the reviewed pull request into `main` (a Git-connected Pages project then builds and deploys), or run
   `npm run build && npx wrangler pages deploy` for a direct upload.
2. Set `PMP_ADMIN_BOOTSTRAP_PASSWORD` (secret) and, if wanted, bind `PMP_DB`; bootstrap the admin account, then remove
   the secret.
3. Verify `/#pmp` sign-up and a lesson, `/admin` sign-in, and a `/#pmp/verify/…` link on the production URL.

## Editing content

All lists live in [`src/data.ts`](src/data.ts):

- `LINKEDIN_POSTS`, `BOOK_POSTS` — blog carousels (newest first)
- `REELS` — Instagram reels; `code` is the part after `/reel/` in the link, `cover` is an image in `src/assets/`
- `WHATSAPP_NUMBER` — the WhatsApp contact tile appears when this has 10+ digits

Theme colours for dark and light mode are the tokens at the top of [`src/styles.css`](src/styles.css).

## Structure

```
src/
  App.tsx              page layout, home ⇄ PMP ⇄ admin ⇄ coaching view switch
  hooks/useTheme.ts    dark/light theme, remembered in localStorage
  hooks/useHashView.ts #pmp / #admin / #coaching views + section scrolling
  components/          Header, Hero, About, Services, Blog, Contact, Footer, Icons
  pmp/                 PMP learner interface (#pmp)
  admin/               administrator panel (#admin)
  coaching/            Strategy & Coaching booking (#coaching)
  contact/             "Chat with Rahul" widget and contact API client
  assets/              portraits, hero skies, reel covers
functions/
  api/contact.ts       Cloudflare Pages Function that emails enquiries via Resend
  api/pmp/[[path]].ts  PMP platform API (/api/pmp/*), implemented in server/pmp/
server/pmp/            auth, D1 store, unlock engine, scoring, admin API, course content, certificate PDF
docs/pmp-curriculum/   source-processing artifacts and the curriculum reports
scripts/               content validation, source stats and report generators
```
