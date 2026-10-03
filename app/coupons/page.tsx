'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function CouponsPage() {
  const [list, setList] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [type, setType] = useState('percent');
  const [value, setValue] = useState('');
  const [max, setMax] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    const r = await api.get('/coupons').catch(() => ({ data: [] }));
    setList(r.data);
  }
  useEffect(() => { load(); }, []);

  async function create(e: any) {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/coupons', {
        code,
        discountType: type,
        discountValue: Number(value),
        maxRedemptions: max ? Number(max) : undefined,
      });
      setMsg('Coupon created');
      setCode(''); setValue(''); setMax('');
      load();
    } catch (err: any) { setMsg(err?.response?.data?.message || 'Failed'); }
  }

  async function revoke(id: string) {
    if (!confirm('Revoke coupon?')) return;
    await api.delete('/coupons/' + id);
    load();
  }

  return (
    <main className='p-6 max-w-4xl mx-auto space-y-6'>
      <nav className='flex gap-4 text-sm'>
        <a href='/dashboard'>Dashboard</a>
        <a href='/coupons' className='font-semibold'>Coupons</a>
      </nav>
      <h1 className='text-2xl font-bold'>Coupons</h1>
      {msg && <p className='text-sm text-blue-600'>{msg}</p>}
      <form onSubmit={create} className='border p-4 rounded space-y-3'>
        <input className='w-full border p-2 rounded' placeholder='Code (e.g. LAUNCH20)' value={code} onChange={e => setCode(e.target.value)} />
        <div className='flex gap-3'>
          <select className='border p-2 rounded' value={type} onChange={e => setType(e.target.value)}>
            <option value='percent'>Percent off</option>
            <option value='amount'>Fixed amount (paisa)</option>
          </select>
          <input className='border p-2 rounded flex-1' placeholder={type === 'percent' ? '20' : '5000'} value={value} onChange={e => setValue(e.target.value)} />
          <input className='border p-2 rounded flex-1' placeholder='Max redemptions (optional)' value={max} onChange={e => setMax(e.target.value)} />
        </div>
        <button className='bg-black text-white px-4 py-2 rounded text-sm'>Create coupon</button>
      </form>
      <section className='border p-4 rounded'>
        {list.length === 0 && <p className='text-sm text-gray-500'>No coupons yet.</p>}
        {list.map(c => (
          <div key={c.id} className='flex justify-between items-center text-sm border-b py-2 gap-3'>
            <code className='font-bold'>{c.code}</code>
            <span>{c.discountType === 'percent' ? c.discountValue + '%' : 'PKR ' + (c.discountValue / 100).toFixed(2)}</span>
            <span className='text-xs text-gray-500'>{c.redemptions}{c.maxRedemptions ? '/' + c.maxRedemptions : ''} used</span>
            <span className={c.active ? 'text-green-600' : 'text-gray-400'}>{c.active ? 'active' : 'revoked'}</span>
            {c.active && <button onClick={() => revoke(c.id)} className='text-xs text-red-600'>Revoke</button>}
          </div>
        ))}
      </section>
    </main>
  );
}