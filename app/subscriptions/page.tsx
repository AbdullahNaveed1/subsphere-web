'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Header } from '@/components/Header';

export default function SubscriptionsPage() {
  const [sub, setSub] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  async function load() {
    const s = await api.get('/subscriptions/me').catch(() => ({ data: null }));
    const p = await api.get('/plans').catch(() => ({ data: [] }));
    setSub(s.data);
    setPlans(p.data);
  }
  useEffect(() => { load(); }, []);

  async function subscribe(planId: string) {
    setMsg('');
    try { await api.post('/subscriptions', { planId }); setMsg('Subscribed successfully'); load(); }
    catch (e: any) { setMsg(e?.response?.data?.message || 'Failed'); }
  }

  async function cancel() {
    if (!confirm('Cancel subscription?')) return;
    await api.delete('/subscriptions/me');
    load();
  }

  return (
    <main className="min-h-screen">
      <Header active="/subscriptions" />

      <div className="w-full px-6 sm:px-8 py-6 sm:py-8 space-y-6">
        <div>
          <h1 className="ss-h1">Subscriptions</h1>
          <p className="ss-sub">Manage your plan and billing cycle</p>
        </div>

        {msg && <div className="ss-badge-accent p-3 rounded-lg text-sm">{msg}</div>}

        {sub ? (
          <div className="ss-card">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div>
                <p className="ss-kpi-label">Current plan</p>
                <p className="text-xl sm:text-2xl font-bold tracking-tight">{sub.plan?.name}</p>
                <p className="text-sm text-[var(--fg-muted)] mt-1">PKR {((sub.plan?.priceCents || 0) / 100).toFixed(2)} / {sub.plan?.interval}</p>
                <p className="text-xs text-[var(--fg-dim)] mt-3">Renews {new Date(sub.currentPeriodEnd).toLocaleDateString()}</p>
              </div>
              <span className="ss-badge-success self-start">{sub.status}</span>
            </div>
            <button onClick={cancel} className="ss-btn ss-btn-danger mt-6">Cancel subscription</button>
          </div>
        ) : (
          <div className="ss-card">
            <p className="text-sm text-[var(--fg-muted)]">No active subscription. Choose a plan below to get started.</p>
          </div>
        )}

        <div>
          <h2 className="ss-h2">Available plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map(p => (
              <div key={p.id} className="ss-card flex flex-col">
                <p className="font-semibold text-lg">{p.name}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight">PKR {(p.priceCents / 100).toFixed(0)}</p>
                <p className="text-xs text-[var(--fg-dim)] mb-4">per {p.interval}</p>
                <button onClick={() => subscribe(p.id)} className="ss-btn ss-btn-primary mt-auto">Choose {p.name}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}