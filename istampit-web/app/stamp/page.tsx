import { Metadata } from 'next';
import { Suspense } from 'react';
import StampClient from './StampClient';

export const metadata: Metadata = {
  title: 'Create Blockchain Timestamp - iStampit.io',
  description: 'Create immutable proof-of-existence timestamps for your documents using Bitcoin blockchain. Free, privacy-first, and instantly downloadable.',
  keywords: ['create timestamp', 'blockchain proof', 'bitcoin timestamp', 'document protection', 'proof of existence', 'OpenTimestamps'],
  openGraph: {
    title: 'Create Blockchain Timestamp - iStampit.io',
    description: 'Create immutable proof-of-existence timestamps for your documents using Bitcoin blockchain. Free, privacy-first, and instantly downloadable.',
    images: [{ url: '/social/og-banner.png', width: 1200, height: 630, alt: 'iStampit.io - Create Timestamp' }],
  },
  alternates: {
    canonical: '/stamp'
  }
};

export default function StampPage() {
  return (
    <Suspense fallback={<main className="min-h-screen p-8">Loading...</main>}>
      <StampClient />
    </Suspense>
  );
}
