import { INSTAGRAM_URL, LINKEDIN_URL } from '../data';
import { InstagramIcon, LinkedInIcon } from './Icons';

export function About() {
  return (
    <section id="about" className="section-pad">
      <div className="container about-grid">
        <div className="about-copy">
          <div className="eyebrow">ABOUT ME</div>
          <h2 className="h2">Optimising Revenue. Shaping Strategy. Driving Growth.</h2>
          <p className="first">
            I'm a revenue management professional at Air India, working across aviation revenue strategy, pricing, inventory
            optimisation and commercial performance, with 7+ years of total work experience, including 4+ years post-MBA.
          </p>
          <p>
            Alongside commercial strategy, I've led programme management for new route launches, coordinating
            cross-functional teams to drive execution.
          </p>
          <p>
            Before Air India, I worked with Vedanta Resources and Max Life Insurance. I studied Mechanical Engineering at NIT
            Surat, completed an MBA in International Business from MDI Gurgaon and ESCP Europe, and hold the Project
            Management Professional (PMP®) certification.
          </p>
          <p>Outside work, I make music — mostly on the guitar and piano.</p>
          <div className="about-links">
            <a className="btn btn-ghost" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon size={18} />
              Connect on LinkedIn
            </a>
            <a className="btn btn-ghost" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              <InstagramIcon size={19} />
              Follow on Instagram
            </a>
          </div>
        </div>
        <div className="about-side">
          <dl className="facts">
            <div>
              <dt>CURRENTLY</dt>
              <dd>Revenue Management, Air India</dd>
            </div>
            <div>
              <dt>PREVIOUSLY</dt>
              <dd>Vedanta Resources · Max Life Insurance</dd>
            </div>
            <div>
              <dt>EDUCATION</dt>
              <dd>MBA, International Business — MDI Gurgaon &amp; ESCP Europe</dd>
              <dd>B.Tech, Mechanical Engineering — NIT Surat</dd>
            </div>
            <div>
              <dt>CERTIFICATION</dt>
              <dd>Project Management Professional (PMP®)</dd>
            </div>
            <div>
              <dt>BEYOND WORK</dt>
              <dd>Guitar &amp; piano</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
