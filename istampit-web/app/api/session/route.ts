// Session proxy route (dev/local only).
// Static Export Note:
//  "output: 'export'" cannot include truly dynamic /api routes. To allow the build to succeed we
//  force this route to be treated as static and return a placeholder payload in static export
//  scenarios. In a deployed dynamic environment you should provide a real session endpoint (e.g.
//  via NextAuth, an auth worker, or edge function) and optionally remove this placeholder.
//
//  Hosting guidance:
//    Configure your edge / proxy to forward /api/session to your auth origin's session endpoint.
//    Example: /api/session -> https://auth.example.com/api/session (with credentials).
//
//  If you need a dynamic version during local dev, set ISTAMPIT_ENABLE_SESSION_PROXY=1 and we'll
//  attempt a live fetch; otherwise a static placeholder is returned.
//
//  This design keeps the static export build green while still documenting intent.

// Allow dynamic handling (edge runtime) now that hybrid deployment is enabled.

// Narrow interface (we only inspect env & potentially perform a fetch in dev).
export async function GET() {
  const enableProxy = process.env.ISTAMPIT_ENABLE_SESSION_PROXY === '1';
  if (enableProxy) {
    try {
      const target = `${process.env.NEXTAUTH_URL || ''}/api/auth/session` || '/api/auth/session';
      const res = await fetch(target, {
        headers: { Accept: 'application/json' },
        // credentials passthrough only meaningful in browser; build-time static export will not run this branch
        cache: 'no-store'
      });
      const json = await res.json();
      return new Response(JSON.stringify(json), {
        status: res.status,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    } catch {
      return new Response(JSON.stringify({ authenticated: false, error: 'proxy-failed' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }
  }
  // Static placeholder
  return new Response(JSON.stringify({
    placeholder: true,
    authenticated: false,
    hint: 'Configure external auth proxy for /api/session or set ISTAMPIT_ENABLE_SESSION_PROXY=1 in dev.'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' }
  });
}
