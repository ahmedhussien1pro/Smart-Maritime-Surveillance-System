'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Shield, Activity } from 'lucide-react';

export function InitialLoader() {
  const { isRTL } = useLocale();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('جاري بدء تشغيل النظام...');
  const isFirstLoad = useRef(true);

  const statuses = [
    'جاري التوصيل بسيرفر القيادة...',
    'تهيـئة الرادار والتغطية التكتيكية...',
    'معايرة كاميرات الذكاء الاصطناعي...',
    'دفـعـة 170 ضبـاط احتيـاط - جاهزية تامة',
  ];

  const triggerLoader = () => {
    setLoading(true);
    setProgress(0);
    setStatusText(statuses[0]);

    let currentStep = 0;
    // Increased duration ~3.2 seconds total duration
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 4; // 25 steps of 120ms = ~3.0s
        if (next >= 25 && currentStep === 0) { currentStep = 1; setStatusText(statuses[1]); }
        if (next >= 55 && currentStep === 1) { currentStep = 2; setStatusText(statuses[2]); }
        if (next >= 85 && currentStep === 2) { currentStep = 3; setStatusText(statuses[3]); }
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }
        return next;
      });
    }, 120);

    return interval;
  };

  // Initial page refresh / load
  useEffect(() => {
    const interval = triggerLoader();
    return () => clearInterval(interval);
  }, []);

  // Global Page Navigation trigger on route change
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    const interval = triggerLoader();
    return () => clearInterval(interval);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#050a12] flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none animate-in fade-in duration-300">
      {/* Background Tactical Radar Sweep Effect */}
      <div className="absolute inset-0 radar-grid opacity-30 pointer-events-none" />
      <div className="absolute w-[650px] h-[650px] rounded-full border border-emerald-500/10 animate-ping pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center gap-5">
        {/* Glowing Shield & Logo Wrapper */}
        <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600/40 via-amber-500/40 to-black/60 blur-2xl animate-pulse" />

          <div className="relative w-full h-full p-2.5 rounded-2xl bg-black/70 border-2 border-amber-500/60 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-amber-500/30">
            <Image
              src="/reserve_officers_logo.png"
              alt="شعار كلية ضباط الاحتياط"
              width={160}
              height={160}
              className="object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-transform duration-500 hover:scale-105"
              priority
            />
          </div>
        </div>

        {/* Batch & Academy Titles */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/25 border border-red-500/50 text-red-400 text-xs font-mono font-extrabold uppercase tracking-widest shadow-md shadow-red-950/40">
            <Shield className="w-3.5 h-3.5" />
            <span>{isRTL ? 'كلية ضباط الاحتياط' : 'RESERVE OFFICERS ACADEMY'}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200 mt-1 drop-shadow-md">
            {isRTL ? 'دفـــعـــة 170' : 'BATCH 170'}
          </h1>

          <p className="text-xs font-mono text-cyan-400 font-bold tracking-wider">
            {isRTL ? 'نظام المراقبة والاستطلاع البحري الذكي C2' : 'SMART MARITIME SURVEILLANCE C2 SYSTEM'}
          </p>
        </div>

        {/* Tactical Progress Bar */}
        <div className="w-full flex flex-col gap-2 mt-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-200 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              {statusText}
            </span>
            <span className="text-emerald-400 font-extrabold text-sm">{progress}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-emerald-500/40 shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-150 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400 shadow-md shadow-emerald-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
