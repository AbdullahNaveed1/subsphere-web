'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PayPage() {
  const params = useParams();
  const token = params?.token as string;
  const [link, setLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:3001/api/pay/' + token)
      .then(r => r.json())
      .then(setLink)
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function pay() {
    setWorking(true);
    setErr('');
    try {
      const r = await fetch('http://localhost:3001/api/pay/' + token + '/pay', { method: 'POST' });
      const out = await r.json();
      if (!r.ok) throw new Error(out.message || 'Payment failed');
      setDone(true);
    } catch (e: any) { setErr(e.message); }
    setWorking(false);
  }

  if (loading) return <main className="p-6">Loading...</main>;
  if (err && !link) return <main className="p-6 text-red-600">{err}</main>;
  if (!link) return <main className="p-6">Link not found</main>;

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded border">
          <p className="text-4xl mb-4">✓</p>
          <h1 className="text-xl font-bold">Paid</h1>
          <p className="text-sm text-gray-500 mt-2">Thank you</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border rounded p-6 space-y-4">
        <h1 className="text-xl font-bold">Pay</h1>
        {link.description && <p className="text-sm text-gray-600">{link.description}</p>}
        <div className="border-b pb-3">
          <p className="text-xs text-gray-500">Amount</p>
          <p className="text-2xl font-bold">PKR {(link.amount / 100).toFixed(2)}</p>
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button disabled={working} onClick={pay} className="w-full bg-black text-white p-3 rounded font-medium">
          {working ? 'Processing...' : 'Pay now'}
        </button>
      </div>
    </main>
  );
}