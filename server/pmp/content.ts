/*
 * The course as learners see it: the authored content (server/pmp/content/*.ts) with any
 * edits the administrator has *published* applied on top. Drafts are never shown to
 * learners. Edits are limited to fields that do not change the course structure: lessons
 * and questions cannot be added or removed here, so unlock rules and coverage stay intact.
 *
 * Source references are derived from topic ids (server/pmp/sourceMap.ts); an editor can
 * change which catalogue topics a lesson cites but cannot type page numbers by hand.
 */
import type { D1Like } from '../bookingStore.ts';
import { EXAMS, MODULES } from './course.ts';
import { SOURCE_MAP } from './sourceMap.ts';
import { allOverrides, type OverrideRow } from './store.ts';
import type { Exam, Lesson, Module, Question } from './types.ts';

export interface Course {
  modules: Module[];
  exams: Exam[];
}

export const BASE_COURSE: Course = { modules: MODULES, exams: EXAMS };

export type LessonPatch = Partial<Pick<Lesson, 'title' | 'minutes' | 'objectives' | 'body' | 'keyTerms' | 'topics'>>;
export type QuestionPatch = Partial<Pick<Question, 'stem' | 'options' | 'answer' | 'explanation' | 'ref' | 'topic'>>;

export function findBaseLesson(id: string): Lesson | null {
  for (const m of MODULES) for (const l of m.lessons) if (l.id === id) return l;
  return null;
}

export function findBaseQuestion(id: string): { question: Question; assessmentId: string } | null {
  for (const m of MODULES) for (const q of m.quiz) if (q.id === id) return { question: q, assessmentId: m.id };
  for (const e of EXAMS) for (const q of e.questions) if (q.id === id) return { question: q, assessmentId: e.id };
  return null;
}

const parse = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export function applyOverrides(base: Course, overrides: OverrideRow[]): Course {
  const lessonPatches = new Map<string, LessonPatch>();
  const questionPatches = new Map<string, QuestionPatch>();
  for (const o of overrides) {
    const p = parse<Record<string, unknown>>(o.published);
    if (!p) continue;
    if (o.kind === 'lesson') lessonPatches.set(o.item_id, p as LessonPatch);
    else questionPatches.set(o.item_id, p as QuestionPatch);
  }
  if (lessonPatches.size === 0 && questionPatches.size === 0) return base;
  const q = (x: Question): Question => (questionPatches.has(x.id) ? { ...x, ...questionPatches.get(x.id)! } as Question : x);
  return {
    modules: base.modules.map((m) => ({
      ...m,
      lessons: m.lessons.map((l) => (lessonPatches.has(l.id) ? { ...l, ...lessonPatches.get(l.id)! } : l)),
      quiz: m.quiz.map(q),
    })),
    exams: base.exams.map((e) => ({ ...e, questions: e.questions.map(q) })),
  };
}

/** The published course for this request (one small query). */
export async function loadCourse(db: D1Like): Promise<{ course: Course; overrides: OverrideRow[] }> {
  const overrides = await allOverrides(db);
  return { course: applyOverrides(BASE_COURSE, overrides), overrides };
}

/* ---------------- validation of admin edits ---------------- */
const clean = (v: string, max: number) => v.replace(/\r\n/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').slice(0, max);
const isStr = (v: unknown): v is string => typeof v === 'string';

export type Checked<T> = { ok: true; value: T } | { ok: false; error: string };

export function checkLessonPatch(raw: unknown): Checked<LessonPatch> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, error: 'Invalid lesson data.' };
  const r = raw as Record<string, unknown>;
  const out: LessonPatch = {};
  if ('title' in r) {
    if (!isStr(r.title) || r.title.trim().length < 3) return { ok: false, error: 'Title must be at least 3 characters.' };
    out.title = clean(r.title.trim(), 160);
  }
  if ('minutes' in r) {
    if (typeof r.minutes !== 'number' || !Number.isInteger(r.minutes) || r.minutes < 1 || r.minutes > 240) return { ok: false, error: 'Minutes must be a whole number from 1 to 240.' };
    out.minutes = r.minutes;
  }
  if ('objectives' in r) {
    if (!Array.isArray(r.objectives) || !r.objectives.every(isStr)) return { ok: false, error: 'Objectives must be a list of text items.' };
    const items = r.objectives.map((o) => clean(o.trim(), 300)).filter(Boolean);
    if (items.length < 1 || items.length > 12) return { ok: false, error: 'Give between 1 and 12 objectives.' };
    out.objectives = items;
  }
  if ('body' in r) {
    if (!isStr(r.body) || r.body.trim().length < 50) return { ok: false, error: 'Lesson content must be at least 50 characters.' };
    out.body = clean(r.body, 60_000);
  }
  if ('keyTerms' in r) {
    if (!Array.isArray(r.keyTerms) || r.keyTerms.length > 30) return { ok: false, error: 'Key terms must be a list of up to 30 items.' };
    const terms = [];
    for (const t of r.keyTerms) {
      if (!t || typeof t !== 'object' || !isStr((t as Record<string, unknown>).term) || !isStr((t as Record<string, unknown>).def)) return { ok: false, error: 'Each key term needs a term and a definition.' };
      const term = clean(((t as Record<string, string>).term).trim(), 120);
      const def = clean(((t as Record<string, string>).def).trim(), 600);
      if (term && def) terms.push({ term, def });
    }
    out.keyTerms = terms;
  }
  if ('topics' in r) {
    if (!Array.isArray(r.topics) || !r.topics.every(isStr) || r.topics.length < 1 || r.topics.length > 12) return { ok: false, error: 'Choose between 1 and 12 source topics.' };
    const unknown = r.topics.filter((t) => !SOURCE_MAP[t]);
    if (unknown.length) return { ok: false, error: `Unknown source topic: ${unknown[0]}` };
    out.topics = [...new Set(r.topics)];
  }
  if (Object.keys(out).length === 0) return { ok: false, error: 'Nothing to save.' };
  return { ok: true, value: out };
}

export function checkQuestionPatch(raw: unknown): Checked<QuestionPatch> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, error: 'Invalid question data.' };
  const r = raw as Record<string, unknown>;
  const out: QuestionPatch = {};
  if ('stem' in r) {
    if (!isStr(r.stem) || r.stem.trim().length < 10) return { ok: false, error: 'The question must be at least 10 characters.' };
    out.stem = clean(r.stem.trim(), 1200);
  }
  if ('options' in r) {
    if (!Array.isArray(r.options) || r.options.length !== 4 || !r.options.every(isStr)) return { ok: false, error: 'Exactly four answer options are required.' };
    const opts = r.options.map((o) => clean(o.trim(), 400));
    if (opts.some((o) => !o)) return { ok: false, error: 'Answer options cannot be empty.' };
    if (new Set(opts.map((o) => o.toLowerCase())).size !== 4) return { ok: false, error: 'Answer options must all be different.' };
    if (opts.some((o) => /all of the above|none of the above/i.test(o))) return { ok: false, error: '"All/none of the above" does not work with shuffled options.' };
    out.options = opts as [string, string, string, string];
  }
  if ('answer' in r) {
    if (![0, 1, 2, 3].includes(r.answer as number)) return { ok: false, error: 'The correct answer must be option A, B, C or D.' };
    out.answer = r.answer as 0 | 1 | 2 | 3;
  }
  if ('explanation' in r) {
    if (!isStr(r.explanation) || r.explanation.trim().length < 20) return { ok: false, error: 'The explanation must be at least 20 characters.' };
    out.explanation = clean(r.explanation.trim(), 2000);
  }
  if ('ref' in r) {
    if (!isStr(r.ref) || !r.ref.trim()) return { ok: false, error: 'A source reference is required.' };
    out.ref = clean(r.ref.trim(), 200);
  }
  if ('topic' in r) {
    if (!isStr(r.topic) || !SOURCE_MAP[r.topic]) return { ok: false, error: 'Choose a known source topic.' };
    out.topic = r.topic;
  }
  if (Object.keys(out).length === 0) return { ok: false, error: 'Nothing to save.' };
  return { ok: true, value: out };
}
