'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Invoices() {
  const [list, setList] = useState<any[]>([]);
  async function load() { const r = await api.get('/invoices'); setList(r.data); }
  useEffect(() => { load(); }, []);
  async function pay(id: string) { await api.post('/invoices/' + id + '/pay'); load(); }
  return (
    <main className='p-6 max-w-3xl mx-auto space-y-6'>
      <nav className='flex gap-4 text-sm'>
        <a href='/dashboard'>Dashboard</a>
        <a href='/billing'>Billing</a>
        <a href='/invoices' className='font-semibold'>Invoices</a>
      </nav>
      <h1 className='text-2xl font-bold'>Invoices</h1>
      {list.length === 0 && <p className='text-sm text-gray-500'>No invoices yet.</p>}
      <table className='w-full text-sm'>
        <thead><tr className='border-b'><th className='text-left p-2'>Number</th><th className='text-left p-2'>Amount</th><th className='text-left p-2'>Status</th><th></th></tr></thead>
        <tbody>
          {list.map((i) => (
            <tr key={i.id} className='border-b'>
              <td className='p-2'>{i.number}</td>
              <td className='p-2'>PKR {(i.totalCents / 100).toFixed(2)}</td>
              <td className='p-2'>{i.status}</td>
              <td className='p-2'>{i.status !== 'PAID' && <button onClick={() => pay(i.id)} className='text-blue-600'>Mark paid</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
