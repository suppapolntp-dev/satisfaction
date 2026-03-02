"use client";
import React from "react";
import { overlay, modal, RED } from "./Shared";

interface ConfirmPopupProps {
  isOpen:        boolean;
  title:         string;
  description?:  string;
  confirmLabel?: string;
  cancelLabel?:  string;
  onConfirm:     () => void;
  onCancel:      () => void;
}

export function ConfirmPopup({
  isOpen, title, description,
  confirmLabel = "ยืนยัน", cancelLabel = "ยกเลิก",
  onConfirm, onCancel,
}: ConfirmPopupProps) {
  if (!isOpen) return null;
  return (
    <div style={overlay} onClick={onCancel}>
      <div style={{ ...modal(), padding: "2.5rem" }} onClick={(e) => e.stopPropagation()}
        className="d-flex flex-column align-items-center text-center">
        <span className="material-symbols-outlined mb-3" style={{ fontSize: "60px", color: "#ef4444" }}>
          delete_forever
        </span>
        <h5 className="fw-bold mb-1">{title}</h5>
        {description && <p className="text-muted small mb-0">{description}</p>}
        <div className="d-flex gap-2 mt-4">
          <button onClick={onCancel}  className="btn btn-light fw-bold px-4 rounded-3">{cancelLabel}</button>
          <button onClick={onConfirm} className="btn fw-bold px-4 rounded-3 text-white border-0"
            style={{ background: RED }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}