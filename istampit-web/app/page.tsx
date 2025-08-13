import { Metadata } from 'next';
import { Suspense } from 'react';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Digital Watermarking & Timestamp Verification Platform',
  description: 'Secure your digital content with advanced watermarking technology. Bitcoin-secured timestamps, privacy-first proof of existence, and instant verification.',
  keywords: ['digital watermarking', 'timestamp verification', 'blockchain proof', 'bitcoin timestamps', 'content protection', 'copyright protection'],
  openGraph: {
    title: 'iStampit.io - Digital Watermarking & Timestamp Verification',
    description: 'Secure your digital content with advanced watermarking technology. Bitcoin-secured timestamps and privacy-first proof of existence.',
    images: [{ url: '/social/og-banner.png', width: 1200, height: 630, alt: 'iStampit.io Platform' }],
  },
  alternates: {
    canonical: '/'
  }
};

export default function Home() {
  return (
    <Suspense fallback={<main className="min-h-screen p-8">Loading...</main>}>
      <HomeClient />
    </Suspense>
  );
}
