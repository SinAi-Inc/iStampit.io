import { type NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { scope: 'openid email profile' } }
    })
  ],
  session: { strategy: 'jwt' },
  // Restructured architecture: central auth service at auth.istampit.io issues a session cookie
  // to parent domain so the static marketing site (istampit.io) can read session via /api/session.
  // SameSite=None required for future embedded / popup flows. Always Secure in production.
  cookies: process.env.NODE_ENV === 'production' ? {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
        domain: '.istampit.io'
      }
    }
  } : undefined,
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) (session.user as any).id = token.sub;
      return session;
    }
  }
};
