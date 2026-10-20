import { useEffect, useState } from 'react';

export type View = 'home' | 'pmp' | 'coaching';

/* Hashes that open their own view instead of a section of the home page. */
const PAGE_VIEWS: Record<string, View> = { '#pmp': 'pmp', '#coaching': 'coaching' };

const viewFromHash = (hash: string): View => PAGE_VIEWS[hash] ?? (hash.startsWith('#pmp/') ? 'pmp' : 'home');

/**
 * The site has three views: the home page, the PMP® learning path and the coaching booking page.
 * `#pmp` (with sub-routes such as `#pmp/lesson/…`) and `#coaching` open those pages; any other hash (#about, #blog, #top…) shows home and
 * scrolls to that section once it has rendered. Using the hash keeps views linkable
 * and the back button working, with no server routing needed.
 */
export function useHashView(): View {
  const [view, setView] = useState<View>(() => viewFromHash(window.location.hash));

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      const id = viewFromHash(hash) !== 'home' || hash === '' ? 'top' : hash.slice(1);
      // Wait a frame so a section that was just mounted exists before scrolling.
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };
    const onHashChange = () => {
      setView(viewFromHash(window.location.hash));
      scrollToHash();
    };
    if (window.location.hash) scrollToHash();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return view;
}
