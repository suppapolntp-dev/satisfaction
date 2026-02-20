// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.branchId = user.branchId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role;
      session.user.branchId = token.branchId;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [], // ไม่ใส่ bcrypt ที่นี่ เพราะต้องรันบน Edge ได้
};