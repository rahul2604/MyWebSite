import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, api, type Me } from './api';
import { AssessmentView } from './AssessmentView';
import { AuthPage } from './AuthPage';
import { CertificateView } from './CertificateView';
import { Dashboard } from './Dashboard';
import { LessonView } from './LessonView';
import { ReviewView } from './ReviewView';
import { Sidebar } from './Sidebar';
import { VerifyView } from './VerifyView';
import { usePmpRoute, type PmpRoute } from './route';
import './pmp.css';

type Session = { kind: 'loading' } | { kind: 'signedOut' } | { kind: 'error'; message: string } | { kind: 'signedIn'; me: Me };

/* The PMP® learning platform (#pmp). Locks and scores are decided by the server; this UI reflects them. */
export function PmpApp({ hidden }: { hidden: boolean }) {
  const route = usePmpRoute();
  const [session, setSession] = useState<Session>({ kind: 'loading' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    try {
      const me = await api.me();
      setSession({ kind: 'signedIn', me });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setSession({ kind: 'signedOut' });
      else setSession({ kind: 'error', message: err instanceof ApiError ? err.message : 'Something went wrong.' });
    }
  }, []);

  useEffect(() => {
    if (!hidden && route.page !== 'verify') void refresh();
  }, [hidden, refresh, route.page]);

  // New page: close the mobile drawer, scroll to the top and move focus to the content.
  const routeKey = JSON.stringify(route);
  useEffect(() => {
    if (hidden) return;
    setDrawerOpen(false);
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [routeKey, hidden]);

  if (hidden) return null;

  if (route.page === 'verify') {
    return (
      <section className="pmp-app" aria-label="Certificate verification">
        <div className="container">
          <VerifyView code={route.code} />
        </div>
      </section>
    );
  }

  const signOut = async () => {
    try {
      await api.logout();
    } finally {
      setSession({ kind: 'signedOut' });
      window.location.hash = '#pmp';
    }
  };

  return (
    <section className="pmp-app" aria-label="PMP learning platform">
      <div className="container">
        {session.kind === 'loading' && <p className="pmp-status">Loading your course…</p>}
        {session.kind === 'error' && (
          <div className="pmp-card pmp-notice" role="alert">
            <p>{session.message}</p>
            <button className="btn btn-ghost btn-small" type="button" onClick={() => void refresh()}>
              Try again
            </button>
          </div>
        )}
        {session.kind === 'signedOut' && <AuthPage onSignedIn={() => void refresh()} />}
        {session.kind === 'signedIn' && session.me.user.mustChangePassword && (
          <div className="pmp-card pmp-notice" role="alert">
            <p>Set your own administrator password before previewing the course.</p>
            <a className="btn btn-blue btn-small" href="#admin">
              Go to the admin panel
            </a>
          </div>
        )}
        {session.kind === 'signedIn' && !session.me.user.mustChangePassword && session.me.user.role === 'admin' && (
          <p className="pmp-preview-banner" role="note">
            <span>Preview as learner: every module and assessment is open, and nothing you do here is recorded.</span>
            <a href="#admin">Back to the admin panel</a>
          </p>
        )}
        {session.kind === 'signedIn' && !session.me.user.mustChangePassword && (
          <div className="pmp-shell">
            <div className="pmp-topbar">
              <button className="btn btn-ghost btn-small pmp-menu-btn" type="button" aria-expanded={drawerOpen} aria-controls="pmp-sidebar" onClick={() => setDrawerOpen(true)}>
                Course menu
              </button>
              <div className="pmp-topbar-progress" aria-label={`Course progress ${session.me.state.progress.percent}%`}>
                <span>{session.me.state.progress.percent}% complete</span>
                <span className="progress-track" aria-hidden="true">
                  <span className="progress-fill" style={{ width: `${session.me.state.progress.percent}%` }} />
                </span>
              </div>
              <div className="pmp-user">
                <span className="pmp-user-name">{session.me.user.name}</span>
                <button className="btn btn-ghost btn-small" type="button" onClick={() => void signOut()}>
                  Sign out
                </button>
              </div>
            </div>
            <div className="pmp-columns">
              {drawerOpen && <div className="pmp-scrim" onClick={() => setDrawerOpen(false)} aria-hidden="true" />}
              <Sidebar state={session.me.state} route={route} open={drawerOpen} onClose={() => setDrawerOpen(false)} hasCertificate={!!session.me.certificate} />
              <div className="pmp-main-col" ref={mainRef} tabIndex={-1}>
                <Page route={route} me={session.me} refresh={refresh} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Page({ route, me, refresh }: { route: PmpRoute; me: Me; refresh: () => Promise<void> }) {
  const preview = me.user.role === 'admin';
  switch (route.page) {
    case 'lesson':
      return <LessonView key={route.id} id={route.id} state={me.state} refresh={refresh} preview={preview} />;
    case 'check':
    case 'exam':
      return <AssessmentView key={route.id} id={route.id} state={me.state} refresh={refresh} preview={preview} />;
    case 'review':
      return <ReviewView key={route.id} id={route.id} state={me.state} />;
    case 'certificate':
      return <CertificateView me={me} refresh={refresh} />;
    default:
      return <Dashboard me={me} />;
  }
}
