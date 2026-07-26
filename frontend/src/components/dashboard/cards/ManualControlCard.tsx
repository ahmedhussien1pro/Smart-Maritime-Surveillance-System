'use client';

import { useState } from 'react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Square, AlertOctagon, Gamepad2, Bell, Lightbulb } from 'lucide-react';

export function ManualControlCard() {
  const { t } = useLocale();
  const [speed, setSpeed] = useState(50);
  const [lights, setLights] = useState(false);
  const [alarm, setAlarm] = useState(false);

  const sendCommand = (cmd: string) => {
    console.log('[CONTROL]', cmd);
    // TODO: emit via socket
  };

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Gamepad2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t('control.title')}</span>
      </div>

      {/* D-Pad */}
      <div className="flex flex-col items-center gap-1">
        <button onClick={() => sendCommand('forward')} className="btn-ghost p-3 rounded-xl hover:bg-green-500/10 hover:border-green-500/30">
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex gap-1">
          <button onClick={() => sendCommand('left')} className="btn-ghost p-3 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={() => sendCommand('stop')} className="btn-ghost p-3 rounded-xl hover:bg-yellow-500/10">
            <Square className="w-5 h-5 text-yellow-400" />
          </button>
          <button onClick={() => sendCommand('right')} className="btn-ghost p-3 rounded-xl">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <button onClick={() => sendCommand('backward')} className="btn-ghost p-3 rounded-xl hover:bg-red-500/10">
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>

      {/* Speed Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="label">{t('control.speed')}</span>
          <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{speed}%</span>
        </div>
        <input
          type="range" min={0} max={100} value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full h-1.5 rounded-full accent-green-400"
          style={{ accentColor: 'var(--accent)' }}
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-2">
        <button
          onClick={() => setLights(!lights)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-all ${
            lights ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400' : 'border-transparent'
          }`}
          style={!lights ? { background: 'var(--bg-primary)', color: 'var(--text-muted)' } : {}}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          {t('control.lights')}
        </button>
        <button
          onClick={() => setAlarm(!alarm)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-all ${
            alarm ? 'bg-orange-500/10 border-orange-500/40 text-orange-400 animate-pulse' : 'border-transparent'
          }`}
          style={!alarm ? { background: 'var(--bg-primary)', color: 'var(--text-muted)' } : {}}
        >
          <Bell className="w-3.5 h-3.5" />
          {t('control.alarm')}
        </button>
      </div>

      {/* Emergency Stop */}
      <button
        onClick={() => sendCommand('emergency_stop')}
        className="btn-danger w-full flex items-center justify-center gap-2 py-3 font-bold tracking-wider text-sm"
      >
        <AlertOctagon className="w-4 h-4" />
        {t('control.emergency_stop')}
      </button>
    </div>
  );
}
