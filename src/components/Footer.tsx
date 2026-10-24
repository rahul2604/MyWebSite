import { HASHTAG_URL, INSTAGRAM_URL, LINKEDIN_URL } from '../data';
import { InstagramIcon, LinkedInIcon } from './Icons';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span>
          © {new Date().getFullYear()} Rahul Mehra ·{' '}
          <a className="tag" href={HASHTAG_URL} target="_blank" rel="noopener noreferrer">
            #rahulm2604
          </a>
          {' · '}
          <a className="tag" href="#support">
            Help &amp; FAQs
          </a>
        </span>
        <div className="footer-icons">
          <a className="icon-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">
            <LinkedInIcon size={18} />
          </a>
          <a className="icon-link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in a new tab)">
            <InstagramIcon size={19} />
          </a>
        </div>
      </div>
    </footer>
  );
}
