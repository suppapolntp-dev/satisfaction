// src/app/components/UI/FormLabel.tsx
// ── label เล็กๆ สีเทาเหนือ input ──
import React from "react";

export function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="form-label fw-bold text-muted mb-1" style={{ fontSize: "0.7rem" }}>
      {children}
    </label>
  );
}