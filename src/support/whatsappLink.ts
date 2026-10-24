/*
 * WhatsApp click-to-chat link (https://wa.me/<digits>?text=...). It only OPENS a chat with the
 * message prefilled; the visitor reviews and sends it themselves. Nothing is sent automatically.
 */
export function whatsappChatUrl(number: string, message: string): string | null {
  const digits = number.replace(/\D/g, '');
  // E.164: 8–15 digits including the country code (wa.me wants no "+" and no leading zeros).
  if (!/^[1-9]\d{7,14}$/.test(digits)) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Prefilled support messages. */
export const SUPPORT_MESSAGE = {
  site: 'Hi Rahul, I need some help with your website.',
  course: 'Hi Rahul, I need some help with the PMP course on your website.',
} as const;
