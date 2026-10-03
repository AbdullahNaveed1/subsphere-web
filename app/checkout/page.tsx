'use client';
import { useState } from 'react';

export default function Checkout() {
  const [amount, setAmount] = useState('2500');
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function pay(e: any) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('apiKey');
      if (!apiKey) { setError('No API key. Go to dashboard first.'); setLoading(false); return; }
      const res = await fetch('http://localhost:3001/api/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          'Idempotency-Key': 'chk-' + Date.now(),
        },
        body: JSON.stringify({ amount: Number(amount), method, provider: 'safepay' }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.message || 'No checkout URL returned');
      }
    } catch (err: any) {
      setError(err.message || 'Failed');
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <form onSubmit={pay} className="w-full max-w-sm bg-white p-6 rounded border space-y-4">
        <h1 className="text-xl font-bold">Checkout</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Amount (PKR)</label>
          <input className="w-full border p-2 rounded" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Method</label>
          <select className="w-full border p-2 rounded" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="card">Card</option>
            <option value="raast">Raast</option>
            <option value="jazzcash">JazzCash</option>
            <option value="easypaisa">Easypaisa</option>
          </select>
        </div>
        <button disabled={loading} className="w-full bg-black text-white p-2 rounded">
          {loading ? 'Redirecting...' : 'Pay with Safepay'}
        </button>
        <a href="/dashboard" className="block text-center text-sm text-gray-600">Back to dashboard</a>
      </form>
    </main>
  );
}