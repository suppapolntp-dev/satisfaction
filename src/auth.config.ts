// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id                  = user.id;
        token.roleId              = user.roleId;
        token.roleName            = user.roleName;
        token.areaId              = user.areaId;
        token.branchIds           = user.branchIds;
        token.canViewAll          = user.canViewAll;          
        token.canViewDashboard    = user.canViewDashboard;
        token.canViewSatisfaction = user.canViewSatisfaction;
        token.canManageBrand      = user.canManageBrand;
        token.canManageBranch     = user.canManageBranch;
        token.canManageArea       = user.canManageArea;
        token.canManageUser       = user.canManageUser;
        token.canManageRole       = user.canManageRole;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id                  = token.id as string;
      session.user.roleId              = token.roleId              as number;
      session.user.roleName            = token.roleName            as string;
      session.user.areaId              = token.areaId              as number;
      session.user.branchIds           = token.branchIds           as number[];
      session.user.canViewAll          = token.canViewAll          as number;  
      session.user.canViewDashboard    = token.canViewDashboard    as number;
      session.user.canViewSatisfaction = token.canViewSatisfaction as number;
      session.user.canManageBrand      = token.canManageBrand      as number;
      session.user.canManageBranch     = token.canManageBranch     as number;
      session.user.canManageArea       = token.canManageArea       as number;
      session.user.canManageUser       = token.canManageUser       as number;
      session.user.canManageRole       = token.canManageRole       as number;
      return session;
    },
  },
  session: { 
  strategy: "jwt",
  maxAge: 30 * 365 * 24 * 60 * 60, // 30 ปี = แทบไม่หมดอายุ
},
  providers: [],
};