import { BOOKING_URL } from '../data';
import { useCourseLaunched } from '../pmp/useCourseLaunched';
import { ArrowRight, ChatIcon, CourseIcon, GradCapIcon } from './Icons';

export function Services() {
  const launched = useCourseLaunched();
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
            <p className="service-free-note">Free: every session, including the 1:1 mock interview. No payment needed.</p>
            <a className="inline-link" href="#coaching">
              Book a free session <ArrowRight size={16} />
            </a>
          </article>
          {launched ? (
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
          ) : (
            /* Until the course launches (PMP_COURSE_LAUNCHED), the card announces it instead of linking to it. */
            <article className="service lift service-soon" aria-labelledby="pmp-soon-title">
              <div className="service-top">
                <div className="icon-tile soon-icon">
                  <GradCapIcon />
                </div>
                <span className="service-num">02</span>
              </div>
              <div className="soon-kicker">PMP® LEARNING PATH</div>
              <h3 id="pmp-soon-title">Coming Soon</h3>
              <p>
                A structured, comprehensive learning experience designed to help professionals prepare for the Project
                Management Professional (PMP®) certification.
              </p>
              <p className="soon-note">
                We’re building something valuable. Our comprehensive PMP learning experience will be launching soon. Stay
                tuned!
              </p>
              <span className="soon-badge">
                <span className="soon-dot" aria-hidden="true" />
                Launching soon
              </span>
            </article>
          )}
        </div>
        <div style={{ marginTop: 40 }}>
          <a className="btn btn-blue btn-cta" href={BOOKING_URL}>
            Schedule Appointment <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
