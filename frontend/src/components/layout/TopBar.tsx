'use client';

import { useTheme } from 'next-themes';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Moon, Sun, Globe, Radio, Anchor } from 'lucide-react';

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t, isRTL } = useLocale();

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)' }}>
          <Anchor className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
            {isRTL ? 'نظام المراقبة البحرية' : 'Maritime Surveillance'}
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {isRTL ? 'لوحة القيادة البحرية' : 'Naval Command & Control'}
          </p>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
        <Radio className="w-3.5 h-3.5 text-green-400" />
        <span className="text-xs font-medium text-green-400">{t('status.simulation')}</span>
        <span className="status-dot online" />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Language Toggle */}
        <button
          onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
          className="btn-ghost flex items-center gap-1.5 text-xs"
          title="Toggle Language"
        >
          <Globe className="w-4 h-4" />
          <span>{locale === 'en' ? 'العربية' : 'English'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn-ghost p-2"
          title="Toggle Theme"
        >
          {theme === 'dark'
            ? <Sun className="w-4 h-4" />
            : <Moon className="w-4 h-4" />
          }
        </button>
      </div>
    </header>
  );
}
