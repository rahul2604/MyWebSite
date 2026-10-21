import type { Me } from './api';
import { href } from './route';

const nextHref = (n: NonNullable<Me['state']['next']>) =>
  n.kind === 'lesson' ? href(`lesson/${n.id}`) : n.kind === 'quiz' ? href(`check/${n.id}`) : n.kind === 'exam' ? href(`exam/${n.id}`) : href('certificate');

export function Dashboard({ me }: { me: Me }) {
  const { state, user } = me;
  const firstName = user.name.split(' ')[0];
  const started = state.progress.lessonsDone > 0;
  const minutesLeft = state.modules.flatMap((m) => m.lessons).filter((l) => l.status !== 'completed').reduce((n, l) => n + l.minutes, 0);

  return (
    <div className="pmp-page">
      <header className="pmp-page-head">
        <span className="eyebrow">DASHBOARD</span>
        <h2 className="display">{started ? `Welcome back, ${firstName}` : `Welcome, ${firstName}`}</h2>
        <p className="pmp-muted">{me.course.title}</p>
      </header>

      <div className="pmp-card pmp-continue">
        <div>
          <p className="pmp-kicker">{state.next ? (started ? 'Continue where you left off' : 'Start here') : 'All done'}</p>
          <p className="pmp-continue-title">{state.next ? state.next.title : 'You have completed the course.'}</p>
        </div>
        {state.next && (
          <a className="btn btn-blue btn-cta" href={nextHref(state.next)}>
            {state.next.kind === 'certificate' ? 'View certificate' : started ? 'Continue' : 'Start the course'}
          </a>
        )}
      </div>

      <div className="pmp-stats">
        <div className="pmp-card pmp-stat">
          <span className="pmp-stat-num display">{state.progress.percent}%</span>
          <span className="pmp-muted">overall progress</span>
          <span className="progress-track" aria-hidden="true">
            <span className="progress-fill" style={{ width: `${state.progress.percent}%` }} />
          </span>
        </div>
        <div className="pmp-card pmp-stat">
          <span className="pmp-stat-num display">
            {state.progress.lessonsDone}/{state.progress.lessonsTotal}
          </span>
          <span className="pmp-muted">lessons completed</span>
        </div>
        <div className="pmp-card pmp-stat">
          <span className="pmp-stat-num display">
            {state.progress.quizzesPassed}/{state.progress.quizzesTotal}
          </span>
          <span className="pmp-muted">knowledge checks passed</span>
        </div>
        <div className="pmp-card pmp-stat">
          <span className="pmp-stat-num display">{Math.round(minutesLeft / 60)} h</span>
          <span className="pmp-muted">of lessons remaining</span>
        </div>
      </div>

      <h3 className="pmp-section-title">Modules</h3>
      <ol className="pmp-module-grid">
        {state.modules.map((m) => {
          const done = m.lessons.filter((l) => l.status === 'completed').length;
          const first = m.lessons.find((l) => l.status === 'available') ?? m.lessons[0];
          return (
            <li key={m.id} className={`pmp-card pmp-module-card is-${m.status}`}>
              <div className="pmp-module-top">
                <span className="pmp-module-num display">{m.number}</span>
                <span className={`pmp-pill is-${m.status}`}>{m.status === 'completed' ? 'Passed' : m.status === 'available' ? 'Open' : 'Locked'}</span>
              </div>
              <p className="pmp-module-title">{m.title}</p>
              <p className="pmp-muted pmp-small">
                {done}/{m.lessons.length} lessons · check {m.quiz.best !== null ? `best ${m.quiz.best}%` : 'not taken'}
              </p>
              {m.status !== 'locked' && (
                <a className="inline-link pmp-small" href={m.quiz.status === 'available' && done === m.lessons.length ? href(`check/${m.id}`) : href(`lesson/${first.id}`)}>
                  {m.status === 'completed' ? 'Review' : done === m.lessons.length ? 'Take the knowledge check' : done ? 'Continue' : 'Start'}
                </a>
              )}
            </li>
          );
        })}
      </ol>

      <h3 className="pmp-section-title">Exams and certificate</h3>
      <div className="pmp-exam-grid">
        {state.exams.map((e) => (
          <div key={e.id} className={`pmp-card pmp-exam-card is-${e.status}`}>
            <p className="pmp-module-title">{e.title}</p>
            <p className="pmp-muted pmp-small">
              {e.questionCount} questions · {e.minutes} minutes{e.best !== null ? ` · best ${e.best}%` : ''}
            </p>
            {e.status === 'locked' ? (
              <p className="pmp-small pmp-locked-note">{e.lockReason}</p>
            ) : (
              <a className="inline-link pmp-small" href={href(`exam/${e.id}`)}>
                {e.openAttemptId ? 'Resume' : e.attempts > 0 ? 'Open' : 'Start'}
              </a>
            )}
          </div>
        ))}
        <div className={`pmp-card pmp-exam-card ${state.certificateEligible ? 'is-completed' : 'is-locked'}`}>
          <p className="pmp-module-title">Course certificate</p>
          <p className="pmp-muted pmp-small">Issued when you pass the final assessment with 80% or more.</p>
          {state.certificateEligible ? (
            <a className="inline-link pmp-small" href={href('certificate')}>
              {me.certificate ? 'View and download' : 'Claim your certificate'}
            </a>
          ) : (
            <p className="pmp-small pmp-locked-note">Locked</p>
          )}
        </div>
      </div>

      <p className="pmp-disclaimer">
        This is an independent course. It is not affiliated with, endorsed by or authorised by PMI, and the course
        certificate is not a PMI credential. Check PMI's current exam content outline before booking your exam.
      </p>
    </div>
  );
}
