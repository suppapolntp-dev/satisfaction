// src/app/(admin)/rolemanager/page.tsx
"use client";
import React, { useState } from "react";
import type { Role, PermKey, ColumnDef } from "@/types/models";
import { PERMISSIONS } from "@/types/models";
import { useCrudManager } from "@/hooks/useCrudManager";
import { PageHeader } from "@/app/components/UI/PageHeader";
import { ContentCard } from "@/app/components/UI/ContentCard";
import { AdminPageContent } from "@/app/components/UI/AdminPageContent";
import { TableContainer, TableHeader, TableBody } from "@/app/components/Table";
import { TableTipbox } from "@/app/components/Form/Tipbox";
import { ConfirmPopup } from "@/app/components/UI/Popup";

// ลดคอลัมน์ "สิทธิ์การเข้าถึง" ให้แคบลง เพราะแสดงแค่ icon Tipbox
const COLUMNS: ColumnDef[] = [
  { label: "ID",        width: "10%" },
  { label: "Role Name", width: "40%" },
  { label: "สิทธิ์",   width: "15%" },
  { label: "สถานะ",    width: "15%" },
  { label: "Action",   width: "20%" },
];

const DEFAULT_PERMS: Record<PermKey, number> = {
  canViewAll: 0, canViewDashboard: 0, canViewSatisfaction: 0, canManageBrand: 0,
  canManageBranch: 0, canManageArea: 0, canManageUser: 0, canManageRole: 0,
};

export default function RoleManagerPage() {
  const crud = useCrudManager<Role>({ endpoint: "/api/roles", idKey: "roleId" });

  const [newName,     setNewName]     = useState("");
  const [newPerms,    setNewPerms]    = useState<Record<PermKey, number>>({ ...DEFAULT_PERMS });
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleCreate = () => {
    if (!newName.trim()) return alert("กรุณากรอกชื่อ Role");
    crud.handleCreate(
      { roleName: newName, ...newPerms, isActive: 1 } as Partial<Role>,
      () => { setNewName(""); setNewPerms({ ...DEFAULT_PERMS }); }
    );
  };

  const handleToggleActive = (r: Role) =>
    crud.handleSave({ roleId: r.roleId, isActive: r.isActive === 1 ? 0 : 1 } as Partial<Role>);

  const handleEditSave = async (data: Partial<Role>) => {
    const ok = await crud.handleSave(data);
    if (ok) setEditingRole(null);
    return ok;
  };

  // สร้าง tooltip text: รายชื่อสิทธิ์ที่เปิด คั่นด้วย ", "
  const getPermText = (r: Role) => {
    const active = PERMISSIONS.filter(({ key }) => r[key] === 1).map(({ label }) => label);
    return active.length === 0 ? "ไม่มีสิทธิ์" : active.join(", ");
  };

  return (
    <>
      <PageHeader title="จัดการ Role" subtitle="กำหนดสิทธิ์การเข้าถึงของแต่ละ Role" />
      <AdminPageContent>

        {/* ── Create Form ── */}
        <div className="bg-white rounded-4 p-4 border shadow-sm" >
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="bg-success bg-opacity-10 d-flex align-items-center justify-content-center rounded-3"
              style={{ width: 44, height: 44, color: "#10b981" }}>
              <i className="bi bi-shield-check fs-5" />
            </div>
            <div>
              <h6 className="mb-0 fw-bold">สร้าง Role ใหม่</h6>
              <p className="mb-0 text-muted" style={{ fontSize: "0.78rem" }}>กำหนดชื่อและสิทธิ์การเข้าถึง</p>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-12">
              <label className="form-label fw-bold text-muted mb-1" style={{ fontSize: "0.68rem" }}>ROLE NAME *</label>
              <input className="form-control border-0 bg-light rounded-3" placeholder="e.g. Manager"
                value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-3">
            {PERMISSIONS.map(({ key, label }) => (
              <label key={key}
                className={`d-flex align-items-center gap-2 px-3 py-2 rounded-3 border ${newPerms[key] ? "bg-success bg-opacity-10 border-success" : "bg-light"}`}
                style={{ cursor: "pointer", fontSize: "0.78rem", transition: "all 0.2s" }}>
                <input type="checkbox" className="form-check-input m-0" checked={!!newPerms[key]}
                  onChange={(e) => setNewPerms((p) => ({ ...p, [key]: e.target.checked ? 1 : 0 }))} />
                <span className={`fw-semibold ${newPerms[key] ? "text-success" : "text-muted"}`}>{label}</span>
              </label>
            ))}
          </div>

          <div className="pt-2 border-top d-flex justify-content-end">
            <button onClick={handleCreate} disabled={crud.creating}
              className="btn text-white border-0 d-flex align-items-center gap-2 px-4 py-2"
              style={{ borderRadius: "1rem", background: "linear-gradient(135deg,#34d399,#10b981)" }}>
              <i className="bi bi-plus-circle" />
              <span className="fw-bold">{crud.creating ? "กำลังบันทึก..." : "บันทึก"}</span>
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <ContentCard title="รายชื่อ Role ทั้งหมด" subtitle="จัดการสิทธิ์ในระบบ" icon="bi-shield-check">
          <TableContainer>
            <TableHeader columns={COLUMNS} />
            <TableBody isEmpty={!crud.loading && crud.items.length === 0} colSpan={COLUMNS.length}>
              {crud.loading
                ? <tr><td colSpan={COLUMNS.length} className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" />กำลังโหลด...
                  </td></tr>
                : crud.items.map((r) => (
                  <tr key={r.roleId}>
                    <td className="text-center text-muted">{r.roleId}</td>
                    <td className="text-center fw-bold">{r.roleName}</td>

                    {/* สิทธิ์ → TableTipbox hover แสดงรายชื่อ */}
                    <td className="text-center">
                      <TableTipbox message={getPermText(r)} />
                    </td>

                    <td className="text-center">
                      <span
                        className={`badge rounded-pill px-2 py-1 ${r.isActive ? "bg-success" : "bg-danger"}`}
                        style={{ fontSize: "0.68rem", cursor: "pointer" }}
                        onClick={() => handleToggleActive(r)}>
                        {r.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <button onClick={() => setEditingRole(r)} className="btn btn-sm btn-outline-info rounded-3">
                          <i className="bi bi-pencil" />
                        </button>
                        <button onClick={() => crud.openDeleteConfirm(r.roleId)} className="btn btn-sm btn-outline-danger rounded-3">
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </TableBody>
          </TableContainer>
        </ContentCard>
      </AdminPageContent>

      
      <ConfirmPopup
        isOpen={crud.confirmOpen} title="ยืนยันการลบ Role?"
        description="Role นี้จะถูกลบถาวร" confirmLabel="ลบเลย"
        onConfirm={() => crud.handleDeleteConfirm()} onCancel={crud.closeDeleteConfirm}
      />
    </>
  );
}