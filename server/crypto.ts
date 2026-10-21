/*
 * Web Crypto helpers (work in Cloudflare Workers and Node 20+).
 *  - AES-256-GCM for the stored Google refresh token
 *  - HMAC-SHA-256 for signing the short-lived OAuth state cookie
 * Keys never leave the server and are never logged.
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function b64urlEncode(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function b64urlDecode(text: string): Uint8Array {
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export const randomBytes = (n: number) => crypto.getRandomValues(new Uint8Array(n));
export const randomToken = (n = 32) => b64urlEncode(randomBytes(n));

/** Decodes GOOGLE_TOKEN_ENCRYPTION_KEY (base64 or base64url). Returns null unless it is exactly 32 bytes. */
export function parseKey(value: string | undefined): Uint8Array | null {
  if (!value) return null;
  try {
    const bytes = b64urlDecode(value.trim().replace(/=+$/, ''));
    return bytes.length === 32 ? bytes : null;
  } catch {
    return null;
  }
}

async function subKey(master: Uint8Array, label: string): Promise<Uint8Array> {
  // Separate keys per purpose, derived from the one master key.
  const data = new Uint8Array([...encoder.encode(`rm:${label}:`), ...master]);
  return new Uint8Array(await crypto.subtle.digest('SHA-256', data));
}

/** AES-GCM encrypt; `context` is bound as additional authenticated data. Output: "v1.<iv>.<ciphertext>". */
export async function encryptSecret(plaintext: string, master: Uint8Array, context: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', await subKey(master, 'enc'), 'AES-GCM', false, ['encrypt']);
  const iv = randomBytes(12);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: encoder.encode(context) }, key, encoder.encode(plaintext));
  return `v1.${b64urlEncode(iv)}.${b64urlEncode(new Uint8Array(ct))}`;
}

/** Throws if the blob was tampered with, the key is wrong, or the context differs. */
export async function decryptSecret(blob: string, master: Uint8Array, context: string): Promise<string> {
  const [version, ivText, ctText] = blob.split('.');
  if (version !== 'v1' || !ivText || !ctText) throw new Error('unsupported ciphertext');
  const key = await crypto.subtle.importKey('raw', await subKey(master, 'enc'), 'AES-GCM', false, ['decrypt']);
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: b64urlDecode(ivText), additionalData: encoder.encode(context) },
    key,
    b64urlDecode(ctText),
  );
  return decoder.decode(pt);
}

async function hmacKey(master: Uint8Array) {
  return crypto.subtle.importKey('raw', await subKey(master, 'mac'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function sign(data: string, master: Uint8Array): Promise<string> {
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(master), encoder.encode(data));
  return b64urlEncode(new Uint8Array(sig));
}

/** Constant-time signature check (crypto.subtle.verify). */
export async function verify(data: string, signature: string, master: Uint8Array): Promise<boolean> {
  try {
    return await crypto.subtle.verify('HMAC', await hmacKey(master), b64urlDecode(signature), encoder.encode(data));
  } catch {
    return false;
  }
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  const x = encoder.encode(a);
  const y = encoder.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

export async function sha256b64url(text: string): Promise<string> {
  return b64urlEncode(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(text))));
}
