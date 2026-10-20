/*
 * The calendar owner's Google refresh token, stored ENCRYPTED (AES-256-GCM, see crypto.ts)
 * in the single-row D1 table `google_auth`. Plaintext tokens never touch the database,
 * responses or logs. Only server code reads this table; no route returns it.
 */
import { ensureSchema, type D1Like } from './bookingStore.ts';

export interface GoogleAuthRow {
  email: string;
  enc_refresh_token: string;
  scopes: string;
  status: 'active' | 'invalid';
  created_at: string;
  updated_at: string;
}

/** Additional authenticated data binding the ciphertext to its purpose and owner. */
export const tokenContext = (email: string) => `google_refresh_token:v1:${email.toLowerCase()}`;

export async function getGoogleAuth(db: D1Like): Promise<GoogleAuthRow | null> {
  await ensureSchema(db);
  return db.prepare(`SELECT email, enc_refresh_token, scopes, status, created_at, updated_at FROM google_auth WHERE id = 1`).first<GoogleAuthRow>();
}

export async function saveGoogleAuth(db: D1Like, a: { email: string; encRefreshToken: string; scopes: string; nowIso: string }) {
  await ensureSchema(db);
  await db
    .prepare(
      `INSERT INTO google_auth (id, email, enc_refresh_token, scopes, status, created_at, updated_at)
       VALUES (1, ?1, ?2, ?3, 'active', ?4, ?4)
       ON CONFLICT (id) DO UPDATE SET email = ?1, enc_refresh_token = ?2, scopes = ?3, status = 'active', updated_at = ?4`,
    )
    .bind(a.email, a.encRefreshToken, a.scopes, a.nowIso)
    .run();
}

/** Called when Google reports the refresh token revoked/expired (invalid_grant). */
export async function markGoogleAuthInvalid(db: D1Like, nowIso: string) {
  await db.prepare(`UPDATE google_auth SET status = 'invalid', updated_at = ?1 WHERE id = 1`).bind(nowIso).run();
}
