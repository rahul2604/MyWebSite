import { useEffect, useState } from 'react';
import { ApiError, api, type CourseState, type Result } from './api';
import { ResultView } from './ResultView';
import { href } from './route';

/** Review of a previously submitted attempt (#pmp/review/:attemptId). */
export function ReviewView({ id, state }: { id: string; state: CourseState }) {
  const [data, setData] = useState<{ assessmentId: string; result: Result } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .attempt(id)
      .then((r) => setData({ assessmentId: r.attempt.assessmentId, result: r.result }))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load this attempt.'));
  }, [id]);

  if (error)
    return (
      <div className="pmp-card pmp-notice" role="alert">
        <p>{error}</p>
        <a className="btn btn-ghost btn-small" href={href()}>
          Back to dashboard
        </a>
      </div>
    );
  if (!data) return <p className="pmp-status">Loading…</p>;
  const title = state.modules.find((m) => m.id === data.assessmentId)?.quiz.title ?? state.exams.find((e) => e.id === data.assessmentId)?.title ?? 'Attempt';
  return (
    <ResultView
      title={title}
      result={data.result}
      actions={
        <a className="btn btn-ghost" href={href()}>
          Dashboard
        </a>
      }
    />
  );
}
