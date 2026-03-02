// src/app/components/UI/AdminModal.tsx
// ═══════════════════════════════════════════════
// Uniform Modal — ทุก popup ใช้ร่วมกัน
// ขนาด/animation เดียวกัน, ไม่ล้น sidebar
// ═══════════════════════════════════════════════
"use client";

import React from "react";

interface AdminModalProps {
  /** เปิด/ปิด modal */
  isOpen: boolean;
  /** callback ปิด modal */
  onClose: () => void;
  /** ชื่อหัว modal */
  title: string;
  /** icon bootstrap (optional) */
  icon?: string;
  /** ความกว้าง modal (default: 580px) */
  width?: number;
  /** เนื้อหาภายใน */
  children: React.ReactNode;
  /** ปุ่มด้านล่าง (optional — ถ้าไม่ส่งจะไม่แสดง footer) */
  footer?: React.ReactNode;
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  icon = "bi-pencil-square",
  width = 580,
  children,
  footer,
}: AdminModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ zIndex: 1050, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 shadow-lg d-flex flex-column"
        style={{
          width: `${width}px`,
          maxWidth: "95vw",
          maxHeight: "90vh",
          overflow: "hidden",
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex align-items-center gap-3 p-4 pb-3 border-bottom">
          <div
            className="bg-success bg-opacity-10 d-flex align-items-center justify-content-center rounded-3"
            style={{ width: 40, height: 40, color: "#10b981" }}
          >
            <i className={`bi ${icon} fs-5`} />
          </div>
          <h6 className="mb-0 fw-bold flex-grow-1">{title}</h6>
          <button
            onClick={onClose}
            className="btn btn-sm text-muted border-0 p-1"
            title="ปิด"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="p-4 overflow-auto flex-grow-1">{children}</div>

        {/* Footer (optional) */}
        {footer && (
          <div className="d-flex justify-content-end gap-2 p-4 pt-3 border-top">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}