import { CheckIcon } from '../../components/Icons';
import type { BookingConfirmation } from '../api/bookingApi';
import type { CoachingService } from '../data/services';
import { BookingSummary } from './BookingSummary';

interface Props {
  confirmation: BookingConfirmation;
  service: CoachingService;
  onBookAnother: () => void;
  onHome: () => void;
}

export function Confirmation({ confirmation: c, service, onBookAnother, onHome }: Props) {
  return (
    <div className="bk-confirmed">
      <div className="bk-confirmed-head">
        <div className="ok-circle" aria-hidden="true">
          <CheckIcon />
        </div>
        <div>
          <span className="badge">DEMO BOOKING</span>
          <h3 className="bk-step-title" data-step-heading tabIndex={-1}>
            Demo booking complete
          </h3>
          <p className="bk-lede">Thanks, {c.details.fullName.trim().split(/\s+/)[0]}. This is how the confirmation will look once bookings are live.</p>
        </div>
      </div>

      <div className="bk-ref">
        <span>Demo reference</span>
        <strong>{c.reference}</strong>
      </div>

      <div className="bk-prototype-notice" role="note">
        <h4>Prototype — nothing has been booked</h4>
        <ul>
          <li>This slot has <strong>not</strong> been reserved against a real calendar.</li>
          <li>No meeting link has been created.</li>
          <li>No WhatsApp message or email has been sent to you or to Rahul.</li>
        </ul>
        <p>
          Online booking isn't live yet. To arrange a session in the meantime, reach out through the{' '}
          <a href="#contact">contact options</a> on this site.
        </p>
      </div>

      <div className="bk-two-col">
        <div className="bk-main-col">
          <BookingSummary service={service} date={c.date} time={c.time} title="Session" />
        </div>
        <div className="bk-side-col">
          <div className="bk-summary">
            <h3 className="bk-summary-title">Your details</h3>
            <dl>
              <div><dt>Name</dt><dd>{c.details.fullName.trim()}</dd></div>
              <div><dt>WhatsApp</dt><dd>{c.details.whatsapp}</dd></div>
              <div><dt>Email</dt><dd className="bk-break">{c.details.email}</dd></div>
            </dl>
          </div>
        </div>
      </div>

      <div className="bk-actions">
        <button type="button" className="btn btn-blue btn-cta" onClick={onBookAnother}>
          Make another demo booking
        </button>
        <button type="button" className="btn btn-ghost bk-ghost-cta" onClick={onHome}>
          Back to homepage
        </button>
      </div>
    </div>
  );
}
