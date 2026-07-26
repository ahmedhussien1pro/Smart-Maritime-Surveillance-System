'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { Navigation, Wifi, WifiOff, Gauge } from 'lucide-react';
import type { SimData } from '@/hooks/useSimulation';

interface Props { data: SimData | null; }

export function BoatStatusCard({ data }: Props) {
  const { t, isRTL } = useLocale();
  const isOnline = !!data;

  return (
    <div className="card flex flex-col gap-3">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Navigation className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t('boat.title')}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {isOnline
            ? <Wifi className="w-3.5 h-3.5 text-green-400" />
            : <WifiOff className="w-3.5 h-3.5 text-red-500" />
          }
          <span className={`text-xs ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
            {isOnline ? t('status.online') : t('status.offline')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatItem label={t('boat.mode')} value={data?.mode === 'AUTO' ? t('boat.auto') : t('boat.manual')} accent={data?.mode === 'AUTO'} />
        <StatItem label={t('boat.speed')} value={`${data?.speed ?? 0} km/h`} />
        <StatItem label={t('boat.heading')} value={`${data?.heading ?? 0}°`} icon={<Gauge className="w-3 h-3" />} />
        <StatItem label={t('boat.mission')} value={t('boat.idle')} />
      </div>
    </div>
  );
}

function StatItem({ label, value, accent, icon }: { label: string; value: string; accent?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg p-2.5" style={{ background: 'var(--bg-primary)' }}>
      <p className="label mb-1">{label}</p>
      <div className="flex items-center gap-1">
        {icon}
        <p className="text-sm font-bold" style={{ color: accent ? 'var(--accent)' : 'var(--text-primary)' }}>
          {value}
        </p>
      </div>
    </div>
  );
}
