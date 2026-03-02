import type { CSSProperties } from "react";

// ─── Shared styles ────────────────────────────
export const overlay: CSSProperties = {
  position: "fixed", inset: 0,
  background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 9999,
  animation: "fadeIn 0.3s ease-out forwards",
};

export const modal = (maxW = 480): CSSProperties => ({
  background: "white", borderRadius: "2.5rem",
  width: "90%", maxWidth: maxW,
  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  overflow: "hidden",
  animation: "popIn 1.0s cubic-bezier(0.34, 1.56, 0.64, 1)",
});

export const labelCss: CSSProperties = { fontSize: "0.7rem" };
export const GREEN = "linear-gradient(135deg,#34d399,#10b981)";
export const RED   = "linear-gradient(135deg,#f87171,#ef4444)";

// ─── Shared types ─────────────────────────────
export type BranchItem = { branchId: number; branchName: string; brandId: number };
export type AreaItem   = { areaId:   number; areaName:   string };
export type RoleItem   = { roleId:   number; roleName:   string; isActive: number };
export type BrandItem  = { brandId:  number; brandName:  string };