'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Header } from '@/components/Header';

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
    } catch (err: any) { setMsg(err?.response?.data?.message || 'Failed'); }
  }

  async function remove(id: string) {
    if (!confirm('Delete customer?')) return;
    await api.delete('/v1/customers/' + id);
    load();
  }

  return (
    <main className="min-h-screen">
      <Header active="/customers" />
      <div className="w-full px-6 sm:px-8 py-6 sm:py-8 space-y-6">
        <div>
          <h1 className="ss-h1">Customers</h1>
          <p className="ss-sub">Every customer your organization has records for</p>
        </div>

        {msg && <div className="ss-badge-accent p-3 rounded-lg text-sm">{msg}</div>}

        <form onSubmit={create} className="ss-card space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="ss-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className="ss-input" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <button className="ss-btn ss-btn-primary">Add customer</button>
        </form>

        <section className="ss-card">
          <h2 className="ss-h2">All customers</h2>
          {list.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">No customers yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="ss-table min-w-[500px]">
                <thead>
                  <tr><th>Email</th><th>Name</th><th>Created</th><th></th></tr>
                </thead>
                <tbody>
                  {list.map(c => (
                    <tr key={c.id}>
                      <td>{c.email}</td>
                      <td>{c.name || '—'}</td>
                      <td className="text-[var(--fg-dim)] text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td><button onClick={() => remove(c.id)} className="ss-btn ss-btn-danger text-xs px-2 py-1">Delete</button></td>
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