// src/app/components/UI/AdminPageContent.tsx
// ═══════════════════════════════════════════════
// Uniform Layout Wrapper สำหรับทุกหน้า Admin
// ให้ maxWidth, padding, spacing เท่ากันหมด
// ═══════════════════════════════════════════════
import React from "react";

interface AdminPageContentProps {
  children: React.ReactNode;
  /** maxWidth ของเนื้อหา (default: 1400px) */
  maxWidth?: string;
}

export function AdminPageContent({
  children,
  maxWidth = "1400px",
}: AdminPageContentProps) {
  return (
    <div
      className="px-4 pb-4 mx-auto w-100 d-flex flex-column gap-4 py-4 overflow-auto"
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
}