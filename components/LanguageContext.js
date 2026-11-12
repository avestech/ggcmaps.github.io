'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { normalizeLocale } from '../lib/i18n';

const STORAGE_KEY = 'ggcmap.locale';

const LanguageContext = createContext({
  locale: 'en',
  setLocale: () => {},
});

export function LanguageProvider({ children, defaultLocale = 'en' }) {
  const [locale, setLocaleState] = useState(normalizeLocale(defaultLocale));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setLocaleState(normalizeLocale(stored));
    }
  }, []);

  const setLocale = useCallback((next) => {
    setLocaleState((prev) => {
      const normalized = normalizeLocale(next ?? prev);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, normalized);
      }
      return normalized;
    });
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
