import React from "react";

interface ContentCardProps {
  title: string;        // ชื่อหัวข้อหลัก เช่น "Create New User"
  subtitle: string;     // คำอธิบายย่อย เช่น "for branch access charts"
  icon: string;         // ชื่อ icon จาก Bootstrap Icons เช่น "bi-person-plus"
  children: React.ReactNode; // เนื้อหาภายใน (Form หรือ Table)
  actions?: React.ReactNode; // (Optional) ปุ่ม Filter, Export หรือปุ่มอื่นๆ ด้านขวา
}

export const ContentCard = ({ 
  title, 
  subtitle, 
  icon, 
  children, 
  actions 
}: ContentCardProps) => {
  return (
    <div className="bg-white rounded-4 p-4 d-flex flex-column border shadow-sm mb-4">
      
      <div className="d-flex align-items-center gap-3 mb-4">
        <div 
          className="bg-success bg-opacity-10 d-flex align-items-center justify-content-center rounded-3 shadow-none"
          style={{ width: "48px", height: "48px", color: "#10b981" }}
        >
          <i className={`bi ${icon} fs-4`}></i>
        </div>

        <div className="d-flex flex-column">
          <h3 className="mb-0 fw-bold text-dark" style={{ fontSize: "1rem" }}>
            {title.toUpperCase()}
          </h3>
          <p className="mb-0 text-muted" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
            {subtitle}
          </p>
        </div>

        {actions && <div className="ms-auto d-flex gap-2">{actions}</div>}
      </div>

      <div className="w-100">
        {children}
      </div>
    </div>
  );
};