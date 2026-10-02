'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Billing() {
  const [plans, setPlans] = useState<any[]>([]);
  const [sub, setSub] = useState<any>(null);
  const [msg, setMsg] = useState('');
  async function load() {
    const p = await api.get('/plans');
    const s = await api.get('/subscriptions/me').catch(() => ({ data: null }));
    setPlans(p.data);
    setSub(s.data);
  }
  useEffect(() => { load(); }, []);
  async function subscribe(planId: string) {
    setMsg('');
    try { await api.post('/subscriptions', { planId }); setMsg('Subscribed'); load(); }
    catch (e: any) { setMsg((e && e.response && e.response.data && e.response.data.message) || 'Failed'); }
  }
  async function cancel() {
    if (!confirm('Cancel subscription?')) return;
    await api.delete('/subscriptions/me');
    load();
  }
  return (<main className='p-6 max-w-3xl mx-auto space-y-6'><nav className='flex gap-4 text-sm'><a href='/dashboard'>Dashboard</a><a href='/billing' className='font-semibold'>Billing</a><a href='/invoices'>Invoices</a></nav>{msg && <p className='text-sm'>{msg}</p>}{sub && (<div className='border p-4 rounded'><p className='text-xs text-gray-500'>Current</p><p className='font-semibold'>{sub.plan && sub.plan.name} - PKR {((sub.plan && sub.plan.priceCents || 0) / 100).toFixed(2)}/{sub.plan && sub.plan.interval}</p><button onClick={cancel} className='mt-2 text-sm text-red-600'>Cancel</button></div>)}<div className='grid grid-cols-3 gap-4'>{plans.map((p) => (<div key={p.id} className='border p-4 rounded space-y-2'><p className='font-semibold'>{p.name}</p><p>PKR {(p.priceCents / 100).toFixed(2)}/{p.interval}</p><button onClick={() => subscribe(p.id)} className='w-full bg-black text-white p-2 rounded text-sm'>Choose</button></div>))}</div></main>);
}
