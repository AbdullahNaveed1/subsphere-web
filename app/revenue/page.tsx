'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Header } from '@/components/Header';

export default function RevenuePage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    api.get('/analytics/revenue').then(r => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <main className="min-h-screen"><Header active="/revenue" /><div className="p-8 text-[var(--fg-muted)]">Loading…</div></main>;
  const max = Math.max(1, ...data.daily.map((d: any) => d.cents));

  return (
    <main className="min-h-screen">
      <Header active="/revenue" />
      <div className="w-full px-6 sm:px-8 py-6 sm:py-8 space-y-6">
        <div>
          <h1 className="ss-h1">Revenue</h1>
          <p className="ss-sub">Daily breakdown over the last 14 days</p>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="ss-card p-4">
            <p className="ss-kpi-label">All time</p>
            <p className="ss-kpi-value text-lg sm:text-xl">PKR {(data.totalCents / 100).toFixed(2)}</p>
          </div>
          <div className="ss-card p-4">
            <p className="ss-kpi-label">Last 30d</p>
            <p className="ss-kpi-value text-lg sm:text-xl">PKR {(data.last30Cents / 100).toFixed(2)}</p>
          </div>
          <div className="ss-card p-4">
            <p className="ss-kpi-label">Last 7d</p>
            <p className="ss-kpi-value text-lg sm:text-xl">PKR {(data.last7Cents / 100).toFixed(2)}</p>
          </div>
          <div className="ss-card p-4">
            <p className="ss-kpi-label">Refunded</p>
            <p className="ss-kpi-value text-lg sm:text-xl" style={{ color: 'var(--danger)' }}>PKR {(data.refundedCents / 100).toFixed(2)}</p>
          </div>
        </section>

        <section className="ss-card">
          <h2 className="ss-h2">Last 14 days</h2>
          <div className="flex items-end gap-1 h-40 mt-4">
            {data.daily.map((d: any) => (
              <div key={d.date} className="flex-1 flex flex-col items-center justify-end" title={d.date + ': PKR ' + (d.cents/100).toFixed(2)}>
                <div className="w-full rounded-t" style={{ height: Math.max(2, d.cents / max * 140) + 'px', background: 'linear-gradient(to top, var(--accent), var(--accent-hover))' }} />
              </div>
            ))}
          </div>
        </section>

        <section className="ss-card text-sm space-y-1">
          <p>Total payments: <span className="font-semibold">{data.counts.payments}</span></p>
          <p>Failed payments: <span className="font-semibold" style={{ color: 'var(--danger)' }}>{data.counts.failed}</span></p>
        </section>
      </div>
    </main>
  );
}