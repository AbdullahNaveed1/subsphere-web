'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Header } from '@/components/Header';

export default function Dashboard() {
  const [revenue, setRevenue] = useState<any>(null);
  const [sub, setSub] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter();

  async function load() {
    const [r, s, p, w] = await Promise.all([
      api.get('/analytics/revenue').catch(() => ({ data: null })),
      api.get('/subscriptions/me').catch(() => ({ data: null })),
      api.get('/v1/payments').catch(() => ({ data: [] })),
      api.get('/webhooks/events').catch(() => ({ data: [] })),
    ]);
    setRevenue(r.data);
    setSub(s.data);
    setPayments(p.data.slice(0, 5));
    setEvents(w.data.slice(0, 5));
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    load();
  }, []);

  return (
    <main className="min-h-screen">
      <Header active="/dashboard" />

      <div className="w-full px-6 sm:px-8 py-6 sm:py-8 space-y-6">
        <div>
          <h1 className="ss-h1">Dashboard</h1>
          <p className="ss-sub">Overview of your payments, subscriptions, and activity</p>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="ss-card p-4 sm:p-5">
            <p className="ss-kpi-label">All time</p>
            <p className="ss-kpi-value text-lg sm:text-2xl">PKR {((revenue?.totalCents || 0) / 100).toFixed(2)}</p>
          </div>
          <div className="ss-card p-4 sm:p-5">
            <p className="ss-kpi-label">Last 30d</p>
            <p className="ss-kpi-value text-lg sm:text-2xl">PKR {((revenue?.last30Cents || 0) / 100).toFixed(2)}</p>
          </div>
          <div className="ss-card p-4 sm:p-5">
            <p className="ss-kpi-label">Payments</p>
            <p className="ss-kpi-value text-lg sm:text-2xl">{revenue?.counts?.payments || 0}</p>
          </div>
          <div className="ss-card p-4 sm:p-5">
            <p className="ss-kpi-label">Failed</p>
            <p className="ss-kpi-value text-lg sm:text-2xl" style={{ color: 'var(--danger)' }}>{revenue?.counts?.failed || 0}</p>
          </div>
        </section>

        <section className="ss-card">
          <h2 className="ss-h2">Current subscription</h2>
          {sub ? (
            <div>
              <p className="font-medium">{sub.plan?.name} — PKR {((sub.plan?.priceCents || 0) / 100).toFixed(2)}/{sub.plan?.interval}</p>
              <p className="text-xs text-[var(--fg-dim)] mt-1">Status: {sub.status} · Renews {new Date(sub.currentPeriodEnd).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="text-sm text-[var(--fg-muted)]">No active subscription. <Link href="/subscriptions" className="text-[var(--accent-hover)] hover:underline">Choose a plan</Link></p>
          )}
        </section>

        <section className="ss-card">
          <h2 className="ss-h2">Recent payments</h2>
          {payments.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">No payments yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="ss-table min-w-[600px]">
                <thead>
                  <tr><th>ID</th><th>Amount</th><th>Method</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td><span className="ss-code">{p.id.slice(0, 12)}</span></td>
                      <td>PKR {(p.amount / 100).toFixed(2)}</td>
                      <td><span className="ss-badge">{p.method}</span></td>
                      <td>
                        <span className={'ss-badge ' + (p.status === 'succeeded' ? 'ss-badge-success' : p.status === 'failed' ? 'ss-badge-danger' : '')}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="ss-card">
          <h2 className="ss-h2">Recent webhook events</h2>
          {events.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">No events yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="ss-table min-w-[500px]">
                <thead>
                  <tr><th>Type</th><th>Status</th><th>Attempts</th></tr>
                </thead>
                <tbody>
                  {events.map((e) => (
                    <tr key={e.id}>
                      <td><span className="ss-code">{e.type}</span></td>
                      <td><span className={'ss-badge ' + (e.status === 'delivered' ? 'ss-badge-success' : e.status === 'failed' ? 'ss-badge-danger' : 'ss-badge-warn')}>{e.status}</span></td>
                      <td>{e.attempts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}