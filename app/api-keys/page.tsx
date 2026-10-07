'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Header } from '@/components/Header';

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
    <main className="min-h-screen">
      <Header active="/api-keys" />
      <div className="w-full px-6 sm:px-8 py-6 sm:py-8 space-y-6">
        <div>
          <h1 className="ss-h1">API keys</h1>
          <p className="ss-sub">Authenticate your requests with test and live keys</p>
        </div>

        {msg && <div className="ss-badge-danger p-3 rounded-lg text-sm">{msg}</div>}

        {newKey && (
          <div className="ss-badge-warn p-3 rounded-lg">
            <p className="font-medium mb-1">Copy now — shown once</p>
            <code className="ss-code break-all">{newKey}</code>
          </div>
        )}

        <form onSubmit={create} className="ss-card space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="ss-input" placeholder="Key name" value={name} onChange={e => setName(e.target.value)} required />
            <select className="ss-input" value={mode} onChange={e => setMode(e.target.value)}>
              <option value='test'>test</option>
              <option value='live'>live</option>
            </select>
          </div>
          <div>
            <p className="text-xs text-[var(--fg-dim)] uppercase tracking-wider mb-2">Scopes</p>
            <div className="flex flex-wrap gap-2">
              {ALL_SCOPES.map(s => (
                <button
                  type='button'
                  key={s}
                  onClick={() => toggle(s)}
                  className={'text-xs px-3 py-1 rounded-full border transition ' +
                    (scopes.includes(s)
                      ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                      : 'border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-hover)]')}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button className="ss-btn ss-btn-primary">Create key</button>
        </form>

        <section className="ss-card">
          <h2 className="ss-h2">All keys</h2>
          {keys.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">No keys yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="ss-table min-w-[700px]">
                <thead>
                  <tr><th>Name</th><th>Prefix</th><th>Mode</th><th>Scopes</th><th></th></tr>
                </thead>
                <tbody>
                  {keys.map(k => (
                    <tr key={k.id}>
                      <td>{k.name}</td>
                      <td><span className="ss-code">{k.prefix}</span></td>
                      <td><span className={'ss-badge ' + (k.mode === 'live' ? 'ss-badge-danger' : 'ss-badge-accent')}>{k.mode}</span></td>
                      <td className="text-xs text-[var(--fg-muted)]">{k.scopes}</td>
                      <td><button onClick={() => revoke(k.id)} className="ss-btn ss-btn-danger text-xs px-2 py-1">Revoke</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}