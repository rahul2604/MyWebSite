import { useEffect, useRef, useState } from 'react';
import type { CourseState, Status } from './api';
import { href, type PmpRoute } from './route';

const label: Record<Status, string> = { locked: 'Locked', available: 'Open', completed: 'Done' };

function Mark({ status }: { status: Status }) {
  return <span className={`pmp-mark is-${status}`} aria-label={label[status]} title={label[status]} />;
}

function isCurrent(route: PmpRoute, kind: PmpRoute['page'], id: string) {
  return route.page === kind && 'id' in route && route.id === id;
}

/** Left course navigation. On small screens it becomes a drawer opened from the top bar. */
export function Sidebar({ state, route, open, onClose, hasCertificate }: { state: CourseState; route: PmpRoute; open: boolean; onClose: () => void; hasCertificate: boolean }) {
  const currentModule =
    route.page === 'lesson'
      ? state.modules.find((m) => m.lessons.some((l) => l.id === route.id))?.id
      : route.page === 'check'
        ? route.id
        : state.modules.find((m) => m.status === 'available')?.id;
  const [expanded, setExpanded] = useState<string | undefined>(currentModule);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setExpanded(currentModule), [currentModule]);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <nav id="pmp-sidebar" className={`pmp-sidebar${open ? ' is-open' : ''}`} aria-label="Course contents">
      <div className="pmp-sidebar-head">
        <a className={`pmp-side-link${route.page === 'home' ? ' is-current' : ''}`} href={href()} aria-current={route.page === 'home' ? 'page' : undefined}>
          Dashboard
        </a>
        <button ref={closeRef} type="button" className="pmp-drawer-close" onClick={onClose} aria-label="Close course menu">
          ×
        </button>
      </div>
      <ol className="pmp-mods">
        {state.modules.map((m) => {
          const isOpen = expanded === m.id;
          return (
            <li key={m.id} className={`pmp-mod is-${m.status}`}>
              <button type="button" className="pmp-mod-btn" aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? undefined : m.id)}>
                <Mark status={m.status} />
                <span className="pmp-mod-num">{m.number}</span>
                <span className="pmp-mod-title">{m.title}</span>
              </button>
              {isOpen && (
                <ol className="pmp-lessons">
                  {m.lessons.map((l) =>
                    l.status === 'locked' ? (
                      <li key={l.id} className="is-locked">
                        <Mark status="locked" />
                        <span>{l.title}</span>
                      </li>
                    ) : (
                      <li key={l.id}>
                        <a href={href(`lesson/${l.id}`)} className={isCurrent(route, 'lesson', l.id) ? 'is-current' : ''} aria-current={isCurrent(route, 'lesson', l.id) ? 'page' : undefined}>
                          <Mark status={l.status} />
                          <span>{l.title}</span>
                        </a>
                      </li>
                    ),
                  )}
                  <li className={m.quiz.status === 'locked' ? 'is-locked pmp-quiz-item' : 'pmp-quiz-item'}>
                    {m.quiz.status === 'locked' ? (
                      <>
                        <Mark status="locked" />
                        <span>Knowledge check</span>
                      </>
                    ) : (
                      <a href={href(`check/${m.id}`)} className={isCurrent(route, 'check', m.id) ? 'is-current' : ''}>
                        <Mark status={m.quiz.status} />
                        <span>
                          Knowledge check{m.quiz.best !== null ? ` · best ${m.quiz.best}%` : ''}
                        </span>
                      </a>
                    )}
                  </li>
                </ol>
              )}
            </li>
          );
        })}
      </ol>
      <p className="pmp-side-heading">Exams</p>
      <ul className="pmp-exams-nav">
        {state.exams.map((e) => (
          <li key={e.id} className={e.status === 'locked' ? 'is-locked' : ''}>
            {e.status === 'locked' ? (
              <>
                <Mark status="locked" />
                <span>{e.title}</span>
              </>
            ) : (
              <a href={href(`exam/${e.id}`)} className={isCurrent(route, 'exam', e.id) ? 'is-current' : ''}>
                <Mark status={e.id === 'final' ? (e.passed ? 'completed' : 'available') : e.attempts > 0 ? 'completed' : 'available'} />
                <span>{e.title}</span>
              </a>
            )}
          </li>
        ))}
        <li className={state.certificateEligible || hasCertificate ? '' : 'is-locked'}>
          {state.certificateEligible || hasCertificate ? (
            <a href={href('certificate')} className={route.page === 'certificate' ? 'is-current' : ''}>
              <Mark status="completed" />
              <span>Certificate</span>
            </a>
          ) : (
            <>
              <Mark status="locked" />
              <span>Certificate</span>
            </>
          )}
        </li>
      </ul>
      <p className="pmp-side-heading">Support</p>
      <a className={`pmp-side-link${route.page === 'support' ? ' is-current' : ''}`} href={href('support')} aria-current={route.page === 'support' ? 'page' : undefined}>
        Help &amp; FAQs
      </a>
    </nav>
  );
}
