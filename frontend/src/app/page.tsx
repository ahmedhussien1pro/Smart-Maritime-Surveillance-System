'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <div className="text-4xl mb-4">⚓</div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Maritime System...</p>
      </div>
    </div>
  );
}
