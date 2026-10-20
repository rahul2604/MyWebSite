/*
 * Client for /api/pmp. The session lives in an HttpOnly cookie the browser sends
 * automatically; this code never sees or stores a token. Nothing here imports server
 * content, so answer keys can never end up in the browser bundle.
 */

export type Status = 'locked' | 'available' | 'completed';

export interface AssessmentState {
  id: string;
  kind: 'quiz' | 'exam';
  title: string;
  questionCount: number;
  minutes: number | null;
  status: Status;
  best: number | null;
  passed: boolean;
  attempts: number;
  openAttemptId: string | null;
  availableFromMs: number | null;
  lockReason: string | null;
}

export interface ModuleState {
  id: string;
  number: string;
  title: string;
  summary: string;
  status: Status;
  lessons: { id: string; title: string; minutes: number; status: Status }[];
  quiz: AssessmentState;
}

export interface CourseState {
  modules: ModuleState[];
  exams: AssessmentState[];
  progress: { lessonsDone: number; lessonsTotal: number; quizzesPassed: number; quizzesTotal: number; percent: number };
  next: { kind: 'lesson' | 'quiz' | 'exam' | 'certificate'; id: string; title: string } | null;
  certificateEligible: boolean;
}

export interface Me {
  user: { id: string; name: string; email: string; joined: string };
  course: { title: string; version: string; passMark: number };
  state: CourseState;
  certificate: { code: string; issued: string; name: string } | null;
}

export interface Lesson {
  id: string;
  moduleId: string;
  moduleNumber: string;
  moduleTitle: string;
  title: string;
  minutes: number;
  objectives: string[];
  body: string;
  keyTerms: { term: string; def: string }[];
  sources: { book: string; section: string; printed: string; pdf: string }[];
  prevLessonId: string | null;
  nextLessonId: string | null;
  position: { index: number; of: number };
}

export interface Attempt {
  id: string;
  assessmentId: string;
  kind: 'quiz' | 'exam';
  title: string;
  startedAt: string;
  deadline: string | null;
  serverNow: string;
  passMark: number;
  questions: { id: string; number: number; stem: string; options: string[] }[];
}

export interface Result {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  results: {
    id: string;
    number: number;
    stem: string;
    options: string[];
    chosen: number | null;
    correct: number;
    isCorrect: boolean;
    explanation: string;
    ref: string;
    topic: string;
  }[];
}

export interface Verification {
  certificate: { code: string; name: string; issued: string; course: string; courseVersion: string };
  notice: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/pmp/${path}`, {
      method: init.method ?? (init.body !== undefined ? 'POST' : 'GET'),
      credentials: 'same-origin',
      headers: init.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'network', 'We could not reach the server. Check your connection and try again.');
  }
  let data: Record<string, unknown> = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON error page */
  }
  if (!res.ok || data.ok === false) {
    throw new ApiError(res.status, String(data.code ?? 'error'), String(data.error ?? 'Something went wrong. Please try again.'));
  }
  return data as T;
}

export const api = {
  me: () => request<Me & { ok: true }>('me'),
  signup: (name: string, email: string, password: string) => request<{ user: { name: string } }>('auth/signup', { body: { name, email, password } }),
  login: (email: string, password: string) => request<{ user: { name: string } }>('auth/login', { body: { email, password } }),
  logout: () => request<{ ok: true }>('auth/logout', { body: {} }),
  lesson: (id: string) => request<{ lesson: Lesson; completed: boolean }>(`lessons/${encodeURIComponent(id)}`),
  completeLesson: (id: string) => request<{ state: CourseState }>(`lessons/${encodeURIComponent(id)}/complete`, { body: {} }),
  start: (id: string) => request<{ attempt: Attempt }>(`assessments/${encodeURIComponent(id)}/start`, { body: {} }),
  submit: (id: string, attemptId: string, answers: Record<string, number>) =>
    request<{ result: Result; state: CourseState; replayed?: boolean }>(`assessments/${encodeURIComponent(id)}/submit`, { body: { attemptId, answers } }),
  attempt: (id: string) => request<{ attempt: { id: string; assessmentId: string; submittedAt: string }; result: Result }>(`attempts/${encodeURIComponent(id)}`),
  issueCertificate: () => request<{ certificate: { code: string; issued: string; name: string } }>('certificate', { body: {} }),
  verify: (code: string) => request<Verification>(`verify/${encodeURIComponent(code)}`),
  certificatePdfUrl: '/api/pmp/certificate.pdf',
};
