'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Header } from '@/components/Header';

export default function CouponsPage() {
  const [list, setList] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [type, setType] = useState('percent');
  const [value, setValue] = useState('');
  const [max, setMax] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    const r = await api.get('/coupons').catch(() => ({ data: [] }));
    setList(r.data);
  }
  useEffect(() => { load(); }, []);

  async function create(e: any) {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/coupons', {
        code,
        discountType: type,
        discountValue: Number(value),
        maxRedemptions: max ? Number(max) : undefined,
      });
      setMsg('Coupon created');
      setCode(''); setValue(''); setMax('');
      load();
    } catch (err: any) { setMsg(err?.response?.data?.message || 'Failed'); }
  }

  async function revoke(id: string) {
    if (!confirm('Revoke coupon?')) return;
    await api.delete('/coupons/' + id);
    load();
  }

  return (
    <main className="min-h-screen">
      <Header active="/coupons" />
      <div className="w-full px-6 sm:px-8 py-6 sm:py-8 space-y-6">
        <div>
          <h1 className="ss-h1">Coupons</h1>
          <p className="ss-sub">Discount codes your customers can redeem at checkout</p>
        </div>

        {msg && <div className="ss-badge-accent p-3 rounded-lg text-sm">{msg}</div>}

        <form onSubmit={create} className="ss-card space-y-3">
          <input className="ss-input" placeholder="Code (e.g. LAUNCH20)" value={code} onChange={e => setCode(e.target.value)} required />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select className="ss-input" value={type} onChange={e => setType(e.target.value)}>
              <option value='percent'>Percent off</option>
              <option value='amount'>Fixed amount (paisa)</option>
            </select>
            <input className="ss-input" placeholder={type === 'percent' ? '20' : '5000'} value={value} onChange={e => setValue(e.target.value)} required />
            <input className="ss-input" placeholder='Max redemptions (optional)' value={max} onChange={e => setMax(e.target.value)} />
          </div>
          <button className="ss-btn ss-btn-primary">Create coupon</button>
        </form>

        <section className="ss-card">
          <h2 className="ss-h2">All coupons</h2>
          {list.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">No coupons yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="ss-table min-w-[600px]">
                <thead>
                  <tr><th>Code</th><th>Discount</th><th>Used</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  {list.map(c => (
                    <tr key={c.id}>
                      <td><span className="ss-code">{c.code}</span></td>
                      <td>{c.discountType === 'percent' ? c.discountValue + '%' : 'PKR ' + (c.discountValue / 100).toFixed(2)}</td>
                      <td>{c.redemptions}{c.maxRedemptions ? '/' + c.maxRedemptions : ''}</td>
                      <td><span className={'ss-badge ' + (c.active ? 'ss-badge-success' : '')}>{c.active ? 'active' : 'revoked'}</span></td>
                      <td>{c.active && <button onClick={() => revoke(c.id)} className="ss-btn ss-btn-danger text-xs px-2 py-1">Revoke</button>}</td>
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