'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setAuth } from '@/lib/api';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: any) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuth(res.data.accessToken || res.data.access_token || res.data.token);
      const orgs = await api.get('/orgs');
      if (orgs.data && orgs.data.length) {
        localStorage.setItem('orgId', orgs.data[0].id);
      } else {
        const org = await api.post('/orgs', { name: 'My Org', slug: 'my-org-' + Date.now() });
        localStorage.setItem('orgId', org.data.id);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError((err && err.response && err.response.data && err.response.data.message) || 'Login failed');
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-black font-bold">S</div>
            <span className="text-xl font-bold tracking-tight">SubSphere</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">Sign in to your dashboard</p>
        </div>

        <form onSubmit={submit} className="ss-card space-y-4">
          {error && <div className="ss-badge-danger p-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="text-xs text-[var(--fg-dim)] uppercase tracking-wider block mb-2">Email</label>
            <input className="ss-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs text-[var(--fg-dim)] uppercase tracking-wider block mb-2">Password</label>
            <input className="ss-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="ss-btn ss-btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="text-center text-xs text-[var(--fg-dim)]">
            No account? <Link href="/register" className="text-[var(--accent-hover)] hover:underline">Create one</Link>
          </p>
        </form>
      </div>
    </main>
  );
}