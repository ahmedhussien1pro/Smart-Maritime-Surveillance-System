'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { Bell, AlertTriangle, Info, ShieldAlert, AlertOctagon, Zap } from 'lucide-react';
import type { SystemNotification } from '@/hooks/useSocket';

interface Props {
  notifications?: SystemNotification[];
  ackMessage?: string | null;
  sendCommand?: (cmd: string, payload?: Record<string, unknown>) => void;
}

export function NotificationsCard({ notifications = [], ackMessage, sendCommand }: Props) {
  const { t, translateText } = useLocale();

  const hasDangerAlert = notifications.some((n) => n.severity === 'danger');

  return (
    <div className={`card flex flex-col gap-3.5 ${hasDangerAlert ? 'border-red-500/50 shadow-lg shadow-red-950/30' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className={`w-4 h-4 ${hasDangerAlert ? 'text-red-500 animate-bounce' : 'text-amber-500'}`} />
          <span className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
            {t('notifications.title')}
          </span>
        </div>

        {ackMessage && (
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 animate-pulse">
            {translateText(ackMessage)}
          </span>
        )}
      </div>

      {/* Prominent High Severity Alarm Response Banner */}
      {hasDangerAlert && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white border-2 border-red-500 flex items-center justify-between flex-wrap gap-3 shadow-lg shadow-red-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-black/30 border border-white/30 flex items-center justify-center animate-pulse flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-extrabold block uppercase tracking-wider text-white">
                {t('notifications.critical_alert')}
              </span>
              <span className="text-[11px] block font-mono text-red-100">
                {t('notifications.action_required')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => sendCommand?.('emergency_stop')}
              className="px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4 text-red-400" />
              {t('control.emergency_stop')}
            </button>

            <button
              onClick={() => sendCommand?.('intercept_target')}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Zap className="w-4 h-4 text-black" />
              {t('notifications.intercept')}
            </button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 font-mono font-bold">
            {t('notifications.no_alerts')}
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs font-mono transition-all ${
                n.severity === 'danger'
                  ? 'bg-red-500/10 border-red-500/40 text-red-900 dark:text-red-200'
                  : n.severity === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200'
                  : 'bg-slate-100 dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {n.severity === 'danger' ? (
                  <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0 animate-pulse" />
                ) : n.severity === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                )}
                <div>
                  <span className="font-bold block text-slate-900 dark:text-slate-100">
                    {translateText(n.title)}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {translateText(n.message)}
                  </span>
                </div>
              </div>

              <span className="text-[10px] text-slate-500 dark:text-slate-400 flex-shrink-0 font-bold">
                {n.timestamp}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
