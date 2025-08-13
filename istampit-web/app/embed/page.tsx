import { Suspense } from 'react';
import EmbedClient from './EmbedClient';

export default function EmbedDemo() {
  return (
    <Suspense fallback={<div className="p-8">Loading embed examples...</div>}>
      <EmbedClient />
    </Suspense>
  );
}
