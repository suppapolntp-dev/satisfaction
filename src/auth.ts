// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { db } from "@/db";
import { account } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig, // spread config จาก auth.config.ts
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

        // 6. คืนข้อมูลเข้า JWT
        return {
          id: String(user.userId),
          name: user.userName,
          role: user.userRole,
          branchId: user.branchId,
        };
      },
    }),
  ],
});