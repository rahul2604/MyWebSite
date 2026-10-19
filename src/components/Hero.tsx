import portraitDark from '../assets/portrait-dark.webp';
import portraitLight from '../assets/portrait-light.webp';
import { BOOKING_URL } from '../data';
import { ArrowRight } from './Icons';

const STATS = [
  { title: 'Air India', sub: 'Revenue Management' },
  { title: 'MDI × ESCP', sub: 'MBA, International Business', offset: true },
  { title: 'PMP®', sub: 'Certified Professional' },
];

export function Hero() {
  return (
    <div className="hero">
      <div className="hero-copy">
        <h1 className="hero-name">RAHUL MEHRA</h1>
        <p className="hero-roles">
          Revenue Strategy <span className="sep" aria-hidden="true">|</span> Aviation{' '}
          <span className="sep" aria-hidden="true">|</span> Project Management
        </p>
        <p className="hero-intro">
          At Air India, I work as a Product Owner, focusing on revenue strategy, pricing and commercial products that help
          airlines grow revenue. My role also involves launching new routes and bringing teams together to turn plans into
          action. Outside work, I help professionals prepare for strategy interviews and the PMP® certification.
        </p>
        <div className="hero-cta-wrap">
          <a className="btn btn-blue hero-cta" href={BOOKING_URL}>
            Schedule Appointment <ArrowRight />
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <img
          className="portrait"
          src={portraitDark}
          alt="Portrait of Rahul Mehra in a navy blazer and white shirt"
          width={880}
          height={893}
        />
        <img
          className="portrait-light"
          src={portraitLight}
          alt="Portrait of Rahul Mehra in a navy blazer and white shirt"
          width={880}
          height={893}
        />
        <div className="hero-stats">
          {STATS.map((s) => (
            <div key={s.title} className={s.offset ? 'stat offset' : 'stat'}>
              <div className="stat-title">{s.title}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
