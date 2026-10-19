/* Booking references. A real backend should issue these; the demo makes its own. */

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O or 1/I lookalikes

export function generateDemoReference(date: string): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const code = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
  return `DEMO-${date.slice(2).replace(/-/g, '')}-${code}`;
}
