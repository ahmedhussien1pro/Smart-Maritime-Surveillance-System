'use client';

import { useEffect, useRef } from 'react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Radio } from 'lucide-react';
import { RadarState, BoatState } from '@/hooks/useSocket';

interface RadarCardProps {
  radarState?: RadarState;
  boatState?: BoatState;
}

export function RadarCard({ radarState, boatState }: RadarCardProps) {
  const { t, isRTL } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let sweepAngle = 0;

    const render = () => {
      sweepAngle = (sweepAngle + 0.03) % (Math.PI * 2);
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) / 2 - 25;

      ctx.clearRect(0, 0, w, h);

      // Radar background
      ctx.fillStyle = '#06121e';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Range Rings (100m, 200m, 300m)
      [0.33, 0.66, 1].forEach((rRatio, idx) => {
        const r = radius * rRatio;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.15)';
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(0, 255, 136, 0.6)';
        ctx.font = '9px monospace';
        ctx.fillText(`${(idx + 1) * 100}m`, cx + 4, cy - r + 12);
      });

      // Axis Cross
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.2)';
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Rotating Radar Sweep Cone
      const grad = ctx.createConicGradient(sweepAngle, cx, cy);
      grad.addColorStop(0, 'rgba(0, 255, 136, 0.4)');
      grad.addColorStop(0.15, 'rgba(0, 255, 136, 0.05)');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, sweepAngle - 0.5, sweepAngle);
      ctx.closePath();
      ctx.fill();

      // Sweep Line
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * radius, cy + Math.sin(sweepAngle) * radius);
      ctx.stroke();

      // Draw Targets
      if (radarState?.targets) {
        radarState.targets.forEach((tTarget) => {
          const targetRad = (tTarget.angle * Math.PI) / 180;
          const distRatio = Math.min(1, tTarget.distance / 300);
          const tx = cx + Math.cos(targetRad) * (radius * distRatio);
          const ty = cy + Math.sin(targetRad) * (radius * distRatio);

          let color = '#00ff88';
          if (tTarget.threat === 'DANGER') color = '#ff3366';
          else if (tTarget.threat === 'WARNING') color = '#ffaa00';

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(tx, ty, tTarget.threat === 'DANGER' ? 6 : 4, 0, Math.PI * 2);
          ctx.fill();

          if (tTarget.threat === 'DANGER') {
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(tx, ty, 10 + Math.sin(sweepAngle * 4) * 3, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(tTarget.id, tx + 8, ty + 3);
        });
      }

      // Center Boat Vessel Marker (USV)
      const boatRad = ((boatState?.heading || 0) * Math.PI) / 180;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(boatRad);
      ctx.fillStyle = '#0284c7';
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(8, 10);
      ctx.lineTo(0, 6);
      ctx.lineTo(-8, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [radarState, boatState]);

  return (
    <div className="card flex flex-col h-full min-h-[360px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-500 animate-pulse flex-shrink-0" />
          <span className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
            {t('radar.title')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
          <span>{isRTL ? 'المدى: 300m' : 'RNG: 300m'}</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
            {isRTL ? `الأهداف: ${radarState?.targets?.length || 0}` : `TARGETS: ${radarState?.targets?.length || 0}`}
          </span>
        </div>
      </div>

      {/* Radar Canvas Container */}
      <div className="flex-1 rounded-xl relative overflow-hidden flex items-center justify-center border hud-border-corners radar-grid" style={{ background: '#040912' }}>
        <canvas ref={canvasRef} width={360} height={320} className="w-full h-full object-contain" />

        {/* N / S / E / W Cardinal Directions */}
        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] font-bold text-emerald-400 font-mono">
          {isRTL ? 'ش' : 'N'}
        </span>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-bold text-emerald-400 font-mono">
          {isRTL ? 'ج' : 'S'}
        </span>
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-emerald-400 font-mono">
          {isRTL ? 'غ' : 'W'}
        </span>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-emerald-400 font-mono">
          {isRTL ? 'ق' : 'E'}
        </span>
      </div>
    </div>
  );
}
