import type { NextAuthOptions, CookieOption } from 'next-auth';

// Shared cookie config mirroring auth service (session decoding only here)
const cookieDomain = process.env.NODE_ENV === 'production' ? '.istampit.io' : undefined;
const sharedCookie = (name: string, opts: Partial<CookieOption['options']> = {}): CookieOption => ({
  name,
  options: {
    path: '/',
    secure: true,
    httpOnly: !name.includes('csrf') && !name.includes('callback'),
    sameSite: 'lax',
    ...(cookieDomain ? { domain: cookieDomain } : {}),
    ...opts,
  }
});

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [], // Delegated to external auth service
  session: { strategy: 'jwt' },
  cookies: {
    sessionToken: sharedCookie('__Secure-next-auth.session-token'),
  csrfToken: sharedCookie('__Secure-next-auth.csrf-token', { httpOnly: false }),
    callbackUrl: sharedCookie('__Secure-next-auth.callback-url', { httpOnly: false }),
    state: sharedCookie('__Secure-next-auth.state'),
  },
};

export default authOptions;
