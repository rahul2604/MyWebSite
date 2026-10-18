import type { Theme } from '../hooks/useTheme';
import { INSTAGRAM_URL, LINKEDIN_URL, TOPMATE_URL } from '../data';
import { InstagramIcon, LinkedInIcon, Logo, MoonIcon, SunIcon } from './Icons';

interface HeaderProps {
  onPmp: boolean;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ onPmp, theme, onToggleTheme }: HeaderProps) {
  const themeLabel = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <header className="site-header">
      <a className="logo" href="#top" aria-label="Rahul Mehra — home">
        <Logo />
      </a>
      <nav className="primary-nav" aria-label="Primary">
        <a className="nav-link" href="#about">About</a>
        <a className="nav-link" href="#services">Services</a>
        <a className="nav-link" href="#pmp" aria-current={onPmp ? 'page' : undefined}>
          PMP® Learning Path
        </a>
        <a className="nav-link" href="#blog">Blog</a>
        <a className="nav-link" href="#contact">Contact</a>
      </nav>
      <div className="header-actions">
        <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={themeLabel} title={themeLabel}>
          <span className="tt-opt tt-sun" aria-hidden="true">
            <SunIcon />
          </span>
          <span className="tt-opt tt-moon" aria-hidden="true">
            <MoonIcon />
          </span>
        </button>
        <div className="header-socials">
          <a className="icon-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="Rahul Mehra on LinkedIn (opens in a new tab)">
            <LinkedInIcon size={20} />
          </a>
          <a className="icon-link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Rahul Mehra on Instagram (opens in a new tab)">
            <InstagramIcon size={21} />
          </a>
        </div>
        <a className="btn btn-white header-cta" href={TOPMATE_URL} target="_blank" rel="noopener noreferrer">
          Schedule Appointment
        </a>
      </div>
    </header>
  );
}
