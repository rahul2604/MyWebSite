import { useEffect, useState } from 'react';

/* Must match the mobile-header media query in styles.css. */
const MOBILE_QUERY = '(max-width: 859px)';
/* Ignore scroll movements smaller than these, so the bar doesn't flicker.
   Revealing needs a slightly more deliberate upward scroll than hiding. */
const HIDE_DELTA = 10;
const SHOW_DELTA = 24;
/* Always show the bar within this distance of the top of the page. */
const TOP_ZONE = 80;

/**
 * Mobile toolbar behaviour: hide the fixed header while scrolling down,
 * reveal it on scroll up or near the top. Does nothing on desktop, and stays
 * visible while `pinned` (e.g. the mobile menu is open).
 */
export function useAutoHideHeader(pinned: boolean) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    // `anchor` is where the current scroll run started; `prevY` is the last frame's position.
    let anchor = window.scrollY;
    let prevY = anchor;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY);
      setScrolled(y > 4);
      if (!mq.matches || pinned || y < TOP_ZONE) {
        setHidden(false);
        anchor = prevY = y;
        return;
      }
      // Direction reversed: start measuring the new run from the turning point.
      if (Math.sign(y - prevY) !== Math.sign(prevY - anchor) && prevY !== anchor) anchor = prevY;
      prevY = y;
      const run = y - anchor;
      if (run > HIDE_DELTA) setHidden(true);
      else if (run < -SHOW_DELTA) setHidden(false);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    mq.addEventListener('change', update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', update);
    };
  }, [pinned]);

  return { hidden: hidden && !pinned, scrolled };
}
