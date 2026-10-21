/*
 * /api/pmp/admin/* — administrator API. The caller has already been authenticated and its
 * role checked against the database in router.ts (role === 'admin', password changed).
 *
 *   GET  overview                         real counts from the course, D1 and source artifacts
 *   GET  modules                          every module with lessons, topics, sources, quiz info, edit status
 *   GET  lessons/:id                      authored, published and draft versions + learner-view payloads
 *   PUT  lessons/:id/draft  {patch}       save a draft (never shown to learners)
 *   POST lessons/:id/publish              publish the draft
 *   POST lessons/:id/discard              discard the draft
 *   POST lessons/:id/revert {confirm}     remove the published edit (back to authored content)
 *   GET  assessments                      knowledge checks, mocks and final with pass rules
 *   GET  assessments/:id                  questions WITH answers, explanations, topics, edit status
 *   PUT  questions/:id/draft  {patch}     same draft / publish / discard / revert cycle as lessons
 *   POST preview/:assessmentId/start      learner-format questions + layout; nothing is stored
 *   POST preview/:assessmentId/score      score a preview; nothing is stored
 *   GET  topics                           source topic -> lessons / questions / pages, with gaps
 *   GET  learners, learners/:id           learner progress (no password data)
 *   GET  audit                            recent administrative actions
 *   GET  certificate-sample.pdf           the certificate template with sample data
 */
import type { D1Like } from '../bookingStore.ts';
import { fail, json } from '../http.ts';
import {
  applyOverrides,
  checkLessonPatch,
  checkQuestionPatch,
  findBaseLesson,
  findBaseQuestion,
  loadCourse,
  type Course,
} from './content.ts';
import { courseState, findAssessment, findLesson, lessonPayload, newLayout, presentQuestions, score, type LayoutItem } from './engine.ts';
import { pdfResponse, readJson } from './router.ts';
import { SOURCE_MAP } from './sourceMap.ts';
import { SOURCE_STATS } from './sourceStats.ts';
import {
  attemptsFor,
  audit,
  completedLessons,
  discardDraft,
  findCertificateByUser,
  findUserById,
  learnerSummaries,
  passedAssessmentsByUser,
  publishDraft,
  recentAudit,
  revertPublished,
  saveDraft,
  type OverrideKind,
  type OverrideRow,
  type UserRow,
} from './store.ts';
import { PASS_MARK, type Question } from './types.ts';

const parse = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const editState = (o: OverrideRow | undefined) => ({
  published: !!o?.published,
  publishedAt: o?.published_ms ? new Date(o.published_ms).toISOString() : null,
  draft: !!o?.draft,
  draftAt: o?.draft_updated_ms ? new Date(o.draft_updated_ms).toISOString() : null,
});

const sourcesFor = (topics: string[]) =>
  topics.map((t) => ({ topic: t, title: SOURCE_STATS.topics[t]?.title ?? t, ...(SOURCE_MAP[t] ?? { book: '', section: '', printed: '', pdf: '' }) }));

function allQuestions(course: Course) {
  return [
    ...course.modules.flatMap((m) => m.quiz.map((q) => ({ q, assessmentId: m.id }))),
    ...course.exams.flatMap((e) => e.questions.map((q) => ({ q, assessmentId: e.id }))),
  ];
}

const adminQuestion = (q: Question, o: OverrideRow | undefined) => ({
  id: q.id,
  stem: q.stem,
  options: q.options,
  answer: q.answer,
  explanation: q.explanation,
  ref: q.ref,
  topic: q.topic,
  topicTitle: SOURCE_STATS.topics[q.topic]?.title ?? q.topic,
  edit: editState(o),
  draft: parse<Partial<Question>>(o?.draft ?? null),
});

export async function handleAdmin(request: Request, db: D1Like, admin: UserRow, parts: string[], now: number): Promise<Response> {
  const method = request.method;
  const [section, id, action] = parts;
  const { course, overrides } = await loadCourse(db);
  const ov = (kind: OverrideKind, itemId: string) => overrides.find((o) => o.kind === kind && o.item_id === itemId);

  /* ---------------- overview ---------------- */
  if (section === 'overview' && method === 'GET') {
    const learners = await learnerSummaries(db, 100_000);
    const questions = allQuestions(course);
    const taughtTopics = new Set(course.modules.flatMap((m) => m.lessons.flatMap((l) => l.topics)));
    const assessedTopics = new Set(questions.map((x) => x.q.topic));
    const allTopics = Object.keys(SOURCE_STATS.topics);
    return json(200, {
      ok: true,
      curriculum: {
        modules: course.modules.length,
        lessons: course.modules.reduce((n, m) => n + m.lessons.length, 0),
        lessonMinutes: course.modules.reduce((n, m) => n + m.lessons.reduce((k, l) => k + l.minutes, 0), 0),
        knowledgeChecks: course.modules.length,
        knowledgeCheckQuestions: course.modules.reduce((n, m) => n + m.quiz.length, 0),
        mockTests: course.exams.filter((e) => e.id.startsWith('mock')).map((e) => ({ id: e.id, title: e.title, questions: e.questions.length, minutes: e.minutes })),
        final: course.exams.filter((e) => e.id === 'final').map((e) => ({ id: e.id, title: e.title, questions: e.questions.length, minutes: e.minutes }))[0] ?? null,
        passMarkPercent: PASS_MARK * 100,
        lessonsLabelledAs: 'Lesson-level quizzes are not part of this course design; each module ends with one knowledge check.',
      },
      coverage: {
        topics: allTopics.length,
        taught: allTopics.filter((t) => taughtTopics.has(t)).length,
        assessed: allTopics.filter((t) => assessedTopics.has(t)).length,
        untaught: allTopics.filter((t) => !taughtTopics.has(t)),
        unassessed: allTopics.filter((t) => !assessedTopics.has(t)),
      },
      source: {
        expectedPages: SOURCE_STATS.expectedPages,
        manifestRecords: SOURCE_STATS.manifestRecords,
        missingPages: SOURCE_STATS.missingPages,
        verification: SOURCE_STATS.verification,
        byBook: SOURCE_STATS.byBook,
        byDisposition: SOURCE_STATS.byDisposition,
        visualInspection: SOURCE_STATS.visualInspection,
        pagesWithIssues: SOURCE_STATS.pagesWithIssues,
        unresolved: SOURCE_STATS.unresolved,
        contentPagesWithoutTopics: SOURCE_STATS.contentPagesWithoutTopics,
        index: SOURCE_STATS.index,
      },
      edits: {
        publishedLessonEdits: overrides.filter((o) => o.kind === 'lesson' && o.published).length,
        publishedQuestionEdits: overrides.filter((o) => o.kind === 'question' && o.published).length,
        drafts: overrides.filter((o) => o.draft).map((o) => ({ kind: o.kind, id: o.item_id, updated: o.draft_updated_ms ? new Date(o.draft_updated_ms).toISOString() : null })),
      },
      learners: { total: learners.length, withCertificate: learners.filter((l) => l.certificate_code).length },
    });
  }

  /* ---------------- modules ---------------- */
  if (section === 'modules' && !id && method === 'GET') {
    return json(200, {
      ok: true,
      modules: course.modules.map((m, i) => {
        const topics = [...new Set(m.lessons.flatMap((l) => l.topics))];
        return {
          id: m.id,
          number: m.number,
          title: m.title,
          summary: m.summary,
          minutes: m.lessons.reduce((n, l) => n + l.minutes, 0),
          prerequisite: i === 0 ? null : `Pass the Module ${course.modules[i - 1].number} knowledge check`,
          published: true,
          lessons: m.lessons.map((l) => ({ id: l.id, title: l.title, minutes: l.minutes, objectives: l.objectives, topics: l.topics, edit: editState(ov('lesson', l.id)) })),
          sources: sourcesFor(topics),
          quiz: { questions: m.quiz.length, passMarkPercent: PASS_MARK * 100, edited: m.quiz.filter((q) => ov('question', q.id)?.published).length },
        };
      }),
    });
  }

  /* ---------------- lessons ---------------- */
  if (section === 'lessons' && id) {
    const base = findBaseLesson(id);
    const found = findLesson(id, course);
    if (!base || !found) return fail(404, 'not_found', 'Lesson not found.');
    const o = ov('lesson', id);

    if (!action && method === 'GET') {
      const draft = parse<Record<string, unknown>>(o?.draft ?? null);
      const draftCourse = draft ? applyOverrides(course, [{ kind: 'lesson', item_id: id, published: JSON.stringify(draft), draft: null, draft_updated_ms: null, draft_by: null, published_ms: null, published_by: null }]) : null;
      const draftFound = draftCourse ? findLesson(id, draftCourse) : null;
      const related = found.module.quiz.filter((q) => q.topic && found.lesson.topics.includes(q.topic)).map((q) => ({ id: q.id, stem: q.stem }));
      return json(200, {
        ok: true,
        authored: base,
        current: found.lesson,
        draft,
        edit: editState(o),
        learnerView: lessonPayload(found.module, found.lesson, found.index),
        draftView: draftFound ? lessonPayload(draftFound.module, draftFound.lesson, draftFound.index) : null,
        sources: sourcesFor(found.lesson.topics),
        relatedQuestions: related,
        module: { id: found.module.id, number: found.module.number, title: found.module.title },
      });
    }
    return editAction(request, db, admin, now, 'lesson', id, action, o);
  }

  /* ---------------- questions ---------------- */
  if (section === 'questions' && id && action) {
    if (!findBaseQuestion(id)) return fail(404, 'not_found', 'Question not found.');
    return editAction(request, db, admin, now, 'question', id, action, ov('question', id));
  }

  /* ---------------- assessments ---------------- */
  if (section === 'assessments' && method === 'GET') {
    if (!id) {
      return json(200, {
        ok: true,
        passMarkPercent: PASS_MARK * 100,
        assessments: [
          ...course.modules.map((m, i) => ({
            id: m.id,
            kind: 'quiz',
            title: `Module ${m.number} knowledge check`,
            module: m.title,
            questions: m.quiz.length,
            minutes: null,
            unlockRule: 'Opens when every lesson in the module is complete.',
            consequence: i < course.modules.length - 1 ? `Passing opens Module ${course.modules[i + 1].number}.` : 'Passing every knowledge check opens Mock Test 1.',
          })),
          ...course.exams.map((e) => ({
            id: e.id,
            kind: 'exam',
            title: e.title,
            module: null,
            questions: e.questions.length,
            minutes: e.minutes,
            unlockRule: e.id === 'mock-1' ? 'Opens when every module knowledge check is passed.' : e.id === 'mock-2' ? 'Opens when Mock Test 1 has been submitted.' : 'Opens when Mock Test 2 has been submitted; a failed attempt can be retaken after 24 hours.',
            consequence: e.id === 'final' ? 'Passing (80%) makes the learner eligible for the certificate.' : 'Submitting (any score) opens the next exam.',
          })),
        ],
      });
    }
    const a = findAssessment(id, course);
    if (!a) return fail(404, 'not_found', 'Assessment not found.');
    return json(200, {
      ok: true,
      id,
      kind: a.kind,
      title: a.kind === 'exam' ? a.exam.title : `Module ${a.module.number} knowledge check`,
      minutes: a.kind === 'exam' ? a.exam.minutes : null,
      passMarkPercent: PASS_MARK * 100,
      scoring: 'One mark per question; unanswered questions score zero; pass at 80% or more. Options are shuffled per attempt; exam question order is shuffled too.',
      questions: a.questions.map((q) => adminQuestion(q, ov('question', q.id))),
    });
  }

  /* ---------------- preview (nothing stored) ---------------- */
  if (section === 'preview' && id && method === 'POST') {
    const a = findAssessment(id, course);
    if (!a) return fail(404, 'not_found', 'Assessment not found.');
    const body = await readJson(request);
    if (body instanceof Response) return body;
    if (action === 'start') {
      const layout = newLayout(a.questions, a.kind === 'exam');
      return json(200, {
        ok: true,
        preview: true,
        attempt: {
          id: `preview-${id}`,
          assessmentId: id,
          kind: a.kind,
          title: a.kind === 'exam' ? a.exam.title : `Module ${a.module.number} knowledge check`,
          startedAt: new Date(now).toISOString(),
          deadline: a.kind === 'exam' ? new Date(now + a.exam.minutes * 60_000).toISOString() : null,
          serverNow: new Date(now).toISOString(),
          passMark: PASS_MARK * 100,
          questions: presentQuestions(a.questions, layout),
        },
        layout,
      });
    }
    if (action === 'score') {
      const layout = validLayout(body.layout, a.questions);
      if (!layout) return fail(400, 'bad_layout', 'Invalid preview data.');
      const answers: Record<string, number> = {};
      if (body.answers && typeof body.answers === 'object') {
        for (const [k, v] of Object.entries(body.answers as Record<string, unknown>)) if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 3) answers[k] = v;
      }
      return json(200, { ok: true, preview: true, result: score(a.questions, layout, answers) });
    }
    return fail(404, 'not_found', 'Not found.');
  }

  /* ---------------- topics / coverage ---------------- */
  if (section === 'topics' && method === 'GET') {
    const questions = allQuestions(course);
    return json(200, {
      ok: true,
      topics: Object.entries(SOURCE_STATS.topics).map(([t, info]) => {
        const lessons = course.modules.flatMap((m) => m.lessons.filter((l) => l.topics.includes(t)).map((l) => ({ id: l.id, title: l.title, module: m.number })));
        const qs = questions.filter((x) => x.q.topic === t);
        return {
          id: t,
          title: info.title,
          module: info.module,
          process: info.process,
          source: SOURCE_MAP[t] ?? null,
          lessons,
          questions: { total: qs.length, byAssessment: qs.reduce<Record<string, number>>((acc, x) => ((acc[x.assessmentId] = (acc[x.assessmentId] ?? 0) + 1), acc), {}) },
          status: lessons.length === 0 ? 'not taught' : qs.length === 0 ? 'taught, not assessed' : 'taught and assessed',
        };
      }),
      unresolvedPages: SOURCE_STATS.unresolved,
      contentPagesWithoutTopics: SOURCE_STATS.contentPagesWithoutTopics,
    });
  }

  /* ---------------- learners ---------------- */
  if (section === 'learners' && method === 'GET') {
    if (!id) {
      const [rows, passed] = await Promise.all([learnerSummaries(db), passedAssessmentsByUser(db)]);
      const lessonsTotal = course.modules.reduce((n, m) => n + m.lessons.length, 0);
      return json(200, {
        ok: true,
        lessonsTotal,
        modulesTotal: course.modules.length,
        learners: rows.map((r) => {
          const p = passed.get(r.id) ?? new Set<string>();
          return {
            id: r.id,
            name: r.name,
            email: r.email,
            joined: new Date(r.created_ms).toISOString(),
            lessonsDone: Number(r.lessons_done),
            checksPassed: course.modules.filter((m) => p.has(m.id)).length,
            mock1: p.has('mock-1'),
            mock2: p.has('mock-2'),
            finalPassed: p.has('final'),
            submittedAttempts: Number(r.attempts),
            lastActivity: Math.max(Number(r.last_lesson_ms ?? 0), Number(r.last_attempt_ms ?? 0)) ? new Date(Math.max(Number(r.last_lesson_ms ?? 0), Number(r.last_attempt_ms ?? 0))).toISOString() : null,
            certificate: r.certificate_code,
          };
        }),
      });
    }
    const learner = await findUserById(db, id);
    if (!learner || learner.role !== 'learner') return fail(404, 'not_found', 'Learner not found.');
    const [done, attempts, cert] = await Promise.all([completedLessons(db, id), attemptsFor(db, id), findCertificateByUser(db, id)]);
    const state = courseState(done, attempts, now, course);
    return json(200, {
      ok: true,
      learner: { id: learner.id, name: learner.name, email: learner.email, joined: new Date(learner.created_ms).toISOString() },
      progress: state.progress,
      modules: state.modules.map((m) => ({ id: m.id, number: m.number, title: m.title, status: m.status, lessonsDone: m.lessons.filter((l) => l.status === 'completed').length, lessons: m.lessons.length, quizBest: m.quiz.best, quizPassed: m.quiz.passed })),
      exams: state.exams.map((e) => ({ id: e.id, title: e.title, attempts: e.attempts, best: e.best, passed: e.passed })),
      attempts: attempts.map((a) => ({
        id: a.id,
        assessmentId: a.assessment_id,
        status: a.status,
        started: new Date(a.started_ms).toISOString(),
        submitted: a.submitted_ms ? new Date(a.submitted_ms).toISOString() : null,
        score: a.score,
        total: a.total,
        passed: a.passed === 1,
      })),
      certificateEligible: state.certificateEligible,
      certificate: cert ? { code: cert.code, issued: new Date(cert.issued_ms).toISOString() } : null,
    });
  }

  /* ---------------- audit ---------------- */
  if (section === 'audit' && method === 'GET') {
    const rows = await recentAudit(db);
    return json(200, { ok: true, entries: rows.map((r) => ({ ...r, at: new Date(r.at_ms).toISOString() })) });
  }

  /* ---------------- certificate template ---------------- */
  if (section === 'certificate-sample.pdf' && method === 'GET') {
    return pdfResponse(request, { name: 'Sample Learner', code: 'PMP-SAMP-LE00-0000', issuedMs: now, scoreText: 'Final assessment score: 88.9% (sample)', filename: 'certificate-sample.pdf' });
  }

  return fail(404, 'not_found', 'Not found.');
}

/** Draft / publish / discard / revert for a lesson or question. */
async function editAction(request: Request, db: D1Like, admin: UserRow, now: number, kind: OverrideKind, id: string, action: string | undefined, o: OverrideRow | undefined): Promise<Response> {
  const method = request.method;
  const target = `${kind}:${id}`;
  if (action === 'draft' && method === 'PUT') {
    const body = await readJson(request);
    if (body instanceof Response) return body;
    const checked = kind === 'lesson' ? checkLessonPatch(body.patch) : checkQuestionPatch(body.patch);
    if (!checked.ok) return fail(400, 'invalid', checked.error);
    if (kind === 'question') {
      // Validate the merged result, not just the patch (e.g. answer index against options).
      const base = findBaseQuestion(id)!.question;
      const published = parse<Partial<Question>>(o?.published ?? null) ?? {};
      const existing = parse<Partial<Question>>(o?.draft ?? null) ?? {};
      const merged = { ...base, ...published, ...existing, ...checked.value };
      const recheck = checkQuestionPatch({ stem: merged.stem, options: merged.options, answer: merged.answer, explanation: merged.explanation, ref: merged.ref, topic: merged.topic });
      if (!recheck.ok) return fail(400, 'invalid', recheck.error);
    }
    // A draft builds on the existing draft (if any), which itself started from the published edit.
    const previous = { ...(parse<Record<string, unknown>>(o?.published ?? null) ?? {}), ...(parse<Record<string, unknown>>(o?.draft ?? null) ?? {}) };
    const draft = { ...previous, ...checked.value };
    await saveDraft(db, kind, id, JSON.stringify(draft), now, admin.id);
    await audit(db, now, admin, `${kind}_draft_saved`, target, `fields: ${Object.keys(checked.value).join(', ')}`);
    return json(200, { ok: true, saved: true });
  }
  if (method !== 'POST') return fail(405, 'method', 'Method not allowed.');
  const body = await readJson(request);
  if (body instanceof Response) return body;
  if (action === 'publish') {
    if (!o?.draft) return fail(409, 'no_draft', 'There is no draft to publish.');
    await publishDraft(db, kind, id, now, admin.id);
    await audit(db, now, admin, `${kind}_published`, target);
    return json(200, { ok: true, published: true });
  }
  if (action === 'discard') {
    if (!o?.draft) return fail(409, 'no_draft', 'There is no draft to discard.');
    await discardDraft(db, kind, id);
    await audit(db, now, admin, `${kind}_draft_discarded`, target);
    return json(200, { ok: true });
  }
  if (action === 'revert') {
    if (body.confirm !== true) return fail(400, 'confirm_required', 'Confirm that you want to restore the original authored content.');
    if (!o?.published) return fail(409, 'nothing_published', 'This item has no published edit.');
    await revertPublished(db, kind, id);
    await audit(db, now, admin, `${kind}_reverted`, target);
    return json(200, { ok: true });
  }
  return fail(404, 'not_found', 'Not found.');
}

/** Accepts a preview layout only if it is a permutation of exactly this assessment's questions. */
function validLayout(raw: unknown, questions: Question[]): LayoutItem[] | null {
  if (!Array.isArray(raw) || raw.length !== questions.length) return null;
  const ids = new Set(questions.map((q) => q.id));
  const seen = new Set<string>();
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null;
    const { q, o } = item as { q: unknown; o: unknown };
    if (typeof q !== 'string' || !ids.has(q) || seen.has(q)) return null;
    if (!Array.isArray(o) || o.length !== 4 || [...o].sort().join() !== '0,1,2,3') return null;
    seen.add(q);
  }
  return raw as LayoutItem[];
}

