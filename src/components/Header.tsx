import { useEffect, useState, type MouseEvent } from 'react';
import { useAutoHideHeader } from '../hooks/useAutoHideHeader';
import type { Theme } from '../hooks/useTheme';
import { INSTAGRAM_URL, LINKEDIN_URL, TOPMATE_URL } from '../data';
import { CloseIcon, InstagramIcon, LinkedInIcon, Logo, MenuIcon, MoonIcon, SunIcon } from './Icons';

interface HeaderProps {
  onPmp: boolean;
  theme: Theme;
  onToggleTheme: () => void;
}

/* Must match the max-width of the mobile-menu media query in styles.css. */
const MOBILE_MENU_QUERY = '(max-width: 859px)';

export function Header({ onPmp, theme, onToggleTheme }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const themeLabel = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  const closeMenu = () => setMenuOpen(false);
  const { hidden, scrolled } = useAutoHideHeader(menuOpen);

  // RM logo: go to the homepage ("/") from any view, then scroll smoothly to the top.
  const goHome = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let "open in new tab" work
    e.preventDefault();
    closeMenu();
    if (window.location.hash) {
      history.pushState(null, '', window.location.pathname + window.location.search);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  const headerClass = ['site-header', hidden && 'is-hidden', scrolled && 'is-scrolled', menuOpen && 'menu-open']
    .filter(Boolean)
    .join(' ');

  // Close on Escape, and when the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!menuOpen) return;
    const mq = window.matchMedia(MOBILE_MENU_QUERY);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const onChange = () => {
      if (!mq.matches) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);
    return () => {
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [menuOpen]);

  return (
    <header className={headerClass}>
      <a className="logo" href="/" aria-label="Rahul Mehra — home" onClick={goHome}>
        <Logo />
      </a>
      <nav id="primary-nav" className={menuOpen ? 'primary-nav is-open' : 'primary-nav'} aria-label="Primary">
        <a className="nav-link" href="#about" onClick={closeMenu}>About</a>
        <a className="nav-link" href="#services" onClick={closeMenu}>Services</a>
        <a className="nav-link" href="#pmp" aria-current={onPmp ? 'page' : undefined} onClick={closeMenu}>
          PMP® Learning Path
        </a>
        <a className="nav-link" href="#blog" onClick={closeMenu}>Blog</a>
        <a className="nav-link" href="#contact" onClick={closeMenu}>Contact</a>
        {/* Shown only inside the mobile menu, where the header bar has no room for them. */}
        <div className="nav-extras">
          <div className="nav-extras-icons">
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
        <a className="btn btn-white header-cta header-cta-bar" href={TOPMATE_URL} target="_blank" rel="noopener noreferrer">
          Schedule Appointment
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
}
