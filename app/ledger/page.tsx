'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function LedgerPage() {
  const [balance, setBalance] = useState(0);
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    api.get('/ledger/balance').then(r => setBalance(r.data.balanceCents)).catch(() => {});
    api.get('/ledger/entries?limit=50').then(r => setEntries(r.data)).catch(() => {});
  }, []);

  return (
    <main className='p-6 max-w-4xl mx-auto space-y-6'>
      <nav className='flex gap-4 text-sm'>
        <a href='/dashboard'>Dashboard</a>
        <a href='/ledger' className='font-semibold'>Ledger</a>
      </nav>
      <h1 className='text-2xl font-bold'>Ledger</h1>

      <div className='border p-6 rounded'>
        <p className='text-xs text-gray-500'>Current balance</p>
        <p className='text-3xl font-bold'>PKR {(balance / 100).toFixed(2)}</p>
      </div>

      <section className='border p-4 rounded'>
        <h2 className='font-semibold mb-3'>Entries</h2>
        {entries.length === 0 && <p className='text-sm text-gray-500'>No entries yet.</p>}
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b text-left text-xs text-gray-500'>
              <th className='p-2'>Type</th>
              <th className='p-2'>Amount</th>
              <th className='p-2'>Balance</th>
              <th className='p-2'>Description</th>
              <th className='p-2'>Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className='border-b'>
                <td className='p-2'>{e.type}</td>
                <td className={e.amountCents >= 0 ? 'p-2 text-green-600' : 'p-2 text-red-600'}>
                  {e.amountCents >= 0 ? '+' : ''}PKR {(e.amountCents / 100).toFixed(2)}
                </td>
                <td className='p-2'>PKR {(e.balanceAfter / 100).toFixed(2)}</td>
                <td className='p-2 text-gray-500 text-xs'>{e.description || '-'}</td>
                <td className='p-2 text-gray-400 text-xs'>{new Date(e.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}