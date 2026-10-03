'use client';
import Link from 'next/link';

const AUTH = `curl -H "X-API-Key: sk_test_..." http://localhost:3001/api/v1/ping`;

function Code({ children }: { children: string }) {
  return <pre className='bg-gray-900 text-white p-4 rounded text-xs overflow-x-auto whitespace-pre'>{children}</pre>;
}

export default function Docs() {
  return (
    <main className='min-h-screen bg-white text-black'>
      <nav className='max-w-4xl mx-auto flex justify-between items-center p-6 border-b'>
        <Link href='/' className='font-bold'>SubSphere</Link>
        <Link href='/register' className='text-sm bg-black text-white px-4 py-1.5 rounded'>Get API key</Link>
      </nav>
      <div className='max-w-4xl mx-auto px-6 py-12 space-y-12'>
        <section>
          <h1 className='text-3xl font-bold mb-4'>API Reference</h1>
          <p className='text-sm text-gray-600'>Base URL: http://localhost:3001/api</p>
        </section>
        <section>
          <h2 className='text-2xl font-bold mb-4'>Authentication</h2>
          <p className='text-sm mb-3'>All /v1/* endpoints require X-API-Key header.</p>
          <Code>{AUTH}</Code>
        </section>
        <section>
          <h2 className='text-2xl font-bold mb-4'>Payments</h2>
          <p className='text-sm mb-3'>Test keys support simulate: succeeded | failed | pending.</p>
          <Code>{'POST /api/v1/payments\nX-API-Key: sk_test_...\nIdempotency-Key: order-123\nContent-Type: application/json\n\n{ "amount": 5000, "method": "raast", "simulate": "succeeded" }'}</Code>
        </section>
        <section>
          <h2 className='text-2xl font-bold mb-4'>Refunds</h2>
          <Code>{'POST /api/v1/refunds\nX-API-Key: sk_test_...\n\n{ "paymentId": "cm...", "amount": 1000 }'}</Code>
        </section>
        <section>
          <h2 className='text-2xl font-bold mb-4'>Customers</h2>
          <Code>{'POST /api/v1/customers\nX-API-Key: sk_test_...\n\n{ "email": "a@b.com", "name": "Ali" }'}</Code>
        </section>
        <section>
          <h2 className='text-2xl font-bold mb-4'>Events</h2>
          <Code>{'GET /api/v1/events?since=2026-10-01T00:00:00Z\nX-API-Key: sk_test_...'}</Code>
        </section>
        <section>
          <h2 className='text-2xl font-bold mb-4'>Webhooks</h2>
          <p className='text-sm mb-3'>HMAC-SHA256 signed via X-SubSphere-Signature. Auto-retry with exponential backoff.</p>
        </section>
        <section>
          <h2 className='text-2xl font-bold mb-4'>SDK</h2>
          <Code>{'npm install @subsphere/node\n\nconst { SubSphere } = require("@subsphere/node");\nconst ss = new SubSphere("sk_test_...");\nconst p = await ss.payments.create({ amount: 5000, method: "raast" });'}</Code>
        </section>
        <section>
          <h2 className='text-2xl font-bold mb-4'>CLI</h2>
          <Code>{'subsphere listen --api-key sk_test_...\nsubsphere trigger payment.test --api-key sk_test_...\nsubsphere logs --api-key sk_test_...'}</Code>
        </section>
      </div>
    </main>
  );
}