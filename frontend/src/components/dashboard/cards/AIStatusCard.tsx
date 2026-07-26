'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { Eye, Cpu } from 'lucide-react';
import type { AIState } from '@/hooks/useSocket';

interface Props {
  data: AIState | null;
}

export function AIStatusCard({ data }: Props) {
  const { t } = useLocale();

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
            {t('ai.title')}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-mono text-xs text-cyan-400 font-bold">
          <Cpu className="w-3 h-3" />
          YOLOv8-Sea
        </div>
      </div>

      <div className="rounded-xl p-3 border flex items-center justify-between" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
        <div>
          <span className="label block mb-1">{t('ai.target')}</span>
          <span className="text-sm font-extrabold font-mono text-red-400">
            {data?.detected ? t('ai.detected') : t('ai.clear')}
          </span>
        </div>

        <div className="text-right">
          <span className="label block mb-1">{t('ai.confidence')}</span>
          <span className="text-base font-extrabold font-mono text-cyan-400">
            {data?.detected ? `${((data.confidence || 0.85) * 100).toFixed(0)}%` : '--'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="flex justify-between items-center p-2 rounded bg-slate-900/50 border border-slate-800">
          <span className="text-slate-400">{t('ai.fps')}</span>
          <span className="font-bold text-emerald-400">{data?.fps || 30} FPS</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded bg-slate-900/50 border border-slate-800">
          <span className="text-slate-400">{t('ai.tracking')}</span>
          <span className={`font-bold ${data?.tracking ? 'text-red-400' : 'text-emerald-400'}`}>
            {data?.tracking ? t('ai.locked') : t('ai.searching')}
          </span>
        </div>
      </div>
    </div>
  );
}
