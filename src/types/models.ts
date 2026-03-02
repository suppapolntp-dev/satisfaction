// src/types/models.ts
// ═══════════════════════════════════════════════
// Shared Types — ใช้ร่วมกันทุกหน้า
// ═══════════════════════════════════════════════

// ─── Brand ───────────────────────────────────
export type Brand = {
  brandId:        number;
  brandName:      string;
  brandShortName: string | null;
  brandImage:     string | null;
};

// ─── Branch ──────────────────────────────────
export type Branch = {
  branchId:        number;
  brandId:         number | null;
  branchName:      string;
  branchShortName: string | null;
  branchAddress:   string | null;
  email:           string | null;
  contact:         string | null;
};

// ─── Area ────────────────────────────────────
export type Area = {
  areaId:      number;
  areaName:    string;
  description: string | null;
};

// ─── Role ────────────────────────────────────
export type PermKey =
  | "canViewAll"
  | "canViewDashboard"
  | "canViewSatisfaction"
  | "canManageBrand"
  | "canManageBranch"
  | "canManageArea"
  | "canManageUser"
  | "canManageRole";

export type Role = {
  roleId:              number;
  roleName:            string;
  isActive:            number;
  canViewAll:          number;
  canViewDashboard:    number;
  canViewSatisfaction: number;
  canManageBrand:      number;
  canManageBranch:     number;
  canManageArea:       number;
  canManageUser:       number;
  canManageRole:       number;
};

// ─── Account (User) ─────────────────────────
export type Account = {
  userId:   number;
  userName: string;
  roleId:   number | null;
  areaId:   number | null;
};

// ─── Column config สำหรับ Table ─────────────
export type ColumnDef = {
  label: string;
  width: string;
};

// ─── API Response ────────────────────────────
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?:   T;
  error?:  string;
  count?:  number;
  message?: string;
};

// ─── Satisfaction Stats ─────────────────────
export type StatsData = {
  total:       number;
  counts:      { good: number; average: number; poor: number };
  percentages: { good: number; average: number; poor: number };
  updatedAt:   string;
};

// ─── Permission config ──────────────────────
export const PERMISSIONS: { key: PermKey; label: string }[] = [
  { key: "canViewAll",          label: "View All"     },
  { key: "canViewDashboard",    label: "Dashboard"    },
  { key: "canViewSatisfaction", label: "Satisfaction" },
  { key: "canManageBrand",      label: "Brand"        },
  { key: "canManageBranch",     label: "Branch"       },
  { key: "canManageArea",       label: "Area"         },
  { key: "canManageUser",       label: "User"         },
  { key: "canManageRole",       label: "Role"         },
];