import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const RATE_LIMIT = 30; // requests per window
const WINDOW_MS = 60_000;
const buckets = new Map<string, { count: number; reset: number }>();

function allow(key: string) {
	const now = Date.now();
	let b = buckets.get(key);
	if (!b || b.reset < now) {
		b = { count: 0, reset: now + WINDOW_MS };
		buckets.set(key, b);
	}
	b.count++;
	return b.count <= RATE_LIMIT;
}

export function middleware(req: NextRequest) {
	if (req.nextUrl.pathname.startsWith('/api/') && req.method === 'POST') {
		const ip = req.ip || req.headers.get('x-forwarded-for') || 'anon';
		if (!allow(ip)) {
			return new NextResponse(JSON.stringify({ error: 'rate_limited' }), { status: 429, headers: { 'content-type': 'application/json' } });
		}
		const origin = req.headers.get('origin');
		const host = req.headers.get('host');
		if (origin && host && !origin.includes(host)) {
			return new NextResponse(JSON.stringify({ error: 'csrf_rejected' }), { status: 403, headers: { 'content-type': 'application/json' } });
		}
	}
	return NextResponse.next();
}

export const config = { matcher: ['/api/:path*'] };
