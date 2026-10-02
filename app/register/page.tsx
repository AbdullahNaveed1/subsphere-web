'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setAuth } from '@/lib/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  async function submit(e: any) {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', { email, password, name });
      setAuth(res.data.accessToken || res.data.access_token || res.data.token);
      const org = await api.post('/orgs', { name: name + ' Org', slug: 'org-' + Date.now() });
      localStorage.setItem('orgId', org.data.id);
      router.push('/dashboard');
    } catch (err: any) {
      setError((err && err.response && err.response.data && err.response.data.message) || 'Registration failed');
    }
  }
  return (<main className='min-h-screen flex items-center justify-center p-6'><form onSubmit={submit} className='w-full max-w-sm space-y-4'><h1 className='text-2xl font-bold'>Create account</h1>{error && <p className='text-red-600 text-sm'>{error}</p>}<input className='w-full border p-2 rounded' placeholder='Name' value={name} onChange={(e: any) => setName(e.target.value)} /><input className='w-full border p-2 rounded' placeholder='Email' value={email} onChange={(e: any) => setEmail(e.target.value)} /><input className='w-full border p-2 rounded' type='password' placeholder='Password' value={password} onChange={(e: any) => setPassword(e.target.value)} /><button className='w-full bg-black text-white p-2 rounded'>Create account</button><a href='/login' className='block text-center text-sm text-gray-600'>Already have an account</a></form></main>);
}
