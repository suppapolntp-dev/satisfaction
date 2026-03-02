// src/app/(admin)/branchmanager/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import type { ColumnDef } from "@/types/models";
import { PageHeader } from "@/app/components/UI/PageHeader";
import { ContentCard } from "@/app/components/UI/ContentCard";
import { AdminPageContent } from "@/app/components/UI/AdminPageContent";
import { TableContainer, TableHeader, TableBody } from "@/app/components/Table";
import { TableTipbox } from "@/app/components/Form/Tipbox";
import { ConfirmPopup} from "@/app/components/UI/Popup";

type Branch = {
  branchId: number; brandId: number | null; branchName: string;
  branchShortName: string | null; branchAddress: string | null;
  email: string | null; contact: string | null;
};
type Brand = { brandId: number; brandName: string };

// ลด 8 คอลัมน์ → 5 คอลัมน์ (รวม address+email+contact เป็น Info Tipbox)
const COLUMNS: ColumnDef[] = [
  { label: "ID",          width: "8%"  },
  { label: "Branch Name", width: "30%" },
  { label: "Brand",       width: "20%" },
  { label: "Short",       width: "12%" },
  { label: "Info",        width: "10%" },
  { label: "Action",      width: "20%" },
];

const lbl   = { fontSize: "0.68rem" };
const GREEN = "linear-gradient(135deg,#34d399,#10b981)";

export default function BranchManagerPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [brands,   setBrands]   = useState<Brand[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [creating, setCreating] = useState(false);

  // create form
  const [newBranchId, setNewBranchId] = useState("");
  const [newBrandId,  setNewBrandId]  = useState<number | "">("");
  const [newName,     setNewName]     = useState("");
  const [newShort,    setNewShort]    = useState("");
  const [newAddress,  setNewAddress]  = useState("");
  const [newEmail,    setNewEmail]    = useState("");
  const [newContact,  setNewContact]  = useState("");

  // edit popup
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // delete
  const [confirmOpen,     setConfirmOpen]     = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const getBrandName = (id: number | null) =>
    brands.find((b) => b.brandId === id)?.brandName ?? "-";

  // สร้าง tooltip text: address + email + contact
  const getInfoText = (b: Branch) => {
    const parts = [
      b.branchAddress ? `📍 ${b.branchAddress}` : null,
      b.email         ? `✉️ ${b.email}`         : null,
      b.contact       ? `📞 ${b.contact}`        : null,
    ].filter(Boolean);
    return parts.length === 0 ? "ไม่มีข้อมูลติดต่อ" : parts.join("  |  ");
  };

  const fetchAll = async () => {
    setLoading(true);
    const [brRes, bdRes] = await Promise.all([
      fetch("/api/branchs").then((r) => r.json()),
      fetch("/api/brands").then((r)  => r.json()),
    ]);
    if (brRes.success) setBranches(brRes.data);
    if (bdRes.success) setBrands(bdRes.data);
    setLoading(false);
  };
  useEffect(() => {(async () => { await fetchAll(); })(); }, []);

  const handleCreate = async () => {
    if (!newBranchId.trim()) return alert("กรุณากรอก Branch ID");
    if (!newName.trim())     return alert("กรุณากรอกชื่อ Branch");
    if (!newBrandId)         return alert("กรุณาเลือก Brand");
    setCreating(true);
    const json = await fetch("/api/branchs", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        branchId: Number(newBranchId), brandId: newBrandId, branchName: newName,
        branchShortName: newShort || null, branchAddress: newAddress || null,
        email: newEmail || null, contact: newContact || null,
      }),
    }).then((r) => r.json());
    if (json.success) {
      setNewBranchId(""); setNewBrandId(""); setNewName(""); setNewShort("");
      setNewAddress(""); setNewEmail(""); setNewContact("");
      fetchAll();
    } else alert(json.error);
    setCreating(false);
  };

  const handleDeleteConfirm = async () => {
    setConfirmOpen(false);
    await fetch(`/api/branchs?id=${pendingDeleteId}`, { method: "DELETE" });
    fetchAll();
    setPendingDeleteId(null);
  };

  return (
    <>
      <PageHeader title="จัดการ Branch" subtitle="สร้างและจัดการ Branch ในระบบ" />
      <AdminPageContent>

        {/* ── Create Form ── */}
        <div className="bg-white rounded-4 p-4 border shadow-sm">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="bg-success bg-opacity-10 d-flex align-items-center justify-content-center rounded-3"
              style={{ width: 44, height: 44, color: "#10b981" }}>
              <i className="bi bi-building fs-5" />
            </div>
            <div>
              <h6 className="mb-0 fw-bold">สร้าง Branch ใหม่</h6>
              <p className="mb-0 text-muted" style={{ fontSize: "0.78rem" }}>เพิ่ม Branch เข้าสู่ระบบ</p>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <label className="form-label fw-bold text-muted mb-1" style={lbl}>ID *</label>
              <input type="number" className="form-control border-0 bg-light rounded-3 fw-bold"
                placeholder="1001" value={newBranchId} onChange={(e) => setNewBranchId(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold text-muted mb-1" style={lbl}>BRAND *</label>
              <select className="form-select border-0 bg-light rounded-3"
                value={newBrandId} onChange={(e) => setNewBrandId(Number(e.target.value) || "")}>
                <option value="">-- เลือก --</option>
                {brands.map((b) => <option key={b.brandId} value={b.brandId}>{b.brandName}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold text-muted mb-1" style={lbl}>BRANCH NAME *</label>
              <input className="form-control border-0 bg-light rounded-3" placeholder="e.g. สาขาสยาม"
                value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold text-muted mb-1" style={lbl}>SHORT NAME</label>
              <input className="form-control border-0 bg-light rounded-3" placeholder="e.g. SYM"
                value={newShort} onChange={(e) => setNewShort(e.target.value)} />
            </div>
            
          </div>
          <div className="row g-3">
            <div className="col-md-5">
              <label className="form-label fw-bold text-muted mb-1" style={lbl}>ADDRESS</label>
              <input className="form-control border-0 bg-light rounded-3" placeholder="ที่อยู่สาขา"
                value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold text-muted mb-1" style={lbl}>EMAIL</label>
              <input type="email" className="form-control border-0 bg-light rounded-3" placeholder="branch@example.com"
                value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold text-muted mb-1" style={lbl}>CONTACT</label>
              <input className="form-control border-0 bg-light rounded-3" placeholder="0812345678"
                value={newContact} onChange={(e) => setNewContact(e.target.value)} />
            </div>
          </div>

          <div className="pt-3 border-top mt-3 d-flex justify-content-end">
            <button onClick={handleCreate} disabled={creating}
              className="btn text-white border-0 d-flex align-items-center gap-2 px-4 py-2"
              style={{ borderRadius: "1rem", background: GREEN }}>
              <i className="bi bi-plus-circle" />
              <span className="fw-bold">{creating ? "กำลังบันทึก..." : "บันทึก"}</span>
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <ContentCard title="รายชื่อ Branch ทั้งหมด" subtitle="จัดการ Branch ในระบบ" icon="bi-building">
          <TableContainer>
            <TableHeader columns={COLUMNS} />
            <TableBody isEmpty={!loading && branches.length === 0} colSpan={COLUMNS.length}>
              {loading
                ? <tr><td colSpan={COLUMNS.length} className="text-center py-4 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" />กำลังโหลด...
                  </td></tr>
                : branches.map((b) => (
                  <tr key={b.branchId}>
                    <td className="text-center text-muted">{b.branchId}</td>
                    <td className="text-center fw-bold">{b.branchName}</td>
                    <td className="text-center">{getBrandName(b.brandId)}</td>
                    <td className="text-center text-muted">{b.branchShortName ?? "-"}</td>

                    {/* Info → TableTipbox hover แสดง address + email + contact */}
                    <td className="text-center">
                      <TableTipbox message={getInfoText(b)} />
                    </td>

                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <button onClick={() => setEditingBranch(b)} className="btn btn-sm btn-outline-info rounded-3">
                          <i className="bi bi-pencil" />
                        </button>
                        <button onClick={() => { setPendingDeleteId(b.branchId); setConfirmOpen(true); }}
                          className="btn btn-sm btn-outline-danger rounded-3">
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
        isOpen={confirmOpen} title="ยืนยันการลบ Branch?"
        description="Branch นี้จะถูกลบถาวร" confirmLabel="ลบเลย"
        onConfirm={handleDeleteConfirm} onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}