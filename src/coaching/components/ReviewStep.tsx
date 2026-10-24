import { useState } from 'react';
import { ArrowLeft } from '../../components/Icons';
import type { BookingMode } from '../api/bookingApi';
import type { CoachingService } from '../data/services';
import type { AspirantDetails } from '../lib/validation';
import { BookingSummary } from './BookingSummary';

interface Props {
  service: CoachingService;
  date: string;
  time: string;
  details: AspirantDetails;
  /** Server-reported mode for "server" services; null until availability has loaded. */
  mode: BookingMode | null;
  submitting: boolean;
  error: string | null;
  onBack: () => void;
  onEditService: () => void;
  onEditSlot: () => void;
  onEditDetails: () => void;
  onConfirm: () => void;
}

export function ReviewStep(p: Props) {
  const [ack, setAck] = useState(false);
  const [ackError, setAckError] = useState(false);
  const mode: BookingMode = p.service.booking === 'server' ? (p.mode ?? 'mock') : 'demo';

  const confirm = () => {
    if (!ack) {
      setAckError(true);
      document.getElementById('bk-ack')?.focus();
      return;
    }
    p.onConfirm();
  };

  return (
    <div>
      <button type="button" className="inline-link bk-back" onClick={p.onBack}>
        <ArrowLeft /> Your details
      </button>
      <h3 className="bk-step-title" data-step-heading tabIndex={-1}>
        Review your booking
      </h3>

      <div className="bk-two-col">
        <div className="bk-main-col">
          <BookingSummary
            service={p.service} date={p.date} time={p.time} title="Session"
            onEditService={p.onEditService} onEditSlot={p.onEditSlot}
          />
          <div className="bk-summary">
            <h3 className="bk-summary-title">
              Your details
              <button type="button" className="bk-edit" onClick={p.onEditDetails}>
                Edit<span className="sr-only"> your details</span>
              </button>
            </h3>
            <dl>
              <div><dt>Full name</dt><dd>{p.details.fullName.trim()}</dd></div>
              <div><dt>WhatsApp</dt><dd>{p.details.whatsapp.trim()}</dd></div>
              {mode !== 'demo' && (
                <div>
                  <dt>WhatsApp updates</dt>
                  <dd>{p.details.whatsappOptIn ? 'Yes: confirmation and reminder on WhatsApp' : 'No (email only)'}</dd>
                </div>
              )}
              <div><dt>Email</dt><dd className="bk-break">{p.details.email.trim()}</dd></div>
              <div><dt>Purpose</dt><dd className="bk-pre">{p.details.purpose.trim()}</dd></div>
              <div><dt>Heard about me via</dt><dd>{p.details.heardFrom}</dd></div>
            </dl>
          </div>
        </div>

        <aside className="bk-side-col">
          <div className="card bk-confirm-box">
            <p className="bk-free-note">
              <span className="bk-chip bk-chip-free">Free</span> This session is free. You won’t be asked for any payment.
            </p>
            <p className="bk-demo-note" role="note">
              {mode === 'live' ? (
                <>
                  <strong>Live booking.</strong> Confirming books this time in Rahul’s Google Calendar and creates a Google
                  Meet link. You’ll see the link on the next screen and receive it by email.
                </>
              ) : mode === 'mock' ? (
                <>
                  <strong>Demo booking.</strong> Confirming reserves this slot and emails a confirmation to you and a
                  notification to Rahul. The meeting link will be shared separately.
                </>
              ) : (
                <>
                  <strong>This is a demo.</strong> Confirming creates a sample booking reference only. No calendar slot is reserved and
                  no message, email or meeting link is sent.
                </>
              )}
            </p>
            <label className="bk-check">
              <input
                id="bk-ack" type="checkbox" checked={ack}
                onChange={(e) => { setAck(e.target.checked); setAckError(false); }}
                aria-invalid={ackError} aria-describedby={ackError ? 'bk-ack-err' : undefined}
              />
              <span>
                {mode === 'live'
                  ? 'I’ll join the Google Meet call at the booked time (IST)'
                  : mode === 'mock'
                    ? 'I understand this is a demo booking and the meeting link will be shared separately'
                    : 'I understand this is a prototype booking'}
              </span>
            </label>
            {ackError && (
              <span id="bk-ack-err" className="field-error" role="alert">
                {mode === 'live' ? 'Tick the box to continue.' : 'Tick the box to confirm you understand this is a demo.'}
              </span>
            )}
            {p.error && (
              <p className="bk-error" role="alert">
                {p.error}
              </p>
            )}
            <button type="button" className="btn btn-blue btn-cta bk-continue" onClick={confirm} disabled={p.submitting} aria-busy={p.submitting}>
              {p.submitting ? 'Confirming…' : mode === 'demo' ? 'Confirm demo booking' : 'Confirm booking'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
