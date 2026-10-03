'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function RevenuePage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    api.get('/analytics/revenue').then(r => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <main className='p-6'>Loading...</main>;
  const max = Math.max(1, ...data.daily.map((d: any) => d.cents));

  return (
    <main className='p-6 max-w-4xl mx-auto space-y-6'>
      <nav className='flex gap-4 text-sm'>
        <a href='/dashboard'>Dashboard</a>
        <a href='/revenue' className='font-semibold'>Revenue</a>
      </nav>
      <h1 className='text-2xl font-bold'>Revenue</h1>
      <div className='grid grid-cols-4 gap-3'>
        <div className='border p-4 rounded'>
          <p className='text-xs text-gray-500'>All time</p>
          <p className='text-xl font-bold'>PKR {(data.totalCents / 100).toFixed(2)}</p>
        </div>
        <div className='border p-4 rounded'>
          <p className='text-xs text-gray-500'>Last 30d</p>
          <p className='text-xl font-bold'>PKR {(data.last30Cents / 100).toFixed(2)}</p>
        </div>
        <div className='border p-4 rounded'>
          <p className='text-xs text-gray-500'>Last 7d</p>
          <p className='text-xl font-bold'>PKR {(data.last7Cents / 100).toFixed(2)}</p>
        </div>
        <div className='border p-4 rounded'>
          <p className='text-xs text-gray-500'>Refunded</p>
          <p className='text-xl font-bold text-red-600'>PKR {(data.refundedCents / 100).toFixed(2)}</p>
        </div>
      </div>
      <section className='border p-4 rounded'>
        <h2 className='font-semibold mb-3'>Last 14 days</h2>
        <div className='flex items-end gap-1 h-40'>
          {data.daily.map((d: any) => (
            <div key={d.date} className='flex-1 flex flex-col items-center justify-end' title={d.date + ': PKR ' + (d.cents/100).toFixed(2)}>
              <div className='w-full bg-black' style={{ height: (d.cents / max * 140) + 'px' }}></div>
            </div>
          ))}
        </div>
      </section>
      <section className='border p-4 rounded text-sm'>
        <p>Total payments: <span className='font-semibold'>{data.counts.payments}</span></p>
        <p>Failed payments: <span className='font-semibold text-red-600'>{data.counts.failed}</span></p>
      </section>
    </main>
  );
}
