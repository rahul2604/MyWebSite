/*
 * Course content types for the PMP learning path.
 *
 * Content lives on the server only. Lesson text is sent to a signed-in learner once the
 * lesson is unlocked; questions are sent without their answers, and scoring happens on
 * the server (see server/pmp/engine.ts).
 *
 * Lesson bodies use a small Markdown subset rendered by src/pmp/Markdown.tsx:
 *   ## / ### headings, paragraphs, "- " bullets, "1. " numbered lists, | tables |,
 *   "> " callouts (first bold word becomes the callout label), **bold** and *italic*.
 */

/** Where a lesson draws from: section numbers and topic ids in docs/pmp-curriculum/topic-catalogue.json. */
export interface Lesson {
  id: string;
  title: string;
  /** Estimated study time in minutes. */
  minutes: number;
  /** Topic ids from the catalogue; source page references are derived from these. */
  topics: string[];
  objectives: string[];
  body: string;
  keyTerms?: { term: string; def: string }[];
}

export interface Question {
  id: string;
  stem: string;
  /** Exactly four options. */
  options: [string, string, string, string];
  /** Index (0-3) of the single correct option. */
  answer: 0 | 1 | 2 | 3;
  explanation: string;
  /** Topic id from the catalogue (drives the coverage matrix). */
  topic: string;
  /** Short human-readable reference, e.g. "PMBOK 6 §4.1" or "APG §5.4". */
  ref: string;
}

export interface Module {
  id: string;
  /** Display number, e.g. "1". */
  number: string;
  title: string;
  summary: string;
  lessons: Lesson[];
  /** Module knowledge check (8-15 questions; pass mark PASS_MARK). */
  quiz: Question[];
}

export interface Exam {
  id: 'mock-1' | 'mock-2' | 'final';
  title: string;
  summary: string;
  /** Time limit in minutes (shown to the learner; enforced on the server with a grace period). */
  minutes: number;
  questions: Question[];
}

export const PASS_MARK = 0.8;
