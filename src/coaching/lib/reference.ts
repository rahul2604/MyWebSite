/* Booking references, e.g. "RM-261020-K8WTAQ". */

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O or 1/I lookalikes

export function generateReference(date: string, prefix = 'DEMO'): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const code = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
  return `${prefix}-${date.slice(2).replace(/-/g, '')}-${code}`;
}

/** Reference for in-browser demo bookings. */
export const generateDemoReference = (date: string) => generateReference(date, 'DEMO');
