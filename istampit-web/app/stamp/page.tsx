import { Metadata } from 'next';
import RetiredFeatureNotice from '../RetiredFeatureNotice';

export const metadata: Metadata = {
  title: 'iStampit Timestamping Retired',
  description: 'The live timestamping surface has been retired as part of the iStampit shutdown. The archive and goodbye page remain available.',
  keywords: ['istampit retired', 'timestamping retired', 'project archive', 'service sunset'],
  openGraph: {
    title: 'iStampit Timestamping Retired',
    description: 'The live timestamping surface has been retired as part of the iStampit shutdown.',
    images: [{ url: '/social/og-banner.png', width: 1200, height: 630, alt: 'iStampit Retired' }],
  },
  alternates: {
    canonical: '/stamp'
  }
};

export default function StampPage() {
  return (
    <RetiredFeatureNotice
      title="Timestamping has been retired."
      description="The live stamping workflow at /stamp is no longer being offered. Use the main goodbye page and public ledger archive for the remaining retirement-period materials."
    />
  );
}
