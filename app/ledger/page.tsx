'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Header } from '@/components/Header';

export default function LedgerPage() {
  const [balance, setBalance] = useState(0);
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    api.get('/ledger/balance').then(r => setBalance(r.data.balanceCents)).catch(() => {});
    api.get('/ledger/entries?limit=50').then(r => setEntries(r.data)).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen">
      <Header active="/ledger" />
      <div className="w-full px-6 sm:px-8 py-6 sm:py-8 space-y-6">
        <div>
          <h1 className="ss-h1">Ledger</h1>
          <p className="ss-sub">Append-only record of every cent in and out</p>
        </div>

        <div className="ss-card">
          <p className="ss-kpi-label">Current balance</p>
          <p className="ss-kpi-value">PKR {(balance / 100).toFixed(2)}</p>
        </div>

        <section className="ss-card">
          <h2 className="ss-h2">Entries</h2>
          {entries.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">No entries yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="ss-table min-w-[700px]">
                <thead>
                  <tr><th>Type</th><th>Amount</th><th>Balance</th><th>Description</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {entries.map(e => (
                    <tr key={e.id}>
                      <td><span className="ss-badge">{e.type}</span></td>
                      <td style={{ color: e.amountCents >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {e.amountCents >= 0 ? '+' : ''}PKR {(e.amountCents / 100).toFixed(2)}
                      </td>
                      <td>PKR {(e.balanceAfter / 100).toFixed(2)}</td>
                      <td className="text-[var(--fg-muted)] text-xs">{e.description || '—'}</td>
                      <td className="text-[var(--fg-dim)] text-xs">{new Date(e.createdAt).toLocaleString()}</td>
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