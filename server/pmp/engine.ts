/*
 * The rules of the learning path, enforced on the server:
 *   - a module opens when the previous module's knowledge check is passed (Module 0 is open)
 *   - a lesson opens when the previous lesson in its module is complete
 *   - a knowledge check opens when every lesson in its module is complete
 *   - Mock Test 1 opens when every knowledge check is passed
 *   - Mock Test 2 opens when Mock Test 1 has been submitted
 *   - the final assessment opens when Mock Test 2 has been submitted
 *   - a certificate is issued when the final assessment is passed (score >= PASS_MARK)
 *
 * Scoring: options are shuffled per attempt; the layout (question order and option order)
 * is stored with the attempt, and the learner's displayed choices are mapped back to the
 * original options before marking. Answer keys never leave the server before submission.
 */
import { EXAMS, MODULES } from './course.ts';
import { SOURCE_MAP } from './sourceMap.ts';
import { PASS_MARK, type Exam, type Lesson, type Module, type Question } from './types.ts';
import type { AttemptRow } from './store.ts';

export const EXAM_GRACE_MS = 2 * 60 * 1000;
export const FINAL_RETAKE_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export type Status = 'locked' | 'available' | 'completed';

export interface AssessmentState {
  id: string;
  kind: 'quiz' | 'exam';
  title: string;
  questionCount: number;
  minutes: number | null;
  status: Status;
  /** Best percentage across submitted attempts. */
  best: number | null;
  passed: boolean;
  attempts: number;
  openAttemptId: string | null;
  /** When a locked-by-cooldown final can be retaken. */
  availableFromMs: number | null;
  lockReason: string | null;
}

export interface CourseState {
  modules: {
    id: string;
    number: string;
    title: string;
    summary: string;
    status: Status;
    lessons: { id: string; title: string; minutes: number; status: Status }[];
    quiz: AssessmentState;
  }[];
  exams: AssessmentState[];
  progress: { lessonsDone: number; lessonsTotal: number; quizzesPassed: number; quizzesTotal: number; percent: number };
  /** The next thing to do, for the dashboard's "continue" button. */
  next: { kind: 'lesson' | 'quiz' | 'exam' | 'certificate'; id: string; title: string } | null;
  certificateEligible: boolean;
}

const pct = (score: number, total: number) => Math.round((score / total) * 1000) / 10;

function attemptSummary(assessmentId: string, attempts: AttemptRow[]) {
  const mine = attempts.filter((a) => a.assessment_id === assessmentId);
  const submitted = mine.filter((a) => a.status === 'submitted');
  const best = submitted.length ? Math.max(...submitted.map((a) => pct(a.score ?? 0, a.total))) : null;
  const open = mine.find((a) => a.status === 'open') ?? null;
  const lastSubmitted = submitted.length ? Math.max(...submitted.map((a) => a.submitted_ms ?? 0)) : null;
  return { submitted, best, passed: submitted.some((a) => a.passed === 1), open, lastSubmitted, count: submitted.length };
}

export function courseState(done: Set<string>, attempts: AttemptRow[], nowMs: number): CourseState {
  let previousPassed = true; // Module 0 is always open
  const modules: CourseState['modules'] = [];
  let next: CourseState['next'] = null;
  let lessonsDone = 0;
  let lessonsTotal = 0;
  let quizzesPassed = 0;

  for (const mod of MODULES) {
    const open: boolean = previousPassed;
    let prevLessonDone = true;
    const lessons = mod.lessons.map((l) => {
      lessonsTotal++;
      const complete = done.has(l.id);
      if (complete) lessonsDone++;
      const status: Status = !open ? 'locked' : complete ? 'completed' : prevLessonDone ? 'available' : 'locked';
      if (status === 'available' && !next) next = { kind: 'lesson', id: l.id, title: l.title };
      prevLessonDone = complete;
      return { id: l.id, title: l.title, minutes: l.minutes, status };
    });
    const allLessonsDone = mod.lessons.every((l) => done.has(l.id));
    const s = attemptSummary(mod.id, attempts);
    if (s.passed) quizzesPassed++;
    const quizStatus: Status = s.passed ? 'completed' : open && allLessonsDone ? 'available' : 'locked';
    if (quizStatus === 'available' && !next) next = { kind: 'quiz', id: mod.id, title: `${mod.title}: knowledge check` };
    modules.push({
      id: mod.id,
      number: mod.number,
      title: mod.title,
      summary: mod.summary,
      status: !open ? 'locked' : s.passed ? 'completed' : 'available',
      lessons,
      quiz: {
        id: mod.id,
        kind: 'quiz',
        title: `Module ${mod.number} knowledge check`,
        questionCount: mod.quiz.length,
        minutes: null,
        status: quizStatus,
        best: s.best,
        passed: s.passed,
        attempts: s.count,
        openAttemptId: s.open?.id ?? null,
        availableFromMs: null,
        lockReason: quizStatus === 'locked' ? (open ? 'Complete every lesson in this module first.' : 'Pass the previous module\'s knowledge check first.') : null,
      },
    });
    previousPassed = open && s.passed;
  }

  const exams: AssessmentState[] = [];
  let examGate = previousPassed; // all knowledge checks passed
  let gateReason = 'Pass every module knowledge check first.';
  for (const ex of EXAMS) {
    const s = attemptSummary(ex.id, attempts);
    let status: Status = s.passed || (ex.id !== 'final' && s.count > 0) ? 'completed' : examGate ? 'available' : 'locked';
    let availableFromMs: number | null = null;
    let lockReason = status === 'locked' ? gateReason : null;
    if (ex.id === 'final' && status === 'available' && !s.passed && s.lastSubmitted && !s.open) {
      const until = s.lastSubmitted + FINAL_RETAKE_COOLDOWN_MS;
      if (nowMs < until) {
        status = 'locked';
        availableFromMs = until;
        lockReason = 'You can retake the final assessment 24 hours after your last attempt.';
      }
    }
    // Mocks can be retaken once submitted; "completed" only marks that the gate is satisfied.
    if (status === 'available' && !next) next = { kind: 'exam', id: ex.id, title: ex.title };
    exams.push({
      id: ex.id,
      kind: 'exam',
      title: ex.title,
      questionCount: ex.questions.length,
      minutes: ex.minutes,
      status,
      best: s.best,
      passed: s.passed,
      attempts: s.count,
      openAttemptId: s.open?.id ?? null,
      availableFromMs,
      lockReason,
    });
    examGate = examGate && s.count > 0;
    gateReason = `Submit ${ex.title} first.`;
  }

  const finalPassed = exams.find((e) => e.id === 'final')?.passed ?? false;
  if (finalPassed && !next) next = { kind: 'certificate', id: 'certificate', title: 'Your course certificate' };
  const quizzesTotal = MODULES.length;
  const units = lessonsTotal + quizzesTotal + EXAMS.length;
  const unitsDone = lessonsDone + quizzesPassed + exams.filter((e) => (e.id === 'final' ? e.passed : e.attempts > 0)).length;
  return {
    modules,
    exams,
    progress: { lessonsDone, lessonsTotal, quizzesPassed, quizzesTotal, percent: Math.round((unitsDone / units) * 100) },
    next,
    certificateEligible: finalPassed,
  };
}

/* ---------------- lookups ---------------- */
export function findLesson(id: string): { module: Module; lesson: Lesson; index: number } | null {
  for (const module of MODULES) {
    const index = module.lessons.findIndex((l) => l.id === id);
    if (index >= 0) return { module, lesson: module.lessons[index], index };
  }
  return null;
}

export function findAssessment(id: string): { kind: 'quiz'; module: Module; questions: Question[] } | { kind: 'exam'; exam: Exam; questions: Question[] } | null {
  const module = MODULES.find((m) => m.id === id);
  if (module) return { kind: 'quiz', module, questions: module.quiz };
  const exam = EXAMS.find((e) => e.id === id);
  if (exam) return { kind: 'exam', exam, questions: exam.questions };
  return null;
}

export function lessonStatus(state: CourseState, lessonId: string): Status {
  for (const m of state.modules) for (const l of m.lessons) if (l.id === lessonId) return l.status;
  return 'locked';
}

export function assessmentStatus(state: CourseState, id: string): AssessmentState | null {
  return state.modules.find((m) => m.id === id)?.quiz ?? state.exams.find((e) => e.id === id) ?? null;
}

/** Public lesson payload with source references derived from its topics. */
export function lessonPayload(module: Module, lesson: Lesson, index: number) {
  const sources = lesson.topics
    .map((t) => SOURCE_MAP[t])
    .filter(Boolean)
    .map((s) => ({ book: s.book, section: s.section, printed: s.printed, pdf: s.pdf }));
  const unique = sources.filter((s, i) => sources.findIndex((x) => x.book === s.book && x.section === s.section) === i);
  const prev = module.lessons[index - 1];
  const nextLesson = module.lessons[index + 1];
  return {
    id: lesson.id,
    moduleId: module.id,
    moduleNumber: module.number,
    moduleTitle: module.title,
    title: lesson.title,
    minutes: lesson.minutes,
    objectives: lesson.objectives,
    body: lesson.body,
    keyTerms: lesson.keyTerms ?? [],
    sources: unique,
    prevLessonId: prev?.id ?? null,
    nextLessonId: nextLesson?.id ?? null,
    position: { index: index + 1, of: module.lessons.length },
  };
}

/* ---------------- attempts ---------------- */
export interface LayoutItem {
  q: string;
  /** o[displayIndex] = original option index */
  o: number[];
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  const r = new Uint32Array(a.length);
  crypto.getRandomValues(r);
  for (let i = a.length - 1; i > 0; i--) {
    const j = r[i] % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Quizzes keep the authored question order (it follows the lessons); exams shuffle questions too. */
export function newLayout(questions: Question[], shuffleQuestions: boolean): LayoutItem[] {
  const order = shuffleQuestions ? shuffle(questions) : questions;
  return order.map((qn) => ({ q: qn.id, o: shuffle([0, 1, 2, 3]) }));
}

/** Questions as the learner sees them: no answers, no explanations. */
export function presentQuestions(questions: Question[], layout: LayoutItem[]) {
  const byId = new Map(questions.map((qn) => [qn.id, qn]));
  return layout.map((item, i) => {
    const qn = byId.get(item.q)!;
    return { id: qn.id, number: i + 1, stem: qn.stem, options: item.o.map((orig) => qn.options[orig]) };
  });
}

export function parseLayout(raw: string): LayoutItem[] {
  return JSON.parse(raw) as LayoutItem[];
}

/** Validates the submitted answers against the attempt layout: { questionId: displayed index 0-3 }. */
export function cleanAnswers(raw: unknown, layout: LayoutItem[]): Record<string, number> {
  const out: Record<string, number> = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  const ids = new Set(layout.map((l) => l.q));
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (ids.has(k) && typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 3) out[k] = v;
  }
  return out;
}

export function score(questions: Question[], layout: LayoutItem[], answers: Record<string, number>) {
  const byId = new Map(questions.map((qn) => [qn.id, qn]));
  let correct = 0;
  const results = layout.map((item, i) => {
    const qn = byId.get(item.q)!;
    const chosenDisplay = answers[item.q];
    const chosenOriginal = chosenDisplay === undefined ? null : item.o[chosenDisplay];
    const correctDisplay = item.o.indexOf(qn.answer);
    const isCorrect = chosenOriginal === qn.answer;
    if (isCorrect) correct++;
    return {
      id: qn.id,
      number: i + 1,
      stem: qn.stem,
      options: item.o.map((orig) => qn.options[orig]),
      chosen: chosenDisplay ?? null,
      correct: correctDisplay,
      isCorrect,
      explanation: qn.explanation,
      ref: qn.ref,
      topic: qn.topic,
    };
  });
  const total = layout.length;
  return { score: correct, total, percent: pct(correct, total), passed: correct / total >= PASS_MARK, results };
}
