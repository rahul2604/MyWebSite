/* Validation for the aspirant details form. Shared by the form and the booking API. */

export const HEARD_FROM_OPTIONS = ['LinkedIn', 'Instagram', 'Referral', 'Google/Search', 'Website', 'Other'] as const;
export type HeardFrom = (typeof HEARD_FROM_OPTIONS)[number];

export interface AspirantDetails {
  fullName: string;
  whatsapp: string;
  email: string;
  purpose: string;
  heardFrom: HeardFrom | '';
}

export type DetailsErrors = Partial<Record<keyof AspirantDetails, string>>;

export const EMPTY_DETAILS: AspirantDetails = { fullName: '', whatsapp: '+91 ', email: '', purpose: '', heardFrom: '' };

export const PURPOSE_MIN = 20;
export const PURPOSE_MAX = 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** "+" then a 1–3 digit country code and 6–14 more digits; spaces, dashes and brackets are ignored. */
const WHATSAPP_RE = /^\+\d{7,17}$/;

export const normaliseWhatsapp = (value: string) => value.replace(/[\s()-]/g, '');

export function validateDetails(d: AspirantDetails): DetailsErrors {
  const e: DetailsErrors = {};
  if (d.fullName.trim().length < 2) e.fullName = 'Enter your full name.';
  const wa = normaliseWhatsapp(d.whatsapp);
  if (!wa || wa === '+' || wa === '+91') e.whatsapp = 'Enter your WhatsApp number with country code, e.g. +91 98765 43210.';
  else if (!wa.startsWith('+')) e.whatsapp = 'Start with your country code, e.g. +91.';
  else if (!WHATSAPP_RE.test(wa)) e.whatsapp = 'Enter a valid mobile number with country code (digits only after the +).';
  if (!d.email.trim()) e.email = 'Enter your email address.';
  else if (!EMAIL_RE.test(d.email.trim())) e.email = 'Enter a valid email address, e.g. name@example.com.';
  const purpose = d.purpose.trim();
  if (!purpose) e.purpose = 'Tell me what you need help with.';
  else if (purpose.length < PURPOSE_MIN) e.purpose = `Add a little more detail (at least ${PURPOSE_MIN} characters).`;
  else if (purpose.length > PURPOSE_MAX) e.purpose = `Keep this under ${PURPOSE_MAX} characters.`;
  if (!d.heardFrom) e.heardFrom = 'Choose how you heard about me.';
  return e;
}
