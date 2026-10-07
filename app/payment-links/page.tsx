'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Header } from '@/components/Header';

export default function PaymentLinksPage() {
  const [list, setList] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [method, setMethod] = useState('card');
  const [msg, setMsg] = useState('');

  async function load() {
    const r = await api.get('/payment-links').catch(() => ({ data: [] }));
    setList(r.data);
  }
  useEffect(() => { load(); }, []);

  async function create(e: any) {
    e.preventDefault();
    setMsg('');
    try {
      const r = await api.post('/payment-links', { amount: Number(amount), description, method });
      setMsg('Link created: ' + r.data.url);
      setAmount(''); setDescription('');
      load();
    } catch (err: any) { setMsg(err?.response?.data?.message || 'Failed'); }
  }

  async function revoke(id: string) {
    if (!confirm('Revoke this link?')) return;
    await api.delete('/payment-links/' + id);
    load();
  }

  return (
    <main className="min-h-screen">
      <Header active="/payment-links" />
      <div className="w-full px-6 sm:px-8 py-6 sm:py-8 space-y-6">
        <div>
          <h1 className="ss-h1">Payment links</h1>
          <p className="ss-sub">Shareable URLs to collect payments anywhere</p>
        </div>

        {msg && <div className="ss-badge-accent p-3 rounded-lg text-sm break-all">{msg}</div>}

        <form onSubmit={create} className="ss-card space-y-3">
          <input className="ss-input" placeholder="Amount in paisa (e.g. 5000 = PKR 50)" value={amount} onChange={e => setAmount(e.target.value)} required />
          <input className="ss-input" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
          <select className="ss-input" value={method} onChange={e => setMethod(e.target.value)}>
            <option value='card'>Card</option>
            <option value='raast'>Raast</option>
            <option value='jazzcash'>JazzCash</option>
            <option value='easypaisa'>Easypaisa</option>
          </select>
          <button className="ss-btn ss-btn-primary">Create link</button>
        </form>

        <section className="ss-card">
          <h2 className="ss-h2">All links</h2>
          {list.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">No links yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="ss-table min-w-[700px]">
                <thead>
                  <tr><th>Token</th><th>Amount</th><th>Method</th><th>Used</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  {list.map(l => (
                    <tr key={l.id}>
                      <td><span className="ss-code">/pay/{l.token.slice(0, 10)}…</span></td>
                      <td>PKR {(l.amount / 100).toFixed(2)}</td>
                      <td><span className="ss-badge">{l.method}</span></td>
                      <td>{l.timesUsed}x</td>
                      <td><span className={'ss-badge ' + (l.active ? 'ss-badge-success' : '')}>{l.active ? 'active' : 'revoked'}</span></td>
                      <td>{l.active && <button onClick={() => revoke(l.id)} className="ss-btn ss-btn-danger text-xs px-2 py-1">Revoke</button>}</td>
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