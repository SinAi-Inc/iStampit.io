import { Suspense } from 'react';
import VerifyClient from './VerifyClient';

// Always treat /verify as fully static & public; no auth gating.
export const dynamic = 'force-static';

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-8">Preparing verifier...</div>}>
      <VerifyClient />
    </Suspense>
  );
}
