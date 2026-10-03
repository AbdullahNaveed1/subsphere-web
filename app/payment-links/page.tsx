'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function PaymentLinksPage() {
  const [list, setList] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [method, setMethod] = useState('card');
  const [msg, setMsg] = useState('');

  async function load() {
    const r = await api.get('/payment-links').catch(() => ({ data: [] }));
    setList(r.data);
  }
  useEffect(() => { load(); }, []);

  async function create(e: any) {
    e.preventDefault();
    setMsg('');
    try {
      const r = await api.post('/payment-links', { amount: Number(amount), description, method });
      setMsg('Link created: ' + r.data.url);
      setAmount(''); setDescription('');
      load();
    } catch (err: any) { setMsg(err?.response?.data?.message || 'Failed'); }
  }

  async function revoke(id: string) {
    if (!confirm('Revoke this link?')) return;
    await api.delete('/payment-links/' + id);
    load();
  }

  return (
    <main className='p-6 max-w-4xl mx-auto space-y-6'>
      <nav className='flex gap-4 text-sm'>
        <a href='/dashboard'>Dashboard</a>
        <a href='/payment-links' className='font-semibold'>Payment links</a>
      </nav>
      <h1 className='text-2xl font-bold'>Payment links</h1>
      {msg && <p className='text-sm text-blue-600 break-all'>{msg}</p>}
      <form onSubmit={create} className='border p-4 rounded space-y-3'>
        <input className='w-full border p-2 rounded' placeholder='Amount in paisa (e.g. 5000 = PKR 50)' value={amount} onChange={e => setAmount(e.target.value)} />
        <input className='w-full border p-2 rounded' placeholder='Description (optional)' value={description} onChange={e => setDescription(e.target.value)} />
        <select className='w-full border p-2 rounded' value={method} onChange={e => setMethod(e.target.value)}>
          <option value='card'>Card</option>
          <option value='raast'>Raast</option>
          <option value='jazzcash'>JazzCash</option>
          <option value='easypaisa'>Easypaisa</option>
        </select>
        <button className='bg-black text-white px-4 py-2 rounded text-sm'>Create link</button>
      </form>
      <section className='border p-4 rounded'>
        {list.length === 0 && <p className='text-sm text-gray-500'>No links yet.</p>}
        {list.map(l => (
          <div key={l.id} className='flex justify-between items-center text-sm border-b py-2 gap-3'>
            <code className='text-xs'>/pay/{l.token.slice(0, 10)}...</code>
            <span>PKR {(l.amount / 100).toFixed(2)}</span>
            <span className='text-xs'>{l.method}</span>
            <span className='text-xs text-gray-500'>used {l.timesUsed}x</span>
            <span className={l.active ? 'text-green-600' : 'text-gray-400'}>{l.active ? 'active' : 'revoked'}</span>
            {l.active && <button onClick={() => revoke(l.id)} className='text-xs text-red-600'>Revoke</button>}
          </div>
        ))}
      </section>
    </main>
  );
}