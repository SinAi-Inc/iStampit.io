import { Metadata } from 'next';
import { Suspense } from 'react';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy - iStampit.io',
  description: 'Privacy Policy for iStampit.io - Learn how we collect, use, and protect your information when using our digital watermarking and timestamp verification services.',
  keywords: ['privacy policy', 'data protection', 'iStampit.io', 'digital privacy', 'GDPR', 'data security'],
  alternates: {
    canonical: '/privacy'
  }
};

export default function PrivacyPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading privacy policy...</div>}>
      <PrivacyClient />
    </Suspense>
  );
}
