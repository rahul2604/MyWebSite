import { useEffect, useState, type FormEvent } from 'react';
import { ApiError, api, type Verification } from './api';
import { go, href } from './route';

/* Public certificate verification (#pmp/verify/CODE). No sign-in required. */
export function VerifyView({ code }: { code: string }) {
  const [state, setState] = useState<{ kind: 'idle' } | { kind: 'loading' } | { kind: 'ok'; data: Verification } | { kind: 'missing'; message: string }>(
    code ? { kind: 'loading' } : { kind: 'idle' },
  );
  const [input, setInput] = useState(code);

  useEffect(() => {
    setInput(code);
    if (!code) {
      setState({ kind: 'idle' });
      return;
    }
    setState({ kind: 'loading' });
    api
      .verify(code)
      .then((data) => setState({ kind: 'ok', data }))
      .catch((err) => setState({ kind: 'missing', message: err instanceof ApiError ? err.message : 'Could not check this certificate.' }));
  }, [code]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const c = input.trim().toUpperCase();
    if (c) go(`verify/${encodeURIComponent(c)}`);
  };

  return (
    <div className="pmp-verify">
      <span className="eyebrow">CERTIFICATE VERIFICATION</span>
      <h2 className="display">Check a course certificate</h2>
      <form className="pmp-verify-row" onSubmit={submit}>
        <label htmlFor="verify-code" className="sr-only">
          Certificate ID
        </label>
        <input id="verify-code" className="field" placeholder="PMP-XXXX-XXXX-XXXX" value={input} onChange={(e) => setInput(e.target.value)} maxLength={32} />
        <button className="btn btn-blue btn-small" type="submit">
          Verify
        </button>
      </form>

      {state.kind === 'loading' && <p className="pmp-status">Checking…</p>}
      {state.kind === 'missing' && (
        <div className="pmp-card pmp-verify-result is-missing" role="status">
          <p className="pmp-verify-verdict">Not found</p>
          <p>{state.message}</p>
        </div>
      )}
      {state.kind === 'ok' && (
        <div className="pmp-card pmp-verify-result is-valid" role="status">
          <p className="pmp-verify-verdict">Valid certificate</p>
          <dl className="pmp-verify-dl">
            <div>
              <dt>Awarded to</dt>
              <dd>{state.data.certificate.name}</dd>
            </div>
            <div>
              <dt>Course</dt>
              <dd>{state.data.certificate.course}</dd>
            </div>
            <div>
              <dt>Issued</dt>
              <dd>{new Date(state.data.certificate.issued).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
            </div>
            <div>
              <dt>Certificate ID</dt>
              <dd>{state.data.certificate.code}</dd>
            </div>
          </dl>
          <p className="pmp-disclaimer">{state.data.notice}</p>
        </div>
      )}
      <p className="pmp-small">
        <a href={href()}>About the course</a>
      </p>
    </div>
  );
}
