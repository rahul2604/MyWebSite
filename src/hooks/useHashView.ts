import { useEffect, useState } from 'react';

export type View = 'home' | 'pmp';

const viewFromHash = (hash: string): View => (hash === '#pmp' ? 'pmp' : 'home');

/**
 * The site has two views: the home page and the PMP® learning path.
 * `#pmp` opens the learning path; any other hash (#about, #blog, #top…) shows home and
 * scrolls to that section once it has rendered. Using the hash keeps views linkable
 * and the back button working, with no server routing needed.
 */
export function useHashView(): View {
  const [view, setView] = useState<View>(() => viewFromHash(window.location.hash));

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      const id = hash === '#pmp' || hash === '' ? 'top' : hash.slice(1);
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
