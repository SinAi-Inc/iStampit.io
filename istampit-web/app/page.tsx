import { Metadata } from 'next';
import { Suspense } from 'react';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'iStampit Retired',
  description: 'iStampit has been retired. The istampit.io landing page remains online as a goodbye notice during the service sunset.',
  keywords: ['istampit retired', 'service sunset', 'project archive', 'goodbye from istampit'],
  openGraph: {
    title: 'iStampit Retired',
    description: 'iStampit has been retired. Thank you for being part of the project.',
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
