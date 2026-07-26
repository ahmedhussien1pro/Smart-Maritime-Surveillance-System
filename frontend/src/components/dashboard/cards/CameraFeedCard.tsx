'use client';

import { useState } from 'react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Maximize2, Circle, Camera } from 'lucide-react';

export function CameraFeedCard() {
  const { t } = useLocale();
  const [isRecording] = useState(true);

  return (
    <div className="card h-full min-h-[280px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t('camera.title')}</span>
        </div>
        <div className="flex items-center gap-2">
          {isRecording && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30">
              <Circle className="w-2 h-2 fill-red-500 text-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-400">{t('camera.recording')}</span>
            </div>
          )}
          <button className="btn-ghost p-1.5">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feed Area */}
      <div
        className="flex-1 rounded-lg flex items-center justify-center relative overflow-hidden"
        style={{ background: '#0a0f14', border: '1px solid var(--border)', minHeight: '200px' }}
      >
        {/* Simulation: No real stream */}
        <div className="text-center">
          <div className="text-4xl mb-3 opacity-30">📡</div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('camera.connecting')}</p>
          <p className="text-xs mt-1 font-mono" style={{ color: 'var(--accent)', opacity: 0.6 }}>192.168.1.10:81/stream</p>
        </div>

        {/* Corner Overlays - Military HUD style */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2" style={{ borderColor: 'var(--accent)', opacity: 0.5 }} />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2" style={{ borderColor: 'var(--accent)', opacity: 0.5 }} />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2" style={{ borderColor: 'var(--accent)', opacity: 0.5 }} />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2" style={{ borderColor: 'var(--accent)', opacity: 0.5 }} />

        {/* Timestamp */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <p className="text-xs font-mono" style={{ color: 'var(--accent)', opacity: 0.7 }}>
            {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
          </p>
        </div>
      </div>
    </div>
  );
}
