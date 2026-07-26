'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { Brain, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { SimData } from '@/hooks/useSimulation';

interface Props { data: SimData | null; }

export function AIStatusCard({ data }: Props) {
  const { t } = useLocale();
  const detected = data?.aiDetected ?? false;

  return (
    <div className={`card flex flex-col gap-3 ${detected ? 'border-red-500/50' : ''}`}
      style={detected ? { boxShadow: '0 0 20px rgba(255,59,59,0.15)' } : {}}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t('ai.title')}</span>
        </div>
        {detected
          ? <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
          : <CheckCircle2 className="w-4 h-4 text-green-400" />
        }
      </div>

      <div
        className={`rounded-lg px-3 py-2 text-center text-sm font-bold ${
          detected ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'text-green-400'
        }`}
        style={!detected ? { background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)' } : {}}
      >
        {detected ? t('ai.detected') : t('ai.clear')}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div style={{ color: 'var(--text-muted)' }}>{t('ai.model')}: <span style={{ color: 'var(--text-secondary)' }}>YOLOv8n</span></div>
        <div style={{ color: 'var(--text-muted)' }}>{t('ai.fps')}: <span style={{ color: 'var(--text-secondary)' }}>{data?.aiFps ?? 0}</span></div>
        <div style={{ color: 'var(--text-muted)' }}>{t('ai.confidence')}: <span style={{ color: 'var(--text-secondary)' }}>{((data?.aiConfidence ?? 0) * 100).toFixed(0)}%</span></div>
        <div style={{ color: 'var(--text-muted)' }}>{t('ai.tracking')}: <span style={{ color: data?.aiTracking ? 'var(--accent)' : 'var(--text-secondary)' }}>{data?.aiTracking ? '●' : '○'}</span></div>
      </div>
    </div>
  );
}
