'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, clearAuth } from '@/lib/api';

export default function Dashboard() {
  const [revenue, setRevenue] = useState<any>(null);
  const [sub, setSub] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
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

  async function syncPayments() {
    setMsg('Syncing...');
    try {
      const r = await api.post('/v1/payments/sync');
      setMsg('Synced: ' + r.data.updated.length + ' updated / ' + r.data.checked + ' checked');
      load();
    } catch (e: any) {
      setMsg('Sync failed: ' + (e?.response?.data?.message || e.message));
    }
  }

  function logout() {
    clearAuth();
    router.push('/login');
  }

  const nav = [
    ['Subscriptions', '/subscriptions'],
    ['Customers', '/customers'],
    ['Payment links', '/payment-links'],
    ['Coupons', '/coupons'],
    ['API keys', '/api-keys'],
    ['Webhooks', '/webhooks'],
    ['Refunds', '/refunds'],
    ['Invoices', '/invoices'],
    ['Revenue', '/revenue'],
    ['Docs', '/docs'],
  ];

  return (
    <main className='p-6 max-w-5xl mx-auto space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
        <button onClick={logout} className='text-sm text-gray-600'>Logout</button>
      </div>

      <nav className='flex flex-wrap gap-3 text-sm'>
        {nav.map(([label, href]) => (
          <a key={href} href={href} className='border px-3 py-1 rounded hover:bg-gray-50'>{label}</a>
        ))}
      </nav>

      {msg && <p className='text-sm text-blue-600'>{msg}</p>}

      <section className='grid grid-cols-4 gap-3'>
        <div className='border p-4 rounded'>
          <p className='text-xs text-gray-500'>Revenue (all time)</p>
          <p className='text-xl font-bold'>PKR {((revenue?.totalCents || 0) / 100).toFixed(2)}</p>
        </div>
        <div className='border p-4 rounded'>
          <p className='text-xs text-gray-500'>Last 30d</p>
          <p className='text-xl font-bold'>PKR {((revenue?.last30Cents || 0) / 100).toFixed(2)}</p>
        </div>
        <div className='border p-4 rounded'>
          <p className='text-xs text-gray-500'>Payments</p>
          <p className='text-xl font-bold'>{revenue?.counts?.payments || 0}</p>
        </div>
        <div className='border p-4 rounded'>
          <p className='text-xs text-gray-500'>Failed</p>
          <p className='text-xl font-bold text-red-600'>{revenue?.counts?.failed || 0}</p>
        </div>
      </section>

      <section className='border p-4 rounded'>
        <h2 className='font-semibold mb-2'>Current subscription</h2>
        {sub ? (
          <div>
            <p className='font-semibold'>{sub.plan?.name} — PKR {((sub.plan?.priceCents || 0) / 100).toFixed(2)}/{sub.plan?.interval}</p>
            <p className='text-xs text-gray-500 mt-1'>Status: {sub.status} • Renews {new Date(sub.currentPeriodEnd).toLocaleDateString()}</p>
          </div>
        ) : (
          <p className='text-sm text-gray-500'>No active subscription. <a href='/subscriptions' className='text-blue-600 underline'>Choose a plan</a></p>
        )}
      </section>

      <section className='border p-4 rounded'>
        <div className='flex justify-between items-center mb-3'>
          <h2 className='font-semibold'>Recent payments</h2>
          <button onClick={syncPayments} className='text-xs bg-blue-600 text-white px-3 py-1 rounded'>Sync status</button>
        </div>
        {payments.length === 0 && <p className='text-sm text-gray-500'>No payments yet.</p>}
        {payments.map((p) => (
          <div key={p.id} className='flex justify-between text-sm border-b py-2'>
            <code>{p.id.slice(0, 12)}</code>
            <span>PKR {(p.amount / 100).toFixed(2)}</span>
            <span>{p.method}</span>
            <span className={p.status === 'succeeded' ? 'text-green-600' : p.status === 'failed' ? 'text-red-600' : 'text-gray-500'}>{p.status}</span>
          </div>
        ))}
      </section>

      <section className='border p-4 rounded'>
        <h2 className='font-semibold mb-3'>Recent webhook events</h2>
        {events.length === 0 && <p className='text-sm text-gray-500'>None yet.</p>}
        {events.map((e) => (
          <div key={e.id} className='flex justify-between text-sm border-b py-2'>
            <span>{e.type}</span>
            <span>{e.status}</span>
            <span>attempts: {e.attempts}</span>
          </div>
        ))}
      </section>
    </main>
  );
}