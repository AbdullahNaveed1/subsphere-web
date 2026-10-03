'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Refunds() {
  const [list, setList] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentId, setPaymentId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    const r = await api.get('/refunds');
    const p = await api.get('/payments');
    setList(r.data);
    setPayments(p.data.filter((x: any) => x.status === 'succeeded'));
  }
  useEffect(() => { load(); }, []);

  async function create(e: any) {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/refunds', { paymentId, amount: Number(amount), reason });
      setMsg('Refund created');
      setAmount(''); setReason('');
      load();
    } catch (e: any) {
      setMsg(e?.response?.data?.message || 'Failed');
    }
  }

  return (
    <main className='p-6 max-w-4xl mx-auto space-y-6'>
      <nav className='flex gap-4 text-sm'>
        <a href='/dashboard'>Dashboard</a>
        <a href='/refunds' className='font-semibold'>Refunds</a>
      </nav>
      <h1 className='text-2xl font-bold'>Refunds</h1>
      {msg && <p className='text-sm text-blue-600'>{msg}</p>}
      <form onSubmit={create} className='border p-4 rounded space-y-3'>
        <select className='w-full border p-2 rounded' value={paymentId} onChange={e => setPaymentId(e.target.value)}>
          <option value=''>-- select payment --</option>
          {payments.map(p => <option key={p.id} value={p.id}>{p.id.slice(0,12)} - PKR {(p.amount/100).toFixed(2)}</option>)}
        </select>
        <input className='w-full border p-2 rounded' placeholder='Amount (paisa)' value={amount} onChange={e => setAmount(e.target.value)} />
        <input className='w-full border p-2 rounded' placeholder='Reason (optional)' value={reason} onChange={e => setReason(e.target.value)} />
        <button className='bg-black text-white px-4 py-2 rounded text-sm'>Create refund</button>
      </form>
      <section className='border p-4 rounded'>
        <h2 className='font-semibold mb-3'>Recent refunds</h2>
        {list.length === 0 && <p className='text-sm text-gray-500'>None yet.</p>}
        {list.map(r => (
          <div key={r.id} className='flex justify-between text-sm border-b py-2'>
            <code>{r.id.slice(0,12)}</code>
            <span>PKR {(r.amount/100).toFixed(2)}</span>
            <span>{r.status}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
