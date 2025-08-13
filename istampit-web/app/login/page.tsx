import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) redirect('/');
  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <form action="/api/auth/signin/google" method="post">
        <button className="btn-primary w-full" type="submit">Continue with Google</button>
      </form>
      <p className="text-xs text-gray-500 mt-4">
        By continuing you agree to our <Link href="/terms" className="underline">Terms</Link> & <Link href="/privacy" className="underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}
