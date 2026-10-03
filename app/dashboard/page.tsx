'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, clearAuth } from '@/lib/api';

export default function Dashboard() {
  const [keys, setKeys] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [newKey, setNewKey] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function load() {
    const k = await api.get('/api-keys');
    const p = await api.get('/v1/payments').catch(() => ({ data: [] }));
    const w = await api.get('/webhooks/events').catch(() => ({ data: [] }));
    setKeys(k.data);
    setPayments(p.data);
    setEvents(w.data);
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    load();
  }, []);

  async function createKey() {
    const r = await api.post('/api-keys', { name: 'Default', mode: 'test' });
    setNewKey(r.data.rawKey);
    localStorage.setItem('apiKey', r.data.rawKey);
    load();
  }

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

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-3 text-sm">
          <a href="/docs">Docs</a>
          <a href="/refunds">Refunds</a>
          <a href="/checkout">Checkout</a>
          <button onClick={logout} className="text-gray-600">Logout</button>
        </div>
      </div>

      {msg && <p className="text-sm text-blue-600">{msg}</p>}

      <section className="border p-4 rounded">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">API Keys</h2>
          <button onClick={createKey} className="text-sm bg-black text-white px-3 py-1 rounded">New key</button>
        </div>
        {newKey && (
          <div className="bg-yellow-50 border border-yellow-300 p-3 rounded mb-3 text-xs">
            <p className="font-semibold mb-1">Copy this now — shown once:</p>
            <code className="break-all">{newKey}</code>
          </div>
        )}
        {keys.map((k) => (
          <div key={k.id} className="flex justify-between text-sm border-b py-2">
            <span>{k.name}</span>
            <code className="text-gray-500">{k.prefix}</code>
            <span>{k.mode}</span>
          </div>
        ))}
        {keys.length === 0 && <p className="text-sm text-gray-500">No keys yet.</p>}
      </section>

      <section className="border p-4 rounded">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Recent Payments</h2>
          <button onClick={syncPayments} className="text-xs bg-blue-600 text-white px-3 py-1 rounded">Sync status</button>
        </div>
        {payments.length === 0 && <p className="text-sm text-gray-500">No payments yet.</p>}
        {payments.map((p) => (
          <div key={p.id} className="flex justify-between text-sm border-b py-2">
            <code>{p.id.slice(0, 12)}</code>
            <span>PKR {(p.amount / 100).toFixed(2)}</span>
            <span>{p.method}</span>
            <span className={p.status === 'succeeded' ? 'text-green-600' : 'text-gray-500'}>{p.status}</span>
          </div>
        ))}
      </section>

      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-3">Webhook events</h2>
        {events.length === 0 && <p className="text-sm text-gray-500">None yet.</p>}
        {events.map((e) => (
          <div key={e.id} className="flex justify-between text-sm border-b py-2">
            <span>{e.type}</span>
            <span>{e.status}</span>
            <span>attempts: {e.attempts}</span>
          </div>
        ))}
      </section>
    </main>
  );
}