'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CheckoutSession() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [method, setMethod] = useState('card');
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:3001/api/checkout/' + token)
      .then(r => r.json())
      .then(setData)
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function pay() {
    setWorking(true);
    try {
      const r = await fetch('http://localhost:3001/api/checkout/' + token + '/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcome: 'succeeded' }),
      });
      const out = await r.json();
      if (!r.ok) throw new Error(out.message || 'Payment failed');
      router.push('/checkout/' + token + '/success');
    } catch (e: any) {
      setErr(e.message);
    }
    setWorking(false);
  }

  async function cancel() {
    await fetch('http://localhost:3001/api/checkout/' + token + '/cancel', { method: 'POST' });
    router.push('/checkout/' + token + '/cancelled');
  }

  if (loading) return <main className="p-6">Loading...</main>;
  if (err && !data) return <main className="p-6 text-red-600">{err}</main>;
  if (!data) return <main className="p-6">Not found</main>;

  const s = data.session;
  const p = data.payment;
  if (s.status !== 'open') {
    return (
      <main className="p-6 max-w-md mx-auto">
        <h1 className="text-xl font-bold">Session {s.status}</h1>
        <p className="text-sm text-gray-600 mt-2">This checkout session is no longer active.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border rounded p-6 space-y-4">
        <h1 className="text-xl font-bold">Checkout</h1>
        <div className="border-b pb-3">
          <p className="text-xs text-gray-500">Amount</p>
          <p className="text-2xl font-bold">PKR {(p.amount / 100).toFixed(2)}</p>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Payment method</label>
          <select className="w-full border p-2 rounded" value={method} onChange={e => setMethod(e.target.value)}>
            <option value="card">Card</option>
            <option value="raast">Raast</option>
            <option value="jazzcash">JazzCash</option>
            <option value="easypaisa">Easypaisa</option>
          </select>
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button disabled={working} onClick={pay} className="w-full bg-black text-white p-3 rounded font-medium">
          {working ? 'Processing...' : 'Pay PKR ' + (p.amount / 100).toFixed(2)}
        </button>
        <button disabled={working} onClick={cancel} className="w-full text-sm text-gray-600">
          Cancel
        </button>
      </div>
    </main>
  );
}