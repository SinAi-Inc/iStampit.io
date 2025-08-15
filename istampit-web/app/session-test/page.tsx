import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';

export const dynamic = 'force-dynamic';

export default async function SessionTest() {
  const session = await getServerSession(authOptions);
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Session Test</h1>
      <p className="text-sm text-gray-600">If authenticated via auth.istampit.io you should see decoded session payload below.</p>
      <pre className="bg-gray-900 text-green-200 p-4 rounded text-xs overflow-x-auto border border-gray-700">
        {JSON.stringify(session, null, 2)}
      </pre>
    </main>
  );
}
