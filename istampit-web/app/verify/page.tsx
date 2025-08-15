import { Suspense } from 'react';
import VerifyClient from './VerifyClient';

// Build-time flag: when producing a fully static export (e.g. GitHub Pages), we cannot run server session logic.
const IS_STATIC = process.env.NEXT_PUBLIC_PAGES_STATIC === '1';

// Hint Next.js about rendering mode (static export must not attempt dynamic features)
export const dynamic = IS_STATIC ? 'force-static' : 'force-dynamic';

let Page: any;

if (IS_STATIC) {
  // Static placeholder – client component will still show auth gate via remote session hook
  Page = function VerifyStatic() {
    return (
      <Suspense fallback={<div className="p-8">Preparing verifier...</div>}>
        <VerifyClient />
      </Suspense>
    );
  };
} else {
  // Dynamic (server) variant with server-side session gating
  Page = async function VerifyDynamic() {
    const { getServerSession } = await import('next-auth');
    const { redirect } = await import('next/navigation');
    const authOptions = (await import('@/lib/authOptions')).default;
    const session = await getServerSession(authOptions);
    if (!session) {
      const authOrigin = (process.env.NEXT_PUBLIC_AUTH_ORIGIN || 'https://auth.istampit.io').replace(/\/$/, '');
      const appOrigin = (process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://istampit.io').replace(/\/$/, '');
      const signInUrl = `${authOrigin}/api/auth/signin?callbackUrl=${encodeURIComponent(`${appOrigin}/verify`)}`;
      redirect(signInUrl);
    }
    return (
      <Suspense fallback={<div className="p-8">Preparing verifier...</div>}>
        <VerifyClient />
      </Suspense>
    );
  };
}

export default Page;
