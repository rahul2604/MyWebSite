import { useEffect, useState } from 'react';

/* Sub-routes of the #pmp view, e.g. #pmp/lesson/m01-l2, #pmp/check/M01, #pmp/exam/mock-1. */
export type PmpRoute =
  | { page: 'home' }
  | { page: 'lesson'; id: string }
  | { page: 'check'; id: string }
  | { page: 'exam'; id: string }
  | { page: 'review'; id: string }
  | { page: 'certificate' }
  | { page: 'support' }
  | { page: 'verify'; code: string };

export function parseRoute(hash: string): PmpRoute {
  const [, page, arg] = hash.replace(/^#/, '').split('/');
  const id = arg ? decodeURIComponent(arg) : '';
  switch (page) {
    case 'lesson':
      return id ? { page: 'lesson', id } : { page: 'home' };
    case 'check':
      return id ? { page: 'check', id } : { page: 'home' };
    case 'exam':
      return id ? { page: 'exam', id } : { page: 'home' };
    case 'review':
      return id ? { page: 'review', id } : { page: 'home' };
    case 'certificate':
      return { page: 'certificate' };
    case 'support':
      return { page: 'support' };
    case 'verify':
      return { page: 'verify', code: id.toUpperCase() };
    default:
      return { page: 'home' };
  }
}

export const href = (path = '') => (path ? `#pmp/${path}` : '#pmp');

export function go(path = '') {
  window.location.hash = href(path);
}

export function usePmpRoute(): PmpRoute {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
