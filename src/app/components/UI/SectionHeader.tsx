// src/app/components/UI/SectionHeader.tsx
import React from "react";

interface SectionHeaderProps {
  icon:     string;   // bootstrap icon class เช่น "bi-map"
  title:    string;
  subtitle: string;
}

export function SectionHeader({ icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="d-flex align-items-center gap-3 mb-4">
      <div
        className="bg-success bg-opacity-10 d-flex align-items-center justify-content-center rounded-3"
        style={{ width: "48px", height: "48px", color: "#10b981" }}>
        <i className={`bi ${icon} fs-4`} />
      </div>
      <div>
        <h3 className="mb-0 fw-bold h6 text-dark">{title}</h3>
        <p className="mb-0 text-muted small">{subtitle}</p>
      </div>
    </div>
  );
}