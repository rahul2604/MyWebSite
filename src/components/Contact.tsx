import { EMAIL, GMAIL_COMPOSE_URL, INSTAGRAM_URL, LINKEDIN_URL, TOPMATE_URL, WHATSAPP_NUMBER } from '../data';
import { ArrowRight, GmailIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon } from './Icons';

const waDigits = WHATSAPP_NUMBER.replace(/\D/g, '');

const CHANNELS = [
  { cls: 'soc-li', label: 'LinkedIn', href: LINKEDIN_URL, aria: 'LinkedIn (opens in a new tab)', icon: <LinkedInIcon size={24} /> },
  { cls: 'soc-ig', label: 'Instagram', href: INSTAGRAM_URL, aria: 'Instagram (opens in a new tab)', icon: <InstagramIcon size={24} /> },
  ...(waDigits.length >= 10
    ? [{ cls: 'soc-wa', label: 'WhatsApp', href: `https://wa.me/${waDigits}`, aria: 'WhatsApp (opens in a new tab)', icon: <WhatsAppIcon /> }]
    : []),
  {
    cls: 'soc-gm',
    label: 'Gmail',
    href: GMAIL_COMPOSE_URL,
    aria: `Send an email to ${EMAIL} in Gmail (opens in a new tab)`,
    icon: <GmailIcon />,
  },
];

export function Contact() {
  return (
    <section id="contact" className="section-pad contact">
      <div className="contact-inner">
        <div className="eyebrow">CONTACT</div>
        <h2 className="h2">Let's connect</h2>
        <div className="socials" role="list" aria-label="Contact and social links">
          {CHANNELS.map((c) => (
            <div role="listitem" key={c.label}>
              <a className={`soc ${c.cls}`} href={c.href} target="_blank" rel="noopener noreferrer" aria-label={c.aria}>
                <span className="soc-ic">{c.icon}</span>
                <span className="soc-label">{c.label}</span>
              </a>
            </div>
          ))}
        </div>
        <div className="contact-cta">
          <a className="btn btn-blue btn-cta" href={TOPMATE_URL} target="_blank" rel="noopener noreferrer">
            Schedule Appointment <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
