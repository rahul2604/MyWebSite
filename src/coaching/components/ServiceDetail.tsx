import { ArrowLeft, ArrowRight, CheckIcon } from '../../components/Icons';
import type { CoachingService } from '../data/services';
import { Value } from './Placeholder';

interface Props {
  service: CoachingService;
  onBack: () => void;
  onChooseSlot: () => void;
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="bk-block">
      <h4>{title}</h4>
      <ul>
        {items.map((it) => (
          <li key={it}>
            <span className="bk-tick" aria-hidden="true">
              <CheckIcon size={14} strokeWidth={2.6} />
            </span>
            {it}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ServiceDetail({ service, onBack, onChooseSlot }: Props) {
  return (
    <div>
      <button type="button" className="inline-link bk-back" onClick={onBack}>
        <ArrowLeft /> All services
      </button>
      <div className="bk-detail-head">
        <div className="bk-service-top">
          <span className="service-num">{service.number}</span>
          {service.free && <span className="bk-chip bk-chip-free">Free</span>}
        </div>
        <h3 className="bk-step-title" data-step-heading tabIndex={-1}>
          {service.title}
        </h3>
        <p className="bk-lede">{service.summary}</p>
        <ul className="bk-facts" aria-label="Session facts">
          <li>
            <span>Format</span>
            <Value text={service.format} />
          </li>
          <li>
            <span>Duration</span>
            <Value text={service.duration} />
          </li>
          <li>
            <span>Price</span>
            <Value text={service.price} />
          </li>
        </ul>
      </div>

      <div className="bk-blocks">
        <Block title="What the session covers" items={service.covers} />
        <Block title="Who it's designed for" items={service.forWho} />
        <Block title="What you can expect to gain" items={service.outcomes} />
        <Block title="How to prepare" items={service.preparation} />
      </div>

      <div className="bk-actions">
        <button type="button" className="btn btn-blue btn-cta" onClick={onChooseSlot}>
          Choose a Slot <ArrowRight />
        </button>
      </div>
    </div>
  );
}
