import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authApi } from "@/lib/api-client";

export const authOptions: NextAuthOptions = {
  providers: [
    // ── Credentials (email + password) ───────────────────────────────────────
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const { accessToken, user } = await authApi.login(
            credentials.email,
            credentials.password
          );

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
          };
        } catch {
          // Invalid credentials — return null to trigger a login error
          return null;
        }
      },
    }),

    // ── Google OAuth ──────────────────────────────────────────────────────────
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // First sign in: persist accessToken and role onto the JWT
      if (user) {
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
      }

      // For Google OAuth: exchange the Google token with our backend
      if (account?.provider === "google" && account.id_token) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: account.id_token }),
            }
          );
          if (res.ok) {
            const { accessToken, user: backendUser } = await res.json();
            token.accessToken = accessToken;
            token.role = backendUser.role;
            token.id = backendUser.id;
          }
        } catch {
          // silently fail — session will still be created, role defaults to learner
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
