'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

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
    try { await api.post('/subscriptions', { planId }); setMsg('Subscribed'); load(); }
    catch (e: any) { setMsg(e?.response?.data?.message || 'Failed'); }
  }

  async function cancel() {
    if (!confirm('Cancel subscription?')) return;
    await api.delete('/subscriptions/me');
    load();
  }

  return (
    <main className='p-6 max-w-4xl mx-auto space-y-6'>
      <nav className='flex gap-4 text-sm'>
        <a href='/dashboard'>Dashboard</a>
        <a href='/subscriptions' className='font-semibold'>Subscriptions</a>
      </nav>
      <h1 className='text-2xl font-bold'>Subscriptions</h1>
      {msg && <p className='text-sm text-blue-600'>{msg}</p>}
      {sub ? (
        <div className='border p-4 rounded'>
          <p className='text-xs text-gray-500'>Current subscription</p>
          <p className='font-semibold'>{sub.plan?.name}</p>
          <p className='text-sm'>PKR {((sub.plan?.priceCents || 0) / 100).toFixed(2)} / {sub.plan?.interval}</p>
          <p className='text-xs text-gray-500 mt-2'>Status: {sub.status}</p>
          <p className='text-xs text-gray-500'>Renews: {new Date(sub.currentPeriodEnd).toLocaleDateString()}</p>
          <button onClick={cancel} className='mt-3 text-sm text-red-600'>Cancel</button>
        </div>
      ) : (
        <p className='text-sm text-gray-500'>No active subscription.</p>
      )}
      <section>
        <h2 className='font-semibold mb-3'>Available plans</h2>
        <div className='grid grid-cols-3 gap-3'>
          {plans.map(p => (
            <div key={p.id} className='border p-4 rounded space-y-2'>
              <p className='font-semibold'>{p.name}</p>
              <p className='text-sm'>PKR {(p.priceCents / 100).toFixed(2)}/{p.interval}</p>
              <button onClick={() => subscribe(p.id)} className='w-full bg-black text-white p-2 rounded text-sm'>Choose</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
