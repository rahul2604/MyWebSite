import { useEffect, useState } from 'react';
import { ApiError, api, type CourseState, type Lesson } from './api';
import { Markdown } from './Markdown';
import { go, href } from './route';

type Load = { kind: 'loading' } | { kind: 'error'; message: string; locked: boolean } | { kind: 'ready'; lesson: Lesson; completed: boolean };

export function LessonView({ id, state, refresh, preview = false }: { id: string; state: CourseState; refresh: () => Promise<void>; preview?: boolean }) {
  const [load, setLoad] = useState<Load>({ kind: 'loading' });
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    let live = true;
    api
      .lesson(id)
      .then((r) => live && setLoad({ kind: 'ready', lesson: r.lesson, completed: r.completed }))
      .catch((err) => live && setLoad({ kind: 'error', message: err instanceof ApiError ? err.message : 'Could not load this lesson.', locked: err instanceof ApiError && err.status === 403 }));
    return () => {
      live = false;
    };
  }, [id]);

  if (load.kind === 'loading') return <p className="pmp-status">Loading lesson…</p>;
  if (load.kind === 'error')
    return (
      <div className="pmp-card pmp-notice" role="alert">
        <p>{load.message}</p>
        <a className="btn btn-ghost btn-small" href={href()}>
          Back to dashboard
        </a>
      </div>
    );

  const { lesson, completed } = load;
  const mod = state.modules.find((m) => m.id === lesson.moduleId);
  const isLastLesson = !lesson.nextLessonId;

  const completeAndContinue = async () => {
    setBusy(true);
    setActionError('');
    try {
      // Administrator previews never record progress.
      if (!completed && !preview) await api.completeLesson(lesson.id);
      if (!preview) await refresh();
      go(lesson.nextLessonId ? `lesson/${lesson.nextLessonId}` : `check/${lesson.moduleId}`);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Could not save your progress. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="pmp-page pmp-lesson">
      <nav className="pmp-crumbs" aria-label="Breadcrumb">
        <a href={href()}>Dashboard</a>
        <span aria-hidden="true">/</span>
        <span>
          Module {lesson.moduleNumber}: {lesson.moduleTitle}
        </span>
      </nav>
      <header className="pmp-page-head">
        <span className="eyebrow">
          LESSON {lesson.position.index} OF {lesson.position.of} · {lesson.minutes} MIN
        </span>
        <h2 className="display">{lesson.title}</h2>
        {completed && <span className="pmp-pill is-completed">Completed</span>}
      </header>

      <section className="pmp-card pmp-objectives" aria-labelledby="obj-h">
        <h3 id="obj-h">By the end of this lesson you can</h3>
        <ul>
          {lesson.objectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>

      <div className="pmp-prose">
        <Markdown source={lesson.body} />
      </div>

      {lesson.keyTerms.length > 0 && (
        <section className="pmp-card pmp-terms" aria-labelledby="terms-h">
          <h3 id="terms-h">Key terms</h3>
          <dl>
            {lesson.keyTerms.map((t) => (
              <div key={t.term}>
                <dt>{t.term}</dt>
                <dd>{t.def}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="pmp-sources" aria-labelledby="src-h">
        <h3 id="src-h">Read alongside</h3>
        <ul>
          {lesson.sources.map((s) => (
            <li key={`${s.book}-${s.section}`}>
              <strong>{s.book}</strong>, {s.section}
              {s.printed ? ` · pp. ${s.printed}` : ''} <span className="pmp-muted">(PDF {s.pdf})</span>
            </li>
          ))}
        </ul>
        <p className="pmp-muted pmp-small">The lesson is an original explanation. Page numbers refer to the source edition used to build this course.</p>
      </section>

      <div className="pmp-lesson-actions">
        {lesson.prevLessonId ? (
          <a className="btn btn-ghost" href={href(`lesson/${lesson.prevLessonId}`)}>
            Previous lesson
          </a>
        ) : (
          <span />
        )}
        <button className="btn btn-blue btn-cta" type="button" onClick={() => void completeAndContinue()} disabled={busy}>
          {busy ? 'Saving…' : completed || preview ? (isLastLesson ? 'Go to the knowledge check' : 'Next lesson') : isLastLesson ? 'Complete and take the knowledge check' : 'Complete and continue'}
        </button>
      </div>
      {actionError && (
        <p className="field-error" role="alert">
          {actionError}
        </p>
      )}
      {mod && isLastLesson && <p className="pmp-muted pmp-small pmp-right">The knowledge check has {mod.quiz.questionCount} questions. Score 80% to open the next module.</p>}
    </article>
  );
}
