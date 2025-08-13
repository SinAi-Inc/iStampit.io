import { Suspense } from 'react';
import DocsClient from './DocsClient';

export default function DocsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading documentation...</div>}>
      <DocsClient />
    </Suspense>
  );
}
