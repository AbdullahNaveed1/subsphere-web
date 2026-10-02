'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push(localStorage.getItem('token') ? '/dashboard' : '/login');
  }, [router]);
  return <main className='p-6'>Loading...</main>;
}
