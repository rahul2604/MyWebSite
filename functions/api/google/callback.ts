/*
 * GET /api/google/callback — Google redirects here after the owner approves (or denies) access.
 *
 * Disabled (404) unless GOOGLE_SETUP_ENABLED=true. Checks, in order:
 *   registered origin → Google error/denial → code & state present → signed, unexpired state
 *   cookie matching `state` → server-side code exchange (client secret + PKCE) → ID token is for
 *   this client, unexpired, with a VERIFIED email equal to the calendar owner → both calendar
 *   scopes granted → refresh token present.
 * Only then is the refresh token encrypted (AES-256-GCM) and stored in D1. The response page
 * never contains tokens; the state cookie is always cleared.
 */
import { clock } from '../../../server/clock.ts';
import { encryptSecret } from '../../../server/crypto.ts';
import { calendarOwner, type Env } from '../../../server/env.ts';
import { exchangeCode, googleConfig, GoogleError, REQUIRED_CALENDAR_SCOPES, resetGoogleTokenCache } from '../../../server/google.ts';
import { saveGoogleAuth, tokenContext } from '../../../server/googleAuthStore.ts';
import { checkState, clearStateCookie, idTokenClaims, readCookie, redirectUriFor, resultPage, STATE_COOKIE } from '../../../server/oauth.ts';

const ISSUERS = new Set(['https://accounts.google.com', 'accounts.google.com']);

export const onRequest = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  if (env.GOOGLE_SETUP_ENABLED !== 'true') return resultPage(404, 'Not found', 'This page is not available.');
  if (request.method !== 'GET') return resultPage(405, 'Method not allowed', 'Use GET.', { Allow: 'GET' });

  const url = new URL(request.url);
  const secure = url.protocol === 'https:';
  const done = (status: number, title: string, message: string) =>
    resultPage(status, title, message, { 'Set-Cookie': clearStateCookie(secure) });

  const redirectUri = redirectUriFor(request.url);
  if (!redirectUri) return done(400, 'Wrong address', 'This callback only works on the registered addresses.');

  const cfg = googleConfig(env);
  if (!cfg || !env.BOOKINGS_DB) return done(503, 'Not configured', 'Google credentials, the encryption key or the database binding are missing.');

  // The owner cancelled, or Google reported an error. The raw value is never echoed back.
  const googleError = url.searchParams.get('error');
  if (googleError) {
    console.warn('google-oauth: authorization not granted', googleError === 'access_denied' ? 'access_denied' : 'other');
    return googleError === 'access_denied'
      ? done(400, 'Authorization cancelled', 'Google Calendar was not connected. You can start again whenever you are ready.')
      : done(400, 'Authorization failed', 'Google reported an error. Please start again.');
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !state || code.length > 2048 || state.length > 512) {
    return done(400, 'Invalid request', 'The authorization response was incomplete. Please start again.');
  }

  const check = await checkState(readCookie(request.headers.get('Cookie'), STATE_COOKIE), state, cfg.key, clock.now().getTime());
  if (!check.ok) {
    console.warn('google-oauth: state rejected', check.reason);
    return check.reason === 'expired'
      ? done(400, 'Link expired', 'The authorization took longer than 10 minutes. Please start again.')
      : done(400, 'Invalid or missing state', 'This response could not be verified. Please start again from /api/google/start in the same browser.');
  }

  let exchange;
  try {
    exchange = await exchangeCode(cfg, code, check.verifier, redirectUri);
  } catch (err) {
    if (!(err instanceof GoogleError)) console.error('google-oauth: unexpected exchange error');
    return done(502, 'Could not complete authorization', 'Google did not accept the authorization. Please start again.');
  }

  const claims = idTokenClaims(exchange.idToken);
  const owner = calendarOwner(env);
  const email = typeof claims?.email === 'string' ? claims.email.toLowerCase() : '';
  const verified = claims?.email_verified === true || claims?.email_verified === 'true';
  const nowSec = clock.now().getTime() / 1000;
  if (
    !claims ||
    !ISSUERS.has(String(claims.iss)) ||
    claims.aud !== cfg.clientId ||
    typeof claims.exp !== 'number' ||
    claims.exp < nowSec
  ) {
    console.warn('google-oauth: id token rejected');
    return done(400, 'Could not verify the account', 'Google did not return a valid identity. Please start again.');
  }
  if (!verified || email !== owner) {
    console.warn('google-oauth: account rejected (not the calendar owner or not verified)');
    return done(403, 'Wrong Google account', `Only the calendar owner's Google account can be connected. Nothing was saved.`);
  }

  const missing = REQUIRED_CALENDAR_SCOPES.filter((s) => !exchange.scopes.includes(s));
  if (missing.length) {
    console.warn('google-oauth: calendar permissions not granted', missing.length);
    return done(400, 'Calendar permission missing', 'Please start again and tick both Google Calendar permissions on the consent screen.');
  }
  if (!exchange.refreshToken) {
    console.warn('google-oauth: no refresh token returned');
    return done(
      400,
      'No offline access granted',
      'Google did not return a refresh token. Remove this app at myaccount.google.com/permissions, then start again.',
    );
  }

  try {
    const nowIso = clock.now().toISOString();
    const encRefreshToken = await encryptSecret(exchange.refreshToken, cfg.key, tokenContext(owner));
    await saveGoogleAuth(env.BOOKINGS_DB, { email: owner, encRefreshToken, scopes: exchange.scopes.join(' '), nowIso });
    resetGoogleTokenCache();
  } catch {
    console.error('google-oauth: could not store the connection');
    return done(500, 'Could not save the connection', 'Please try again.');
  }

  console.log('google-oauth: calendar connected');
  return done(
    200,
    'Google Calendar connected',
    `Connected the calendar of ${owner}. Now set GOOGLE_SETUP_ENABLED to false (or remove it) and redeploy, so these setup pages are switched off.`,
  );
};
