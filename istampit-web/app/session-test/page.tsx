const IS_STATIC = process.env.NEXT_PUBLIC_PAGES_STATIC === '1';
export const dynamic = IS_STATIC ? 'force-static' : 'force-dynamic';

let Page: any;

if (IS_STATIC) {
  Page = function SessionTestStatic() {
    return (
      <main className="p-8 space-y-4">
        <h1 className="text-2xl font-bold">Session Test (Static)</h1>
        <p className="text-sm text-gray-600">Static export build – server session decoding disabled. Deploy dynamic build to view live session.</p>
        <pre className="bg-gray-900 text-green-200 p-4 rounded text-xs overflow-x-auto border border-gray-700">null</pre>
      </main>
    );
  };
} else {
  Page = async function SessionTestDynamic() {
    const { getServerSession } = await import('next-auth');
    const authOptions = (await import('@/lib/authOptions')).default;
    const session = await getServerSession(authOptions);
    return (
      <main className="p-8 space-y-4">
        <h1 className="text-2xl font-bold">Session Test</h1>
        <p className="text-sm text-gray-600">If authenticated via auth.istampit.io you should see decoded session payload below.</p>
        <pre className="bg-gray-900 text-green-200 p-4 rounded text-xs overflow-x-auto border border-gray-700">{JSON.stringify(session, null, 2)}</pre>
      </main>
    );
  };
}

export default Page;
