'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      className="w-16 md:w-60 flex-shrink-0 flex flex-col border-r rtl:border-l rtl:border-r-0 h-screen select-none"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-center md:justify-start gap-3 px-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0" style={{ background: 'var(--accent-glow)', borderColor: 'var(--accent)' }}>
          <Anchor className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        </div>
        <div className="hidden md:block">
          <span className="text-sm font-extrabold tracking-wider block" style={{ color: 'var(--accent)' }}>
            {isRTL ? 'نظام بحري' : 'MARITIME'}
          </span>
          <span className="text-[10px] font-mono block text-slate-400">SURVEILLANCE</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex flex-col gap-1.5 p-3 flex-1">
        {NAV_ITEMS.map(({ key, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
              style={{
                background: active ? 'var(--accent-glow)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                border: active ? '1px solid var(--border)' : '1px solid transparent',
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden md:block text-xs font-bold tracking-wide">
                {t(key)}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Reserve Officers Batch 170 Footer Badge */}
      <div className="p-3 border-t flex flex-col items-center gap-2" style={{ borderColor: 'var(--border)' }}>
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border bg-slate-900/50 w-full justify-center" style={{ borderColor: 'var(--border)' }}>
          <Image src="/reserve_officers_logo.png" alt="شعار الضباط الاحتياط" width={22} height={22} className="object-contain" />
          <span className="text-[11px] font-extrabold text-amber-400 font-mono">
            {isRTL ? 'دفعة 170 ضباط احتياط' : 'BATCH 170'}
          </span>
        </div>
        <p className="text-[10px] font-mono hidden md:block text-slate-400 font-semibold">
          {t('footer.version')}
        </p>
      </div>
    </aside>
  );
}
