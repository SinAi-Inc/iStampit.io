import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/authOptions';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ authenticated: false });
  return NextResponse.json({
    authenticated: true,
    user: {
      id: (session.user as any)?.id,
      email: session.user?.email,
      name: session.user?.name
    }
  });
}
