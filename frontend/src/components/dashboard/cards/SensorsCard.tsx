'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { Thermometer, Wind, Compass, Droplet, Activity, Waves } from 'lucide-react';
import type { BoatState } from '@/hooks/useSocket';

interface Props {
  data: BoatState | null;
}

export function SensorsCard({ data }: Props) {
  const { t } = useLocale();

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <span className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
            {t('sensors.title')}
          </span>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 uppercase">
          {t('sensors.metrics')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SensorItem label={t('sensors.wind_speed')} val={`14.2 ${t('boat.knots')}`} icon={<Wind className="w-3.5 h-3.5 text-sky-500" />} />
        <SensorItem label={t('sensors.wind_dir')} val={`${data?.heading ?? 120}°`} icon={<Compass className="w-3.5 h-3.5 text-teal-500" />} />
        <SensorItem label={t('sensors.water_temp')} val="24.5 °C" icon={<Thermometer className="w-3.5 h-3.5 text-amber-500" />} />
        <SensorItem label={t('sensors.ph')} val="7.8 pH" icon={<Droplet className="w-3.5 h-3.5 text-indigo-500" />} />
        <SensorItem label={t('sensors.pollution')} val="12 ppm" icon={<Activity className="w-3.5 h-3.5 text-emerald-500" />} />
        <SensorItem label={t('sensors.turbidity')} val="18 NTU" icon={<Waves className="w-3.5 h-3.5 text-cyan-500" />} />
      </div>
    </div>
  );
}

function SensorItem({ label, val, icon }: { label: string; val: string; icon: React.ReactNode }) {
  return (
    <div className="p-2.5 rounded-lg border flex items-center justify-between" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{label}</span>
      </div>
      <span className="text-xs font-extrabold font-mono text-sky-600 dark:text-cyan-400">{val}</span>
    </div>
  );
}
