'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Header } from '@/components/Header';

export default function Invoices() {
  const [list, setList] = useState<any[]>([]);
  async function load() { const r = await api.get('/invoices'); setList(r.data); }
  useEffect(() => { load(); }, []);
  async function pay(id: string) { await api.post('/invoices/' + id + '/pay'); load(); }

  return (
    <main className="min-h-screen">
      <Header active="/invoices" />
      <div className="w-full px-6 sm:px-8 py-6 sm:py-8 space-y-6">
        <div>
          <h1 className="ss-h1">Invoices</h1>
          <p className="ss-sub">Auto-numbered invoices for your subscriptions</p>
        </div>

        <section className="ss-card">
          {list.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">No invoices yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="ss-table min-w-[600px]">
                <thead>
                  <tr><th>Number</th><th>Amount</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  {list.map((i) => (
                    <tr key={i.id}>
                      <td><span className="ss-code">{i.number}</span></td>
                      <td>PKR {(i.totalCents / 100).toFixed(2)}</td>
                      <td><span className={'ss-badge ' + (i.status === 'PAID' ? 'ss-badge-success' : i.status === 'PAST_DUE' ? 'ss-badge-danger' : 'ss-badge-warn')}>{i.status}</span></td>
                      <td>{i.status !== 'PAID' && <button onClick={() => pay(i.id)} className="ss-btn ss-btn-primary text-xs px-2 py-1">Mark paid</button>}</td>
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