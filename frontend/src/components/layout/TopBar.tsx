'use client';

import { useTheme } from 'next-themes';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Moon, Sun, Globe, Radio, Anchor } from 'lucide-react';

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t, isRTL } = useLocale();

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 py-3 border-b flex-wrap gap-2"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl border flex-shrink-0" style={{ background: 'var(--accent-glow)', borderColor: 'var(--accent)' }}>
          <Anchor className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <h1 className="text-sm font-extrabold tracking-wide" style={{ color: 'var(--text-primary)' }}>
            {isRTL ? 'نظام المراقبة البحرية الذكي' : 'Smart Maritime Surveillance'}
          </h1>
          <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
            {isRTL ? 'لوحة القيادة والتحكم البحري' : 'Naval Command & Control Center'}
          </p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
        <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse flex-shrink-0" />
        <span className="text-xs font-bold text-emerald-400 font-mono">
          {t('status.simulation')}
        </span>
        <span className="status-dot online" />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Language Toggle */}
        <button
          onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
          className="btn-ghost flex items-center gap-1.5 text-xs font-bold"
          title="Toggle Language"
        >
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>{locale === 'en' ? 'العربية' : 'English'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn-ghost p-2"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>
      </div>
    </header>
  );
}
