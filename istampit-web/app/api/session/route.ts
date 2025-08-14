// This route proxies session state from the centralized auth service.
// NOTE: With `output: 'export'` this API route is not included in the static export.
// Configure your hosting layer (e.g., Cloudflare Worker, Vercel Edge Function, or nginx) to
// forward /api/session to `${NEXT_PUBLIC_AUTH_ORIGIN}/api/session` with credentials.
// Provided here for local dev parity.
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(_req: NextRequest) {
  try {
    // Delegate to NextAuth session route directly (same-origin).
    const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/auth/session` || '/api/auth/session', {
      headers: { Accept: 'application/json' },
      // @ts-ignore - fetch in edge runtime supports this; credential passthrough depends on browser
      credentials: 'include',
      cache: 'no-store'
    });
    const json = await res.json();
    return new Response(JSON.stringify(json), {
      status: res.status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch {
    return new Response(JSON.stringify({ authenticated: false, error: 'unreachable' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
}
