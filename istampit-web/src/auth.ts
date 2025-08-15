// For NextAuth v4 we use a pages API route, this file can export config if needed.
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // No local providers: this app delegates auth to external auth service.
  providers: [],
  pages: {
    signIn: '/auth/google',
  },
};
