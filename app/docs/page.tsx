'use client';
import Link from 'next/link';
import { Header } from '@/components/Header';

function Code({ children }: { children: string }) {
  return <pre className="ss-code block p-4 rounded-lg overflow-x-auto text-xs leading-relaxed whitespace-pre">{children}</pre>;
}

function Section({ title, children }: { title: string; children: any }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export default function Docs() {
  return (
    <main className="min-h-screen">
      <Header active="/docs" />
      <div className="w-full px-6 sm:px-8 py-6 sm:py-10 space-y-10">
        <div>
          <h1 className="ss-h1">API Reference</h1>
          <p className="ss-sub">Base URL: <span className="ss-code">http://localhost:3001/api</span></p>
        </div>

        <Section title="Authentication">
          <p className="text-sm text-[var(--fg-muted)]">All <span className="ss-code">/v1/*</span> endpoints require an <span className="ss-code">X-API-Key</span> header. Keys start with <span className="ss-code">sk_test_</span> or <span className="ss-code">sk_live_</span>.</p>
          <Code>{'curl -H "X-API-Key: sk_test_..." http://localhost:3001/api/v1/ping'}</Code>
        </Section>

        <Section title="Payments">
          <p className="text-sm text-[var(--fg-muted)]">Create a payment. Add <span className="ss-code">Idempotency-Key</span> to prevent duplicates. Test keys support <span className="ss-code">simulate</span>.</p>
          <Code>{'POST /api/v1/payments\nX-API-Key: sk_test_...\nIdempotency-Key: order-123\nContent-Type: application/json\n\n{ "amount": 5000, "method": "raast", "simulate": "succeeded" }'}</Code>
        </Section>

        <Section title="Refunds">
          <Code>{'POST /api/v1/refunds\nX-API-Key: sk_test_...\n\n{ "paymentId": "cm...", "amount": 1000, "reason": "customer request" }'}</Code>
        </Section>

        <Section title="Customers">
          <Code>{'POST /api/v1/customers\nX-API-Key: sk_test_...\n\n{ "email": "a@b.com", "name": "Ali" }'}</Code>
        </Section>

        <Section title="Payment links">
          <Code>{'POST /api/v1/payment_links\nX-API-Key: sk_test_...\n\n{ "amount": 5000, "description": "Design work" }\n// Returns { url: "http://.../pay/<token>" }'}</Code>
        </Section>

        <Section title="Coupons">
          <Code>{'POST /api/v1/coupons\nX-API-Key: sk_test_...\n\n{ "code": "LAUNCH20", "discountType": "percent", "discountValue": 20 }\n\n// Apply at checkout:\nPOST /api/v1/checkout_sessions\n{ "paymentId": "cm...", "couponCode": "LAUNCH20" }'}</Code>
        </Section>

        <Section title="Ledger">
          <Code>{'GET /api/v1/ledger/balance\n// { "balanceCents": 25000 }\n\nGET /api/v1/ledger/entries?limit=50'}</Code>
        </Section>

        <Section title="Payouts">
          <Code>{'POST /api/v1/payouts\nX-API-Key: sk_test_...\n\n{ "amountCents": 50000, "destination": "PK36SCBL0000001123456702", "method": "raast" }'}</Code>
        </Section>

        <Section title="Events">
          <Code>{'GET /api/v1/events?since=2026-10-01T00:00:00Z\nPOST /api/v1/events/trigger\n{ "type": "payment.test", "data": {} }'}</Code>
        </Section>

        <Section title="Webhooks">
          <p className="text-sm text-[var(--fg-muted)]">All webhooks are HMAC-SHA256 signed with <span className="ss-code">X-SubSphere-Signature</span>. Retried up to 5 times with exponential backoff.</p>
          <Code>{'// Node\nconst ok = SubSphere.verifyWebhook(req.rawBody, req.headers["x-subsphere-signature"], process.env.SUBSPHERE_WEBHOOK_SECRET);'}</Code>
        </Section>

        <Section title="Methods">
          <ul className="text-sm text-[var(--fg-muted)] space-y-1">
            <li><span className="ss-code">raast</span> — Raast instant payments</li>
            <li><span className="ss-code">jazzcash</span> — JazzCash wallet</li>
            <li><span className="ss-code">easypaisa</span> — Easypaisa wallet</li>
            <li><span className="ss-code">card</span> — Debit / credit card</li>
          </ul>
        </Section>

        <Section title="SDK">
          <Code>{'npm install @subsphere/node\n\nconst { SubSphere } = require("@subsphere/node");\nconst ss = new SubSphere("sk_test_...");\nconst p = await ss.payments.create({ amount: 5000, method: "raast" });'}</Code>
        </Section>

        <Section title="CLI">
          <Code>{'subsphere listen --api-key sk_test_...\nsubsphere trigger payment.test --api-key sk_test_...\nsubsphere logs --api-key sk_test_...'}</Code>
        </Section>
      </div>
    </main>
  );
}