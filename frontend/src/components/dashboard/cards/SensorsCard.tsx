'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { Activity, Thermometer, Droplets, Wind } from 'lucide-react';
import type { SimData } from '@/hooks/useSimulation';

interface Props { data: SimData | null; }

export function SensorsCard({ data }: Props) {
  const { t } = useLocale();

  const sensors = [
    { icon: <Wind className="w-3.5 h-3.5 text-blue-400" />, label: t('sensors.wind_speed'), value: `${data?.windSpeed ?? 0} m/s` },
    { icon: <Wind className="w-3.5 h-3.5 text-sky-400" />, label: t('sensors.wind_dir'), value: `${data?.windDir ?? 0}°` },
    { icon: <Thermometer className="w-3.5 h-3.5 text-orange-400" />, label: t('sensors.water_temp'), value: `${data?.waterTemp ?? 0}°C` },
    { icon: <Droplets className="w-3.5 h-3.5 text-cyan-400" />, label: t('sensors.ph'), value: `${data?.ph ?? 0}` },
    { icon: <Activity className="w-3.5 h-3.5 text-red-400" />, label: t('sensors.pollution'), value: `${data?.pollution ?? 0} ppm` },
    { icon: <Droplets className="w-3.5 h-3.5 text-purple-400" />, label: t('sensors.turbidity'), value: `${data?.turbidity ?? 0} NTU` },
  ];

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4" style={{ color: 'var(--accent)' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t('sensors.title')}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {sensors.map((s, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg p-2.5" style={{ background: 'var(--bg-primary)' }}>
            {s.icon}
            <div>
              <p className="label" style={{ fontSize: '10px' }}>{s.label}</p>
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
