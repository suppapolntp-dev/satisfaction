// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { db } from "@/db";
import { account, role, userBranch, userBrand } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        // 1. หา account
        const users = await db.select().from(account)
          .where(eq(account.userName, credentials.username as string));
        const user = users[0];
        if (!user) return null;

        // 2. เช็ค password
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.userPassword
        );
        if (!isValid) return null;

        // 3. หา role + permissions
        if (!user.roleId) return null;
        const roles = await db.select().from(role).where(eq(role.roleId, user.roleId));
        const userRole = roles[0];
        if (!userRole || userRole.isActive === 0) return null;

        // 4. หา brandIds จาก UserBrand
        const brands = await db.select().from(userBrand)
          .where(eq(userBrand.userId, user.userId));
        const brandIds = brands.map((b) => b.brandId);

        // 5. หา branchIds จาก UserBranch
        const branches = await db.select().from(userBranch)
          .where(eq(userBranch.userId, user.userId));
        const branchIds = branches.map((b) => b.branchId);

        // 6. คำนวณ canViewAll
        // — ถ้า role ตั้ง canViewAll = 1 → ใช้เลย
        // — ถ้า manage ครบทุกอย่าง → admin → canViewAll อัตโนมัติ
        const canViewAll = (
          userRole.canViewAll === 1 ||
          (
            userRole.canManageBrand  === 1 &&
            userRole.canManageBranch === 1 &&
            userRole.canManageArea   === 1 &&
            userRole.canManageUser   === 1 &&
            userRole.canManageRole   === 1
          )
        ) ? 1 : 0;

        return {
          id:                  String(user.userId),
          name:                user.userName,
          roleId:              userRole.roleId,
          roleName:            userRole.roleName,
          areaId:              user.areaId,
          brandIds,
          branchIds,
          canViewAll,
          canViewDashboard:    userRole.canViewDashboard    ?? 0,
          canViewSatisfaction: userRole.canViewSatisfaction ?? 0,
          canManageBrand:      userRole.canManageBrand      ?? 0,
          canManageBranch:     userRole.canManageBranch     ?? 0,
          canManageArea:       userRole.canManageArea       ?? 0,
          canManageUser:       userRole.canManageUser       ?? 0,
          canManageRole:       userRole.canManageRole       ?? 0,
        };
      },
    }),
  ],
});