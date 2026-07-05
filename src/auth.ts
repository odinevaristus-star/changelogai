import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        const isPro = await redis.get(`user:${session.user.email}:isPro`);
        // @ts-ignore - session user interface extension
        session.user.isPro = isPro === true || isPro === "true";
      }
      return session;
    },
  },
});
