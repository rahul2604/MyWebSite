/* Single source of "now" for server code, so tests can control time. */
export const clock = { now: (): Date => new Date() };
