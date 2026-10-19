# Rahul Mehra — Portfolio

React + TypeScript + Vite site for Revenue Strategy, Aviation and Project Management, with a PMP® Learning Path prototype.

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
the PMP® Learning Path lives at `/#pmp`, so no `_redirects` file is needed.

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

## Editing content

All lists live in [`src/data.ts`](src/data.ts):

- `LINKEDIN_POSTS`, `BOOK_POSTS` — blog carousels (newest first)
- `REELS` — Instagram reels; `code` is the part after `/reel/` in the link, `cover` is an image in `src/assets/`
- `PMP_MODULES` — learning-path module titles
- `WHATSAPP_NUMBER` — the WhatsApp contact tile appears when this has 10+ digits

Theme colours for dark and light mode are the tokens at the top of [`src/styles.css`](src/styles.css).

## Structure

```
src/
  App.tsx              page layout, home ⇄ PMP view switch
  hooks/useTheme.ts    dark/light theme, remembered in localStorage
  hooks/useHashView.ts #pmp view + section scrolling
  components/          Header, Hero, About, Services, PmpPath, Blog, Contact, Footer, Icons
  lib/certificate.ts   sample certificate SVG generator
  coaching/            Strategy & Coaching booking prototype (#coaching)
  contact/             "Chat with Rahul" widget and contact API client
  assets/              portraits, hero skies, reel covers
functions/
  api/contact.ts       Cloudflare Pages Function that emails enquiries via Resend
```
