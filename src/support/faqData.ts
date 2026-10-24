/*
 * Support FAQ content — the single source for the main-site Support page (#support) and the
 * PMP® course's Help page (#pmp/support). Edit answers here only.
 *
 * Rules for answers: describe only what the site actually does today. Don't promise features that
 * aren't live, don't state a price for the PMP® course (the free policy covers coaching sessions),
 * and never add a phone number or email address that hasn't been confirmed as a support contact.
 */

export type FaqCategoryId = 'start' | 'course' | 'account' | 'bookings' | 'meetings' | 'whatsapp' | 'pricing' | 'technical';

export interface FaqCategory {
  id: FaqCategoryId;
  label: string;
}

export interface FaqLink {
  label: string;
  href: string;
}

export interface FaqItem {
  id: string;
  category: FaqCategoryId;
  question: string;
  /** Paragraphs of plain text. */
  answer: string[];
  links?: FaqLink[];
  /** Extra words people might search for that don't appear in the text. */
  keywords?: string[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: 'start', label: 'Getting started' },
  { id: 'course', label: 'PMP® course' },
  { id: 'account', label: 'Account & sign-in' },
  { id: 'bookings', label: 'Session bookings' },
  { id: 'meetings', label: 'Meeting links' },
  { id: 'whatsapp', label: 'WhatsApp updates' },
  { id: 'pricing', label: 'Services & pricing' },
  { id: 'technical', label: 'Technical issues' },
];

export const FAQ_ITEMS: FaqItem[] = [
  /* ---------------- Getting started ---------------- */
  {
    id: 'what-is-here',
    category: 'start',
    question: 'What can I do on this website?',
    answer: [
      'You can book a one-to-one coaching session with Rahul (an introductory call, a case and guesstimate mock interview, or a PMP® course discovery call), and you can study the PMP® learning path: modules, lessons, knowledge checks, mock tests and a final assessment.',
    ],
    links: [
      { label: 'Book a session', href: '#coaching' },
      { label: 'Open the PMP® learning path', href: '#pmp' },
    ],
  },
  {
    id: 'start-pmp',
    category: 'start',
    question: 'How do I get started with the PMP® course?',
    answer: [
      'Open the PMP® Learning Path from the menu and create a learner account with your name, email address and a password. You then start at the first module; each lesson and knowledge check opens once you have completed the one before it.',
    ],
    links: [{ label: 'Go to the PMP® learning path', href: '#pmp' }],
    keywords: ['sign up', 'register', 'enrol', 'enroll'],
  },
  {
    id: 'navigate-course',
    category: 'start',
    question: 'How do I find my way around the learning platform?',
    answer: [
      'The course menu lists every module with its lessons and knowledge check, followed by the mock tests, the final assessment and your certificate. On a phone, tap "Course menu" at the top to open it. The dashboard shows your overall progress and the next item to study.',
    ],
    keywords: ['sidebar', 'menu', 'dashboard'],
  },

  /* ---------------- PMP course ---------------- */
  {
    id: 'course-contents',
    category: 'course',
    question: 'What does the PMP® course include?',
    answer: [
      'The learning path has 18 modules with 69 lessons, a knowledge check at the end of each module, two mock tests and a final assessment. When you pass the final assessment you can download a course certificate. The certificate confirms you completed this course; it is not a PMI® credential.',
    ],
    keywords: ['modules', 'lessons', 'mock test', 'certificate', 'exam'],
  },
  {
    id: 'locked',
    category: 'course',
    question: 'Why is a lesson or test locked?',
    answer: [
      'Lessons, knowledge checks, mock tests and the final assessment open in order. Complete the previous lesson or pass the previous check to unlock the next item. Items that are still closed are marked as locked in the course menu.',
    ],
    keywords: ['unlock', 'cannot open', "can't open"],
  },
  {
    id: 'content-not-loading',
    category: 'course',
    question: 'What should I do if the course content does not load?',
    answer: [
      'Refresh the page first. If you see "Loading your course…" for a long time or an error message, check your internet connection and press "Try again". If it still fails, sign out and back in, or try another browser. If none of that helps, send a message through Chat with Rahul and mention which lesson you were opening.',
    ],
    keywords: ['blank', 'spinner', 'error'],
  },
  {
    id: 'progress-missing',
    category: 'course',
    question: 'My progress is not showing. What should I do?',
    answer: [
      'Progress is saved on the server against your account, not in your browser. Make sure you are signed in with the same email address you used before. A lesson only counts once you have completed it, and a knowledge check once you have passed it. Refresh the dashboard to see the latest progress.',
    ],
    keywords: ['lost progress', 'not saved', 'reset'],
  },
  {
    id: 'phone',
    category: 'course',
    question: 'Can I study on my phone?',
    answer: ['Yes. The course works in the browser on phones, tablets and computers, and your progress follows your account across devices.'],
    keywords: ['mobile', 'tablet', 'app'],
  },

  /* ---------------- Account ---------------- */
  {
    id: 'cannot-sign-in',
    category: 'account',
    question: 'I cannot sign in. What should I do?',
    answer: [
      'Check that you are using the email address you registered with and that Caps Lock is off. After several wrong passwords in a row the account is locked for 15 minutes as a security measure; wait and try again.',
      'There is no self-service password reset yet. If you have forgotten your password, send a message through Chat with Rahul from the email address you registered with.',
    ],
    keywords: ['login', 'log in', 'password', 'forgot', 'locked out'],
  },
  {
    id: 'sign-in',
    category: 'account',
    question: 'How do I sign in to the PMP® course?',
    answer: [
      'Open the PMP® Learning Path and choose Sign in. Enter the email address and password you used when you created your learner account. New learners choose "Create account" instead. You stay signed in on that device until you sign out or the session expires.',
    ],
    links: [{ label: 'Go to the PMP® learning path', href: '#pmp' }],
    keywords: ['login', 'log in', 'account'],
  },
  {
    id: 'session-expired',
    category: 'account',
    question: 'Why was I signed out?',
    answer: [
      'Learner sessions last 30 days. Changing your password also signs out your other sessions. Clearing your browser cookies signs you out too. Sign in again and your progress will be there.',
    ],
    keywords: ['authentication error', 'logged out', 'session'],
  },
  {
    id: 'account-help',
    category: 'account',
    question: 'Who do I contact if my account is not working?',
    answer: [
      'Use Chat on WhatsApp at the bottom of this page, or the Chat with Rahul form to reply by email. Include the email address of your learner account and what you see on screen. Never send your password.',
    ],
  },

  /* ---------------- Bookings ---------------- */
  {
    id: 'how-to-book',
    category: 'bookings',
    question: 'How do I book a session?',
    answer: [
      'Open Book a Session, choose a service, pick a date and time (shown in India Standard Time, with your local time alongside), enter your details, review them and press Confirm booking. Slots can be booked from 2 hours to 30 days ahead.',
    ],
    links: [{ label: 'Book a session', href: '#coaching' }],
    keywords: ['schedule', 'appointment', 'slot'],
  },
  {
    id: 'time-unavailable',
    category: 'bookings',
    question: 'What if my preferred time is not available?',
    answer: [
      'Booked times are shown as unavailable and can\'t be selected. Try another day: the calendar shows which days still have free slots, up to 30 days ahead. If someone books the same time just before you confirm, you\'ll be asked to choose another slot and nothing is booked twice. If none of the times suit you, send Rahul a message on WhatsApp with the times that would work.',
    ],
    keywords: ['slot', 'full', 'busy', 'no times'],
  },
  {
    id: 'booking-confirmed',
    category: 'bookings',
    question: 'How do I know my booking is confirmed?',
    answer: [
      'After you press Confirm booking, the confirmation screen shows your booking reference and the session details. It also tells you whether your confirmation email was sent. Keep the reference: it identifies your booking if you need to contact us. If you only see an error, nothing has been booked yet, and pressing Confirm again never books you twice.',
    ],
    keywords: ['reference', 'confirmation'],
  },
  {
    id: 'after-booking',
    category: 'bookings',
    question: 'What happens after I submit a booking?',
    answer: [
      'Your slot is reserved so nobody else can take it, a confirmation email is sent to you and Rahul is notified. If you opted in to WhatsApp updates, a WhatsApp confirmation and a reminder before the session are sent as well, when WhatsApp messaging is switched on.',
    ],
  },
  {
    id: 'change-cancel',
    category: 'bookings',
    question: 'Can I change or cancel my booking?',
    answer: [
      'There is no self-service change or cancellation yet. Send a message through Chat with Rahul with your booking reference and what you would like to change. Please do this as early as possible so the slot can be offered to someone else.',
    ],
    keywords: ['reschedule', 'cancel', 'move'],
  },

  /* ---------------- Meetings ---------------- */
  {
    id: 'where-link',
    category: 'meetings',
    question: 'Where will I receive my meeting link?',
    answer: [
      'If your confirmation screen shows a Google Meet link, that is your link. It is also in your confirmation email (and in your WhatsApp confirmation, once automated WhatsApp updates are switched on and you opted in). If the confirmation says the meeting link will be shared separately, Rahul will send it to you before the session.',
    ],
    keywords: ['google meet', 'zoom', 'video'],
  },
  {
    id: 'link-when',
    category: 'meetings',
    question: 'When will my meeting link become available?',
    answer: [
      'It depends on how your booking was made. When the confirmation screen shows a Google Meet link, it was created with your booking and is ready straight away. When the confirmation says the link will be shared separately, Rahul sends it to you before the session.',
    ],
  },
  {
    id: 'no-link',
    category: 'meetings',
    question: 'I have not received my meeting link. What should I do?',
    answer: [
      'Check your confirmation email, including the Spam or Promotions folder. If your booking said the link would be shared separately and you haven\'t received it a few hours before the session, send a message through Chat with Rahul with your booking reference.',
    ],
  },
  {
    id: 'link-not-working',
    category: 'meetings',
    question: 'What if the meeting link does not work?',
    answer: [
      'Open the link in Chrome, Edge, Firefox or Safari, or in the Google Meet app on your phone. You can join as a guest without a Google account; press "Ask to join" and wait to be admitted. Allow your camera and microphone when the browser asks. If it still fails, message Rahul through Chat with Rahul with your booking reference.',
    ],
  },
  {
    id: 'join-meeting',
    category: 'meetings',
    question: 'How do I join my scheduled session?',
    answer: [
      'A minute or two before the start time (IST), open your meeting link, allow your camera and microphone, then press Join or Ask to join.',
    ],
  },

  /* ---------------- WhatsApp ---------------- */
  {
    id: 'whatsapp-updates',
    category: 'whatsapp',
    question: 'Will I receive booking updates on WhatsApp?',
    answer: [
      'Automated WhatsApp booking updates are being set up and may not be switched on yet. You can opt in on the booking form ("Send my booking confirmation and a reminder before the session to this number on WhatsApp"). Once they are switched on, opted-in bookers receive a confirmation after booking and a reminder before the session.',
      'Your confirmation screen always says honestly whether a WhatsApp confirmation was sent. Your confirmation email is sent either way and, with your booking reference, is your record.',
    ],
    keywords: ['notification', 'message', 'opt in', 'automatic'],
  },
  {
    id: 'contact-rahul',
    category: 'whatsapp',
    question: 'How can I contact Rahul for help?',
    answer: [
      'Use the Chat on WhatsApp button at the bottom of this page. It opens WhatsApp with a short message ready for you to review and send yourself; nothing is sent automatically. You can also use the Chat with Rahul form if you prefer a reply by email.',
      'This support chat is separate from booking updates: automated confirmations and reminders are sent to your own WhatsApp number, not from this chat.',
    ],
    keywords: ['support', 'contact', 'help', 'chat', 'phone', 'number'],
  },
  {
    id: 'whatsapp-number',
    category: 'whatsapp',
    question: 'Which WhatsApp number will receive my notifications?',
    answer: [
      'The WhatsApp number you enter on the booking form, including the country code (for example +91 98765 43210). It is used only for this booking\'s confirmation and reminder and is never shown publicly.',
    ],
  },
  {
    id: 'whatsapp-missing',
    category: 'whatsapp',
    question: 'What if I do not receive a WhatsApp message?',
    answer: [
      'Check that you ticked the WhatsApp option and entered the right number with its country code, and that the number has WhatsApp. "Sent" on the confirmation screen means WhatsApp accepted the message; delivery can still take a little while. Your booking stays confirmed even if a WhatsApp message fails, and your confirmation email and booking reference remain your record.',
    ],
  },
  {
    id: 'reminders',
    category: 'whatsapp',
    question: 'Can I get a reminder before my session?',
    answer: [
      'Once automated WhatsApp updates are switched on, bookers who opted in get a reminder about 30 minutes before the session, with the meeting link when one is available. No reminder is sent once a session has started. Until then, please note your session time from the confirmation screen or email.',
    ],
    keywords: ['remind', 'alert'],
  },

  /* ---------------- Services & pricing ---------------- */
  {
    id: 'services-available',
    category: 'pricing',
    question: 'What services are available?',
    answer: [
      'Three one-to-one sessions with Rahul, all free when booked on this website: "Need Advice? Let\'s Talk", a 15-minute introductory call; the 1:1 Case & Guesstimate Mock Interview, 30 minutes of case, guesstimate and CV-based interview practice; and the PMP® Course Discovery Call, 15 minutes about the PMP® course and your preparation. The PMP® learning path itself is in the menu.',
    ],
    links: [{ label: 'See the sessions', href: '#coaching' }],
    keywords: ['coaching', 'mock interview', 'call', 'session'],
  },
  {
    id: 'book-mock-interview',
    category: 'pricing',
    question: 'How do I book a mock interview, and is it free?',
    answer: [
      'Yes, the 1:1 Case & Guesstimate Mock Interview is free when you book it on this website. Open Book a Session, choose the mock interview, pick a 30-minute slot, enter your details and confirm. There is no payment or checkout step.',
    ],
    links: [{ label: 'Book a free mock interview', href: '#coaching' }],
    keywords: ['interview', 'case', 'guesstimate', 'consulting', 'price', 'free', '299'],
  },
  {
    id: 'pay-to-book',
    category: 'pricing',
    question: 'Do I need to pay to book a session?',
    answer: ['No. Every coaching session offered on this site, including the mock interview, is free, and the booking form never asks for payment details.'],
    keywords: ['price', 'cost', 'fee', 'payment', 'charge', 'free'],
  },
  {
    id: 'hidden-charges',
    category: 'pricing',
    question: 'Are there any hidden charges?',
    answer: ['No. There is no payment step anywhere in the booking process, and booking a session does not sign you up for anything paid.'],
    keywords: ['price', 'cost', 'fee'],
  },
  {
    id: 'course-price',
    category: 'pricing',
    question: 'Is the PMP® course free as well?',
    answer: [
      'The free policy on this page covers the coaching sessions. For questions about the PMP® course itself, book a free PMP® Course Discovery Call or send a message through Chat with Rahul.',
    ],
    links: [{ label: 'Book a PMP® Course Discovery Call', href: '#coaching' }],
    keywords: ['price', 'cost', 'fee'],
  },

  /* ---------------- Technical ---------------- */
  {
    id: 'page-not-loading',
    category: 'technical',
    question: 'What should I do if a page is not loading?',
    answer: [
      'Refresh the page, check your internet connection and try again. If that does not help, try another up-to-date browser or a private window, and temporarily turn off browser extensions such as ad blockers.',
    ],
  },
  {
    id: 'booking-failed',
    category: 'technical',
    question: 'What should I do if a booking fails?',
    answer: [
      'Read the message on screen: it says whether anything was booked. If it asks you to press Confirm again, do so; you will never be booked twice. If your time was taken by someone else, choose another slot. If online booking is unavailable, use Chat with Rahul and mention the service and time you wanted.',
    ],
    keywords: ['error', 'not working'],
  },
  {
    id: 'report-issue',
    category: 'technical',
    question: 'How do I report a technical issue?',
    answer: [
      'Use Chat on WhatsApp at the bottom of this page, or the Chat with Rahul form. Mention the page you were on, what you expected, what happened instead, and your device and browser. Please don\'t include passwords.',
    ],
    keywords: ['bug', 'problem', 'feedback'],
  },
];

/** Lower-cases and removes accents and the ® mark so "pmp" matches "PMP®". */
export const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[®™’']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const haystack = (item: FaqItem) => normalise([item.question, ...item.answer, ...(item.keywords ?? [])].join(' '));

/**
 * Items matching every word of the query (in the question, answer or keywords), optionally
 * limited to one category. An empty query returns everything in the category.
 */
export function filterFaq(items: FaqItem[], query: string, category: FaqCategoryId | 'all' = 'all'): FaqItem[] {
  const words = normalise(query).split(' ').filter(Boolean);
  return items.filter((item) => {
    if (category !== 'all' && item.category !== category) return false;
    if (!words.length) return true;
    const text = haystack(item);
    return words.every((w) => text.includes(w));
  });
}

/** Number of items per category, for the category chips (categories with no items are hidden). */
export function categoryCounts(items: FaqItem[]): Record<FaqCategoryId, number> {
  const counts = Object.fromEntries(FAQ_CATEGORIES.map((c) => [c.id, 0])) as Record<FaqCategoryId, number>;
  for (const item of items) counts[item.category]++;
  return counts;
}
