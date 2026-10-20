/*
 * GET /api/google/start — begins the one-time authorization of the owner's Google Calendar.
 *
 * Disabled (404) unless GOOGLE_SETUP_ENABLED=true. Only works on the two registered
 * origins (https://rahulmehra.co.in, http://localhost:8788) so the redirect URI matches
 * Google Cloud Console exactly. Sets a signed, HttpOnly, 10-minute state/PKCE cookie.
 */
import { clock } from '../../../server/clock.ts';
import { calendarOwner, type Env } from '../../../server/env.ts';
import { buildAuthUrl, googleConfig } from '../../../server/google.ts';
import { beginOAuth, redirectUriFor, resultPage } from '../../../server/oauth.ts';

export const onRequest = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  if (env.GOOGLE_SETUP_ENABLED !== 'true') return resultPage(404, 'Not found', 'This page is not available.');
  if (request.method !== 'GET') return resultPage(405, 'Method not allowed', 'Use GET.', { Allow: 'GET' });

  const redirectUri = redirectUriFor(request.url);
  if (!redirectUri) {
    return resultPage(400, 'Wrong address', 'Open this page on https://rahulmehra.co.in (or http://localhost:8788 when testing locally).');
  }
  const cfg = googleConfig(env);
  if (!cfg) {
    return resultPage(503, 'Google is not configured', 'GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and a 32-byte GOOGLE_TOKEN_ENCRYPTION_KEY must be set.');
  }
  if (!env.BOOKINGS_DB) return resultPage(503, 'Database is not configured', 'The BOOKINGS_DB binding is required to store the connection.');

  const secure = new URL(request.url).protocol === 'https:';
  const { state, challenge, cookie } = await beginOAuth(cfg.key, clock.now().getTime(), secure);
  return new Response(null, {
    status: 302,
    headers: {
      Location: buildAuthUrl(cfg, redirectUri, state, challenge, calendarOwner(env)),
      'Set-Cookie': cookie,
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
    },
  });
};
