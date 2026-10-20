import { useCallback, useReducer } from 'react';
import { apiFor, BookingError, newIdempotencyKey, type BookingConfirmation, type BookingMode } from './api/bookingApi';
import { findService, type ServiceId } from './data/services';
import { EMPTY_DETAILS, validateDetails, type AspirantDetails, type DetailsErrors } from './lib/validation';

export type Step = 'services' | 'details' | 'slot' | 'form' | 'review' | 'confirmed';

export const STEPS: { id: Step; label: string }[] = [
  { id: 'services', label: 'Service' },
  { id: 'details', label: 'Details' },
  { id: 'slot', label: 'Slot' },
  { id: 'form', label: 'Your details' },
  { id: 'review', label: 'Review' },
  { id: 'confirmed', label: 'Confirmed' },
];

interface State {
  step: Step;
  serviceId: ServiceId | null;
  date: string | null;
  time: string | null;
  details: AspirantDetails;
  errors: DetailsErrors;
  slotError: string | null;
  submitting: boolean;
  submitError: string | null;
  confirmation: BookingConfirmation | null;
  /** Idempotency key for the current review screen; retries reuse it. */
  attemptKey: string;
  /** Reported by the server with availability: mock (sample hours) or live (Google Calendar). */
  mode: BookingMode | null;
  resending: boolean;
  resendError: string | null;
}

type Action =
  | { type: 'go'; step: Step }
  | { type: 'pickService'; id: ServiceId }
  | { type: 'pickDate'; date: string }
  | { type: 'pickTime'; time: string }
  | { type: 'slotError'; message: string | null }
  | { type: 'setField'; field: keyof AspirantDetails; value: string }
  | { type: 'setErrors'; errors: DetailsErrors }
  | { type: 'submitStart' }
  | { type: 'submitFail'; message: string; slotTaken: boolean }
  | { type: 'submitOk'; confirmation: BookingConfirmation }
  | { type: 'mode'; mode: BookingMode }
  | { type: 'resendStart' }
  | { type: 'resendDone'; confirmation?: BookingConfirmation; error?: string }
  | { type: 'reset' };

const initial: State = {
  step: 'services',
  serviceId: null,
  date: null,
  time: null,
  details: EMPTY_DETAILS,
  errors: {},
  slotError: null,
  submitting: false,
  submitError: null,
  confirmation: null,
  attemptKey: '',
  mode: null,
  resending: false,
  resendError: null,
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'go':
      // Entering Review starts a new confirmation attempt with a fresh idempotency key.
      return { ...s, step: a.step, submitError: null, attemptKey: a.step === 'review' ? newIdempotencyKey() : s.attemptKey };
    case 'pickService':
      // The form is kept. The slot is cleared when the service changes: live and demo
      // services draw on different availability.
      return a.id === s.serviceId
        ? { ...s, step: 'details' }
        : { ...s, serviceId: a.id, step: 'details', date: null, time: null, slotError: null };
    case 'pickDate':
      return { ...s, date: a.date, time: s.date === a.date ? s.time : null, slotError: null };
    case 'pickTime':
      return { ...s, time: a.time, slotError: null };
    case 'slotError':
      return { ...s, slotError: a.message };
    case 'setField': {
      // Clear a field's error as soon as it's edited; keep the rest until the next submit.
      const errors = { ...s.errors };
      delete errors[a.field];
      return { ...s, details: { ...s.details, [a.field]: a.value }, errors };
    }
    case 'setErrors':
      return { ...s, errors: a.errors };
    case 'submitStart':
      return { ...s, submitting: true, submitError: null };
    case 'submitFail':
      return a.slotTaken
        ? { ...s, submitting: false, time: null, step: 'slot', slotError: a.message }
        : { ...s, submitting: false, submitError: a.message };
    case 'submitOk':
      return { ...s, submitting: false, confirmation: a.confirmation, step: 'confirmed' };
    case 'mode':
      return s.mode === a.mode ? s : { ...s, mode: a.mode };
    case 'resendStart':
      return { ...s, resending: true, resendError: null };
    case 'resendDone':
      return { ...s, resending: false, resendError: a.error ?? null, confirmation: a.confirmation ?? s.confirmation };
    case 'reset':
      return initial;
  }
}

export function useBookingFlow() {
  const [state, dispatch] = useReducer(reducer, initial);

  const go = useCallback((step: Step) => dispatch({ type: 'go', step }), []);

  /** Validates the form; moves on to review when it passes. Returns the errors. */
  const submitDetails = useCallback((): DetailsErrors => {
    const errors = validateDetails(state.details);
    dispatch({ type: 'setErrors', errors });
    if (Object.keys(errors).length === 0) dispatch({ type: 'go', step: 'review' });
    return errors;
  }, [state.details]);

  /** Slot is required before the form; returns false (with a message) if missing. */
  const confirmSlot = useCallback((): boolean => {
    if (!state.date || !state.time) {
      dispatch({ type: 'slotError', message: 'Choose a date and a time slot to continue.' });
      return false;
    }
    dispatch({ type: 'go', step: 'form' });
    return true;
  }, [state.date, state.time]);

  const confirmBooking = useCallback(async () => {
    if (!state.serviceId || !state.date || !state.time) {
      dispatch({ type: 'submitFail', message: 'Choose a date and a time slot first.', slotTaken: true });
      return;
    }
    const errors = validateDetails(state.details);
    if (Object.keys(errors).length) {
      dispatch({ type: 'setErrors', errors });
      dispatch({ type: 'go', step: 'form' });
      return;
    }
    const service = findService(state.serviceId);
    if (!service) return;
    dispatch({ type: 'submitStart' });
    try {
      const confirmation = await apiFor(service).createBooking({
        serviceId: state.serviceId,
        date: state.date,
        time: state.time,
        details: state.details,
        idempotencyKey: state.attemptKey || newIdempotencyKey(),
      });
      dispatch({ type: 'submitOk', confirmation });
    } catch (err) {
      const slotTaken = err instanceof BookingError && err.code === 'slot_unavailable';
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      dispatch({ type: 'submitFail', message, slotTaken });
    }
  }, [state.serviceId, state.date, state.time, state.details, state.attemptKey]);

  /** Retries only the emails that weren't accepted, using the original idempotency key (no new booking). */
  const resendEmails = useCallback(async () => {
    const c = state.confirmation;
    const service = c && findService(c.serviceId);
    if (!c?.request || !service) return;
    dispatch({ type: 'resendStart' });
    try {
      const updated = await apiFor(service).createBooking(c.request);
      dispatch({ type: 'resendDone', confirmation: updated });
    } catch (err) {
      dispatch({ type: 'resendDone', error: err instanceof Error ? err.message : 'Please try again in a moment.' });
    }
  }, [state.confirmation]);

  return {
    state,
    go,
    pickService: (id: ServiceId) => dispatch({ type: 'pickService', id }),
    pickDate: (date: string) => dispatch({ type: 'pickDate', date }),
    pickTime: (time: string) => dispatch({ type: 'pickTime', time }),
    setField: (field: keyof AspirantDetails, value: string) => dispatch({ type: 'setField', field, value }),
    confirmSlot,
    submitDetails,
    confirmBooking,
    resendEmails,
    setMode: (mode: BookingMode) => dispatch({ type: 'mode', mode }),
    reset: () => dispatch({ type: 'reset' }),
  };
}

export type BookingFlow = ReturnType<typeof useBookingFlow>;
