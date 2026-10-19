/*
 * Coaching services shown on the Strategy & Coaching page.
 *
 * Edit freely. Any value wrapped in [square brackets] is a placeholder for
 * information that hasn't been decided yet; the UI marks it as "to be confirmed".
 */

export type ServiceId = 'strategy-interview' | 'cases-guesstimates' | 'pmp-guidance';

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
  {
    id: 'cases-guesstimates',
    number: '02',
    title: 'Consulting Cases & Guesstimates',
    summary:
      'Practise structuring business problems, solving case interviews and approaching guesstimates step by step.',
    audience: 'Candidates preparing for case interview and guesstimate rounds',
    format: '[Session format, e.g. one-to-one online call]',
    duration: '[Session duration]',
    price: '[Price]',
    covers: [
      'Working through a case interview problem together',
      'Building issue trees and forming hypotheses',
      'Approaching guesstimates: segmentation, assumptions and sanity checks',
      'Handling numbers and data during a case',
      'Feedback on how you structured and communicated the case',
    ],
    forWho: [
      'Students and professionals with upcoming case interview rounds',
      'Anyone who finds guesstimates difficult to start or structure',
      'Candidates who want realistic practice before the real interview',
    ],
    outcomes: [
      'More confidence in structuring a case from the first question',
      'A repeatable approach for guesstimate questions',
      'Feedback on what to practise next',
    ],
    preparation: [
      'Revise common business frameworks you already know',
      'Practise quick mental maths beforehand',
      'Mention any industries or case types you would like to practise',
    ],
  },
  {
    id: 'pmp-guidance',
    number: '03',
    title: 'PMP® Certification Guidance',
    summary:
      'Guidance for professionals preparing for the PMP® certification process — from planning your preparation to approaching the exam.',
    audience: 'Professionals planning or preparing for the PMP® certification',
    format: '[Session format, e.g. one-to-one online call]',
    duration: '[Session duration]',
    price: '[Price]',
    covers: [
      'An overview of the PMP® certification journey',
      'Planning a realistic study schedule around your work',
      'Predictive, agile and hybrid project management topics',
      'Approaching exam-style questions',
      'Your specific questions about the certification process',
    ],
    forWho: [
      'Professionals starting their PMP® journey',
      'Candidates part-way through their preparation who want direction',
      'Project professionals deciding whether the PMP® is right for them',
    ],
    outcomes: [
      'A clearer plan for your PMP® preparation',
      'An understanding of which areas need the most attention',
      'Answers to your questions about the process',
    ],
    preparation: [
      'Review the PMP® eligibility requirements on the official PMI® website',
      'List the questions you would like answered',
      'Share your target exam timeline, if you have one, in the booking form',
    ],
  },
];

export const findService = (id: ServiceId | null) => COACHING_SERVICES.find((s) => s.id === id) ?? null;

/** True for "[...]" placeholder values that haven't been confirmed yet. */
export const isPlaceholder = (value: string) => value.startsWith('[') && value.endsWith(']');
