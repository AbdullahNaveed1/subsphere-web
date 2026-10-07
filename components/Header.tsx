'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth } from '@/lib/api';

const NAV = [
  ['Subscriptions', '/subscriptions'],
  ['Customers', '/customers'],
  ['Payment links', '/payment-links'],
  ['Coupons', '/coupons'],
  ['Ledger', '/ledger'],
  ['Payouts', '/payouts'],
  ['API keys', '/api-keys'],
  ['Webhooks', '/webhooks'],
  ['Refunds', '/refunds'],
  ['Invoices', '/invoices'],
  ['Revenue', '/revenue'],
  ['Docs', '/docs'],
];

export function Header({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function logout() {
    clearAuth();
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg-elev)]">
      <div className="w-full px-4 sm:px-6 h-14 flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-black font-bold text-sm">S</div>
          <span className="font-bold tracking-tight hidden sm:inline">SubSphere</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto">
          {NAV.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={
                'text-xs px-3 py-1.5 rounded-md transition whitespace-nowrap ' +
                (active === href
                  ? 'bg-[var(--border)] text-[var(--accent-hover)]'
                  : 'text-[var(--fg-muted)] hover:bg-[var(--border)] hover:text-[var(--fg)]')
              }
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <button onClick={logout} className="hidden sm:inline text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] px-3 py-1.5">
            Sign out
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-md border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)]"
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--bg-elev)]">
          <div className="w-full px-4 py-3 grid grid-cols-2 gap-1">
            {NAV.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={
                  'text-sm px-3 py-2 rounded-md ' +
                  (active === href
                    ? 'bg-[var(--border)] text-[var(--accent-hover)]'
                    : 'text-[var(--fg-muted)] hover:bg-[var(--border)] hover:text-[var(--fg)]')
                }
              >
                {label}
              </Link>
            ))}
            <button
              onClick={logout}
              className="text-sm px-3 py-2 rounded-md text-left text-[var(--danger)] hover:bg-[var(--border)] col-span-2"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}