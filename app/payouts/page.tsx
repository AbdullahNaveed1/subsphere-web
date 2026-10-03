'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function PayoutsPage() {
  const [list, setList] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [method, setMethod] = useState('raast');
  const [balance, setBalance] = useState(0);
  const [msg, setMsg] = useState('');

  async function load() {
    const r = await api.get('/v1/payouts').catch(() => ({ data: [] }));
    const b = await api.get('/ledger/balance').catch(() => ({ data: { balanceCents: 0 } }));
    setList(r.data);
    setBalance(b.data.balanceCents);
  }
  useEffect(() => { load(); }, []);

  async function create(e: any) {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/v1/payouts', { amountCents: Number(amount), destination, method });
      setMsg('Payout requested');
      setAmount(''); setDestination('');
      load();
    } catch (err: any) { setMsg(err?.response?.data?.message || 'Failed'); }
  }

  return (
    <main className='p-6 max-w-4xl mx-auto space-y-6'>
      <nav className='flex gap-4 text-sm'>
        <a href='/dashboard'>Dashboard</a>
        <a href='/payouts' className='font-semibold'>Payouts</a>
      </nav>
      <h1 className='text-2xl font-bold'>Payouts</h1>
      <div className='border p-4 rounded'>
        <p className='text-xs text-gray-500'>Available balance</p>
        <p className='text-2xl font-bold'>PKR {(balance / 100).toFixed(2)}</p>
      </div>
      {msg && <p className='text-sm text-blue-600'>{msg}</p>}
      <form onSubmit={create} className='border p-4 rounded space-y-3'>
        <input className='w-full border p-2 rounded' placeholder='Amount in paisa (e.g. 50000 = PKR 500)' value={amount} onChange={e => setAmount(e.target.value)} />
        <input className='w-full border p-2 rounded' placeholder='Destination (IBAN or Raast ID)' value={destination} onChange={e => setDestination(e.target.value)} />
        <select className='w-full border p-2 rounded' value={method} onChange={e => setMethod(e.target.value)}>
          <option value='raast'>Raast</option>
          <option value='iban'>IBAN bank transfer</option>
        </select>
        <button className='bg-black text-white px-4 py-2 rounded text-sm'>Request payout</button>
      </form>
      <section className='border p-4 rounded'>
        {list.length === 0 && <p className='text-sm text-gray-500'>No payouts yet.</p>}
        {list.map(p => (
          <div key={p.id} className='flex justify-between items-center text-sm border-b py-2 gap-3'>
            <code className='text-xs'>{p.reference}</code>
            <span>PKR {(p.amountCents / 100).toFixed(2)}</span>
            <span className='text-xs text-gray-500'>{p.destination.slice(0, 20)}...</span>
            <span className={p.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}>{p.status}</span>
          </div>
        ))}
      </section>
    </main>
  );
}