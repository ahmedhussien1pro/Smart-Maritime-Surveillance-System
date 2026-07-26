'use client';

import { Suspense } from 'react';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-4">
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardGrid />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card h-48" style={{ background: 'var(--bg-card)' }} />
      ))}
    </div>
  );
}
