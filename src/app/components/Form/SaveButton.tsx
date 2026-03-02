// src/app/components/UI/SaveButton.tsx
import React from "react";

interface SaveButtonProps {
  onClick:  () => void;
  loading:  boolean;
  label?:   string;   // default "บันทึก"
  icon?:    string;   // default "bi-plus-circle"
}

export function SaveButton({ onClick, loading, label = "บันทึก", icon = "bi-plus-circle" }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="btn text-white border-0 d-flex align-items-center gap-2 px-4 py-2"
      style={{ borderRadius: "1rem", background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)" }}>
      <i className={`bi ${icon}`} />
      <span className="fw-bold">{loading ? "กำลังบันทึก..." : label}</span>
    </button>
  );
}