// Deprecated page: session inspection removed with public static site redesign.
export const dynamic = 'force-static';

export default function SessionTestDeprecated() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Session Test Deprecated</h1>
      <p className="text-sm text-gray-600">User session decoding has been removed. The site is now fully public and static; this route will be removed in a future cleanup.</p>
      <a className="text-blue-600 underline" href="/verify">Go to Verification page</a>
    </main>
  );
}
