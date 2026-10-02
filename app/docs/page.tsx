'use client';
import Link from 'next/link';

export default function Docs() {
  return (
    <main className="min-h-screen bg-white text-black">
      <nav className="max-w-4xl mx-auto flex justify-between items-center p-6 border-b">
        <Link href="/" className="font-bold">SubSphere</Link>
        <Link href="/register" className="text-sm bg-black text-white px-4 py-1.5 rounded">Get API key</Link>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <section>
          <h1 className="text-3xl font-bold mb-4">Authentication</h1>
          <p className="mb-3 text-sm">Use <code className="bg-gray-100 px-1">X-API-Key</code> header.</p>
          <pre className="bg-gray-900 text-white p-4 rounded text-xs overflow-x-auto">curl -H "X-API-Key: sk_test_..." http://localhost:3001/api/v1/ping</pre>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Create a payment</h2>
          <p className="text-sm mb-3">POST /api/v1/payments</p>
          <pre className="bg-gray-900 text-white p-4 rounded text-xs overflow-x-auto">{'POST /api/v1/payments\nX-API-Key: sk_test_...\nIdempotency-Key: order-123\nContent-Type: application/json\n\n{ "amount": 5000, "method": "raast" }'}</pre>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Methods</h2>
          <ul className="text-sm list-disc pl-6 space-y-1">
            <li>raast</li>
            <li>jazzcash</li>
            <li>easypaisa</li>
            <li>card</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Webhooks</h2>
          <p className="text-sm">Register at POST /api/webhooks/endpoint. HMAC-SHA256 signed.</p>
        </section>
      </div>
    </main>
  );
}