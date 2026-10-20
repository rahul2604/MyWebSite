/*
 * Mounts the PMP learning platform API at /api/pmp/* (see server/pmp/router.ts).
 * Environment: PMP_DB (D1, optional; falls back to BOOKINGS_DB), PMP_SIGNUP_OPEN.
 */
import { handlePmp, type PmpEnv } from '../../../server/pmp/router.ts';

export const onRequest = async ({ request, env }: { request: Request; env: PmpEnv }): Promise<Response> => {
  const path = new URL(request.url).pathname.replace(/^\/api\/pmp\/?/, '');
  return handlePmp(request, env, path);
};
