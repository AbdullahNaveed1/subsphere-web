'use client';
export default function Cancelled() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4">×</p>
        <h1 className="text-xl font-bold">Payment cancelled</h1>
        <p className="text-sm text-gray-500 mt-2">You can close this window.</p>
      </div>
    </main>
  );
}