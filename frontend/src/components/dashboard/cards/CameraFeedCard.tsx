'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Maximize2, Circle, Camera, ShieldAlert, Crosshair, X, Eye } from 'lucide-react';
import { AIState } from '@/hooks/useSocket';

interface CameraFeedCardProps {
  aiState?: AIState;
}

export function CameraFeedCard({ aiState }: CameraFeedCardProps) {
  const { t, isRTL } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [visionMode, setVisionMode] = useState<'THERMAL' | 'NIGHT_VISION' | 'OPTICAL'>('THERMAL');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording] = useState(true);

  // Render canvas frame helper
  const drawFrame = (canvas: HTMLCanvasElement, time: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Vision Mode background
    if (visionMode === 'THERMAL') {
      ctx.fillStyle = '#06101e';
    } else if (visionMode === 'NIGHT_VISION') {
      ctx.fillStyle = '#02180a';
    } else {
      ctx.fillStyle = '#0a192f';
    }
    ctx.fillRect(0, 0, w, h);

    // Waves simulation
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.strokeStyle = visionMode === 'NIGHT_VISION' ? 'rgba(0,255,100,0.15)' : 'rgba(0,180,255,0.15)';
      const waveY = h * 0.5 + Math.sin(time + i * 0.8) * 15 + i * 20;
      ctx.moveTo(0, waveY);
      for (let x = 0; x < w; x += 20) {
        ctx.lineTo(x, waveY + Math.sin(x * 0.02 + time * 2) * 5);
      }
      ctx.stroke();
    }

    // Horizon line
    ctx.strokeStyle = visionMode === 'NIGHT_VISION' ? 'rgba(0,255,100,0.3)' : 'rgba(0,255,136,0.3)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.45);
    ctx.lineTo(w, h * 0.45);
    ctx.stroke();
    ctx.setLineDash([]);

    // Pitch markings
    ctx.fillStyle = visionMode === 'NIGHT_VISION' ? 'rgba(0,255,100,0.6)' : 'rgba(0,255,136,0.6)';
    ctx.font = '10px monospace';
    ctx.fillText('+05°', w / 2 - 80, h * 0.45 - 20);
    ctx.fillText('+05°', w / 2 + 60, h * 0.45 - 20);

    // Crosshair
    const cx = w / 2;
    const cy = h / 2;
    ctx.strokeStyle = visionMode === 'NIGHT_VISION' ? 'rgba(0,255,100,0.7)' : 'rgba(0,255,136,0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, Math.PI * 2);
    ctx.moveTo(cx - 35, cy); ctx.lineTo(cx - 10, cy);
    ctx.moveTo(cx + 10, cy); ctx.lineTo(cx + 35, cy);
    ctx.moveTo(cx, cy - 35); ctx.lineTo(cx, cy - 10);
    ctx.moveTo(cx, cy + 10); ctx.lineTo(cx, cy + 35);
    ctx.stroke();

    // AI Detection Box
    if (aiState?.detected && aiState.bbox) {
      const boxX = (aiState.bbox.x / 100) * w;
      const boxY = (aiState.bbox.y / 100) * h;
      const boxW = (aiState.bbox.width / 100) * w;
      const boxH = (aiState.bbox.height / 100) * h;

      ctx.strokeStyle = '#ff3366';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      // Corners
      const cornerLen = 10;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(boxX, boxY + cornerLen); ctx.lineTo(boxX, boxY); ctx.lineTo(boxX + cornerLen, boxY);
      ctx.moveTo(boxX + boxW - cornerLen, boxY); ctx.lineTo(boxX + boxW, boxY); ctx.lineTo(boxX + boxW, boxY + cornerLen);
      ctx.moveTo(boxX, boxY + boxH - cornerLen); ctx.lineTo(boxX, boxY + boxH); ctx.lineTo(boxX + cornerLen, boxY + boxH);
      ctx.moveTo(boxX + boxW - cornerLen, boxY + boxH); ctx.lineTo(boxX + boxW, boxY + boxH); ctx.lineTo(boxX + boxW, boxY + boxH - cornerLen);
      ctx.stroke();

      // Label Header
      const targetLabel = isRTL ? `قارب معادي (${(aiState.confidence * 100).toFixed(0)}%)` : `HOSTILE BOAT (${(aiState.confidence * 100).toFixed(0)}%)`;
      ctx.fillStyle = '#ff3366';
      ctx.fillRect(boxX, boxY - 24, 160, 22);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(targetLabel, boxX + 6, boxY - 8);
    }
  };

  useEffect(() => {
    let animId: number;
    let time = 0;

    const loop = () => {
      time += 0.05;
      if (canvasRef.current) drawFrame(canvasRef.current, time);
      if (isFullscreen && modalCanvasRef.current) drawFrame(modalCanvasRef.current, time);
      animId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animId);
  }, [aiState, visionMode, isFullscreen, isRTL]);

  return (
    <>
      <div className="card flex flex-col h-full min-h-[360px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
              {t('camera.title')}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
              {aiState?.fps || 30} {t('camera.fps')}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Vision Mode Buttons */}
            <div className="flex rounded-lg overflow-hidden border p-0.5" style={{ background: 'var(--bg-primary)' }}>
              <button
                onClick={() => setVisionMode('THERMAL')}
                className={`px-2 py-1 text-[11px] font-bold rounded transition-all ${visionMode === 'THERMAL' ? 'bg-cyan-500 text-black' : 'text-slate-400'}`}
              >
                {isRTL ? 'حراري' : 'THERMAL'}
              </button>
              <button
                onClick={() => setVisionMode('NIGHT_VISION')}
                className={`px-2 py-1 text-[11px] font-bold rounded transition-all ${visionMode === 'NIGHT_VISION' ? 'bg-emerald-500 text-black' : 'text-slate-400'}`}
              >
                {isRTL ? 'ليلي' : 'NV'}
              </button>
              <button
                onClick={() => setVisionMode('OPTICAL')}
                className={`px-2 py-1 text-[11px] font-bold rounded transition-all ${visionMode === 'OPTICAL' ? 'bg-sky-500 text-black' : 'text-slate-400'}`}
              >
                {isRTL ? 'عادي' : 'RGB'}
              </button>
            </div>

            {isRecording && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/40">
                <Circle className="w-2 h-2 fill-red-500 text-red-500 animate-pulse" />
                <span className="text-[10px] font-extrabold text-red-400 tracking-wider">
                  {t('camera.recording')}
                </span>
              </div>
            )}

            <button
              onClick={() => setIsFullscreen(true)}
              className="btn-ghost p-1.5"
              title={t('camera.fullscreen')}
            >
              <Maximize2 className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Camera Stream Area */}
        <div className="flex-1 rounded-xl relative overflow-hidden flex items-center justify-center border hud-border-corners" style={{ background: '#050a12' }}>
          <canvas ref={canvasRef} width={720} height={400} className="w-full h-full object-cover rounded-xl" />

          {/* Top Info Bar */}
          <div className="absolute top-3 left-4 right-4 flex justify-between items-center text-[11px] font-mono text-cyan-400 pointer-events-none">
            <div className="flex items-center gap-3 bg-black/60 px-3 py-1 rounded-md border border-cyan-500/30 backdrop-blur-md">
              <span>{t('camera.mode')}: {visionMode}</span>
              <span>{t('camera.lat')}: 27.9654°N</span>
              <span>{t('camera.lng')}: 34.3615°E</span>
            </div>
            <div className="bg-black/60 px-3 py-1 rounded-md border border-cyan-500/30 backdrop-blur-md">
              {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
            </div>
          </div>

          {/* Alert Overlay Banner */}
          {aiState?.detected && (
            <div className="absolute bottom-3 left-4 right-4 bg-red-950/90 border-2 border-red-500 p-2.5 rounded-xl backdrop-blur-lg flex items-center justify-between text-xs font-bold text-white shadow-xl shadow-red-900/40 animate-pulse">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span>
                  {t('camera.target_detected')} ({(aiState.confidence * 100).toFixed(0)}%)
                </span>
              </div>
              <span className="bg-red-600 text-white px-2.5 py-1 rounded text-[10px] uppercase font-mono tracking-wider font-extrabold">
                {t('camera.lock_engaged')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN POPUP MODAL */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col p-4 md:p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6 text-emerald-400" />
              <div>
                <h2 className="text-base font-extrabold text-white">
                  {t('camera.title')} - {t('camera.fullscreen')}
                </h2>
                <span className="text-xs font-mono text-emerald-400">HIGH-DEFINITION TACTICAL VIEW</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Vision Mode Buttons */}
              <div className="flex rounded-lg overflow-hidden border p-0.5 bg-slate-900 border-slate-700">
                <button
                  onClick={() => setVisionMode('THERMAL')}
                  className={`px-3 py-1.5 text-xs font-bold rounded ${visionMode === 'THERMAL' ? 'bg-cyan-500 text-black' : 'text-slate-400'}`}
                >
                  {isRTL ? 'حراري' : 'THERMAL'}
                </button>
                <button
                  onClick={() => setVisionMode('NIGHT_VISION')}
                  className={`px-3 py-1.5 text-xs font-bold rounded ${visionMode === 'NIGHT_VISION' ? 'bg-emerald-500 text-black' : 'text-slate-400'}`}
                >
                  {isRTL ? 'ليلي' : 'NV'}
                </button>
                <button
                  onClick={() => setVisionMode('OPTICAL')}
                  className={`px-3 py-1.5 text-xs font-bold rounded ${visionMode === 'OPTICAL' ? 'bg-sky-500 text-black' : 'text-slate-400'}`}
                >
                  {isRTL ? 'عادي' : 'RGB'}
                </button>
              </div>

              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-900/50 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 rounded-2xl relative overflow-hidden border-2 border-emerald-500/40 hud-border-corners flex items-center justify-center bg-slate-950">
            <canvas ref={modalCanvasRef} width={1280} height={720} className="w-full h-full object-cover" />
          </div>
        </div>
      )}
    </>
  );
}
