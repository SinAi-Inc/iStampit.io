import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ALLOWED = [
  'https://istampit.io',
  'https://www.istampit.io',
  'http://localhost:3000',
  'http://localhost:3002'
];

// Simple in-memory rate limiter (best-effort; resets on cold start)
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60; // per window per IP
type Bucket = { count: number; start: number };
const buckets: Map<string, Bucket> = new Map();

function rateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now - b.start > WINDOW_MS) {
    buckets.set(ip, { count: 1, start: now });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }
  if (b.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }
  b.count++;
  return { allowed: true, remaining: MAX_REQUESTS - b.count };
}

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const isApi = req.nextUrl.pathname.startsWith('/api/');

  // Basic rate limiting for auth/session endpoints
  if (isApi) {
    const ip = (req.headers.get('x-forwarded-for') || req.ip || '').split(',')[0].trim() || 'anon';
    const rl = rateLimit(ip);
    if (!rl.allowed) {
      return new NextResponse('Too Many Requests', { status: 429, headers: { 'Retry-After': '60' } });
    }
  }

  if (req.method === 'OPTIONS' && isApi) {
    if (!origin || !ALLOWED.includes(origin)) {
      return new NextResponse('Forbidden origin', { status: 403 });
    }
    const pre = new NextResponse(null, { status: 204 });
    pre.headers.set('Access-Control-Allow-Origin', origin);
    pre.headers.set('Vary', 'Origin');
    pre.headers.set('Access-Control-Allow-Credentials', 'true');
    pre.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    pre.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    pre.headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains; preload');
    return pre;
  }

  if (isApi && origin) {
    if (ALLOWED.includes(origin)) {
      const res = NextResponse.next();
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Vary', 'Origin');
    res.headers.set('Access-Control-Allow-Credentials', 'true');
    res.headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains; preload');
      return res;
    }
    return new NextResponse('Forbidden origin', { status: 403 });
  }
  const res = NextResponse.next();
  res.headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains; preload');
  return res;
}

export const config = { matcher: ['/api/:path*'] };
