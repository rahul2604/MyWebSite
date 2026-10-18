import { useState, type ChangeEvent, type FormEvent } from 'react';
import { PMP_MODULES } from '../data';
import { buildCertificate } from '../lib/certificate';
import { ArrowLeft, CheckIcon, DownloadIcon } from './Icons';

interface Learner {
  name: string;
  email: string;
}

type FieldKey = 'name' | 'email' | 'phone';
type Errors = Partial<Record<FieldKey, string>>;

const TOTAL = PMP_MODULES.length;

function validate(form: Record<FieldKey, string>): Errors {
  const e: Errors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.replace(/[\s()-]/g, '');
  if (name.length < 2) e.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = 'Please enter a valid email address.';
  if (!/^(\+?\d{1,3})?\d{10}$/.test(phone)) e.phone = 'Please enter a valid 10-digit mobile number.';
  return e;
}

/* PMP® learning path prototype. All state is local to the tab — nothing is sent anywhere. */
export function PmpPath({ hidden }: { hidden: boolean }) {
  const [done, setDone] = useState<boolean[]>(() => PMP_MODULES.map(() => false));
  const [sel, setSel] = useState(0);
  const [form, setForm] = useState<Record<FieldKey, string>>({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [learner, setLearner] = useState<Learner | null>(null);

  const count = done.filter(Boolean).length;
  const pct = Math.round((count / TOTAL) * 100);
  const allDone = count === TOTAL;
  const curDone = done[sel];

  const certName = learner ? learner.name : 'Demo Learner';
  const certDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const setField = (k: FieldKey) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const enrol = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLearner({ name: form.name.trim(), email: form.email.trim() });
    }
  };

  const toggleCurrent = () => setDone((d) => d.map((v, i) => (i === sel ? !v : v)));

  const field = (k: FieldKey, label: string, type: string, autoComplete: string) => (
    <div className="field-group">
      <label htmlFor={`pmp-${k}`}>{label}</label>
      <input
        className="field"
        id={`pmp-${k}`}
        type={type}
        autoComplete={autoComplete}
        value={form[k]}
        onChange={setField(k)}
        aria-invalid={errors[k] ? true : false}
        aria-describedby={errors[k] ? `pmp-${k}-err` : undefined}
      />
      {errors[k] && (
        <span id={`pmp-${k}-err`} role="alert" className="field-error">
          {errors[k]}
        </span>
      )}
    </div>
  );

  return (
    // Kept mounted while hidden so progress and enrolment survive a trip back to the home view.
    <section id="pmp" className="pmp" hidden={hidden}>
      <div className="container">
        <a className="inline-link back-link" href="#top">
          <ArrowLeft />
          Back to home
        </a>
        <div className="badge-row">
          <div className="eyebrow">PMP® LEARNING PATH</div>
          <span className="badge">PROTOTYPE</span>
        </div>
        <h2 className="h2">Your path to the PMP® exam</h2>
        <p className="lede">
          A preview of the course structure. Module headings are provisional, and enrolment and progress are demo data that
          stay on this page — nothing is sent anywhere.
        </p>

        <div className="pmp-layout">
          <div className="pmp-side">
            <div className="card panel">
              {learner ? (
                <>
                  <div className="welcome">
                    <div className="ok-circle">
                      <CheckIcon />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="welcome-name">Welcome, {learner.name}</div>
                      <div className="welcome-meta">Enrolled (demo) · {learner.email}</div>
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-small" type="button" onClick={() => setLearner(null)} style={{ marginTop: 18 }}>
                    Change details
                  </button>
                </>
              ) : (
                <>
                  <h3>Enrol (demo)</h3>
                  <form className="form" aria-label="Learner registration" onSubmit={enrol} noValidate>
                    {field('name', 'Full name', 'text', 'name')}
                    {field('email', 'Email address', 'email', 'email')}
                    {field('phone', 'Mobile number', 'tel', 'tel')}
                    <button className="btn btn-blue enrol-btn" type="submit">
                      Enrol
                    </button>
                    <p className="fine-print">Demo only: your details stay in this browser tab and are not stored or shared.</p>
                  </form>
                </>
              )}
            </div>

            <div className="card panel">
              <div className="progress-head">
                <h3>Your progress</h3>
                <span className="progress-pct">{pct}%</span>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-label="Course completion"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              >
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <p className="progress-note">
                {count} of {TOTAL} modules completed
              </p>
              <div className="btn-row">
                <button className="btn btn-ghost btn-small" type="button" onClick={() => setDone(PMP_MODULES.map(() => true))}>
                  Complete all (demo)
                </button>
                <button
                  className="btn btn-ghost btn-small"
                  type="button"
                  onClick={() => {
                    setDone(PMP_MODULES.map(() => false));
                    setSel(0);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="pmp-main">
            <div className="modules" role="list" aria-label="Course modules">
              {PMP_MODULES.map((title, i) => (
                <div role="listitem" key={title}>
                  <button
                    className={sel === i ? 'mod is-sel' : 'mod'}
                    type="button"
                    onClick={() => setSel(i)}
                    aria-current={sel === i ? 'true' : undefined}
                  >
                    <span className="mod-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="mod-title">{title}</span>
                    {done[i] ? (
                      <span className="mod-check" aria-label="Completed">
                        <CheckIcon size={14} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="mod-empty" aria-hidden="true" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="lesson" aria-live="polite">
              <div className="lesson-eyebrow">MODULE {String(sel + 1).padStart(2, '0')}</div>
              <h3>{PMP_MODULES[sel]}</h3>
              <p>[Lesson content for this module will be added once the final curriculum is ready.]</p>
              <div className="lesson-actions">
                <button className="btn btn-blue" type="button" onClick={toggleCurrent}>
                  {curDone ? 'Mark as incomplete' : 'Mark as completed'}
                </button>
                <button className="btn btn-ghost" type="button" onClick={() => setSel((s) => (s + 1) % TOTAL)}>
                  Next module
                </button>
              </div>
            </div>
          </div>
        </div>

        {allDone && (
          <div className="complete">
            <div className="complete-copy">
              <div className="complete-eyebrow">ALL MODULES COMPLETE</div>
              <h3>Well done, {certName}.</h3>
              <p>
                You've worked through every module in the prototype path. Download a sample certificate to preview what
                learners will receive.
              </p>
              {!learner && <p className="hint">Enrol above to show your own name on the certificate.</p>}
              <a
                className="btn btn-white cert-download"
                href={buildCertificate(certName, certDate)}
                download="PMP-Learning-Path-DEMO-certificate.svg"
              >
                <DownloadIcon />
                Download Sample Certificate
              </a>
            </div>
            <div className="cert" aria-label="Sample certificate preview">
              <div className="cert-frame" />
              <div className="cert-demo">DEMO · SAMPLE ONLY</div>
              <div className="cert-kicker">CERTIFICATE OF COMPLETION</div>
              <div className="cert-small" style={{ marginTop: 14 }}>This is to certify that</div>
              <div className="cert-name">{certName}</div>
              <div className="cert-small" style={{ marginTop: 6 }}>has completed all modules of</div>
              <div className="cert-course">PMP® Learning Path (Prototype)</div>
              <div className="cert-foot">
                <div>
                  <strong>{certDate}</strong>Date of completion
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>Rahul Mehra</strong>Course instructor
                </div>
              </div>
              <div className="cert-disclaimer">
                Prototype sample. Not an official PMI® credential and does not certify that the holder has earned the PMP®
                certification.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
