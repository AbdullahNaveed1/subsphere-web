'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Header } from '@/components/Header';

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
    <main className="min-h-screen">
      <Header active="/webhooks" />
      <div className="w-full px-6 sm:px-8 py-6 sm:py-8 space-y-6">
        <div>
          <h1 className="ss-h1">Webhooks</h1>
          <p className="ss-sub">Receive HMAC-signed events when things happen</p>
        </div>

        {msg && <div className="ss-badge-accent p-3 rounded-lg text-sm">{msg}</div>}

        <form onSubmit={save} className="ss-card space-y-3">
          <div>
            <label className="text-xs text-[var(--fg-dim)] uppercase tracking-wider block mb-2">Endpoint URL</label>
            <input className="ss-input" placeholder="https://example.com/webhook" value={url} onChange={e => setUrl(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs text-[var(--fg-dim)] uppercase tracking-wider block mb-2">Events (comma-separated, or * for all)</label>
            <input className="ss-input" value={events} onChange={e => setEvents(e.target.value)} />
          </div>
          <button className="ss-btn ss-btn-primary">Save endpoint</button>
        </form>

        {endpoint && endpoint.secret && (
          <div className="ss-badge-warn p-4 rounded-lg">
            <p className="font-medium mb-2">Signing secret</p>
            <p className="text-xs text-[var(--fg-muted)] mb-2">Use this to verify the X-SubSphere-Signature header:</p>
            <code className="ss-code break-all">{endpoint.secret}</code>
          </div>
        )}

        <section className="ss-card">
          <h2 className="ss-h2">Recent deliveries</h2>
          {list.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">None yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="ss-table min-w-[600px]">
                <thead>
                  <tr><th>Event</th><th>Status</th><th>Attempts</th><th></th></tr>
                </thead>
                <tbody>
                  {list.map(e => (
                    <tr key={e.id}>
                      <td><span className="ss-code">{e.type}</span></td>
                      <td><span className={'ss-badge ' + (e.status === 'delivered' ? 'ss-badge-success' : e.status === 'failed' ? 'ss-badge-danger' : 'ss-badge-warn')}>{e.status}</span></td>
                      <td>{e.attempts}</td>
                      <td><button onClick={() => replay(e.id)} className="ss-btn text-xs px-2 py-1">Replay</button></td>
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