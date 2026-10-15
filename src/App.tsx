import { useMemo, useState } from "react";
import "./styles.css";

type ServiceKey = "strategy" | "pmp";

const services = {
  strategy: {
    eyebrow: "STRATEGY INTERVIEW PREPARATION",
    title: "Think clearly. Structure problems. Communicate with confidence.",
    description:
      "Practical one-to-one coaching for case interviews, guesstimates and business problem-solving—built around your goals and current preparation level.",
    audience: "MBA aspirants, graduates and professionals targeting consulting, corporate strategy, product strategy or business operations roles.",
    modules: ["Structured problem-solving & MECE", "Market sizing and guesstimates", "Profitability, growth and market-entry cases", "Mental math and data interpretation", "Mock interviews with actionable feedback"],
    packages: [
      { name: "Introductory Session", duration: "30 minutes", detail: "Clarify your target role, preparation level and next steps.", price: "Price to be announced" },
      { name: "Focused Coaching", duration: "60 minutes", detail: "Work on one case type or a specific problem-solving skill.", price: "Price to be announced" },
      { name: "Mock Interview", duration: "60 minutes", detail: "A simulated interview followed by structured feedback.", price: "Price to be announced" },
      { name: "Multi-Session Plan", duration: "Custom plan", detail: "A tailored preparation roadmap across multiple sessions.", price: "Price to be announced" },
    ],
  },
  pmp: {
    eyebrow: "PMP CERTIFICATION COACHING",
    title: "Build a preparation plan that works around your career.",
    description:
      "Personal guidance to understand the PMP journey, plan your study approach and develop a structured strategy for scenario-based exam questions.",
    audience: "Working professionals, project coordinators and project managers considering or preparing for PMP certification.",
    modules: ["Certification journey and eligibility overview", "Personalized study roadmap", "Predictive, agile and hybrid concepts", "Situational-question-solving strategy", "Revision planning and exam readiness"],
    packages: [
      { name: "PMP Roadmap Consultation", duration: "45 minutes", detail: "Discuss your starting point, timeline and preparation priorities.", price: "Price to be announced" },
      { name: "Study Strategy Session", duration: "60 minutes", detail: "Create a practical study plan and resource approach.", price: "Price to be announced" },
      { name: "Application Guidance", duration: "60 minutes", detail: "Understand the application process and experience documentation.", price: "Price to be announced" },
      { name: "Multi-Session Coaching", duration: "Custom plan", detail: "Structured support for planning, practice and readiness reviews.", price: "Price to be announced" },
    ],
  },
};

function Arrow() {
  return <span aria-hidden="true" className="arrow">↗</span>;
}

function App() {
  const [activeService, setActiveService] = useState<ServiceKey>("strategy");
  const [selectedPackage, setSelectedPackage] = useState("Introductory Session");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", goal: "", date: "", time: "" });
  const [formMessage, setFormMessage] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", subject: "", message: "", consent: false });
  const [contactMessage, setContactMessage] = useState("");

  const service = services[activeService];
  const selected = useMemo(
    () => service.packages.find((item) => item.name === selectedPackage) ?? service.packages[0],
    [service, selectedPackage]
  );

  function openBooking(key: ServiceKey, packageName?: string) {
    setActiveService(key);
    setSelectedPackage(packageName ?? services[key].packages[0].name);
    setBookingStep(1);
    setFormMessage("");
    setBookingOpen(true);
  }

  function submitBooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (bookingStep === 1) {
      if (!form.name.trim() || !form.email.trim()) {
        setFormMessage("Please add your name and email to continue.");
        return;
      }
      setFormMessage("");
      setBookingStep(2);
      return;
    }
    if (!form.date || !form.time) {
      setFormMessage("Choose a demo date and time to continue.");
      return;
    }
    setBookingStep(3);
    setFormMessage("");
  }

  function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!contact.consent) {
      setContactMessage("Please confirm that you agree to the privacy notice.");
      return;
    }
    setContactMessage("Thanks — this frontend demo has validated your message. Connect a form service later to receive enquiries.");
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Rahul Mehra home">
          <span className="brand-mark">RM</span>
          <span><strong>Rahul Mehra</strong><small>STRATEGY · PRODUCT · PROJECTS</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#approach">My approach</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="button button-dark header-cta" href="#services">Explore coaching <Arrow /></a>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> STRATEGY & CAREER COACHING</div>
            <h1>Build your strategy.<br /><em>Ace your interviews.</em><br />Move forward with clarity.</h1>
            <p className="hero-lede">
              I’m Rahul—a strategy and revenue management professional in aviation. I help aspiring consultants and working professionals sharpen their problem-solving and project management approach.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#services">Explore coaching <Arrow /></a>
              <a className="text-link" href="#about">Get to know me <span>↓</span></a>
            </div>
            <div className="hero-proof">
              <div className="proof-item"><strong>MDI Gurgaon</strong><span>& ESCP Europe</span></div>
              <div className="proof-divider" />
              <div className="proof-item"><strong>NIT Surat</strong><span>Engineering</span></div>
              <div className="proof-divider" />
              <div className="proof-item"><strong>Industry</strong><span>Aviation & operations</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="portrait-frame">
              <img src="/rahul-mehra.jpg" alt="Portrait of Rahul Mehra" className="portrait" />
              <div className="portrait-caption"><span className="caption-dot" /><span><strong>Rahul Mehra</strong><small>Strategy · Revenue · Product</small></span></div>
            </div>
            <div className="floating-note note-top"><span className="note-icon">↗</span><span><strong>Structured thinking</strong><small>Make complex problems clear</small></span></div>
            <div className="floating-note note-bottom"><span className="note-number">01</span><span><strong>Practical coaching</strong><small>Focused on your next step</small></span></div>
            <div className="visual-stamp">THINK<br />CLEARLY.</div>
          </div>
        </section>

        <section className="credibility-band">
          <div className="section-wrap credibility-inner">
            <span className="band-label">EXPERIENCE ACROSS</span>
            <span className="institution">AIR INDIA <small>AVIATION</small></span>
            <span className="institution">MDI GURGAON <small>BUSINESS</small></span>
            <span className="institution">ESCP <small>EUROPE</small></span>
            <span className="institution">NIT SURAT <small>ENGINEERING</small></span>
          </div>
        </section>

        <section className="section-wrap section-padding about-section" id="about">
          <div className="section-label">01 / ABOUT ME</div>
          <div className="about-grid">
            <div>
              <h2>A career shaped by<br /><em>curiosity and execution.</em></h2>
            </div>
            <div className="about-copy">
              <p className="large-copy">From industrial operations to aviation strategy, my work has centred on breaking down complex problems, making data-informed decisions and turning plans into action.</p>
              <p>I bring together an engineering foundation from NIT Surat, an international business education from MDI Gurgaon and ESCP Europe, and experience across operations, revenue management, commercial strategy and product ownership.</p>
              <p>Through coaching, I aim to make structured thinking more approachable—with practical frameworks, thoughtful feedback and clear next steps.</p>
              <a className="text-link link-navy" href="https://www.linkedin.com/in/rahulamehra/" target="_blank" rel="noreferrer">Connect with me on LinkedIn <Arrow /></a>
            </div>
          </div>
          <div className="timeline">
            <div className="timeline-item"><span className="timeline-year">FOUNDATION</span><strong>Engineering & operations</strong><p>NIT Surat · Industrial operations experience at Vedanta Resources.</p></div>
            <div className="timeline-item"><span className="timeline-year">BUSINESS SCHOOL</span><strong>International business</strong><p>MBA in International Business · MDI Gurgaon & ESCP Europe.</p></div>
            <div className="timeline-item"><span className="timeline-year">AVIATION</span><strong>Revenue, strategy & product</strong><p>Commercial performance, pricing, ancillary products and cross-functional initiatives.</p></div>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="section-wrap section-padding">
            <div className="services-heading">
              <div><div className="section-label light-label">02 / COACHING SERVICES</div><h2>Focused support for<br /><em>your next move.</em></h2></div>
              <p>Choose the area you want to work on. We’ll use your goals as the starting point and build a practical plan around them.</p>
            </div>
            <div className="service-cards">
              <article className="service-card">
                <div className="service-card-top"><span className="service-index">01</span><span className="service-symbol">↗</span></div>
                <div className="service-kicker">STRATEGY INTERVIEWS</div>
                <h3>Think in frameworks.<br />Answer with confidence.</h3>
                <p>Build structured problem-solving skills for case interviews, market sizing, guesstimates and business strategy questions.</p>
                <ul><li>Case interview practice</li><li>Guesstimates & mental math</li><li>Mock interviews & feedback</li></ul>
                <button className="card-link" onClick={() => { setActiveService("strategy"); setSelectedPackage(services.strategy.packages[0].name); document.getElementById("service-detail")?.scrollIntoView({ behavior: "smooth" }); }}>Explore strategy coaching <Arrow /></button>
              </article>
              <article className="service-card service-card-featured">
                <div className="service-card-top"><span className="service-index">02</span><span className="service-symbol">✳</span></div>
                <div className="service-kicker">PMP CERTIFICATION</div>
                <h3>Prepare with a plan.<br />Learn with purpose.</h3>
                <p>Get guidance on the certification journey, study planning, situational questions and exam readiness.</p>
                <ul><li>Preparation roadmap</li><li>Study strategy & resources</li><li>Readiness and revision plan</li></ul>
                <button className="card-link" onClick={() => { setActiveService("pmp"); setSelectedPackage(services.pmp.packages[0].name); document.getElementById("service-detail")?.scrollIntoView({ behavior: "smooth" }); }}>Explore PMP coaching <Arrow /></button>
              </article>
            </div>
            <p className="disclaimer">Coaching is educational guidance. It does not guarantee interview outcomes or certification. No PMI-authorized trainer status is implied.</p>
          </div>
        </section>

        <section className="section-wrap section-padding detail-section" id="service-detail">
          <div className="section-label">03 / FIND YOUR STARTING POINT</div>
          <div className="detail-header">
            <div><div className="service-kicker">{service.eyebrow}</div><h2>{service.title}</h2></div>
            <p>{service.description}</p>
          </div>
          <div className="detail-grid">
            <div className="detail-left">
              <h3>What we can work on</h3>
              <ul className="check-list">{service.modules.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul>
              <div className="audience-box"><span className="mini-label">WHO IT'S FOR</span><p>{service.audience}</p></div>
            </div>
            <div className="package-panel">
              <div className="package-panel-heading"><span className="mini-label">CHOOSE A FORMAT</span><span className="demo-tag">PRICING TO BE SET</span></div>
              {service.packages.map((pkg) => (
                <button key={pkg.name} className={`package-option ${selectedPackage === pkg.name ? "selected" : ""}`} onClick={() => setSelectedPackage(pkg.name)}>
                  <span className="radio-mark">{selectedPackage === pkg.name ? "●" : ""}</span>
                  <span className="package-info"><strong>{pkg.name}</strong><small>{pkg.duration} · {pkg.detail}</small></span>
                  <span className="package-price">—</span>
                </button>
              ))}
              <div className="package-summary"><span><strong>{selected.name}</strong><small>{selected.duration}</small></span><span className="price-placeholder">Price to be announced</span></div>
              <button className="button button-dark full-button" onClick={() => openBooking(activeService, selectedPackage)}>Continue to booking <Arrow /></button>
              <p className="fine-print">This is a frontend preview. No payment or appointment is created.</p>
            </div>
          </div>
        </section>

        <section className="approach-section" id="approach">
          <div className="section-wrap section-padding approach-grid">
            <div><div className="section-label light-label">04 / MY APPROACH</div><h2>Less theory for<br /><em>the sake of theory.</em></h2></div>
            <div className="approach-points">
              <div><span>01</span><section><h3>Start with your goal</h3><p>Understand where you are, what you’re aiming for and what is getting in the way.</p></section></div>
              <div><span>02</span><section><h3>Work through real problems</h3><p>Practice structured approaches, test assumptions and make your thinking visible.</p></section></div>
              <div><span>03</span><section><h3>Leave with next steps</h3><p>Turn feedback into a focused plan you can continue using after the session.</p></section></div>
            </div>
          </div>
        </section>

        <section className="section-wrap section-padding contact-section" id="contact">
          <div className="contact-intro">
            <div className="section-label">05 / CONTACT</div>
            <h2>Let’s talk about<br /><em>what’s next.</em></h2>
            <p>Share a little about your goals or the kind of support you’re looking for.</p>
            <a className="social-link" href="https://www.linkedin.com/in/rahulamehra/" target="_blank" rel="noreferrer"><span className="social-icon linkedin-icon">in</span><span><strong>LinkedIn</strong><small>Connect professionally</small></span><Arrow /></a>
            <div className="social-link social-static"><span className="social-icon instagram-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" /></svg></span><span><strong>Instagram</strong><small>Profile link coming soon</small></span><span className="social-status">URL pending</span></div>
          </div>
          <form className="contact-form" onSubmit={submitContact}>
            <div className="form-title">Send an enquiry <span>We’ll keep it simple.</span></div>
            <div className="field-row">
              <label>Your name<input required value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Name" /></label>
              <label>Email address<input required type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@example.com" /></label>
            </div>
            <label>What would you like to discuss?<select required value={contact.subject} onChange={(e) => setContact({ ...contact, subject: e.target.value })}><option value="">Select a topic</option><option>Strategy interview preparation</option><option>PMP certification coaching</option><option>General enquiry</option></select></label>
            <label>Your message<textarea required rows={4} value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} placeholder="Tell me a little about what you need..." /></label>
            <label className="consent"><input type="checkbox" checked={contact.consent} onChange={(e) => setContact({ ...contact, consent: e.target.checked })} /> I agree to the use of my details to respond to this enquiry.</label>
            <button className="button button-dark full-button" type="submit">Submit enquiry <Arrow /></button>
            {contactMessage && <p className="form-message" role="status">{contactMessage}</p>}
            <p className="fine-print">Frontend demo only: this form does not send or store your message.</p>
          </form>
        </section>

        <section className="closing-cta">
          <div className="section-wrap closing-inner"><div><span className="section-label light-label">YOUR NEXT CHAPTER STARTS WITH A CONVERSATION</span><h2>Bring a question.<br /><em>Leave with direction.</em></h2></div><a className="button button-light" href="#services">Explore coaching <Arrow /></a></div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home"><span className="brand-mark">RM</span><span><strong>Rahul Mehra</strong><small>STRATEGY · PRODUCT · PROJECTS</small></span></a>
        <span className="footer-note">A personal website · Built for thoughtful progress</span>
        <div className="footer-links"><a href="#about">About</a><a href="#services">Services</a><a href="https://www.linkedin.com/in/rahulamehra/" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a></div>
      </footer>

      {bookingOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setBookingOpen(false); }}>
          <div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
            <button className="modal-close" onClick={() => setBookingOpen(false)} aria-label="Close booking preview">×</button>
            <div className="section-label">BOOKING PREVIEW · STEP {bookingStep} OF 3</div>
            <div className="progress-track"><span style={{ width: `${bookingStep / 3 * 100}%` }} /></div>
            {bookingStep === 1 && <>
              <h2 id="booking-title">Let’s start with you.</h2>
              <p className="modal-lede">You selected <strong>{selectedPackage}</strong> for {activeService === "strategy" ? "Strategy Interview Preparation" : "PMP Certification Coaching"}.</p>
              <form onSubmit={submitBooking} className="modal-form">
                <label>Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></label>
                <label>Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
                <label>Your goal (optional)<textarea rows={3} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} placeholder="What would you like to work on?" /></label>
                <button className="button button-dark full-button" type="submit">Choose a demo slot <Arrow /></button>
              </form>
            </>}
            {bookingStep === 2 && <>
              <h2 id="booking-title">Pick a demo slot.</h2>
              <p className="modal-lede">These are sample slots for preview only—not live availability.</p>
              <form onSubmit={submitBooking} className="modal-form">
                <label>Preferred date<input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
                <label>Preferred time<select required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}><option value="">Select a sample time</option><option>10:00 AM IST</option><option>12:00 PM IST</option><option>4:00 PM IST</option><option>6:00 PM IST</option></select></label>
                <div className="preview-notice">Payment, calendar and Google Meet are not connected in this version.</div>
                <button className="button button-dark full-button" type="submit">Review booking <Arrow /></button>
                <button className="back-button" type="button" onClick={() => { setBookingStep(1); setFormMessage(""); }}>← Back to details</button>
              </form>
            </>}
            {bookingStep === 3 && <>
              <div className="success-icon">✓</div><h2 id="booking-title">Preview complete.</h2>
              <p className="modal-lede">Your sample selection is ready to review. Nothing has been booked or paid for.</p>
              <div className="booking-receipt"><span>Service<strong>{activeService === "strategy" ? "Strategy Interview Preparation" : "PMP Certification Coaching"}</strong></span><span>Package<strong>{selectedPackage}</strong></span><span>Preferred slot<strong>{form.date} · {form.time}</strong></span><span>Contact<strong>{form.name} · {form.email}</strong></span></div>
              <button className="button button-dark full-button" onClick={() => setBookingOpen(false)}>Close preview</button>
              <p className="fine-print">A real booking flow can be connected in a later phase after you approve the frontend.</p>
            </>}
            {formMessage && <p className="form-message" role="alert">{formMessage}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
