import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function SignOutPage() {
  const session = await getServerSession();
  if (session) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 space-y-6">
        <h1 className="text-2xl font-bold">Sign Out</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Click below to fully sign out.</p>
        <form action="/api/auth/signout" method="post">
          <button className="btn-primary">Sign Out</button>
        </form>
        <Link href="/" className="underline text-sm">Return Home</Link>
      </div>
    );
  }
  redirect('/');
}
