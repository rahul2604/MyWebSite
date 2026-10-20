/*
 * Coaching services shown on the Strategy & Coaching booking page.
 *
 * Source of truth for the first two services: https://topmate.io/rahul_mehra
 * (copied 20 October 2026). Keep them in step with Topmate when either changes.
 *
 * Edit freely. Any value wrapped in [square brackets] is a placeholder for
 * information that hasn't been decided yet; the UI marks it as "to be confirmed".
 */

/* Add an id here (and an entry below) to offer another service. */
export type ServiceId = 'lets-connect' | 'strategy-interview' | 'pmp-discovery';

export interface ServiceTopic {
  title: string;
  text: string;
}

export interface CoachingService {
  id: ServiceId;
  number: string;
  title: string;
  /** Optional tagline under the title. */
  subtitle?: string;
  /** One or two sentences for the service card. */
  summary: string;
  /** Who the session is designed for, in one line. */
  audience: string;
  format: string;
  duration: string;
  /** Session length in minutes, once known. Slots and summaries then show an end time. */
  durationMinutes?: number;
  price: string;
  /** Free sessions get a "Free" badge and never mention payment. */
  free?: boolean;
  /** Small highlight label on the card, e.g. "Popular". */
  badge?: string;
  /** Label for the card's button. Defaults to "View Details & Book". */
  ctaLabel?: string;
  /**
   * "server": booked through /api/bookings (stored, slot held, emails; Google Calendar + Meet when BOOKING_MODE=live).
   * "demo": in-browser prototype only — nothing is stored or sent.
   */
  booking: 'server' | 'demo';

  /* Details page — every section is optional and only shown when present. */
  /** Paragraphs before the topics. */
  intro?: string[];
  topicsHeading?: string;
  topics?: ServiceTopic[];
  /** Paragraphs after the topics. */
  outro?: string[];
  covers?: string[];
  forWho?: string[];
  outcomes?: string[];
  preparation?: string[];
}

export const COACHING_SERVICES: CoachingService[] = [
  {
    // Topmate: "Need Advice? Let's Talk" — Topmate shows no description; summary and audience are Rahul's own wording.
    // Duration: 15 minutes on this site (Topmate lists 10) — free calls use the 15-minute booking rule.
    id: 'lets-connect',
    number: '01',
    title: 'Need Advice? Let’s Talk',
    summary:
      'A brief introductory conversation to connect, discuss your goals, and understand how I might be able to help.',
    audience: 'Anyone interested in exploring my coaching, strategy or career guidance offerings',
    format: 'Video meeting',
    duration: '15 minutes',
    durationMinutes: 15,
    price: 'Free',
    free: true,
    ctaLabel: 'Book a Free Call',
    booking: 'server',
  },
  {
    // Topmate: "1:1 Case & Guesstimate Mock Interview" — text copied from its "About this session".
    id: 'strategy-interview',
    number: '02',
    title: '1:1 Case & Guesstimate Mock Interview',
    subtitle: 'Ace Strategy Interviews – 1:1 Guidance',
    summary:
      'Are you preparing for consulting or strategy interviews as an MBA student or recent graduate? I offer personalized 1:1 sessions to help you succeed in every round.',
    audience: 'MBA students and recent graduates targeting MBB, Big 4 or corporate strategy roles',
    format: 'Video meeting',
    duration: '30 minutes',
    durationMinutes: 30,
    price: '₹299',
    badge: 'Popular',
    // Paid session: stays an in-browser demo until payments exist.
    booking: 'demo',
    intro: [
      'Are you preparing for consulting or strategy interviews as an MBA student or recent graduate? I offer personalized 1:1 sessions to help you succeed in every round.',
    ],
    topicsHeading: 'In each session, we will cover',
    topics: [
      {
        title: 'CV-Based Questions',
        text: 'Learn how to frame your experience, handle common behavioral questions, and showcase your impact effectively.',
      },
      {
        title: 'Guesstimates',
        text: 'Practice structured thinking for market sizing and estimation problems with real examples and feedback.',
      },
      {
        title: 'Case Interviews',
        text: 'Get hands-on with profitability, market entry, and other case types — with detailed walkthroughs and feedback.',
      },
    ],
    outro: [
      'Whether you’re targeting MBB, Big 4, or corporate strategy roles, these sessions will help you build clarity, confidence, and structure in your approach.',
      'I bring experience from top B-schools (MDI Gurgaon, ESCP Europe), operations and strategy roles at Air India, Vedanta, and Max Life, and strong analytical foundations — along with a passion for mentoring.',
      'Let’s work together to sharpen your interview skills and land your dream role.',
    ],
  },
  {
    // Not on Topmate — added on this site.
    id: 'pmp-discovery',
    number: '03',
    title: 'PMP® Course Discovery Call',
    summary:
      'A short call to walk through the PMP® course overview, understand your goals, and discuss a preparation approach and guidance that suits you.',
    audience: 'Professionals considering the PMP® certification or the PMP® course',
    format: '[Session format, e.g. online call]',
    duration: '15 minutes',
    durationMinutes: 15,
    price: 'Free',
    free: true,
    ctaLabel: 'Book a Free Call',
    booking: 'server',
    covers: [
      'An overview of the PMP® course',
      'Your goals and where you are in your PMP® journey',
      'A suitable preparation approach',
      'Guidance on next steps',
    ],
    forWho: [
      'Professionals considering the PMP® certification',
      'Aspirants who want to understand the course before committing',
    ],
    outcomes: [
      'A clear picture of what the course covers',
      'A preparation approach matched to your goals',
      'Answers to your questions about getting started',
    ],
    preparation: [
      'Think about your target timeline for the PMP® exam',
      'Note any questions about the course or the certification process',
      'Mention your current experience and goals in the booking form',
    ],
  },
];

export const findService = (id: ServiceId | null) => COACHING_SERVICES.find((s) => s.id === id) ?? null;

/** True for "[...]" placeholder values that haven't been confirmed yet. */
export const isPlaceholder = (value: string) => value.startsWith('[') && value.endsWith(']');
