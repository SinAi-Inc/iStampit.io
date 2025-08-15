import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import VerifyClient from './VerifyClient';
import authOptions from '@/lib/authOptions';

export default async function VerifyPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    const authOrigin = (process.env.NEXT_PUBLIC_AUTH_ORIGIN || 'https://auth.istampit.io').replace(/\/$/, '');
    const appOrigin = (process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://app.istampit.io').replace(/\/$/, '');
    const signInUrl = `${authOrigin}/api/auth/signin?callbackUrl=${encodeURIComponent(`${appOrigin}/verify`)}`;
    redirect(signInUrl);
  }
  return (
    <Suspense fallback={<div className="p-8">Preparing verifier...</div>}>
      <VerifyClient />
    </Suspense>
  );
}
