import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { scope: 'openid email profile' } }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) (session.user as any).id = token.sub;
      return session;
    }
  }
});

export { handler as GET, handler as POST };
