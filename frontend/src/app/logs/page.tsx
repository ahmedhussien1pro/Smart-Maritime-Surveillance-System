'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useLocale } from '@/components/providers/LocaleProvider';
import { ScrollText, Search, Download, Trash2, ShieldAlert, AlertTriangle, Info } from 'lucide-react';

interface LogItem {
  id: string;
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  timestamp: string;
}

export default function LogsPage() {
  const { t, translateText } = useLocale();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [filter, setFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/logs`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLogs(data);
      })
      .catch(() => {});
  }, [BACKEND_URL]);

  const filteredLogs = logs.filter((log) => {
    const translatedMsg = translateText(log.message);
    const matchesText = translatedMsg.toLowerCase().includes(filter.toLowerCase()) || log.type.toLowerCase().includes(filter.toLowerCase());
    const matchesSev = severityFilter === 'all' || log.severity === severityFilter;
    return matchesText && matchesSev;
  });

  const exportCSV = () => {
    const headers = ['ID,Type,Message,Severity,Timestamp\n'];
    const rows = logs.map((l) => `"${l.id}","${l.type}","${translateText(l.message).replace(/"/g, '""')}","${l.severity}","${l.timestamp}"\n`);
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maritime_logs_${Date.now()}.csv`;
    a.click();
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
                  <ScrollText className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h1 className="text-lg font-extrabold tracking-wide" style={{ color: 'var(--text-primary)' }}>
                    {t('logs.title')}
                  </h1>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {t('logs.subtitle')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={exportCSV} className="btn-ghost flex items-center gap-1.5 text-xs font-bold">
                  <Download className="w-4 h-4 text-emerald-500" />
                  {t('logs.export')}
                </button>
                <button onClick={() => setLogs([])} className="btn-ghost flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                  {t('logs.clear')}
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="card flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-[240px] flex items-center gap-2 px-3 py-2 rounded-lg border bg-slate-100 dark:bg-slate-900/50" style={{ borderColor: 'var(--border)' }}>
                <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={t('logs.search')}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-slate-900 dark:text-slate-200 font-mono font-bold"
                />
              </div>

              <div className="flex gap-1.5 p-1 rounded-lg border bg-slate-100 dark:bg-slate-900/50" style={{ borderColor: 'var(--border)' }}>
                {['all', 'info', 'warning', 'danger'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-3 py-1 text-xs font-bold rounded uppercase transition-all cursor-pointer ${
                      severityFilter === sev ? 'bg-emerald-500 text-black' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Log Table */}
            <div className="card overflow-hidden p-0 border">
              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right border-collapse">
                  <thead>
                    <tr className="border-b text-xs font-mono font-bold text-slate-700 dark:text-slate-300" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <th className="p-3.5">{t('logs.severity')}</th>
                      <th className="p-3.5">{t('logs.type')}</th>
                      <th className="p-3.5">{t('logs.message')}</th>
                      <th className="p-3.5">{t('logs.timestamp')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono text-xs">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-500 font-bold">
                          {t('logs.no_logs')}
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-all">
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                              log.severity === 'danger'
                                ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/40'
                                : log.severity === 'warning'
                                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40'
                                : 'bg-sky-500/20 text-sky-600 dark:text-cyan-400 border border-sky-500/40'
                            }`}>
                              {log.severity === 'danger' ? (
                                <ShieldAlert className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                              ) : log.severity === 'warning' ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                              ) : (
                                <Info className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                              )}
                              {log.severity}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{log.type}</td>
                          <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">{translateText(log.message)}</td>
                          <td className="p-3.5 font-bold text-slate-600 dark:text-slate-400">{log.timestamp}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
