import { CheckIcon } from '../../components/Icons';
import type { BookingConfirmation, WhatsappStatus } from '../api/bookingApi';
import type { CoachingService } from '../data/services';
import { BookingSummary } from './BookingSummary';

interface Props {
  confirmation: BookingConfirmation;
  service: CoachingService;
  resending: boolean;
  resendError: string | null;
  onResendEmails: () => void;
  onBookAnother: () => void;
  onHome: () => void;
}

/** Plain-language status for each email, never claiming more than the server confirmed. */
function emailLine(who: 'booker' | 'owner', outcome: string | undefined, email: string) {
  if (who === 'booker') {
    if (outcome === 'sent') return <>A confirmation email has been sent to <strong className="bk-break">{email}</strong>.</>;
    if (outcome === 'failed') return <>We couldn’t send your confirmation email. Please note your reference above — your booking is still recorded.</>;
    return <>We couldn’t confirm whether your confirmation email was sent. Please note your reference above.</>;
  }
  if (outcome === 'sent') return <>Rahul has been notified by email.</>;
  if (outcome === 'failed') return <>Rahul couldn’t be notified automatically. Please also contact him from <strong>Need help?</strong> (bottom right) with your reference.</>;
  return <>We couldn’t confirm whether Rahul was notified. Please also contact him from <strong>Need help?</strong> (bottom right).</>;
}

const timeIst = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }) + ' IST';

/** WhatsApp status, worded strictly by what the server reported (never "delivered"). */
function whatsappLine(w: WhatsappStatus | undefined, number: string) {
  if (!w || w.confirmation === 'not_requested') return null;
  const reminder =
    w.reminderAt && (w.reminder === 'pending' || w.reminder === 'simulated')
      ? ` A reminder is scheduled for about ${timeIst(w.reminderAt)} on the day.`
      : '';
  switch (w.confirmation) {
    case 'sent':
      return <li>Your WhatsApp confirmation was accepted by WhatsApp for <strong className="bk-break">{number}</strong>.{reminder}</li>;
    case 'simulated':
      return <li><strong>Test mode:</strong> a WhatsApp confirmation to {number} was simulated. No message was actually sent.{reminder}</li>;
    case 'failed':
      return <li>We couldn’t send your WhatsApp confirmation yet; it will be retried automatically. Your booking is confirmed either way.</li>;
    case 'skipped':
      return w.confirmationReason === 'disabled' || w.confirmationReason === 'not_configured' ? (
        <li>WhatsApp messages aren’t switched on for bookings yet, so none was sent. Your confirmation email and booking reference are your record.</li>
      ) : (
        <li>No WhatsApp confirmation was sent for this booking. Your confirmation email and booking reference are your record.</li>
      );
    default:
      return <li>Your WhatsApp confirmation is being prepared.{reminder}</li>;
  }
}

export function Confirmation({ confirmation: c, service, resending, resendError, onResendEmails, onBookAnother, onHome }: Props) {
  const server = c.mode !== 'demo'; // stored by the server (mock or live)
  const live = c.mode === 'live'; // Google Calendar event + verified Meet link
  const first = c.details.fullName.trim().split(/\s+/)[0];
  const allSent = c.emails?.owner === 'sent' && c.emails?.booker === 'sent';
  const canResend = server && !allSent && !!c.request;
  return (
    <div className="bk-confirmed">
      <div className="bk-confirmed-head">
        <div className="ok-circle" aria-hidden="true">
          <CheckIcon />
        </div>
        <div>
          <span className="badge">{live ? 'CONFIRMED' : 'DEMO BOOKING'}</span>
          <h3 className="bk-step-title" data-step-heading tabIndex={-1}>
            {live ? 'Your session is confirmed' : server ? 'Your slot is booked' : 'Demo booking complete'}
          </h3>
          <p className="bk-lede">
            {live
              ? `Thanks, ${first}. Your session is in Rahul’s calendar and your Google Meet link is ready.`
              : server
                ? `Thanks, ${first}. Your slot is reserved — no one else can book this time.`
                : `Thanks, ${first}. This is how the confirmation will look once bookings are live.`}
          </p>
        </div>
      </div>

      <div className="bk-ref">
        <span>{server ? 'Booking reference' : 'Demo reference'}</span>
        <strong>{c.reference}</strong>
      </div>

      {live && c.meetUrl && (
        <div className="bk-meet" role="region" aria-label="Google Meet">
          <div className="bk-meet-head">
            <span className="bk-meet-label">Google Meet</span>
            <a className="bk-meet-url bk-break" href={c.meetUrl} target="_blank" rel="noopener noreferrer">
              {c.meetUrl.replace('https://', '')}
            </a>
          </div>
          <a className="btn btn-blue btn-cta" href={c.meetUrl} target="_blank" rel="noopener noreferrer">
            Join Google Meet
          </a>
          <ol className="bk-meet-steps">
            <li>A minute before your session, open the link above (it’s also in your email).</li>
            <li>Sign in with any Google account, or join from the browser as a guest.</li>
            <li>Allow your camera and microphone, then press <strong>Join</strong> or <strong>Ask to join</strong>.</li>
          </ol>
        </div>
      )}

      {server ? (
        <div className={allSent ? 'bk-live-notice' : 'bk-live-notice is-warning'} role="status">
          <h4>{allSent ? 'Emails sent' : 'Booking recorded — some emails weren’t sent'}</h4>
          <ul>
            <li>{emailLine('booker', c.emails?.booker, c.details.email)}</li>
            <li>{emailLine('owner', c.emails?.owner, c.details.email)}</li>
            {!live && (
              <li>
                This is a demo booking from the new booking system. <strong>The meeting link will be shared separately.</strong>
              </li>
            )}
            {whatsappLine(c.whatsapp, c.details.whatsapp)}
          </ul>
          {canResend && (
            <div className="bk-resend">
              <button type="button" className="btn btn-ghost bk-ghost-cta" onClick={onResendEmails} disabled={resending} aria-busy={resending}>
                {resending ? 'Sending…' : 'Send email again'}
              </button>
              {c.emailRetryAfterSeconds ? (
                <span role="status">Please wait about {c.emailRetryAfterSeconds} seconds before trying again.</span>
              ) : null}
              {resendError && <span role="alert">{resendError}</span>}
            </div>
          )}
        </div>
      ) : (
        <div className="bk-prototype-notice" role="note">
          <h4>Prototype — nothing has been booked</h4>
          <ul>
            <li>This slot has <strong>not</strong> been reserved against a real calendar.</li>
            <li>No meeting link has been created.</li>
            <li>No WhatsApp message or email has been sent to you or to Rahul.</li>
          </ul>
          <p>
            Online booking for this session isn't live yet. To arrange it in the meantime, reach out through the{' '}
            <a href="#contact">contact options</a> on this site.
          </p>
        </div>
      )}

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
          {server ? 'Book another session' : 'Make another demo booking'}
        </button>
        <button type="button" className="btn btn-ghost bk-ghost-cta" onClick={onHome}>
          Back to homepage
        </button>
        <a className="inline-link" href="#support">
          Questions about your booking? Help &amp; FAQs
        </a>
      </div>
    </div>
  );
}
