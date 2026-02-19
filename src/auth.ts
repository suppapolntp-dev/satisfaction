// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { account } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // 1. ตรวจว่าส่งข้อมูลมาครบ
        if (!credentials?.username || !credentials?.password) return null;

        // 2. ดึง user จาก DB
        const result = await db
          .select()
          .from(account)
          .where(eq(account.userName, credentials.username as string));

        const user = result[0];

        // 3. ไม่เจอ user
        if (!user) return null;

        // 4. เปรียบเทียบ password กับ bcrypt hash
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.userPassword
        );
        if (!isValid) return null;

        // 5. user ถูก Block (role = 0)
        if (user.userRole === 0) return null;

        // 6. คืนข้อมูลที่จะเข้า JWT
        return {
          id: String(user.userId),
          name: user.userName,
          role: user.userRole,
          branchId: user.branchId,
        };
      },
    }),
  ],

  callbacks: {
    // JWT callback: ทำงานตอนสร้าง/ต่ออายุ token
    async jwt({ token, user }) {
      if (user) {
        // ครั้งแรกที่ login → user มีค่า → ยัดลง token
        token.id = user.id;
        token.role = user.role;
        token.branchId = user.branchId;
      }
      return token;
    },

    // Session callback: ทำงานตอน client เรียก useSession()
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role;
      session.user.branchId = token.branchId;
      return session;
    },
  },

  pages: {
    signIn: "/login", // redirect มาหน้านี้ถ้าไม่ได้ login
  },

  session: {
    strategy: "jwt", // เก็บ session ใน JWT ไม่ต้องมี DB session table
  },
});