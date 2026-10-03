'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function CustomersPage() {
  const [list, setList] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    const r = await api.get('/v1/customers').catch(() => ({ data: [] }));
    setList(r.data);
  }
  useEffect(() => { load(); }, []);

  async function create(e: any) {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/v1/customers', { email, name });
      setMsg('Customer created');
      setEmail(''); setName('');
      load();
    } catch (e: any) { setMsg(e?.response?.data?.message || 'Failed'); }
  }

  async function remove(id: string) {
    if (!confirm('Delete customer?')) return;
    await api.delete('/v1/customers/' + id);
    load();
  }

  return (
    <main className='p-6 max-w-4xl mx-auto space-y-6'>
      <nav className='flex gap-4 text-sm'>
        <a href='/dashboard'>Dashboard</a>
        <a href='/customers' className='font-semibold'>Customers</a>
      </nav>
      <h1 className='text-2xl font-bold'>Customers</h1>
      {msg && <p className='text-sm text-blue-600'>{msg}</p>}
      <form onSubmit={create} className='border p-4 rounded space-y-3'>
        <input className='w-full border p-2 rounded' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
        <input className='w-full border p-2 rounded' placeholder='Name (optional)' value={name} onChange={e => setName(e.target.value)} />
        <button className='bg-black text-white px-4 py-2 rounded text-sm'>Add customer</button>
      </form>
      <section className='border p-4 rounded'>
        {list.length === 0 && <p className='text-sm text-gray-500'>No customers yet.</p>}
        {list.map(c => (
          <div key={c.id} className='flex justify-between items-center text-sm border-b py-2'>
            <span>{c.email}</span>
            <span>{c.name || '-'}</span>
            <button onClick={() => remove(c.id)} className='text-xs text-red-600'>Delete</button>
          </div>
        ))}
      </section>
    </main>
  );
}
