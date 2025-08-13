import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(_req: NextRequest) {
	return NextResponse.next();
}

// No matchers yet; add when protecting routes
export const config = { matcher: [] };
