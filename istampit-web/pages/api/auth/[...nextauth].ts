import NextAuth from 'next-auth';
import { authOptions } from '@/auth';

// Local NextAuth instance kept minimal (no providers) to decode shared session cookies if present.
export default NextAuth(authOptions ?? { secret: process.env.NEXTAUTH_SECRET, providers: [] });
