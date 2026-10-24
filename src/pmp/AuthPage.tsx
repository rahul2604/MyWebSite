import { useState, type FormEvent } from 'react';
import { api, ApiError } from './api';

const FACTS = [
  ['18', 'modules'],
  ['69', 'lessons'],
  ['32 h', 'of study'],
  ['511', 'practice questions'],
];

/** Entry page for signed-out visitors: what the course is, plus sign-in and sign-up. */
export function AuthPage({ onSignedIn }: { onSignedIn: () => void }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'signup') await api.signup(name.trim(), email.trim(), password);
      else await api.login(email.trim(), password);
      setPassword('');
      onSignedIn();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
      if (err instanceof ApiError && err.code === 'email_taken') setMode('signin');
    } finally {
      setBusy(false);
    }
  };

  const switchTo = (m: 'signin' | 'signup') => {
    setMode(m);
    setError('');
  };

  return (
    <div className="pmp-entry">
      <div className="pmp-entry-copy">
        <span className="eyebrow">PMP® EXAM PREPARATION</span>
        <h1 className="display pmp-entry-title">A complete, structured path through the PMBOK® Guide and the Agile Practice Guide</h1>
        <p className="pmp-lede">
          Original lessons on every Knowledge Area, all 49 processes and agile practice, each with source references. Every
          module ends with a knowledge check, and you move on when you score 80%. Two full mock tests and a final
          assessment lead to a verifiable course certificate.
        </p>
        <ul className="pmp-facts" aria-label="Course at a glance">
          {FACTS.map(([n, label]) => (
            <li key={label}>
              <strong className="display">{n}</strong>
              <span>{label}</span>
            </li>
          ))}
        </ul>
        <ol className="pmp-steps">
          <li>Work through each lesson in order. Each one opens when you finish the one before.</li>
          <li>Pass the module knowledge check with 80% or more to open the next module.</li>
          <li>Take Mock Test 1 and Mock Test 2, then the timed final assessment.</li>
          <li>Pass the final to download your certificate, with a public verification link.</li>
        </ol>
        <p className="pmp-disclaimer">
          Independent course by Rahul Mehra. Not affiliated with, endorsed by or authorised by the Project Management
          Institute (PMI). The course certificate is not a PMI credential. PMI, PMP and PMBOK are marks of the Project
          Management Institute, Inc.
        </p>
      </div>

      <div className="pmp-card pmp-auth">
        <div className="pmp-tabs" role="tablist" aria-label="Account">
          <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'is-on' : ''} onClick={() => switchTo('signup')}>
            Create account
          </button>
          <button type="button" role="tab" aria-selected={mode === 'signin'} className={mode === 'signin' ? 'is-on' : ''} onClick={() => switchTo('signin')}>
            Sign in
          </button>
        </div>
        <form className="form" onSubmit={submit} noValidate>
          {mode === 'signup' && (
            <div className="field-group">
              <label htmlFor="pmp-name">Full name</label>
              <input id="pmp-name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required maxLength={80} />
              <span className="pmp-hint">This is the name printed on your certificate.</span>
            </div>
          )}
          <div className="field-group">
            <label htmlFor="pmp-email">Email</label>
            <input id="pmp-email" className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required maxLength={254} />
          </div>
          <div className="field-group">
            <label htmlFor="pmp-password">Password</label>
            <input
              id="pmp-password"
              className="field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              required
              maxLength={128}
              aria-describedby={mode === 'signup' ? 'pmp-pw-hint' : undefined}
            />
            {mode === 'signup' && (
              <span className="pmp-hint" id="pmp-pw-hint">
                At least 10 characters, with letters and numbers.
              </span>
            )}
          </div>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-blue enrol-btn" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'signup' ? 'Create account and start' : 'Sign in'}
          </button>
          <p className="fine-print">
            Your progress is saved to your account. We use one secure cookie to keep you signed in, and nothing else.
          </p>
          <p className="fine-print">
            Trouble signing in? <a href="#pmp/support">Help &amp; FAQs</a>
          </p>
        </form>
      </div>
    </div>
  );
}
