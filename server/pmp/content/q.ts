import type { Question } from '../types.ts';

/** Compact constructor used by the exam banks. */
export const q = (
  id: string,
  topic: string,
  ref: string,
  stem: string,
  options: [string, string, string, string],
  answer: 0 | 1 | 2 | 3,
  explanation: string,
): Question => ({ id, topic, ref, stem, options, answer, explanation });
