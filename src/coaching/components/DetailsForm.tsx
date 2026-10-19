import { useRef, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight } from '../../components/Icons';
import type { CoachingService } from '../data/services';
import { HEARD_FROM_OPTIONS, PURPOSE_MAX, PURPOSE_MIN, type AspirantDetails, type DetailsErrors } from '../lib/validation';
import { BookingSummary } from './BookingSummary';

interface Props {
  service: CoachingService;
  date: string | null;
  time: string | null;
  details: AspirantDetails;
  errors: DetailsErrors;
  onField: (field: keyof AspirantDetails, value: string) => void;
  onSubmit: () => DetailsErrors;
  onBack: () => void;
  onEditSlot: () => void;
}

const FIELD_ORDER: (keyof AspirantDetails)[] = ['fullName', 'whatsapp', 'email', 'purpose', 'heardFrom'];
const LABELS: Record<keyof AspirantDetails, string> = {
  fullName: 'Full name',
  whatsapp: 'WhatsApp number',
  email: 'Email address',
  purpose: 'Purpose of the call',
  heardFrom: 'How did you hear about me?',
};

export function DetailsForm({ service, date, time, details, errors, onField, onSubmit, onBack, onEditSlot }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const errorList = FIELD_ORDER.filter((f) => errors[f]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = onSubmit();
    const firstBad = FIELD_ORDER.find((f) => found[f]);
    if (firstBad) formRef.current?.querySelector<HTMLElement>(`#bk-${firstBad}`)?.focus();
  };

  const describedBy = (f: keyof AspirantDetails, hint?: string) =>
    [hint, errors[f] ? `bk-${f}-err` : null].filter(Boolean).join(' ') || undefined;

  const fieldError = (f: keyof AspirantDetails) =>
    errors[f] ? (
      <span id={`bk-${f}-err`} className="field-error">
        {errors[f]}
      </span>
    ) : null;

  return (
    <div>
      <button type="button" className="inline-link bk-back" onClick={onBack}>
        <ArrowLeft /> Date &amp; time
      </button>
      <h3 className="bk-step-title" data-step-heading tabIndex={-1}>
        Your details
      </h3>

      <div className="bk-two-col">
        <form ref={formRef} className="card bk-form bk-main-col" onSubmit={submit} noValidate aria-label="Your details">
          {errorList.length > 0 && (
            <div className="bk-error-summary" role="alert">
              <p>Please fix {errorList.length === 1 ? 'this' : `these ${errorList.length}`} before continuing:</p>
              <ul>
                {errorList.map((f) => (
                  <li key={f}>
                    <a href={`#bk-${f}`} onClick={(e) => { e.preventDefault(); document.getElementById(`bk-${f}`)?.focus(); }}>
                      {LABELS[f]}: {errors[f]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="bk-required-note">All fields are required.</p>

          <div className="field-group">
            <label htmlFor="bk-fullName">{LABELS.fullName}</label>
            <input
              id="bk-fullName" className="field" type="text" autoComplete="name" required
              value={details.fullName} onChange={(e) => onField('fullName', e.target.value)}
              aria-invalid={!!errors.fullName} aria-describedby={describedBy('fullName')}
            />
            {fieldError('fullName')}
          </div>

          <div className="field-group">
            <label htmlFor="bk-whatsapp">{LABELS.whatsapp}</label>
            <input
              id="bk-whatsapp" className="field" type="tel" inputMode="tel" autoComplete="tel" required
              value={details.whatsapp} onChange={(e) => onField('whatsapp', e.target.value)}
              aria-invalid={!!errors.whatsapp} aria-describedby={describedBy('whatsapp', 'bk-whatsapp-hint')}
            />
            <span id="bk-whatsapp-hint" className="bk-hint">Include your country code, e.g. +91 98765 43210.</span>
            {fieldError('whatsapp')}
          </div>

          <div className="field-group">
            <label htmlFor="bk-email">{LABELS.email}</label>
            <input
              id="bk-email" className="field" type="email" inputMode="email" autoComplete="email" required
              value={details.email} onChange={(e) => onField('email', e.target.value)}
              aria-invalid={!!errors.email} aria-describedby={describedBy('email')}
            />
            {fieldError('email')}
          </div>

          <div className="field-group">
            <label htmlFor="bk-purpose">{LABELS.purpose}</label>
            <textarea
              id="bk-purpose" className="field bk-textarea" required rows={5} maxLength={PURPOSE_MAX}
              value={details.purpose} onChange={(e) => onField('purpose', e.target.value)}
              aria-invalid={!!errors.purpose} aria-describedby={describedBy('purpose', 'bk-purpose-hint')}
            />
            <span id="bk-purpose-hint" className="bk-hint">
              What would you like help with? Mention the role, company or exam you're preparing for. (At least {PURPOSE_MIN}{' '}
              characters · {details.purpose.trim().length}/{PURPOSE_MAX})
            </span>
            {fieldError('purpose')}
          </div>

          <div className="field-group">
            <label htmlFor="bk-heardFrom">{LABELS.heardFrom}</label>
            <select
              id="bk-heardFrom" className="field bk-select" required
              value={details.heardFrom} onChange={(e) => onField('heardFrom', e.target.value)}
              aria-invalid={!!errors.heardFrom} aria-describedby={describedBy('heardFrom')}
            >
              <option value="">Select an option</option>
              {HEARD_FROM_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            {fieldError('heardFrom')}
          </div>

          <p className="fine-print">
            Prototype: your details stay in this browser tab. Nothing is stored or sent anywhere.
          </p>
          <button type="submit" className="btn btn-blue btn-cta bk-continue">
            Review booking <ArrowRight />
          </button>
        </form>

        <aside className="bk-side-col">
          <BookingSummary service={service} date={date} time={time} onEditSlot={onEditSlot} />
        </aside>
      </div>
    </div>
  );
}
