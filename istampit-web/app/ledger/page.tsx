import { Suspense } from 'react';
import LedgerClient from './LedgerClient';

export default function LedgerPage() {
  return (
    <Suspense fallback={<main className="min-h-screen p-8">Loading Innovation Ledger...</main>}>
      <LedgerClient />
    </Suspense>
  );
}
