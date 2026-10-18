import { TOPMATE_URL } from '../data';
import { ArrowRight, ChatIcon, CourseIcon } from './Icons';

export function Services() {
  return (
    <section id="services" className="section-pad services">
      <div className="container">
        <div className="eyebrow">SERVICES</div>
        <h2 className="h2">How I can help</h2>
        <div className="services-grid">
          <article className="service lift">
            <div className="service-top">
              <div className="icon-tile">
                <ChatIcon />
              </div>
              <span className="service-num">01</span>
            </div>
            <h3>Strategy &amp; Interview Coaching</h3>
            <p>
              One-to-one sessions to prepare for strategy and consulting case interviews — structuring problems,
              communicating your thinking clearly and approaching your next career move with confidence.
            </p>
          </article>
          <article className="service lift">
            <div className="service-top">
              <div className="icon-tile">
                <CourseIcon />
              </div>
              <span className="service-num">02</span>
            </div>
            <h3>PMP® Learning Path</h3>
            <p>
              A structured, module-by-module learning experience for professionals preparing for the Project Management
              Professional (PMP®) certification.
            </p>
            <a className="inline-link" href="#pmp">
              View the learning path <ArrowRight size={16} />
            </a>
          </article>
        </div>
        <div style={{ marginTop: 40 }}>
          <a className="btn btn-blue btn-cta" href={TOPMATE_URL} target="_blank" rel="noopener noreferrer">
            Schedule Appointment <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
