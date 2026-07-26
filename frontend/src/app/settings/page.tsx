'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useTheme } from 'next-themes';
import { Settings, Save, Wifi, Globe, Activity, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { t, locale, setLocale } = useLocale();
  const { theme, setTheme } = useTheme();

  const [espIp, setEspIp] = useState('192.168.1.100');
  const [cameraUrl, setCameraUrl] = useState('http://192.168.1.100:81/stream');
  const [aiEndpoint, setAiEndpoint] = useState('http://localhost:5000/detect');
  const [simMode, setSimMode] = useState(true);
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/health`)
      .then((res) => res.json())
      .then(() => setBackendStatus('online'))
      .catch(() => setBackendStatus('offline'));
  }, [BACKEND_URL]);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0" style={{ background: 'var(--accent-glow)', borderColor: 'var(--accent)' }}>
                  <Settings className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h1 className="text-lg font-extrabold tracking-wide" style={{ color: 'var(--text-primary)' }}>
                    {t('settings.title')}
                  </h1>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {t('settings.subtitle')}
                  </p>
                </div>
              </div>

              <button onClick={handleSave} className="btn-primary">
                <Save className="w-4 h-4" />
                {t('settings.save')}
              </button>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-600 dark:text-emerald-300 text-xs font-bold font-mono flex items-center gap-2 animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {t('settings.saved')}
              </div>
            )}

            {/* Diagnostics Status Badge */}
            <div className="card flex items-center justify-between p-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold block" style={{ color: 'var(--text-primary)' }}>
                    {t('settings.backend_status')}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold">{BACKEND_URL}</span>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase flex items-center gap-1.5 ${
                backendStatus === 'online' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/40'
              }`}>
                <span className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                {backendStatus === 'online' ? t('status.online') : t('status.offline')}
              </span>
            </div>

            {/* Form Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Network & Hardware Settings */}
              <div className="card flex flex-col gap-4">
                <h2 className="text-sm font-bold flex items-center gap-2 border-b pb-3" style={{ color: 'var(--text-primary)' }}>
                  <Wifi className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('settings.subtitle')}
                </h2>

                <div>
                  <label className="label mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t('settings.esp_ip')}</label>
                  <input
                    type="text"
                    value={espIp}
                    onChange={(e) => setEspIp(e.target.value)}
                    className="w-full p-2.5 rounded-lg border bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="label mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t('settings.camera_url')}</label>
                  <input
                    type="text"
                    value={cameraUrl}
                    onChange={(e) => setCameraUrl(e.target.value)}
                    className="w-full p-2.5 rounded-lg border bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="label mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t('settings.ai_endpoint')}</label>
                  <input
                    type="text"
                    value={aiEndpoint}
                    onChange={(e) => setAiEndpoint(e.target.value)}
                    className="w-full p-2.5 rounded-lg border bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Preferences & Toggles */}
              <div className="card flex flex-col gap-4">
                <h2 className="text-sm font-bold flex items-center gap-2 border-b pb-3" style={{ color: 'var(--text-primary)' }}>
                  <Globe className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('settings.title')}
                </h2>

                {/* Simulation Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg border bg-slate-100 dark:bg-slate-900/40" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <span className="text-xs font-bold block" style={{ color: 'var(--text-primary)' }}>
                      {t('settings.sim_title')}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">{t('settings.sim_desc')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={simMode}
                    onChange={(e) => setSimMode(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Audio Alerts */}
                <div className="flex items-center justify-between p-3 rounded-lg border bg-slate-100 dark:bg-slate-900/40" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <span className="text-xs font-bold block" style={{ color: 'var(--text-primary)' }}>
                      {t('settings.audio_title')}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">{t('settings.audio_desc')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={audioAlerts}
                    onChange={(e) => setAudioAlerts(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Language Switch */}
                <div className="flex items-center justify-between p-3 rounded-lg border bg-slate-100 dark:bg-slate-900/40" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{t('settings.language')}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLocale('ar')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        locale === 'ar'
                          ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold shadow'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      العربية
                    </button>
                    <button
                      onClick={() => setLocale('en')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        locale === 'en'
                          ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold shadow'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* Theme Switch */}
                <div className="flex items-center justify-between p-3 rounded-lg border bg-slate-100 dark:bg-slate-900/40" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{t('settings.theme')}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold shadow'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {t('settings.dark')}
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold shadow'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {t('settings.light')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
