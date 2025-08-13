import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ALLOWED = [
  'https://istampit.io',
  'https://www.istampit.io',
  'http://localhost:3000',
  'http://localhost:3002'
];

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const isApi = req.nextUrl.pathname.startsWith('/api/');

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
    return pre;
  }

  if (isApi && origin) {
    if (ALLOWED.includes(origin)) {
      const res = NextResponse.next();
      res.headers.set('Access-Control-Allow-Origin', origin);
      res.headers.set('Vary', 'Origin');
      res.headers.set('Access-Control-Allow-Credentials', 'true');
      return res;
    }
    return new NextResponse('Forbidden origin', { status: 403 });
  }
  return NextResponse.next();
}

export const config = { matcher: ['/api/:path*'] };
