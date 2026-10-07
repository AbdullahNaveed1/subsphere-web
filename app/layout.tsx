import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SubSphere — Payments infrastructure for Pakistan",
  description: "Payments, subscriptions, and payouts for Pakistani developers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--fg)]">{children}</body>
    </html>
  );
}