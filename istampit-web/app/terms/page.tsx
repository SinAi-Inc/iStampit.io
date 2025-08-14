import { Metadata } from 'next';
import { Suspense } from 'react';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service - iStampit.io',
  description: 'Terms of Service for iStampit.io - Review the terms and conditions for using our digital watermarking and timestamp verification platform.',
  keywords: ['terms of service', 'terms and conditions', 'iStampit.io', 'legal terms', 'user agreement'],
  alternates: {
    canonical: '/terms'
  }
};

export default function TermsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading terms of service...</div>}>
      <TermsClient />
    </Suspense>
  );
}
