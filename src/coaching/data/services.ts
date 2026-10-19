/*
 * Coaching services shown on the Strategy & Coaching page.
 *
 * Edit freely. Any value wrapped in [square brackets] is a placeholder for
 * information that hasn't been decided yet; the UI marks it as "to be confirmed".
 */

/* Add an id here (and an entry below) to offer another service. */
export type ServiceId = 'strategy-interview' | 'lets-connect';

export interface CoachingService {
  id: ServiceId;
  number: string;
  title: string;
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
  /** Label for the card's button. Defaults to "View Details & Book". */
  ctaLabel?: string;
  covers: string[];
  forWho: string[];
  outcomes: string[];
  preparation: string[];
}

export const COACHING_SERVICES: CoachingService[] = [
  {
    id: 'strategy-interview',
    number: '01',
    title: 'Strategy & Consulting Interview Preparation',
    summary:
      'Prepare for strategy and consulting interviews — structure problems clearly and communicate your recommendations with confidence.',
    audience: 'Candidates interviewing for strategy, consulting and commercial roles',
    format: '[Session format, e.g. one-to-one online call]',
    duration: '[Session duration]',
    price: '[Price]',
    covers: [
      'How strategy and consulting interviews are typically structured',
      'Breaking down ambiguous business problems into a clear structure',
      'Turning your analysis into a concise, well-supported recommendation',
      'Communicating your thinking clearly under time pressure',
      'Feedback on your current approach and where to focus next',
    ],
    forWho: [
      'MBA students and graduates preparing for strategy or consulting interviews',
      'Professionals moving into strategy, consulting or commercial roles',
      'Candidates who want structured feedback before an upcoming interview',
    ],
    outcomes: [
      'A clearer, repeatable way to approach interview problems',
      'Specific feedback on your structure and communication',
      'A short list of priority areas to work on before your interview',
    ],
    preparation: [
      'Mention the role or company you are preparing for in the booking form',
      'Note the question types or topics you find hardest',
      'Keep a pen and paper ready for structuring during the session',
    ],
  },
  {
    id: 'lets-connect',
    number: '02',
    title: 'Let’s Connect',
    summary:
      'A brief introductory conversation to connect, discuss your goals, and understand how I might be able to help.',
    audience: 'Anyone interested in exploring my coaching, strategy or career guidance offerings',
    format: '[Session format, e.g. online call]',
    duration: '10 minutes',
    durationMinutes: 10,
    price: 'Free (₹0)',
    free: true,
    ctaLabel: 'Book a Free Call',
    covers: [
      'A quick introduction',
      'Your goals and what you are working towards',
      'How I might be able to help, and whether a longer session makes sense',
    ],
    forWho: [
      'Anyone interested in exploring my coaching, strategy or career guidance offerings',
      'People who would like to talk briefly before booking a full session',
    ],
    outcomes: [
      'A clearer idea of whether my coaching fits what you need',
      'Suggested next steps, if a follow-up session would help',
    ],
    preparation: [
      'Jot down your goals and the questions you would like to ask',
      'Share a line about what you are looking for in the booking form',
    ],
  },
];

export const findService = (id: ServiceId | null) => COACHING_SERVICES.find((s) => s.id === id) ?? null;

/** True for "[...]" placeholder values that haven't been confirmed yet. */
export const isPlaceholder = (value: string) => value.startsWith('[') && value.endsWith(']');
