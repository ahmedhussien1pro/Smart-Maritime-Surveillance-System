'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Target, Save, CheckCircle2, Sliders, MapPin } from 'lucide-react';

export default function MissionPage() {
  const { t } = useLocale();
  const [isSaved, setIsSaved] = useState(false);

  const [mission, setMission] = useState({
    name: 'Sector 4 Patrol Mission',
    enemyColor: '#ff3366',
    trackingSpeed: 45,
    boatSpeed: 70,
    confidence: 0.85,
    alarmTime: 15,
    stopDistance: 30,
    searchRadius: 150,
    target: { x: 180, y: 120 },
    simulationMode: true,
  });

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/mission`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) setMission(data);
      })
      .catch(() => {});
  }, [BACKEND_URL]);

  const handleSave = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/mission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mission),
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0" style={{ background: 'var(--accent-glow)', borderColor: 'var(--accent)' }}>
                  <Target className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h1 className="text-lg font-extrabold tracking-wide" style={{ color: 'var(--text-primary)' }}>
                    {t('mission.title')}
                  </h1>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {t('mission.subtitle')}
                  </p>
                </div>
              </div>

              <button onClick={handleSave} className="btn-primary">
                <Save className="w-4 h-4" />
                {t('mission.save')}
              </button>
            </div>

            {isSaved && (
              <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-600 dark:text-emerald-300 text-xs font-bold font-mono flex items-center gap-2 animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {t('mission.saved')}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Controls */}
              <div className="lg:col-span-2 card flex flex-col gap-5">
                <h2 className="text-sm font-bold flex items-center gap-2 border-b pb-3" style={{ color: 'var(--text-primary)' }}>
                  <Sliders className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('mission.params')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t('mission.name')}</label>
                    <input
                      type="text"
                      value={mission.name}
                      onChange={(e) => setMission({ ...mission, name: e.target.value })}
                      className="w-full p-2.5 rounded-lg border bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="label mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t('mission.enemy_color')}</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={mission.enemyColor}
                        onChange={(e) => setMission({ ...mission, enemyColor: e.target.value })}
                        className="h-10 w-14 rounded border bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={mission.enemyColor}
                        onChange={(e) => setMission({ ...mission, enemyColor: e.target.value })}
                        className="w-full p-2.5 rounded-lg border bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t('mission.cruise_speed')}</label>
                    <input
                      type="number"
                      value={mission.boatSpeed}
                      onChange={(e) => setMission({ ...mission, boatSpeed: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg border bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="label mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t('mission.tracking_speed')}</label>
                    <input
                      type="number"
                      value={mission.trackingSpeed}
                      onChange={(e) => setMission({ ...mission, trackingSpeed: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg border bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="label mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t('mission.search_radius')}</label>
                    <input
                      type="number"
                      value={mission.searchRadius}
                      onChange={(e) => setMission({ ...mission, searchRadius: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg border bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="label mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t('mission.stop_distance')}</label>
                    <input
                      type="number"
                      value={mission.stopDistance}
                      onChange={(e) => setMission({ ...mission, stopDistance: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg border bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="label" style={{ color: 'var(--text-secondary)' }}>{t('mission.confidence')}</label>
                    <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">{(mission.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={0.99}
                    step={0.01}
                    value={mission.confidence}
                    onChange={(e) => setMission({ ...mission, confidence: Number(e.target.value) })}
                    className="w-full h-2 rounded-lg accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Waypoint Interactive Map Widget */}
              <div className="card flex flex-col gap-3">
                <h2 className="text-sm font-bold flex items-center gap-2 border-b pb-3" style={{ color: 'var(--text-primary)' }}>
                  <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                  {t('mission.waypoint_title')}
                </h2>

                <div
                  className="flex-1 min-h-[240px] rounded-xl border relative radar-grid flex items-center justify-center cursor-crosshair overflow-hidden"
                  style={{ background: '#050c18' }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.round(e.clientX - rect.left);
                    const y = Math.round(e.clientY - rect.top);
                    setMission({ ...mission, target: { x, y } });
                  }}
                >
                  <span className="absolute top-2 left-2 text-[10px] font-mono text-slate-300 font-bold bg-black/60 px-2 py-0.5 rounded">
                    {t('mission.click_grid')}
                  </span>

                  {/* Vessel Center Marker */}
                  <div className="w-4 h-4 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>

                  {/* Selected Target Pin */}
                  <div
                    className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center animate-bounce"
                    style={{ left: `${mission.target.x}px`, top: `${mission.target.y}px` }}
                  >
                    <div className="w-4 h-4 rounded-full bg-red-600/40 border-2 border-red-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 flex justify-between font-mono text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-bold">{t('mission.target_x')}: <strong className="text-emerald-600 dark:text-emerald-400">{mission.target.x} px</strong></span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold">{t('mission.target_y')}: <strong className="text-emerald-400">{mission.target.y} px</strong></span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
