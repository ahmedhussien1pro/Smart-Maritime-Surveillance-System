'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { Bell, AlertTriangle, Battery, Wifi, Camera, CheckCircle2 } from 'lucide-react';
import type { SimData } from '@/hooks/useSimulation';

interface Props { data: SimData | null; }

const NOTIF_ICONS = {
  enemy: AlertTriangle,
  battery: Battery,
  esp: Wifi,
  camera: Camera,
  mission: CheckCircle2,
};

const NOTIF_COLORS = {
  enemy: 'text-red-400',
  battery: 'text-orange-400',
  esp: 'text-yellow-400',
  camera: 'text-yellow-400',
  mission: 'text-green-400',
};

export function NotificationsCard({ data }: Props) {
  const { t } = useLocale();

  const notifications = [
    data?.aiDetected && { type: 'enemy' as const, text: t('notifications.enemy_detected'), time: 'now' },
    (data?.battery ?? 100) < 20 && { type: 'battery' as const, text: t('notifications.battery_low'), time: '2m ago' },
  ].filter(Boolean) as { type: keyof typeof NOTIF_ICONS; text: string; time: string }[];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t('notifications.title')}</span>
        </div>
        {notifications.length > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-xs text-white font-bold">
            {notifications.length}
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex items-center gap-2 py-3">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>All systems nominal</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {notifications.map((n, i) => {
            const Icon = NOTIF_ICONS[n.type];
            return (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                n.type === 'enemy' ? 'bg-red-500/10 border-red-500/30 animate-pulse' : 'bg-orange-500/10 border-orange-500/30'
              }`}>
                <Icon className={`w-4 h-4 ${NOTIF_COLORS[n.type]}`} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{n.text}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{n.time}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
