// src/types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id:                   string;
    roleId?:              number | null;
    roleName?:            string | null;
    areaId?:              number | null;
    branchIds?:           number[];
    canViewAll?:          number | null;
    canViewDashboard?:    number | null;
    canViewSatisfaction?: number | null;
    canManageBrand?:      number | null;
    canManageBranch?:     number | null;
    canManageArea?:       number | null;
    canManageUser?:       number | null;
    canManageRole?:       number | null;
  }

  interface Session {
    user: {
      id:                   string;
      name?:                string | null;
      roleId?:              number | null;
      roleName?:            string | null;
      areaId?:              number | null;
      branchIds?:           number[];
      canViewAll?:          number | null;
      canViewDashboard?:    number | null;
      canViewSatisfaction?: number | null;
      canManageBrand?:      number | null;
      canManageBranch?:     number | null;
      canManageArea?:       number | null;
      canManageUser?:       number | null;
      canManageRole?:       number | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?:                  string;
    roleId?:              number | null;
    roleName?:            string | null;
    areaId?:              number | null;
    branchIds?:           number[];
    canViewAll?:          number | null;
    canViewDashboard?:    number | null;
    canViewSatisfaction?: number | null;
    canManageBrand?:      number | null;
    canManageBranch?:     number | null;
    canManageArea?:       number | null;
    canManageUser?:       number | null;
    canManageRole?:       number | null;
  }
}