'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { Wifi, WifiOff, Anchor, Compass } from 'lucide-react';
import type { BoatState } from '@/hooks/useSocket';

interface Props {
  data: BoatState | null;
}

export function BoatStatusCard({ data }: Props) {
  const { t } = useLocale();
  const isOnline = data?.connected ?? true;

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Anchor className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
            {t('boat.title')}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
          {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-red-500" />}
          <span className={`text-xs font-mono font-bold ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
            {isOnline ? t('status.online') : t('status.offline')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatItem label={t('boat.mode')} value={data?.mode === 'AUTO' ? t('boat.auto') : t('boat.manual')} accent={data?.mode === 'AUTO'} />
        <StatItem label={t('boat.speed')} value={`${data?.speed ?? 0} ${t('boat.knots')}`} />
        <StatItem label={t('boat.heading')} value={`${data?.heading ?? 0}°`} icon={<Compass className="w-3.5 h-3.5 text-emerald-400" />} />
        <StatItem label={t('boat.mission')} value={t('boat.tracking')} accent />
      </div>
    </div>
  );
}

function StatItem({ label, value, accent, icon }: { label: string; value: string; accent?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg p-2.5 border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
      <p className="label mb-1">{label}</p>
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-sm font-extrabold font-mono" style={{ color: accent ? 'var(--accent)' : 'var(--text-primary)' }}>
          {value}
        </p>
      </div>
    </div>
  );
}
