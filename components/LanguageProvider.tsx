'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DICT } from '@/lib/i18n';

export type Lang = 'en' | 'ar' | 'hi' | 'es' | 'bn' | 'ur' | 'fr';

export const LANGS: { code: Lang; label: string; flag: string; native: string }[] = [
  { code: 'en', label: 'EN', flag: '🇬🇧', native: 'English' },
  { code: 'ar', label: 'AR', flag: '🇸🇦', native: 'العربية' },
  { code: 'hi', label: 'HI', flag: '🇮🇳', native: 'हिन्दी' },
  { code: 'es', label: 'ES', flag: '🇪🇸', native: 'Español' },
  { code: 'bn', label: 'BN', flag: '🇧🇩', native: 'বাংলা' },
  { code: 'ur', label: 'UR', flag: '🇵🇰', native: 'اردو' },
  { code: 'fr', label: 'FR', flag: '🇫🇷', native: 'Français' },
];

// Right-to-left scripts.
const RTL_LANGS: Lang[] = ['ar', 'ur'];

interface LanguageContextValue {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default English for stable SSR markup; restored from localStorage on mount.
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved && LANGS.some((l) => l.code === saved)) setLangState(saved as Lang);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('lang', l);
    } catch {
      /* ignore */
    }
  }, []);

  const dir: 'ltr' | 'rtl' = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';

  // Mirror onto <html> so the whole document flips direction + swaps fonts (CSS),
  // and onto <body class="rtl"> for any RTL-specific tweaks.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.classList.toggle('rtl', dir === 'rtl');
  }, [lang, dir]);

  return (
    <LanguageContext.Provider value={{ lang, dir, setLang }}>{children}</LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider');
  return ctx;
}

/** Active language's translation slice. */
export function useT() {
  const { lang } = useLang();
  return DICT[lang];
}

/** Pick the active language's strings from an {en, ar, hi} record. */
export function pick<T>(lang: Lang, table: Record<Lang, T>): T {
  return table[lang];
}
