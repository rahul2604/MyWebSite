import { useEffect, useRef } from 'react';
import { ArrowLeft } from '../components/Icons';
import { Confirmation } from './components/Confirmation';
import { DetailsForm } from './components/DetailsForm';
import { ReviewStep } from './components/ReviewStep';
import { ServiceDetail } from './components/ServiceDetail';
import { ServiceList } from './components/ServiceList';
import { SlotPicker } from './components/SlotPicker';
import { Stepper } from './components/Stepper';
import { findService } from './data/services';
import { useBookingFlow } from './useBookingFlow';
import './coaching.css';

/* Strategy & Coaching booking prototype. Kept mounted while hidden so progress survives a trip home. */
export function CoachingPage({ hidden }: { hidden: boolean }) {
  const flow = useBookingFlow();
  const { state } = flow;
  const service = findService(state.serviceId);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // On each step change, bring the panel into view and move focus to the step's heading.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const panel = panelRef.current;
    if (!panel) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    panel.querySelector<HTMLElement>('[data-step-heading]')?.focus({ preventScroll: true });
  }, [state.step]);

  // A step that needs a service (or slot) falls back if it is missing.
  const step =
    state.step !== 'services' && !service ? 'services'
      : (state.step === 'review' && (!state.date || !state.time)) ? 'slot'
        : state.step;

  return (
    <section id="coaching" className="pmp bk" hidden={hidden} aria-labelledby="bk-title">
      <div className="container">
        <a className="inline-link back-link" href="#top">
          <ArrowLeft />
          Back to home
        </a>
        <div className="badge-row">
          <div className="eyebrow">STRATEGY &amp; COACHING</div>
          <span className="badge">PROTOTYPE · DEMO BOOKINGS</span>
        </div>
        <h2 id="bk-title" className="h2">Book a coaching session</h2>
        <p className="lede">
          One-to-one guidance for strategy and consulting interviews. Choose a time and share a little about what you
          need.
        </p>

        <div ref={panelRef} className="bk-panel">
          <Stepper step={step} />

          {step === 'services' && <ServiceList selectedId={state.serviceId} onSelect={flow.pickService} />}

          {step === 'details' && service && (
            <ServiceDetail service={service} onBack={() => flow.go('services')} onChooseSlot={() => flow.go('slot')} />
          )}

          {step === 'slot' && service && (
            <SlotPicker
              service={service}
              date={state.date}
              time={state.time}
              error={state.slotError}
              onPickDate={flow.pickDate}
              onPickTime={flow.pickTime}
              onBack={() => flow.go('details')}
              onContinue={flow.confirmSlot}
            />
          )}

          {step === 'form' && service && (
            <DetailsForm
              service={service}
              date={state.date}
              time={state.time}
              details={state.details}
              errors={state.errors}
              onField={flow.setField}
              onSubmit={flow.submitDetails}
              onBack={() => flow.go('slot')}
              onEditSlot={() => flow.go('slot')}
            />
          )}

          {step === 'review' && service && state.date && state.time && (
            <ReviewStep
              service={service}
              date={state.date}
              time={state.time}
              details={state.details}
              submitting={state.submitting}
              error={state.submitError}
              onBack={() => flow.go('form')}
              onEditService={() => flow.go('services')}
              onEditSlot={() => flow.go('slot')}
              onEditDetails={() => flow.go('form')}
              onConfirm={flow.confirmBooking}
            />
          )}

          {step === 'confirmed' && state.confirmation && (
            <Confirmation
              confirmation={state.confirmation}
              service={findService(state.confirmation.serviceId) ?? service!}
              onBookAnother={flow.reset}
              onHome={() => {
                flow.reset();
                window.location.hash = '#top';
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
