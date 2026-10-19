import type { ReactNode } from 'react';
import { BOOKING_TIMEZONE_LABEL } from '../data/availability';
import type { CoachingService } from '../data/services';
import { formatDateLong, formatTime, localEquivalent } from '../lib/dates';
import { Value } from './Placeholder';

interface Props {
  service: CoachingService;
  date: string | null;
  time: string | null;
  title?: string;
  /** Edit links shown in review mode. */
  onEditService?: () => void;
  onEditSlot?: () => void;
  children?: ReactNode;
}

export function BookingSummary({ service, date, time, title = 'Your session', onEditService, onEditSlot, children }: Props) {
  const local = date && time ? localEquivalent(date, time) : null;
  return (
    <div className="bk-summary">
      <h3 className="bk-summary-title">{title}</h3>
      <dl>
        <div>
          <dt>
            Service
            {onEditService && (
              <button type="button" className="bk-edit" onClick={onEditService}>
                Change<span className="sr-only"> service</span>
              </button>
            )}
          </dt>
          <dd>{service.title}</dd>
        </div>
        <div>
          <dt>
            Date &amp; time
            {onEditSlot && (
              <button type="button" className="bk-edit" onClick={onEditSlot}>
                Change<span className="sr-only"> date and time</span>
              </button>
            )}
          </dt>
          {date && time ? (
            <dd>
              {formatDateLong(date)}
              <br />
              {formatTime(time)} IST
              {local && <span className="bk-local">Your time: {local}</span>}
            </dd>
          ) : (
            <dd className="bk-muted">Not selected yet</dd>
          )}
        </div>
        <div>
          <dt>Timezone</dt>
          <dd>{BOOKING_TIMEZONE_LABEL}</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>
            <Value text={service.duration} />
          </dd>
        </div>
        <div>
          <dt>Price</dt>
          <dd>
            <Value text={service.price} />
          </dd>
        </div>
      </dl>
      {children}
    </div>
  );
}
