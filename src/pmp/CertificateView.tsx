import { useState } from 'react';
import { ApiError, api, type Me } from './api';
import { href } from './route';

const longDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export function CertificateView({ me, refresh }: { me: Me; refresh: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const cert = me.certificate;
  const verifyUrl = cert ? `${window.location.origin}/#pmp/verify/${cert.code}` : '';

  const issue = async () => {
    setBusy(true);
    setError('');
    try {
      await api.issueCertificate();
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not issue the certificate. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked; the link is visible to copy by hand */
    }
  };

  if (me.user.role === 'admin') {
    return (
      <div className="pmp-card pmp-notice">
        <p>Administrator accounts cannot be issued certificates. Inspect the template and verification rules in the admin panel.</p>
        <a className="btn btn-ghost btn-small" href="#admin/certificate">
          Certificate template
        </a>
      </div>
    );
  }

  if (!me.state.certificateEligible && !cert) {
    return (
      <div className="pmp-card pmp-notice">
        <p>Your certificate unlocks when you pass the final assessment with 80% or more.</p>
        <a className="btn btn-ghost btn-small" href={href()}>
          Back to dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="pmp-page">
      <header className="pmp-page-head">
        <span className="eyebrow">COURSE CERTIFICATE</span>
        <h2 className="display">{cert ? 'Congratulations' : 'You passed the final assessment'}</h2>
      </header>

      {!cert ? (
        <div className="pmp-card pmp-exam-intro">
          <p>
            Your certificate will show the name on your account: <strong>{me.user.name}</strong>. It gets a unique ID and a
            public verification link.
          </p>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-blue btn-cta" type="button" onClick={() => void issue()} disabled={busy}>
            {busy ? 'Issuing…' : 'Issue my certificate'}
          </button>
        </div>
      ) : (
        <>
          <div className="pmp-cert" aria-label="Certificate preview">
            <div className="pmp-cert-frame" aria-hidden="true" />
            <p className="pmp-cert-kicker">CERTIFICATE OF COMPLETION</p>
            <p className="pmp-cert-small">This certifies that</p>
            <p className="pmp-cert-name">{cert.name}</p>
            <p className="pmp-cert-small">has completed the course</p>
            <p className="pmp-cert-course">{me.course.title}</p>
            <p className="pmp-cert-small">Issued {longDate(cert.issued)} · Certificate ID {cert.code}</p>
            <p className="pmp-cert-disclaimer">Independent course. This is not a PMI credential and is not affiliated with or endorsed by PMI.</p>
          </div>
          <div className="pmp-cert-actions">
            <a className="btn btn-blue btn-cta" href={api.certificatePdfUrl} download>
              Download PDF
            </a>
            <a className="btn btn-ghost" href={href(`verify/${cert.code}`)}>
              Open verification page
            </a>
          </div>
          <div className="pmp-card pmp-verify-link">
            <label htmlFor="verify-url">Verification link</label>
            <div className="pmp-verify-row">
              <input id="verify-url" className="field" readOnly value={verifyUrl} onFocus={(e) => e.currentTarget.select()} />
              <button className="btn btn-ghost btn-small" type="button" onClick={() => void copy()}>
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="pmp-muted pmp-small">Anyone with this link can confirm your certificate. It shows your name, the course and the issue date, not your email.</p>
          </div>
        </>
      )}
    </div>
  );
}
