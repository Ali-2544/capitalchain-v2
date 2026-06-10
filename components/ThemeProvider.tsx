'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  isLight: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Light is the default for stable SSR markup; restored from localStorage on mount
  // so other tabs (e.g. the certificate) match the chosen theme.
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') setTheme(saved);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  // Mirror the theme onto <body class="light"> so the ported CSS variables swap.
  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, isLight: theme === 'light', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
