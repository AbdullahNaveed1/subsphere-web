'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const ALL_SCOPES = ['payments:read','payments:write','refunds:read','refunds:write','customers:read','customers:write'];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [mode, setMode] = useState('test');
  const [scopes, setScopes] = useState<string[]>(['payments:read','payments:write']);
  const [newKey, setNewKey] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    const r = await api.get('/api-keys').catch(() => ({ data: [] }));
    setKeys(r.data);
  }
  useEffect(() => { load(); }, []);

  function toggle(s: string) {
    setScopes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  async function create(e: any) {
    e.preventDefault();
    setMsg('');
    try {
      const r = await api.post('/api-keys', { name, mode, scopes });
      setNewKey(r.data.rawKey);
      setName('');
      load();
    } catch (err: any) { setMsg(err?.response?.data?.message || 'Failed'); }
  }

  async function revoke(id: string) {
    if (!confirm('Revoke this key?')) return;
    await api.delete('/api-keys/' + id);
    load();
  }

  return (
    <main className='p-6 max-w-4xl mx-auto space-y-6'>
      <nav className='flex gap-4 text-sm'>
        <a href='/dashboard'>Dashboard</a>
        <a href='/api-keys' className='font-semibold'>API keys</a>
      </nav>
      <h1 className='text-2xl font-bold'>API keys</h1>
      {msg && <p className='text-sm text-red-600'>{msg}</p>}
      {newKey && (
        <div className='bg-yellow-50 border border-yellow-300 p-3 rounded text-xs'>
          <p className='font-semibold mb-1'>Copy now - shown once:</p>
          <code className='break-all'>{newKey}</code>
        </div>
      )}
      <form onSubmit={create} className='border p-4 rounded space-y-3'>
        <input className='w-full border p-2 rounded' placeholder='Key name' value={name} onChange={e => setName(e.target.value)} />
        <select className='w-full border p-2 rounded' value={mode} onChange={e => setMode(e.target.value)}>
          <option value='test'>test</option>
          <option value='live'>live</option>
        </select>
        <div className='text-xs text-gray-500'>Scopes</div>
        <div className='flex flex-wrap gap-2'>
          {ALL_SCOPES.map(s => (
            <button type='button' key={s} onClick={() => toggle(s)} className={scopes.includes(s) ? 'text-xs px-2 py-1 rounded border bg-black text-white' : 'text-xs px-2 py-1 rounded border'}>
              {s}
            </button>
          ))}
        </div>
        <button className='bg-black text-white px-4 py-2 rounded text-sm'>Create key</button>
      </form>
      <section className='border p-4 rounded'>
        {keys.length === 0 && <p className='text-sm text-gray-500'>No keys yet.</p>}
        {keys.map(k => (
          <div key={k.id} className='flex justify-between items-center text-sm border-b py-2'>
            <span>{k.name}</span>
            <code className='text-gray-500'>{k.prefix}</code>
            <span className={k.mode === 'live' ? 'text-red-600' : 'text-blue-600'}>{k.mode}</span>
            <span className='text-xs text-gray-500'>{k.scopes}</span>
            <button onClick={() => revoke(k.id)} className='text-xs text-red-600'>Revoke</button>
          </div>
        ))}
      </section>
    </main>
  );
}
