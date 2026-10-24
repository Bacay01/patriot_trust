// src/auth.js
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login", // use our own login page, not the default one
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        pin: { label: "PIN", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password, pin } = credentials || {};

        // 1. All three required
        if (!email || !password || !pin) return null;

        // 2. Find the user by email
        const user = await prisma.user.findUnique({
          where: { email: String(email) },
        });
        if (!user) return null;

        // 3. Check password
        const passwordOk = await bcrypt.compare(String(password), user.password);
        if (!passwordOk) return null;

        // 4. Check PIN
        const pinOk = await bcrypt.compare(String(pin), user.pin);
        if (!pinOk) return null;

        // 5. Success — return a safe user object (no password/pin)
        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          userId: user.userId,
        };
      },
    }),
  ],
  callbacks: {
    // Put our custom fields into the token...
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userId = user.userId;
      }
      return token;
    },
    // ...then expose them on the session object
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.userId = token.userId;
      }
      return session;
    },
  },
});