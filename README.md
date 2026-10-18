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
  assets/              portraits, hero skies, reel covers
```
