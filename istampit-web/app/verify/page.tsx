import { Suspense } from 'react';
import VerifyClient from './VerifyClient';

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-8">Preparing verifier...</div>}>
      <VerifyClient />
    </Suspense>
  );
}
