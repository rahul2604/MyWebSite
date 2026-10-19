import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from '../../components/Icons';
import { bookingApi, type DayAvailability } from '../api/bookingApi';
import { BOOKING_TIMEZONE_LABEL } from '../data/availability';
import type { CoachingService } from '../data/services';
import {
  formatDateLong, formatMonth, formatSlot, monthGrid, parseDateKey, toDateKey, WEEKDAY_LABELS,
} from '../lib/dates';
import { BookingSummary } from './BookingSummary';

interface Props {
  service: CoachingService;
  date: string | null;
  time: string | null;
  error: string | null;
  onPickDate: (date: string) => void;
  onPickTime: (time: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

type Load = { status: 'loading' } | { status: 'error' } | { status: 'ready'; days: Map<string, DayAvailability> };

const monthIndex = (y: number, m: number) => y * 12 + m;

export function SlotPicker({ service, date, time, error, onPickDate, onPickTime, onBack, onContinue }: Props) {
  const range = useMemo(() => bookingApi.bookingWindow(), []);
  const first = parseDateKey(range.first);
  const last = parseDateKey(range.last);
  const start = date ? parseDateKey(date) : first;
  const [view, setView] = useState({ y: start.y, m: start.m });
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const timesRef = useRef<HTMLDivElement>(null);
  const pickedDate = useRef(date);

  // On narrow screens the times sit below the calendar: bring them into view after a date is picked.
  useEffect(() => {
    if (!date || date === pickedDate.current) return;
    pickedDate.current = date;
    if (window.matchMedia('(max-width: 859px)').matches) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      timesRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  }, [date]);

  useEffect(() => {
    let alive = true;
    setLoad({ status: 'loading' });
    const monthStart = toDateKey(view.y, view.m, 1);
    const monthEnd = toDateKey(view.y, view.m, new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate());
    const from = monthStart < range.first ? range.first : monthStart;
    const to = monthEnd > range.last ? range.last : monthEnd;
    bookingApi
      .getAvailability(from, to)
      .then((days) => alive && setLoad({ status: 'ready', days: new Map(days.map((d) => [d.date, d])) }))
      .catch(() => alive && setLoad({ status: 'error' }));
    return () => {
      alive = false;
    };
  }, [view.y, view.m, range.first, range.last, attempt]);

  const canPrev = monthIndex(view.y, view.m) > monthIndex(first.y, first.m);
  const canNext = monthIndex(view.y, view.m) < monthIndex(last.y, last.m);
  const shift = (delta: number) => {
    const idx = monthIndex(view.y, view.m) + delta;
    setView({ y: Math.floor(idx / 12), m: idx % 12 });
  };

  const days = load.status === 'ready' ? load.days : null;
  const openCount = (key: string) => days?.get(key)?.slots.filter((s) => s.status === 'available').length ?? 0;
  const monthHasSlots = days ? [...days.values()].some((d) => d.slots.some((s) => s.status === 'available')) : false;
  const daySlots = date && days?.get(date) ? days.get(date)!.slots.filter((s) => s.status !== 'past') : [];

  return (
    <div>
      <button type="button" className="inline-link bk-back" onClick={onBack}>
        <ArrowLeft /> Service details
      </button>
      <h3 className="bk-step-title" data-step-heading tabIndex={-1}>
        Choose a date and time
      </h3>
      <p className="bk-demo-note" role="note">
        <strong>Demo availability.</strong> These slots are sample data for this prototype, not real availability. Choosing
        one does not reserve anything.
      </p>

      <div className="bk-two-col">
        <div className="bk-main-col">
          <div className="card bk-calendar">
            <div className="bk-cal-head">
              <button type="button" className="bk-icon-btn" onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month">
                <ArrowLeft size={18} />
              </button>
              <h4 aria-live="polite">{formatMonth(view.y, view.m)}</h4>
              <button type="button" className="bk-icon-btn" onClick={() => shift(1)} disabled={!canNext} aria-label="Next month">
                <ArrowRight size={18} />
              </button>
            </div>

            {load.status === 'error' ? (
              <div className="bk-state" role="alert">
                <p>Couldn't load availability.</p>
                <button type="button" className="btn btn-ghost btn-small" onClick={() => setAttempt((n) => n + 1)}>
                  Try again
                </button>
              </div>
            ) : (
              <table className="bk-cal-grid" aria-busy={load.status === 'loading'}>
                <caption className="sr-only">
                  {formatMonth(view.y, view.m)} — dates with demo slots can be selected
                </caption>
                <thead>
                  <tr>
                    {WEEKDAY_LABELS.map((d) => (
                      <th key={d} scope="col" abbr={d}>
                        {d.slice(0, 2)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthGrid(view.y, view.m).map((week, wi) => (
                    <tr key={wi}>
                      {week.map((key, di) => {
                        if (!key) return <td key={di} />;
                        const n = openCount(key);
                        const selected = key === date;
                        const dayNum = parseDateKey(key).d;
                        return (
                          <td key={key}>
                            <button
                              type="button"
                              className={`bk-day${selected ? ' is-selected' : ''}${n ? ' has-slots' : ''}`}
                              disabled={!n}
                              aria-pressed={selected}
                              aria-label={`${formatDateLong(key)}, ${n ? `${n} demo slot${n > 1 ? 's' : ''} available` : 'no slots available'}`}
                              onClick={() => onPickDate(key)}
                            >
                              {dayNum}
                              {n > 0 && <span className="bk-day-dot" aria-hidden="true" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {load.status === 'loading' && <p className="bk-cal-status">Loading demo availability…</p>}
            {load.status === 'ready' && !monthHasSlots && (
              <p className="bk-cal-status">No demo slots this month{canNext ? ' — try the next month.' : '.'}</p>
            )}
            <ul className="bk-legend" aria-label="Legend">
              <li><span className="bk-swatch is-open" aria-hidden="true" /> Available</li>
              <li><span className="bk-swatch is-taken" aria-hidden="true" /> Unavailable</li>
              <li><span className="bk-swatch is-sel" aria-hidden="true" /> Selected</li>
            </ul>
          </div>

          <div ref={timesRef} className="card bk-times" aria-live="polite">
            <h4>{date ? formatDateLong(date) : 'Pick a date to see times'}</h4>
            <p className="bk-tz">All times in {BOOKING_TIMEZONE_LABEL}</p>
            {date && daySlots.length === 0 && load.status === 'ready' && (
              <p className="bk-muted">No times left on this date. Choose another date.</p>
            )}
            {daySlots.length > 0 && (
              <div className="bk-slot-grid" role="group" aria-label={`Times on ${formatDateLong(date!)}`}>
                {daySlots.map((s) => {
                  const selected = s.time === time;
                  const open = s.status === 'available';
                  return (
                    <button
                      key={s.time}
                      type="button"
                      className={`bk-slot${selected ? ' is-selected' : ''}${open ? '' : ' is-taken'}`}
                      disabled={!open}
                      aria-pressed={selected}
                      onClick={() => onPickTime(s.time)}
                    >
                      {formatSlot(s.time, service.durationMinutes)}
                      {!open && <span className="bk-slot-note">Booked</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <aside className="bk-side-col">
          <BookingSummary service={service} date={date && time ? date : null} time={time} />
          {error && (
            <p className="bk-error" role="alert">
              {error}
            </p>
          )}
          <button type="button" className="btn btn-blue btn-cta bk-continue" onClick={onContinue} aria-disabled={!date || !time}>
            Continue <ArrowRight />
          </button>
        </aside>
      </div>
    </div>
  );
}
