
"use client";
import React from "react";
// แก้ชื่อฟังก์ชันเป็นตัวพิมพ์ใหญ่ (Tipbox) ตามมาตรฐาน React Component นะครับ
export function LoginTipbox({ message }: { message: string }) {
  return (
    <>
      <style>
        {`.info-wrapper {
            position: relative;
            display: inline-flex;
            align-items: center;
            cursor: help;
            margin-left: 4px;
            vertical-align: middle;}
          .tooltip-box {
            visibility: hidden;
            width: 220px;
            background-color: #333;
            color: #fff;
            padding: 8px 12px;
            position: absolute;
            z-index: 100;
            bottom: 150%; /* ให้ลอยขึ้นด้านบน */
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            font-size: 0.75rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            pointer-events: none;
          }
        
          /* ทำหัวลูกศรชี้ลง */
          .tooltip-box::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -6px;
            border-width: 6px;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
          }
        
          .info-wrapper:hover .tooltip-box {
            visibility: visible;
            opacity: 1;
            transform: translateX(-50%) translateY(-5px);
          }
        `}
      </style>
      <div className="mt-4 text-center">
        <div className="border-top pt-4">
          <p className="small text-muted mb-0 d-flex align-items-center justify-content-center">
            ถ้าหากลืมรหัสผ่านโปรดติดต่อผู้ดูแลระบบ
            <span className="info-wrapper">
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "18px",
                  color: "#dc3545",
                  cursor: "pointer",
                }}
              >
                info
              </span>
              {/* ใช้ค่าจาก message ที่ส่งเข้ามา */}
              <span className="tooltip-box">
                {message || "กรุณาติดต่อแผนก IT เพื่อขอความช่วยเหลือ"}
              </span>
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
export function TableTipbox({ message }: { message: string }) {
  return (
    <span className="ttip-wrapper">
      {/* Icon */}
      <span className="ttip-icon">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7 6.5V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="7" cy="4.5" r="0.75" fill="currentColor" />
        </svg>
      </span>

      {/* Tooltip Box */}
      <span className="ttip-box" role="tooltip">
        <span className="ttip-arrow" />
        <span className="ttip-content">{message}</span>
      </span>

      <style>{`
        .ttip-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: default;
          vertical-align: middle;
          margin-left: 5px;
        }

        /* Icon circle */
        .ttip-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          color: #9ca3af;
          background: transparent;
          transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
        }

        .ttip-wrapper:hover .ttip-icon {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          transform: scale(1.15);
        }

        /* Tooltip box */
        .ttip-box {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          width: max-content;
          max-width: 220px;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition:
            opacity 0.2s ease,
            transform 0.2s ease,
            visibility 0.2s ease;
          z-index: 9999;
        }

        .ttip-wrapper:hover .ttip-box {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0px);
        }

        /* Glassmorphism content */
        .ttip-content {
          display: block;
          padding: 8px 12px;
          background: rgba(17, 24, 39, 0.88);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          color: #f9fafb;
          font-size: 0.72rem;
          font-weight: 400;
          line-height: 1.5;
          letter-spacing: 0.01em;
          box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.25),
            0 2px 8px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255,255,255,0.06);
          white-space: normal;
          text-align: left;
        }

        /* Arrow */
        .ttip-arrow {
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 5px;
          overflow: hidden;
          pointer-events: none;
        }

        .ttip-arrow::after {
          content: "";
          position: absolute;
          top: -5px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 10px;
          height: 10px;
          background: rgba(17, 24, 39, 0.88);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </span>
  );
}