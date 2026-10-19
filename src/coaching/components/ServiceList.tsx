import { ArrowRight } from '../../components/Icons';
import { COACHING_SERVICES, type ServiceId } from '../data/services';
import { Value } from './Placeholder';

interface Props {
  selectedId: ServiceId | null;
  onSelect: (id: ServiceId) => void;
}

export function ServiceList({ selectedId, onSelect }: Props) {
  const single = COACHING_SERVICES.length === 1;
  return (
    <div>
      <h3 className="bk-step-title" data-step-heading tabIndex={-1}>
        {single ? 'Coaching service' : 'Choose a coaching service'}
      </h3>
      <div className={single ? 'bk-services is-single' : 'bk-services'}>
        {COACHING_SERVICES.map((s) => (
          <article key={s.id} className={`bk-service lift${selectedId === s.id ? ' is-selected' : ''}`}>
            <div className="bk-service-top">
              <span className="service-num">{s.number}</span>
              <span className="bk-chips">
                {selectedId === s.id && <span className="bk-chip">In progress</span>}
                {s.free && <span className="bk-chip bk-chip-free">Free</span>}
              </span>
            </div>
            <div className="bk-service-text">
              <h4>{s.title}</h4>
              <p className="bk-service-summary">{s.summary}</p>
            </div>
            <dl className="bk-meta">
              <div>
                <dt>For</dt>
                <dd>{s.audience}</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>
                  <Value text={s.format} />
                </dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>
                  <Value text={s.duration} />
                </dd>
              </div>
              <div>
                <dt>Price</dt>
                <dd>
                  <Value text={s.price} />
                </dd>
              </div>
            </dl>
            <button type="button" className="btn btn-blue bk-service-cta" onClick={() => onSelect(s.id)}>
              {s.ctaLabel ?? 'View Details & Book'} <ArrowRight size={16} />
              <span className="sr-only"> — {s.title}</span>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
