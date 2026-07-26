'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/providers/LocaleProvider';
import { LayoutDashboard, Target, ScrollText, Settings, Anchor } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'nav.dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'nav.mission',   href: '/mission',   icon: Target },
  { key: 'nav.logs',      href: '/logs',      icon: ScrollText },
  { key: 'nav.settings',  href: '/settings',  icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t, isRTL } = useLocale();

  return (
    <aside
      className="w-16 md:w-56 flex flex-col border-r"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* Brand */}
      <div className="flex items-center justify-center md:justify-start gap-3 px-4 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <Anchor className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--accent)' }} />
        <span className="hidden md:block text-sm font-bold" style={{ color: 'var(--accent)' }}>
          {isRTL ? 'بحري' : 'MARITIME'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {NAV_ITEMS.map(({ key, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{
                background: active ? 'var(--accent-glow)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                border: active ? '1px solid var(--border)' : '1px solid transparent',
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className={`hidden md:block text-sm font-medium ${isRTL ? 'text-right' : ''}`}>
                {t(key)}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-center text-xs hidden md:block" style={{ color: 'var(--text-muted)' }}>
          v1.0.0 POC
        </p>
      </div>
    </aside>
  );
}
