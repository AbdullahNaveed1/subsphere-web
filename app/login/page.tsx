'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setAuth } from '@/lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  async function submit(e: any) {
    e.preventDefault();
    setError('');
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
  }
  return (<main className='min-h-screen flex items-center justify-center p-6'><form onSubmit={submit} className='w-full max-w-sm space-y-4'><h1 className='text-2xl font-bold'>Sign in</h1>{error && <p className='text-red-600 text-sm'>{error}</p>}<input className='w-full border p-2 rounded' placeholder='Email' value={email} onChange={(e: any) => setEmail(e.target.value)} /><input className='w-full border p-2 rounded' type='password' placeholder='Password' value={password} onChange={(e: any) => setPassword(e.target.value)} /><button className='w-full bg-black text-white p-2 rounded'>Sign in</button><a href='/register' className='block text-center text-sm text-gray-600'>Create account</a></form></main>);
}
