import { ArrowLeft, ArrowRight, CheckIcon } from '../../components/Icons';
import type { CoachingService } from '../data/services';
import { Value } from './Placeholder';

interface Props {
  service: CoachingService;
  onBack: () => void;
  onChooseSlot: () => void;
}

function Block({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
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
  const hasAbout = !!(service.intro?.length || service.topics?.length || service.outro?.length);
  const hasLists = !!(service.covers?.length || service.forWho?.length || service.outcomes?.length || service.preparation?.length);
  return (
    <div>
      <button type="button" className="inline-link bk-back" onClick={onBack}>
        <ArrowLeft /> All services
      </button>
      <div className="bk-detail-head">
        <div className="bk-service-top">
          <span className="service-num">{service.number}</span>
          <span className="bk-chips">
            {service.badge && <span className="bk-chip">{service.badge}</span>}
            {service.free && <span className="bk-chip bk-chip-free">Free</span>}
          </span>
        </div>
        <h3 className="bk-step-title" data-step-heading tabIndex={-1}>
          {service.title}
        </h3>
        {service.subtitle && <p className="bk-subtitle">{service.subtitle}</p>}
        {!hasAbout && <p className="bk-lede">{service.summary}</p>}
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

      {hasAbout && (
        <section className="bk-about" aria-labelledby="bk-about-title">
          <h4 id="bk-about-title">About this session</h4>
          {service.intro?.map((p) => <p key={p}>{p}</p>)}
          {service.topics?.length ? (
            <>
              {service.topicsHeading && <h5>{service.topicsHeading}</h5>}
              <div className="bk-topics">
                {service.topics.map((t) => (
                  <div key={t.title} className="bk-topic">
                    <span className="bk-tick" aria-hidden="true">
                      <CheckIcon size={14} strokeWidth={2.6} />
                    </span>
                    <div>
                      <strong>{t.title}</strong>
                      <p>{t.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
          {service.outro?.map((p) => <p key={p}>{p}</p>)}
        </section>
      )}

      {hasLists && (
        <div className="bk-blocks">
          <Block title="What the session covers" items={service.covers} />
          <Block title="Who it's designed for" items={service.forWho} />
          <Block title="What you can expect to gain" items={service.outcomes} />
          <Block title="How to prepare" items={service.preparation} />
        </div>
      )}

      <div className="bk-actions">
        <button type="button" className="btn btn-blue btn-cta" onClick={onChooseSlot}>
          Choose a Slot <ArrowRight />
        </button>
      </div>
    </div>
  );
}
