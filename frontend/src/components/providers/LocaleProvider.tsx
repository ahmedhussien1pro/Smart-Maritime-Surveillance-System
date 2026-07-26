'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import arMessages from '@/messages/ar.json';
import enMessages from '@/messages/en.json';

type Locale = 'en' | 'ar';

const messagesMap: Record<Locale, Record<string, unknown>> = {
  ar: arMessages as Record<string, unknown>,
  en: enMessages as Record<string, unknown>,
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
  translateText: (text: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar');

  useEffect(() => {
    const saved = document.cookie.match(/locale=([^;]+)/)?.[1] as Locale;
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('lang', locale);
    document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    document.cookie = `locale=${locale};path=/;max-age=31536000`;
  }, [locale]);

  const setLocale = (l: Locale) => setLocaleState(l);

  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let val: unknown = messagesMap[locale];
    for (const k of keys) {
      if (val && typeof val === 'object') {
        val = (val as Record<string, unknown>)[k];
      } else {
        return fallback || key;
      }
    }
    return typeof val === 'string' ? val : fallback || key;
  };

  // Advanced dynamic translation dictionary for socket telemetry, notifications & logs
  const translateText = (text: string): string => {
    if (locale === 'en' || !text) return text;

    let res = text;

    // Severity & Event Types
    if (res === 'danger' || res === 'DANGER') return 'خطر عالي';
    if (res === 'warning' || res === 'WARNING') return 'تحذير';
    if (res === 'info' || res === 'INFO') return 'معلومات';
    if (res === 'detection') return 'رصد هدف';
    if (res === 'command') return 'أمر قيادي';
    if (res === 'connection') return 'حالة اتصال';

    // Notification Titles
    if (res === 'AI Alert') return 'تنبيه الذكاء الاصطناعي';
    if (res === 'System Info') return 'معلومات النظام';
    if (res === 'Target Detection') return 'إنذار رصد هدف';

    // Vessel & Target Classes
    res = res.replace(/Hostile Speedboat/g, 'قارب معادي سريع');
    res = res.replace(/Enemy Speedboat/g, 'قارب معادي سريع');
    res = res.replace(/Unidentified Vessel/g, 'زورق غير معرّف');
    res = res.replace(/Cargo Ship/g, 'سفينة بضائع');
    res = res.replace(/Patrol Boat/g, 'زورق دورية');
    res = res.replace(/Clear/g, 'المنطقة آمنة');

    // Action Sentences
    res = res.replace(/detected in Sector 4/g, 'تم رصده في القطاع 4!');
    res = res.replace(/spotted in Sector 4/g, 'تم رصده في القطاع 4!');
    res = res.replace(/Navigation mode set to AUTO/g, 'تم ضبط نمط التوجيه إلى تلقائي (AUTO)');
    res = res.replace(/Navigation mode set to MANUAL/g, 'تم ضبط نمط التوجيه إلى يدوي (MANUAL)');
    res = res.replace(/EMERGENCY STOP TRIGGERED/g, 'تم تفعيل الإيقاف الطارئ الشامل!');
    res = res.replace(/AI Alert:/g, 'تنبيه الذكاء الاصطناعي:');
    res = res.replace(/detected with/g, 'تم رصده بدقة');
    res = res.replace(/confidence/g, '');
    res = res.replace(/Speed increased to/g, 'تم زيادة السرعة إلى');
    res = res.replace(/Speed decreased to/g, 'تم تقليل السرعة إلى');
    res = res.replace(/Steered Left \(Heading:/g, 'توجيه لليسار (زاوية:');
    res = res.replace(/Steered Right \(Heading:/g, 'توجيه لليمين (زاوية:');
    res = res.replace(/Engine Stopped/g, 'تم إيقاف المحركات');
    res = res.replace(/Target detected:/g, 'تم كشف هدف:');
    res = res.replace(/ESP module disconnected/g, 'انقطع اتصال وحدة ESP32');

    return res;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, isRTL: locale === 'ar', translateText }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
};
