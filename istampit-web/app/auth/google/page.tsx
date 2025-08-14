import { redirect } from 'next/navigation';

// Forwarder page: Immediately redirects to Google provider to skip the generic chooser.
// Guards against open redirects by permitting only relative callbackUrl values starting with '/'.
// In static builds (GitHub Pages) NextAuth routes are absent, so we render a notice instead.
export default function GoogleAuthForwarder({ searchParams }: { searchParams?: { callbackUrl?: string } }) {
  const IS_STATIC = process.env.NEXT_PUBLIC_PAGES_STATIC === '1';
  const raw = searchParams?.callbackUrl || '/verify';
  const safe = raw.startsWith('/') ? raw : '/verify';
  if (!IS_STATIC) {
    redirect(`/api/auth/signin/google?callbackUrl=${encodeURIComponent(safe)}`);
  }
  return (
    <div className="max-w-md mx-auto p-8 text-center space-y-4 text-sm">
      <h1 className="text-xl font-semibold">Authentication Disabled</h1>
      <p className="text-gray-600 dark:text-gray-400">
        This static demo build does not include live authentication. Visit the live site to sign in.
      </p>
      <p>
        <a href={`https://app.istampit.io/auth/google?callbackUrl=${encodeURIComponent(safe)}`} className="text-blue-600 underline">
          Continue on live app
        </a>
      </p>
    </div>
  );
}
