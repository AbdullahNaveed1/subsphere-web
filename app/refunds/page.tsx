'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Header } from '@/components/Header';

export default function Refunds() {
  const [list, setList] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentId, setPaymentId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    const r = await api.get('/refunds');
    const p = await api.get('/payments');
    setList(r.data);
    setPayments(p.data.filter((x: any) => x.status === 'succeeded'));
  }
  useEffect(() => { load(); }, []);

  async function create(e: any) {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/refunds', { paymentId, amount: Number(amount), reason });
      setMsg('Refund created');
      setAmount(''); setReason('');
      load();
    } catch (e: any) { setMsg(e?.response?.data?.message || 'Failed'); }
  }

  return (
    <main className="min-h-screen">
      <Header active="/refunds" />
      <div className="w-full px-6 sm:px-8 py-6 sm:py-8 space-y-6">
        <div>
          <h1 className="ss-h1">Refunds</h1>
          <p className="ss-sub">Return funds to your customers</p>
        </div>

        {msg && <div className="ss-badge-accent p-3 rounded-lg text-sm">{msg}</div>}

        <form onSubmit={create} className="ss-card space-y-3">
          <select className="ss-input" value={paymentId} onChange={e => setPaymentId(e.target.value)} required>
            <option value=''>— select a succeeded payment —</option>
            {payments.map(p => <option key={p.id} value={p.id}>{p.id.slice(0,12)} — PKR {(p.amount/100).toFixed(2)}</option>)}
          </select>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="ss-input" placeholder='Amount in paisa' value={amount} onChange={e => setAmount(e.target.value)} required />
            <input className="ss-input" placeholder='Reason (optional)' value={reason} onChange={e => setReason(e.target.value)} />
          </div>
          <button className="ss-btn ss-btn-primary">Create refund</button>
        </form>

        <section className="ss-card">
          <h2 className="ss-h2">Recent refunds</h2>
          {list.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">None yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="ss-table min-w-[500px]">
                <thead>
                  <tr><th>ID</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {list.map(r => (
                    <tr key={r.id}>
                      <td><span className="ss-code">{r.id.slice(0,12)}</span></td>
                      <td>PKR {(r.amount/100).toFixed(2)}</td>
                      <td><span className={'ss-badge ' + (r.status === 'succeeded' ? 'ss-badge-success' : r.status === 'failed' ? 'ss-badge-danger' : 'ss-badge-warn')}>{r.status}</span></td>
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