import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'rm-theme';

function initialTheme(): Theme {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage unavailable */
  }
  try {
    if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light';
  } catch {
    /* matchMedia unavailable */
  }
  return 'dark';
}

/** Dark by default, follows the OS preference until the visitor picks one, then remembers it. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.className = `rm-${theme}`;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next: Theme = t === 'light' ? 'dark' : 'light';
      try {
        window.localStorage.setItem(THEME_KEY, next);
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
