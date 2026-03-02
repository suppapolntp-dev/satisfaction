"use client";
import React from "react";
import { overlay, modal } from "./Shared";

export function ThankPopup({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) return null;
  return (
    <div style={overlay}>
      <div style={{ ...modal(360), padding: "2.5rem" }} className="text-center">
        <span className="material-symbols-outlined mb-3" style={{ fontSize: "60px", color: "#10b981" }}>
          check_circle
        </span>
        <h5 className="fw-bold mb-1">ขอบคุณค่ะ</h5>
        <p className="text-muted small mb-0">การประเมินของคุณมีความสำคัญต่อการพัฒนาบริการของเรา</p>
      </div>
    </div>
  );
}