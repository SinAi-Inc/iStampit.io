import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { authOptions } from '@/auth';

export default NextAuth(authOptions ?? {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  ]
});
