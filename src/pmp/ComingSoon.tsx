import { GradCapIcon } from '../components/Icons';

/* Shown at #pmp to everyone but the administrator until the course launches (server setting PMP_COURSE_LAUNCHED). */
export function ComingSoon() {
  return (
    <div className="pmp-card pmp-soon">
      <div className="pmp-soon-icon" aria-hidden="true">
        <GradCapIcon size={34} />
      </div>
      <div className="eyebrow">PMP® LEARNING PATH</div>
      <h1 className="h2">Coming Soon</h1>
      <p className="pmp-soon-lede">
        A structured, comprehensive learning experience designed to help professionals prepare for the Project Management
        Professional (PMP®) certification.
      </p>
      <p className="pmp-soon-note">
        We’re building something valuable. Our comprehensive PMP learning experience will be launching soon. Stay tuned!
      </p>
      <span className="soon-badge">
        <span className="soon-dot" aria-hidden="true" />
        Launching soon
      </span>
      <a className="btn btn-ghost btn-small" href="#services">
        Back to services
      </a>
    </div>
  );
}
