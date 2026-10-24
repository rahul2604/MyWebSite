/* Validation for the aspirant details form. Shared by the form and the booking API. */

export const HEARD_FROM_OPTIONS = ['LinkedIn', 'Instagram', 'Referral', 'Google/Search', 'Website', 'Other'] as const;
export type HeardFrom = (typeof HEARD_FROM_OPTIONS)[number];

export interface AspirantDetails {
  fullName: string;
  whatsapp: string;
  email: string;
  purpose: string;
  heardFrom: HeardFrom | '';
  /**
   * Explicit opt-in to booking confirmation and reminder messages on WhatsApp. Optional and
   * unticked by default; without it no WhatsApp message is ever sent for the booking.
   */
  whatsappOptIn?: boolean;
}

/** Text fields of the form (the opt-in checkbox has no error message). */
export type DetailsField = Exclude<keyof AspirantDetails, 'whatsappOptIn'>;
export type DetailsErrors = Partial<Record<DetailsField, string>>;

export const EMPTY_DETAILS: AspirantDetails = { fullName: '', whatsapp: '+91 ', email: '', purpose: '', heardFrom: '', whatsappOptIn: false };

export const PURPOSE_MIN = 20;
export const PURPOSE_MAX = 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/**
 * E.164: "+", a country code that doesn't start with 0, and 8–15 digits in total.
 * Spaces, dashes and brackets are ignored (see normaliseWhatsapp).
 */
const E164_RE = /^\+[1-9]\d{7,14}$/;
/** India (+91): a 10-digit mobile number starting with 6, 7, 8 or 9. */
const INDIA_MOBILE_RE = /^\+91[6-9]\d{9}$/;

/** "+91 98765-43210" → "+919876543210" (the international format used for messaging). */
export const normaliseWhatsapp = (value: string) => value.replace(/[\s()-]/g, '');

/** Problem with a WhatsApp number, or null when it is a valid international mobile number. */
export function whatsappProblem(value: string): string | null {
  const wa = normaliseWhatsapp(value);
  if (!wa || wa === '+' || wa === '+91') return 'Enter your WhatsApp number with country code, e.g. +91 98765 43210.';
  if (!wa.startsWith('+')) return 'Start with your country code, e.g. +91.';
  if (!E164_RE.test(wa)) return 'Enter a valid mobile number with country code (digits only after the +).';
  if (wa.startsWith('+91') && !INDIA_MOBILE_RE.test(wa)) return 'Indian mobile numbers have 10 digits after +91 and start with 6, 7, 8 or 9.';
  return null;
}

export function validateDetails(d: AspirantDetails): DetailsErrors {
  const e: DetailsErrors = {};
  if (d.fullName.trim().length < 2) e.fullName = 'Enter your full name.';
  const wa = whatsappProblem(d.whatsapp);
  if (wa) e.whatsapp = wa;
  if (!d.email.trim()) e.email = 'Enter your email address.';
  else if (!EMAIL_RE.test(d.email.trim())) e.email = 'Enter a valid email address, e.g. name@example.com.';
  const purpose = d.purpose.trim();
  if (!purpose) e.purpose = 'Tell me what you need help with.';
  else if (purpose.length < PURPOSE_MIN) e.purpose = `Add a little more detail (at least ${PURPOSE_MIN} characters).`;
  else if (purpose.length > PURPOSE_MAX) e.purpose = `Keep this under ${PURPOSE_MAX} characters.`;
  if (!d.heardFrom) e.heardFrom = 'Choose how you heard about me.';
  return e;
}
