import { Metadata } from 'next';
import RetiredFeatureNotice from '../RetiredFeatureNotice';

// Always treat /verify as fully static & public; no auth gating.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'iStampit Verification Retired',
  description: 'The live verification surface has been retired as part of the iStampit shutdown. The archive and goodbye page remain available.',
  keywords: ['istampit retired', 'verification retired', 'project archive', 'service sunset'],
  openGraph: {
    title: 'iStampit Verification Retired',
    description: 'The live verification surface has been retired as part of the iStampit shutdown.',
    images: [{ url: '/social/og-banner.png', width: 1200, height: 630, alt: 'iStampit Retired' }],
  },
  alternates: {
    canonical: '/verify'
  }
};

export default function VerifyPage() {
  return (
    <RetiredFeatureNotice
      title="Verification has been retired."
      description="The live verification workflow at /verify is no longer being offered. The retirement landing page and public ledger archive remain available while the final shutdown steps are completed."
    />
  );
}
