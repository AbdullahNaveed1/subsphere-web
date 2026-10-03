'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function WebhooksPage() {
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState('*');
  const [endpoint, setEndpoint] = useState<any>(null);
  const [list, setList] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  async function load() {
    const e = await api.get('/webhooks/endpoint').catch(() => ({ data: null }));
    const l = await api.get('/webhooks/events').catch(() => ({ data: [] }));
    setEndpoint(e.data);
    if (e.data) { setUrl(e.data.url); setEvents(e.data.events); }
    setList(l.data);
  }
  useEffect(() => { load(); }, []);

  async function save(e: any) {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/webhooks/endpoint', { url, events: events.split(',').map(s => s.trim()) });
      setMsg('Saved');
      load();
    } catch (e: any) { setMsg(e?.response?.data?.message || 'Failed'); }
  }

  async function replay(id: string) {
    await api.post('/webhooks/events/' + id + '/replay');
    setMsg('Replayed');
    load();
  }

  return (
    <main className='p-6 max-w-4xl mx-auto space-y-6'>
      <nav className='flex gap-4 text-sm'>
        <a href='/dashboard'>Dashboard</a>
        <a href='/webhooks' className='font-semibold'>Webhooks</a>
      </nav>
      <h1 className='text-2xl font-bold'>Webhooks</h1>
      {msg && <p className='text-sm text-blue-600'>{msg}</p>}
      <form onSubmit={save} className='border p-4 rounded space-y-3'>
        <label className='text-xs text-gray-500'>Endpoint URL</label>
        <input className='w-full border p-2 rounded' value={url} onChange={e => setUrl(e.target.value)} placeholder='https://example.com/webhook' />
        <label className='text-xs text-gray-500'>Events (comma separated or *)</label>
        <input className='w-full border p-2 rounded' value={events} onChange={e => setEvents(e.target.value)} />
        <button className='bg-black text-white px-4 py-2 rounded text-sm'>Save endpoint</button>
      </form>
      {endpoint && endpoint.secret && (
        <div className='bg-yellow-50 border border-yellow-300 p-3 rounded text-xs'>
          <p className='font-semibold mb-1'>Signing secret (use to verify X-SubSphere-Signature):</p>
          <code className='break-all'>{endpoint.secret}</code>
        </div>
      )}
      <section className='border p-4 rounded'>
        <h2 className='font-semibold mb-3'>Recent deliveries</h2>
        {list.length === 0 && <p className='text-sm text-gray-500'>None yet.</p>}
        {list.map(e => (
          <div key={e.id} className='flex justify-between items-center text-sm border-b py-2'>
            <span>{e.type}</span>
            <span>{e.status}</span>
            <span>attempts: {e.attempts}</span>
            <button onClick={() => replay(e.id)} className='text-xs text-blue-600 underline'>Replay</button>
          </div>
        ))}
      </section>
    </main>
  );
}
