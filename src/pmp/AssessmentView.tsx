import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ApiError, api, type Attempt, type CourseState, type Result } from './api';
import { ResultView } from './ResultView';
import { href } from './route';

type Phase = { kind: 'intro' } | { kind: 'starting' } | { kind: 'taking'; attempt: Attempt } | { kind: 'submitting'; attempt: Attempt } | { kind: 'done'; result: Result };

const storeKey = (attemptId: string) => `pmp-answers-${attemptId}`;
const loadAnswers = (attemptId: string): Record<string, number> => {
  try {
    return JSON.parse(window.sessionStorage.getItem(storeKey(attemptId)) || '{}');
  } catch {
    return {};
  }
};
const saveAnswers = (attemptId: string, a: Record<string, number>) => {
  try {
    window.sessionStorage.setItem(storeKey(attemptId), JSON.stringify(a));
  } catch {
    /* storage unavailable; answers stay in memory */
  }
};
const clearAnswers = (attemptId: string) => {
  try {
    window.sessionStorage.removeItem(storeKey(attemptId));
  } catch {
    /* ignore */
  }
};

function formatClock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h ? `${h}:` : ''}${String(m).padStart(h ? 2 : 1, '0')}:${String(sec).padStart(2, '0')}`;
}

export function AssessmentView({ id, state, refresh }: { id: string; state: CourseState; refresh: () => Promise<void> }) {
  const info = state.modules.find((m) => m.id === id)?.quiz ?? state.exams.find((e) => e.id === id) ?? null;
  const moduleIndex = state.modules.findIndex((m) => m.id === id);
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' });
  const [error, setError] = useState('');

  const start = useCallback(async () => {
    setError('');
    setPhase({ kind: 'starting' });
    try {
      const { attempt } = await api.start(id);
      setPhase({ kind: 'taking', attempt });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not start. Please try again.');
      setPhase({ kind: 'intro' });
    }
  }, [id]);

  if (!info) {
    return (
      <div className="pmp-card pmp-notice" role="alert">
        <p>We could not find that assessment.</p>
        <a className="btn btn-ghost btn-small" href={href()}>
          Back to dashboard
        </a>
      </div>
    );
  }

  if (phase.kind === 'taking' || phase.kind === 'submitting') {
    return (
      <Runner
        attempt={phase.attempt}
        submitting={phase.kind === 'submitting'}
        onSubmit={async (answers) => {
          setPhase({ kind: 'submitting', attempt: phase.attempt });
          try {
            const r = await api.submit(id, phase.attempt.id, answers);
            clearAnswers(phase.attempt.id);
            await refresh();
            setPhase({ kind: 'done', result: r.result });
          } catch (err) {
            if (err instanceof ApiError && err.status === 410) {
              clearAnswers(phase.attempt.id);
              await refresh();
              setError(err.message);
              setPhase({ kind: 'intro' });
              return;
            }
            setError(err instanceof ApiError ? err.message : 'Could not submit. Your answers are kept on this page; please try again.');
            setPhase({ kind: 'taking', attempt: phase.attempt });
          }
        }}
        error={error}
      />
    );
  }

  if (phase.kind === 'done') {
    const nextModule = moduleIndex >= 0 ? state.modules[moduleIndex + 1] : undefined;
    const nextExam = moduleIndex < 0 ? state.exams[state.exams.findIndex((e) => e.id === id) + 1] : moduleIndex === state.modules.length - 1 ? state.exams[0] : undefined;
    return (
      <ResultView
        title={info.title}
        result={phase.result}
        actions={
          <>
            {phase.result.passed && nextModule && nextModule.status !== 'locked' && (
              <a className="btn btn-blue btn-cta" href={href(`lesson/${nextModule.lessons[0].id}`)}>
                Start Module {nextModule.number}
              </a>
            )}
            {moduleIndex < 0 && id !== 'final' && nextExam && nextExam.status !== 'locked' && (
              <a className="btn btn-blue btn-cta" href={href(`exam/${nextExam.id}`)}>
                Go to {nextExam.title}
              </a>
            )}
            {moduleIndex === state.modules.length - 1 && phase.result.passed && (
              <a className="btn btn-blue btn-cta" href={href('exam/mock-1')}>
                Go to Mock Test 1
              </a>
            )}
            {id === 'final' && phase.result.passed && (
              <a className="btn btn-blue btn-cta" href={href('certificate')}>
                Claim your certificate
              </a>
            )}
            {!(id === 'final' && phase.result.passed) && (
              <button className="btn btn-ghost" type="button" onClick={() => setPhase({ kind: 'intro' })}>
                {phase.result.passed ? 'Back' : 'Try again'}
              </button>
            )}
            <a className="btn btn-ghost" href={href()}>
              Dashboard
            </a>
          </>
        }
      />
    );
  }

  const locked = info.status === 'locked' && !info.openAttemptId;
  const finalPassed = id === 'final' && info.passed;
  return (
    <div className="pmp-page">
      <header className="pmp-page-head">
        <span className="eyebrow">{info.kind === 'quiz' ? 'KNOWLEDGE CHECK' : id === 'final' ? 'FINAL ASSESSMENT' : 'MOCK TEST'}</span>
        <h2 className="display">{info.title}</h2>
      </header>
      <div className="pmp-card pmp-exam-intro">
        <ul className="pmp-exam-facts">
          <li>
            <strong>{info.questionCount}</strong> multiple-choice questions
          </li>
          <li>
            Pass mark <strong>80%</strong>
          </li>
          <li>{info.minutes ? <>Time limit <strong>{info.minutes} minutes</strong> (the clock keeps running if you leave)</> : <>No time limit</>}</li>
          <li>{info.attempts ? `${info.attempts} previous attempt${info.attempts > 1 ? 's' : ''}${info.best !== null ? `, best ${info.best}%` : ''}` : 'Not attempted yet'}</li>
        </ul>
        {info.kind === 'quiz' && <p className="pmp-muted">You can retake a knowledge check as often as you like. Each attempt shuffles the answer options.</p>}
        {id === 'mock-1' && <p className="pmp-muted">Submitting Mock Test 1 (whatever the score) opens Mock Test 2. Use your results to find topics to revise.</p>}
        {id === 'mock-2' && <p className="pmp-muted">Submitting Mock Test 2 opens the final assessment.</p>}
        {id === 'final' && <p className="pmp-muted">Pass with 80% or more to earn your course certificate. If you do not pass, you can retake the final after 24 hours.</p>}
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        {locked ? (
          <p className="pmp-locked-note">{info.lockReason ?? 'This assessment is locked.'}{info.availableFromMs ? ` Available from ${new Date(info.availableFromMs).toLocaleString()}.` : ''}</p>
        ) : finalPassed ? (
          <a className="btn btn-blue btn-cta" href={href('certificate')}>
            You passed. Go to your certificate
          </a>
        ) : (
          <button className="btn btn-blue btn-cta" type="button" onClick={() => void start()} disabled={phase.kind === 'starting'}>
            {phase.kind === 'starting' ? 'Preparing…' : info.openAttemptId ? 'Resume attempt' : info.attempts ? 'Start a new attempt' : 'Start'}
          </button>
        )}
      </div>
    </div>
  );
}

function Runner({ attempt, submitting, onSubmit, error }: { attempt: Attempt; submitting: boolean; onSubmit: (a: Record<string, number>) => Promise<void>; error: string }) {
  const [answers, setAnswers] = useState<Record<string, number>>(() => loadAnswers(attempt.id));
  const [index, setIndex] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const offset = useMemo(() => Date.parse(attempt.serverNow) - Date.now(), [attempt.serverNow]);
  const deadline = attempt.deadline ? Date.parse(attempt.deadline) : null;
  const [now, setNow] = useState(() => Date.now() + offset);
  const submittedRef = useRef(false);
  const questionRef = useRef<HTMLHeadingElement>(null);

  const q = attempt.questions[index];
  const answered = attempt.questions.filter((x) => answers[x.id] !== undefined).length;
  const remaining = deadline ? deadline - now : null;

  const submit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    void onSubmit(answers).finally(() => {
      submittedRef.current = false;
    });
  }, [answers, onSubmit]);

  useEffect(() => {
    if (!deadline) return;
    const t = window.setInterval(() => setNow(Date.now() + offset), 1000);
    return () => window.clearInterval(t);
  }, [deadline, offset]);

  useEffect(() => {
    if (remaining !== null && remaining <= 0 && !submitting) submit();
  }, [remaining, submitting, submit]);

  useEffect(() => questionRef.current?.focus(), [index]);

  const choose = (opt: number) => {
    const next = { ...answers, [q.id]: opt };
    setAnswers(next);
    saveAnswers(attempt.id, next);
  };

  return (
    <div className="pmp-page pmp-runner">
      <div className="pmp-runner-head">
        <div>
          <span className="eyebrow">{attempt.title.toUpperCase()}</span>
          <p className="pmp-muted pmp-small">
            {answered} of {attempt.questions.length} answered
          </p>
        </div>
        {remaining !== null && (
          <div className={`pmp-timer${remaining < 5 * 60_000 ? ' is-low' : ''}`} role="timer" aria-live={remaining < 60_000 ? 'assertive' : 'off'}>
            {formatClock(remaining)}
          </div>
        )}
      </div>

      <div className="pmp-card pmp-question">
        <h3 ref={questionRef} tabIndex={-1} className="pmp-q-stem">
          <span className="pmp-q-num">Question {q.number}</span>
          {q.stem}
        </h3>
        <fieldset className="pmp-options">
          <legend className="sr-only">Choose one answer</legend>
          {q.options.map((opt, i) => (
            <label key={i} className={`pmp-option${answers[q.id] === i ? ' is-chosen' : ''}`}>
              <input type="radio" name={`q-${q.id}`} checked={answers[q.id] === i} onChange={() => choose(i)} disabled={submitting} />
              <span className="pmp-option-letter">{'ABCD'[i]}</span>
              <span>{opt}</span>
            </label>
          ))}
        </fieldset>
        <div className="pmp-q-nav">
          <button className="btn btn-ghost" type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
            Previous
          </button>
          {index < attempt.questions.length - 1 ? (
            <button className="btn btn-blue" type="button" onClick={() => setIndex((i) => i + 1)}>
              Next
            </button>
          ) : (
            <button className="btn btn-blue" type="button" onClick={() => setConfirming(true)} disabled={submitting}>
              Review and submit
            </button>
          )}
        </div>
      </div>

      <details className="pmp-card pmp-q-grid-wrap" open={attempt.questions.length <= 15}>
        <summary>All questions</summary>
        <ol className="pmp-q-grid">
          {attempt.questions.map((x, i) => (
            <li key={x.id}>
              <button
                type="button"
                className={`${answers[x.id] !== undefined ? 'is-answered' : ''}${i === index ? ' is-current' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Question ${x.number}${answers[x.id] !== undefined ? ', answered' : ', not answered'}`}
              >
                {x.number}
              </button>
            </li>
          ))}
        </ol>
      </details>

      {(confirming || submitting) && (
        <div className="pmp-card pmp-confirm" role="alertdialog" aria-labelledby="confirm-h">
          <h3 id="confirm-h">Submit your answers?</h3>
          <p>
            You have answered {answered} of {attempt.questions.length} questions.
            {answered < attempt.questions.length ? ' Unanswered questions are marked wrong.' : ''}
          </p>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          <div className="pmp-q-nav">
            <button className="btn btn-ghost" type="button" onClick={() => setConfirming(false)} disabled={submitting}>
              Keep working
            </button>
            <button className="btn btn-blue" type="button" onClick={submit} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </div>
      )}
      {!confirming && !submitting && error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
