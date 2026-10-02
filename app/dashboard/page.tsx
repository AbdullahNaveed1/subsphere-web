'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, clearAuth } from '@/lib/api';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return; }
    api.get('/dashboard/summary').then((r) => setData(r.data)).catch((e: any) => {
      if (e && e.response && e.response.status === 401) { clearAuth(); router.push('/login'); }
      else { setError((e && e.response && e.response.data && e.response.data.message) || 'Failed to load'); }
    });
  }, [router]);
  function logout() { clearAuth(); router.push('/login'); }
  if (error) return <main className='p-6'>{error}</main>;
  if (!data) return <main className='p-6'>Loading...</main>;
  return (<main className='p-6 max-w-3xl mx-auto space-y-6'><div className='flex justify-between items-center'><h1 className='text-2xl font-bold'>{data.org && data.org.name}</h1><button onClick={logout} className='text-sm text-gray-600'>Logout</button></div><nav className='flex gap-4 text-sm'><a href='/dashboard' className='font-semibold'>Dashboard</a><a href='/billing'>Billing</a><a href='/invoices'>Invoices</a></nav><div className='grid grid-cols-3 gap-4'><div className='border p-4 rounded'><p className='text-xs text-gray-500'>Plan</p><p className='text-lg font-semibold'>{(data.subscription && data.subscription.plan && data.subscription.plan.name) || 'None'}</p></div><div className='border p-4 rounded'><p className='text-xs text-gray-500'>MRR</p><p className='text-lg font-semibold'>PKR {(data.metrics.mrrCents / 100).toFixed(2)}</p></div><div className='border p-4 rounded'><p className='text-xs text-gray-500'>Unpaid</p><p className='text-lg font-semibold'>PKR {(data.metrics.unpaidTotalCents / 100).toFixed(2)}</p></div></div></main>);
}
