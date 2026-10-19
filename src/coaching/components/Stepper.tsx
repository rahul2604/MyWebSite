import { CheckIcon } from '../../components/Icons';
import { STEPS, type Step } from '../useBookingFlow';

export function Stepper({ step }: { step: Step }) {
  const current = STEPS.findIndex((s) => s.id === step);
  return (
    <nav aria-label="Booking progress" className="bk-stepper">
      <ol>
        {STEPS.map((s, i) => {
          const state = i < current ? 'done' : i === current ? 'current' : 'todo';
          return (
            <li key={s.id} className={`bk-step is-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
              <span className="bk-step-dot" aria-hidden="true">
                {state === 'done' ? <CheckIcon size={13} strokeWidth={3} /> : i + 1}
              </span>
              <span className="bk-step-label">
                {s.label}
                {state === 'done' && <span className="sr-only"> (completed)</span>}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="bk-stepper-mobile" aria-hidden="true">
        Step {current + 1} of {STEPS.length} · {STEPS[current].label}
      </p>
    </nav>
  );
}
