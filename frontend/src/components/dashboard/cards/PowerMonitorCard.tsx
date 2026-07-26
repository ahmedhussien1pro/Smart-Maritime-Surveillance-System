'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { Zap, Battery, Sun, Wind, Waves } from 'lucide-react';
import type { SimData } from '@/hooks/useSimulation';

interface Props { data: SimData | null; }

export function PowerMonitorCard({ data }: Props) {
  const { t } = useLocale();
  const battery = data?.battery ?? 0;
  const batteryColor = battery > 50 ? '#30d158' : battery > 20 ? '#ff9f0a' : '#ff3b3b';

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4" style={{ color: 'var(--accent)' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t('power.title')}</span>
      </div>

      {/* Battery Bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1">
            <Battery className="w-4 h-4" style={{ color: batteryColor }} />
            <span className="label">{t('power.battery')}</span>
          </div>
          <span className="text-lg font-bold" style={{ color: batteryColor }}>{battery}%</span>
        </div>
        <div className="h-2 rounded-full" style={{ background: 'var(--bg-primary)' }}>
          <div
            className="h-2 rounded-full transition-all duration-1000"
            style={{ width: `${battery}%`, background: batteryColor, boxShadow: `0 0 8px ${batteryColor}60` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <PowerSource icon={<Sun className="w-3.5 h-3.5 text-yellow-400" />} label={t('power.solar')} value={`${data?.solar ?? 0}W`} />
        <PowerSource icon={<Wind className="w-3.5 h-3.5 text-blue-400" />} label={t('power.wind')} value={`${data?.wind ?? 0}W`} />
        <PowerSource icon={<Waves className="w-3.5 h-3.5 text-cyan-400" />} label={t('power.hydro')} value={`${data?.hydro ?? 0}W`} />
        <PowerSource icon={<Zap className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />} label={t('power.voltage')} value={`${data?.voltage ?? 0}V`} />
      </div>
    </div>
  );
}

function PowerSource({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg p-2" style={{ background: 'var(--bg-primary)' }}>
      {icon}
      <div>
        <p className="label" style={{ fontSize: '10px' }}>{label}</p>
        <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
      </div>
    </div>
  );
}
