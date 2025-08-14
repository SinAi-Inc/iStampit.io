import { type NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
// import Github from 'next-auth/providers/github'; // future provider

// Centralized auth configuration for auth.istampit.io popup-based OAuth
export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: 'consent', access_type: 'offline', scope: 'openid email profile' } }
    })
    // Github({ clientId: process.env.GITHUB_ID!, clientSecret: process.env.GITHUB_SECRET! })
  ],
  session: { strategy: 'jwt' },
  // Restructured architecture: central auth service at auth.istampit.io issues a session cookie
  // to parent domain so the static marketing site (istampit.io) can read session via /api/session.
  // SameSite=None required for future embedded / popup flows. Always Secure in production.
  cookies: {
    sessionToken: {
      name: '__Host-istampit-session',
      options: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
        domain: '.istampit.io'
      }
    }
  },
  pages: { signIn: '/signin' },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always direct back to finish page with original callback
      const u = new URL(url, baseUrl);
      const cb = u.searchParams.get('callbackUrl') ?? '/';
      const finish = new URL('/finish', baseUrl);
      finish.searchParams.set('callback', cb);
      return finish.toString();
    },
    async jwt({ token/*, account, profile*/ }) {
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) (session.user as any).id = token.sub;
      return session;
    }
  }
};
