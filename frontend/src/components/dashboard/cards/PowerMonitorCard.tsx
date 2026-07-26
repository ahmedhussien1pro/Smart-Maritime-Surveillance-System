'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { BatteryCharging, Sun, Wind, Waves, Zap } from 'lucide-react';
import type { BoatState } from '@/hooks/useSocket';

interface Props {
  data: BoatState | null;
}

export function PowerMonitorCard({ data }: Props) {
  const { t } = useLocale();
  const batteryPct = Math.round(data?.battery ?? 88);

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
            {t('power.title')}
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
          {data?.voltage ?? 12.4} {t('power.volts')}
        </span>
      </div>

      {/* Main Battery Gauge */}
      <div className="p-3 rounded-xl border flex flex-col gap-2" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
        <div className="flex justify-between items-center text-xs font-bold font-mono">
          <span className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--text-secondary)' }}>
            <BatteryCharging className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            {t('power.battery')}
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 text-sm font-extrabold">{batteryPct}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-md shadow-emerald-500/50"
            style={{ width: `${batteryPct}%` }}
          />
        </div>
      </div>

      {/* Renewable Sources Grid */}
      <div className="grid grid-cols-3 gap-2">
        <PowerSourceItem label={t('power.solar')} val={`${data?.solar ?? 65} ${t('power.watts')}`} icon={<Sun className="w-3.5 h-3.5 text-amber-500" />} />
        <PowerSourceItem label={t('power.wind')} val={`${data?.wind ?? 18} ${t('power.watts')}`} icon={<Wind className="w-3.5 h-3.5 text-sky-500" />} />
        <PowerSourceItem label={t('power.hydro')} val={`${data?.hydro ?? 12} ${t('power.watts')}`} icon={<Waves className="w-3.5 h-3.5 text-teal-500" />} />
      </div>
    </div>
  );
}

function PowerSourceItem({ label, val, icon }: { label: string; val: string; icon: React.ReactNode }) {
  return (
    <div className="p-2.5 rounded-lg border text-center flex flex-col items-center gap-1" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
      {icon}
      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">{label}</span>
      <span className="text-xs font-extrabold font-mono text-slate-900 dark:text-slate-100">{val}</span>
    </div>
  );
}
