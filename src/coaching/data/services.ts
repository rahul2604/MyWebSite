/*
 * Coaching services shown on the Strategy & Coaching page.
 *
 * Edit freely. Any value wrapped in [square brackets] is a placeholder for
 * information that hasn't been decided yet; the UI marks it as "to be confirmed".
 */

/* Add an id here (and an entry below) to offer another service. */
export type ServiceId = 'strategy-interview';

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
  price: string;
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
];

export const findService = (id: ServiceId | null) => COACHING_SERVICES.find((s) => s.id === id) ?? null;

/** True for "[...]" placeholder values that haven't been confirmed yet. */
export const isPlaceholder = (value: string) => value.startsWith('[') && value.endsWith(']');
