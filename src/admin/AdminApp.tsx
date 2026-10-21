import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { ApiError, api, type Me } from '../pmp/api';
import { AssessmentDetail, Assessments, Audit, CertificatePage, LearnerDetail, Learners, LessonEditor, Modules, Overview, Topics } from './pages';
import '../pmp/pmp.css';
import './admin.css';

/* Sub-routes of #admin, e.g. #admin/modules, #admin/lesson/m04-l2, #admin/assessment/final. */
export type AdminRoute = { page: string; id: string };
const parse = (hash: string): AdminRoute => {
  const [, page = 'overview', id = ''] = hash.replace(/^#/, '').split('/');
  return { page: page || 'overview', id: decodeURIComponent(id) };
};
export const ahref = (path = '') => (path ? `#admin/${path}` : '#admin');

function useAdminRoute() {
  const [route, setRoute] = useState(() => parse(window.location.hash));
  useEffect(() => {
    const on = () => setRoute(parse(window.location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

type Session = { kind: 'loading' } | { kind: 'signedOut' } | { kind: 'notAdmin'; me: Me } | { kind: 'mustChange'; me: Me } | { kind: 'admin'; me: Me } | { kind: 'error'; message: string };

const NAV: [string, string][] = [
  ['overview', 'Dashboard'],
  ['modules', 'Modules and lessons'],
  ['assessments', 'Assessments'],
  ['topics', 'Source coverage'],
  ['learners', 'Learners'],
  ['audit', 'Audit log'],
  ['certificate', 'Certificate'],
];

/** The administrator panel (#admin). Every request is authorised by the server; this UI only reflects it. */
export function AdminApp({ hidden }: { hidden: boolean }) {
  const route = useAdminRoute();
  const [session, setSession] = useState<Session>({ kind: 'loading' });
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    try {
      const me = await api.me();
      if (me.user.role !== 'admin') setSession({ kind: 'notAdmin', me });
      else if (me.user.mustChangePassword) setSession({ kind: 'mustChange', me });
      else setSession({ kind: 'admin', me });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setSession({ kind: 'signedOut' });
      else setSession({ kind: 'error', message: err instanceof ApiError ? err.message : 'Something went wrong.' });
    }
  }, []);

  useEffect(() => {
    if (!hidden) void refresh();
  }, [hidden, refresh]);

  useEffect(() => {
    if (hidden) return;
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [route.page, route.id, hidden]);

  if (hidden) return null;

  const signOut = async () => {
    try {
      await api.logout();
    } finally {
      setSession({ kind: 'signedOut' });
    }
  };

  return (
    <section className="pmp-app adm" aria-label="Administrator panel">
      <div className="container">
        {session.kind === 'loading' && <p className="pmp-status">Loading…</p>}
        {session.kind === 'error' && (
          <div className="pmp-card pmp-notice" role="alert">
            <p>{session.message}</p>
            <button className="btn btn-ghost btn-small" type="button" onClick={() => void refresh()}>
              Try again
            </button>
          </div>
        )}
        {session.kind === 'signedOut' && <AdminSignIn onDone={() => void refresh()} />}
        {session.kind === 'notAdmin' && (
          <div className="pmp-card pmp-notice adm-narrow" role="alert">
            <h2 className="display adm-h">No administrator access</h2>
            <p>You are signed in as {session.me.user.email}, which is a learner account.</p>
            <div className="btn-row">
              <a className="btn btn-blue btn-small" href="#pmp">
                Go to the course
              </a>
              <button className="btn btn-ghost btn-small" type="button" onClick={() => void signOut()}>
                Sign out
              </button>
            </div>
          </div>
        )}
        {session.kind === 'mustChange' && <ChangePassword me={session.me} onDone={() => void refresh()} onSignOut={() => void signOut()} />}
        {session.kind === 'admin' && (
          <div className="pmp-shell">
            <div className="pmp-topbar">
              <button className="btn btn-ghost btn-small pmp-menu-btn" type="button" aria-expanded={menuOpen} aria-controls="adm-nav" onClick={() => setMenuOpen(true)}>
                Admin menu
              </button>
              <div className="adm-title">
                <span className="eyebrow">ADMINISTRATOR</span>
                <span className="adm-title-text">PMP course administration</span>
              </div>
              <div className="pmp-user">
                <a className="btn btn-ghost btn-small" href="#pmp">
                  Preview as learner
                </a>
                <span className="pmp-user-name">{session.me.user.email}</span>
                <button className="btn btn-ghost btn-small" type="button" onClick={() => void signOut()}>
                  Sign out
                </button>
              </div>
            </div>
            <div className="pmp-columns">
              {menuOpen && <div className="pmp-scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
              <nav id="adm-nav" className={`pmp-sidebar adm-nav${menuOpen ? ' is-open' : ''}`} aria-label="Administration">
                <div className="pmp-sidebar-head">
                  <span className="pmp-side-heading">Admin</span>
                  <button type="button" className="pmp-drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close admin menu">
                    ×
                  </button>
                </div>
                <ul>
                  {NAV.map(([p, label]) => {
                    const current = route.page === p || (p === 'modules' && route.page === 'lesson') || (p === 'assessments' && route.page === 'assessment') || (p === 'learners' && route.page === 'learner');
                    return (
                      <li key={p}>
                        <a className={`pmp-side-link${current ? ' is-current' : ''}`} href={ahref(p === 'overview' ? '' : p)} aria-current={current ? 'page' : undefined}>
                          {label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <p className="pmp-muted pmp-small adm-nav-note">Viewing content here never changes any learner's progress.</p>
              </nav>
              <div className="pmp-main-col" ref={mainRef} tabIndex={-1}>
                <AdminPage route={route} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function AdminPage({ route }: { route: AdminRoute }) {
  switch (route.page) {
    case 'modules':
      return <Modules />;
    case 'lesson':
      return <LessonEditor key={route.id} id={route.id} />;
    case 'assessments':
      return <Assessments />;
    case 'assessment':
      return <AssessmentDetail key={route.id} id={route.id} />;
    case 'topics':
      return <Topics />;
    case 'learners':
      return <Learners />;
    case 'learner':
      return <LearnerDetail key={route.id} id={route.id} />;
    case 'audit':
      return <Audit />;
    case 'certificate':
      return <CertificatePage />;
    default:
      return <Overview />;
  }
}

function AdminSignIn({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.login(email.trim(), password);
      setPassword('');
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="pmp-card adm-narrow">
      <span className="eyebrow">ADMINISTRATOR</span>
      <h2 className="display adm-h">Administrator sign-in</h2>
      <p className="pmp-muted">For the site owner only. Learners sign in from the PMP learning path.</p>
      <form className="form" onSubmit={submit} noValidate>
        <div className="field-group">
          <label htmlFor="adm-email">Email</label>
          <input id="adm-email" className="field" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field-group">
          <label htmlFor="adm-pw">Password</label>
          <input id="adm-pw" className="field" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-blue enrol-btn" type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

function ChangePassword({ me, onDone, onSignOut }: { me: Me; onDone: () => void; onSignOut: () => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (next !== confirm) {
      setError('The new passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      await api.changePassword(current, next);
      setCurrent('');
      setNext('');
      setConfirm('');
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not change the password.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="pmp-card adm-narrow">
      <span className="eyebrow">SET YOUR PASSWORD</span>
      <h2 className="display adm-h">Replace the temporary password</h2>
      <p className="pmp-muted">
        Signed in as {me.user.email} with a temporary bootstrap password. Choose your own password (at least 14 characters, with letters and numbers) before using the
        admin panel. Other sessions will be signed out.
      </p>
      <form className="form" onSubmit={submit} noValidate>
        <div className="field-group">
          <label htmlFor="cp-current">Temporary password</label>
          <input id="cp-current" className="field" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </div>
        <div className="field-group">
          <label htmlFor="cp-new">New password</label>
          <input id="cp-new" className="field" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required />
        </div>
        <div className="field-group">
          <label htmlFor="cp-confirm">Confirm new password</label>
          <input id="cp-confirm" className="field" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <div className="btn-row">
          <button className="btn btn-blue btn-small" type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Set password'}
          </button>
          <button className="btn btn-ghost btn-small" type="button" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </form>
    </div>
  );
}
