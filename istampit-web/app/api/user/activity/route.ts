import { getServerSession } from 'next-auth';

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  }
  // Placeholder activity payload (would query DB in future)
  return Response.json({
    user: { email: session.user?.email, name: session.user?.name },
    activity: []
  });
}
