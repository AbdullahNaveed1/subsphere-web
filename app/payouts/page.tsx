'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Header } from '@/components/Header';

export default function PayoutsPage() {
  const [list, setList] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [method, setMethod] = useState('raast');
  const [balance, setBalance] = useState(0);
  const [msg, setMsg] = useState('');

  async function load() {
    const r = await api.get('/v1/payouts').catch(() => ({ data: [] }));
    const b = await api.get('/ledger/balance').catch(() => ({ data: { balanceCents: 0 } }));
    setList(r.data);
    setBalance(b.data.balanceCents);
  }
  useEffect(() => { load(); }, []);

  async function create(e: any) {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/v1/payouts', { amountCents: Number(amount), destination, method });
      setMsg('Payout requested');
      setAmount(''); setDestination('');
      load();
    } catch (err: any) { setMsg(err?.response?.data?.message || 'Failed'); }
  }

  return (
    <main className="min-h-screen">
      <Header active="/payouts" />
      <div className="w-full px-6 sm:px-8 py-6 sm:py-8 space-y-6">
        <div>
          <h1 className="ss-h1">Payouts</h1>
          <p className="ss-sub">Send funds to Raast IDs or bank accounts</p>
        </div>

        <div className="ss-card">
          <p className="ss-kpi-label">Available balance</p>
          <p className="ss-kpi-value">PKR {(balance / 100).toFixed(2)}</p>
        </div>

        {msg && <div className="ss-badge-accent p-3 rounded-lg text-sm">{msg}</div>}

        <form onSubmit={create} className="ss-card space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="ss-input" placeholder="Amount in paisa" value={amount} onChange={e => setAmount(e.target.value)} required />
            <input className="ss-input" placeholder="IBAN or Raast ID" value={destination} onChange={e => setDestination(e.target.value)} required />
          </div>
          <select className="ss-input" value={method} onChange={e => setMethod(e.target.value)}>
            <option value='raast'>Raast</option>
            <option value='iban'>IBAN bank transfer</option>
          </select>
          <button className="ss-btn ss-btn-primary">Request payout</button>
        </form>

        <section className="ss-card">
          <h2 className="ss-h2">All payouts</h2>
          {list.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">No payouts yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="ss-table min-w-[600px]">
                <thead>
                  <tr><th>Reference</th><th>Amount</th><th>Destination</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {list.map(p => (
                    <tr key={p.id}>
                      <td><span className="ss-code">{p.reference}</span></td>
                      <td>PKR {(p.amountCents / 100).toFixed(2)}</td>
                      <td className="text-[var(--fg-muted)] text-xs">{p.destination.slice(0, 24)}…</td>
                      <td><span className={'ss-badge ' + (p.status === 'paid' ? 'ss-badge-success' : 'ss-badge-warn')}>{p.status}</span></td>
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