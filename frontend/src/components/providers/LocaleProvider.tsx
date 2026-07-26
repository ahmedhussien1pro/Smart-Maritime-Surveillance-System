'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Locale = 'en' | 'ar';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [messages, setMessages] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const saved = document.cookie.match(/locale=([^;]+)/)?.[1] as Locale;
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    import(`@/messages/${locale}.json`).then((m) => setMessages(m.default));
    document.documentElement.setAttribute('lang', locale);
    document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    document.cookie = `locale=${locale};path=/;max-age=31536000`;
  }, [locale]);

  const setLocale = (l: Locale) => setLocaleState(l);

  const t = (key: string): string => {
    const keys = key.split('.');
    let val: unknown = messages;
    for (const k of keys) {
      if (val && typeof val === 'object') {
        val = (val as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    return typeof val === 'string' ? val : key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, isRTL: locale === 'ar' }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
};
