/* Small response helpers shared by the Pages Functions. */

export const json = (status: number, body: Record<string, unknown>, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra },
  });

export const fail = (status: number, code: string, error: string, extra?: Record<string, string>, more: Record<string, unknown> = {}) =>
  json(status, { ok: false, code, error, ...more }, extra);

/** Same-site check: browsers send Origin on POST; it must match the host. */
export const sameSite = (origin: string | null, requestUrl: string) => {
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(requestUrl).host;
  } catch {
    return false;
  }
};

/** Best-effort per-visitor limiter (per isolate). Use a Cloudflare WAF rule for a hard limit. */
export function makeRateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (key: string, now: number) => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    const limited = recent.length >= max;
    if (!limited) recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) hits.clear();
    return limited;
  };
}
