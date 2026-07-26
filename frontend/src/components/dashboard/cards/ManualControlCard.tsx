'use client';

import { useState } from 'react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Square, AlertOctagon, Gamepad2, Bell, Lightbulb, Zap } from 'lucide-react';

interface ManualControlCardProps {
  sendCommand: (cmd: string, payload?: Record<string, unknown>) => void;
  speed: number;
}

export function ManualControlCard({ sendCommand, speed: initialSpeed }: ManualControlCardProps) {
  const { t } = useLocale();
  const [speed, setSpeed] = useState(initialSpeed || 50);
  const [lights, setLights] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const [activeBtn, setActiveBtn] = useState<string | null>(null);

  const handleCommand = (cmd: string) => {
    setActiveBtn(cmd);
    sendCommand(cmd, { speed });
    setTimeout(() => setActiveBtn(null), 300);
  };

  const handleToggleLights = () => {
    const nextState = !lights;
    setLights(nextState);
    sendCommand('lights', { state: nextState });
  };

  const handleToggleAlarm = () => {
    const nextState = !alarm;
    setAlarm(nextState);
    sendCommand('alarm', { state: nextState });
  };

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
            {t('control.title')}
          </span>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
          {t('control.override')}
        </span>
      </div>

      {/* Direction D-Pad */}
      <div className="flex flex-col items-center gap-1.5 py-1">
        <button
          onClick={() => handleCommand('forward')}
          className={`btn-ghost p-3 rounded-xl transition-all duration-150 ${activeBtn === 'forward' ? 'bg-emerald-500/30 border-emerald-400 scale-95' : 'hover:bg-emerald-500/10 hover:border-emerald-500/40'}`}
          title={t('control.forward')}
        >
          <ArrowUp className="w-5 h-5 text-emerald-400" />
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => handleCommand('left')}
            className={`btn-ghost p-3 rounded-xl transition-all duration-150 ${activeBtn === 'left' ? 'bg-emerald-500/30 border-emerald-400 scale-95' : 'hover:bg-emerald-500/10 hover:border-emerald-500/40'}`}
            title={t('control.left')}
          >
            <ArrowLeft className="w-5 h-5 text-emerald-400" />
          </button>

          <button
            onClick={() => handleCommand('stop')}
            className={`btn-ghost p-3 rounded-xl transition-all duration-150 ${activeBtn === 'stop' ? 'bg-yellow-500/30 border-yellow-400 scale-95' : 'hover:bg-yellow-500/10 hover:border-yellow-500/40'}`}
            title={t('control.stop')}
          >
            <Square className="w-5 h-5 text-yellow-400 fill-yellow-400/30" />
          </button>

          <button
            onClick={() => handleCommand('right')}
            className={`btn-ghost p-3 rounded-xl transition-all duration-150 ${activeBtn === 'right' ? 'bg-emerald-500/30 border-emerald-400 scale-95' : 'hover:bg-emerald-500/10 hover:border-emerald-500/40'}`}
            title={t('control.right')}
          >
            <ArrowRight className="w-5 h-5 text-emerald-400" />
          </button>
        </div>

        <button
          onClick={() => handleCommand('backward')}
          className={`btn-ghost p-3 rounded-xl transition-all duration-150 ${activeBtn === 'backward' ? 'bg-emerald-500/30 border-emerald-400 scale-95' : 'hover:bg-emerald-500/10 hover:border-emerald-500/40'}`}
          title={t('control.backward')}
        >
          <ArrowDown className="w-5 h-5 text-emerald-400" />
        </button>
      </div>

      {/* Throttle Speed Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="label flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            {t('control.speed')}
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">{speed}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={speed}
          onChange={(e) => {
            const val = Number(e.target.value);
            setSpeed(val);
            sendCommand('set_speed', { speed: val });
          }}
          className="w-full h-2 rounded-lg accent-emerald-400 cursor-pointer"
          style={{ accentColor: '#00ff88' }}
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-2">
        <button
          onClick={handleToggleLights}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold border transition-all ${
            lights ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-900/30' : 'border-slate-800 text-slate-400 bg-slate-900/50'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          {t('control.lights')}
        </button>

        <button
          onClick={handleToggleAlarm}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold border transition-all ${
            alarm ? 'bg-orange-500/20 border-orange-400 text-orange-300 animate-pulse shadow-md shadow-orange-900/30' : 'border-slate-800 text-slate-400 bg-slate-900/50'
          }`}
        >
          <Bell className="w-4 h-4" />
          {t('control.alarm')}
        </button>
      </div>

      {/* Emergency Stop Button */}
      <button
        onClick={() => handleCommand('emergency_stop')}
        className="btn-danger w-full py-3 font-extrabold tracking-widest text-sm uppercase flex items-center justify-center gap-2"
      >
        <AlertOctagon className="w-5 h-5 animate-bounce" />
        {t('control.emergency_stop')}
      </button>
    </div>
  );
}
