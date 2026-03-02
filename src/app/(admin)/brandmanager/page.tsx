"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/app/components/UI/PageHeader";
import { ContentCard } from "@/app/components/UI/ContentCard";
import { TableContainer, TableHeader, TableBody } from "@/app/components/Table";
import { ConfirmPopup } from "@/app/components/UI/Popup";

type Brand = {
  brandId:        number;
  brandName:      string;
  brandShortName: string | null;
  brandImage:     string | null;
};

const cols = [
  { label: "ID",         width: "10%" },
  { label: "Brand Name", width: "28%" },
  { label: "Short Name", width: "17%" },
  { label: "Image URL",  width: "30%" },
  { label: "Action",     width: "15%" },
];

const lbl   = { fontSize: "0.7rem" };
const GREEN = "linear-gradient(135deg,#34d399,#10b981)";

export default function BrandManagerPage() {
  const [brands,  setBrands]  = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // create
  const [newId,    setNewId]    = useState("");
  const [newName,  setNewName]  = useState("");
  const [newShort, setNewShort] = useState("");
  const [newImage, setNewImage] = useState("");
  const [creating, setCreating] = useState(false);

  // edit
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editName,     setEditName]     = useState("");
  const [editShort,    setEditShort]    = useState("");
  const [editImage,    setEditImage]    = useState("");
  const [saving,       setSaving]       = useState(false);

  // delete
  const [confirmOpen,     setConfirmOpen]     = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const fetchBrands = async () => {
    setLoading(true);
    const json = await fetch("/api/brands").then((r) => r.json());
    if (json.success) setBrands(json.data);
    setLoading(false);
  };
  useEffect(() => {(async () => { await fetchBrands(); })();}, []);

  const handleCreate = async () => {
    if (!newId.trim())   return alert("กรุณากรอก Brand ID");
    if (!newName.trim()) return alert("กรุณากรอกชื่อ Brand");
    setCreating(true);
    const json = await fetch("/api/brands", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandId: Number(newId), brandName: newName, brandShortName: newShort || null, brandImage: newImage || null }),
    }).then((r) => r.json());
    if (json.success) { setNewId(""); setNewName(""); setNewShort(""); setNewImage(""); fetchBrands(); }
    else alert(json.error);
    setCreating(false);
  };

  const handleEditClick = (b: Brand) => {
    setEditingBrand(b);
    setEditName(b.brandName);
    setEditShort(b.brandShortName ?? "");
    setEditImage(b.brandImage     ?? "");
  };

  const handleEditSave = async () => {
    if (!editingBrand || !editName.trim()) return alert("กรุณากรอกชื่อ Brand");
    setSaving(true);
    const json = await fetch("/api/brands", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandId: editingBrand.brandId, brandName: editName, brandShortName: editShort || null, brandImage: editImage || null }),
    }).then((r) => r.json());
    if (json.success) { setEditingBrand(null); fetchBrands(); } else alert(json.error);
    setSaving(false);
  };

  const handleDeleteConfirm = async () => {
    setConfirmOpen(false);
    await fetch(`/api/brands?id=${pendingDeleteId}`, { method: "DELETE" });
    fetchBrands();
    setPendingDeleteId(null);
  };

  return (
    <>
      <PageHeader title="จัดการ Brand" subtitle="สร้างและจัดการ Brand ในระบบ" />

      {/* ── Create Form ── */}
      <ContentCard title="สร้าง Brand ใหม่" subtitle="เพิ่ม Brand เข้าสู่ระบบ" icon="bi-shop">
        <div className="row g-3">
          <div className="col-md-2">
            <label className="form-label fw-bold text-muted mb-1" style={lbl}>ID *</label>
            <input type="number" className="form-control border-0 bg-light rounded-3 fw-bold"
              placeholder="1" value={newId} onChange={(e) => setNewId(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold text-muted mb-1" style={lbl}>BRAND NAME *</label>
            <input className="form-control border-0 bg-light rounded-3" placeholder="e.g. MK Restaurant"
              value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <div className="col-md-2 ">
            <label className="form-label fw-bold text-muted mb-1" style={lbl}>SHORT NAME</label>
            <input className="form-control border-0 bg-light rounded-3" placeholder="e.g. MK"
              value={newShort} onChange={(e) => setNewShort(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold text-muted mb-1" style={lbl}>IMAGE URL</label>
            <input className="form-control border-0 bg-light rounded-3" placeholder="https://..."
              value={newImage} onChange={(e) => setNewImage(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 pt-3 border-top d-flex justify-content-end">
          <button onClick={handleCreate} disabled={creating}
            className="btn fw-bold text-white border-0 px-4 py-2 rounded-3 d-flex align-items-center gap-2"
            style={{ background: GREEN }}>
            <i className="bi bi-plus-circle" />
            {creating ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </ContentCard>

      {/* ── Table ── */}
      <ContentCard title="รายชื่อ Brand ทั้งหมด" subtitle="จัดการ Brand ในระบบ" icon="bi-shop">
        <TableContainer>
          <TableHeader columns={cols} />
          <TableBody isEmpty={!loading && brands.length === 0} colSpan={cols.length}>
            {loading ? (
              <tr><td colSpan={cols.length} className="text-center py-4 text-muted">
                <span className="spinner-border spinner-border-sm me-2" />กำลังโหลด...
              </td></tr>
            ) : brands.map((b) => {
              const editing = editingBrand?.brandId === b.brandId;
              return (
                <tr key={b.brandId}>
                  <td className="text-center text-muted">{b.brandId}</td>
                  <td className="text-center fw-bold">
                    {editing
                      ? <input className="form-control form-control-sm border-0 bg-light text-center fw-bold" value={editName} onChange={(e) => setEditName(e.target.value)} />
                      : b.brandName}
                  </td>
                  <td className="text-center">
                    {editing
                      ? <input className="form-control form-control-sm border-0 bg-light text-center" value={editShort} onChange={(e) => setEditShort(e.target.value)} />
                      : (b.brandShortName ?? "-")}
                  </td>
                  <td className="text-center">
                    {editing
                      ? <input className="form-control form-control-sm border-0 bg-light text-center" value={editImage} onChange={(e) => setEditImage(e.target.value)} />
                      : b.brandImage
                        ? <a href={b.brandImage} target="_blank" rel="noreferrer" className="text-success small">ดูรูป</a>
                        : "-"}
                  </td>
                  <td className="text-center">
                    <div className="d-flex gap-2 justify-content-center">
                      {editing ? (
                        <>
                          <button onClick={handleEditSave} disabled={saving} className="btn btn-sm btn-success rounded-3"><i className="bi bi-check-lg" /></button>
                          <button onClick={() => setEditingBrand(null)} className="btn btn-sm btn-light rounded-3"><i className="bi bi-x-lg" /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditClick(b)} className="btn btn-sm btn-outline-info rounded-3"><i className="bi bi-pencil" /></button>
                          <button onClick={() => { setPendingDeleteId(b.brandId); setConfirmOpen(true); }} className="btn btn-sm btn-outline-danger rounded-3"><i className="bi bi-trash" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </TableBody>
        </TableContainer>
      </ContentCard>

      <ConfirmPopup isOpen={confirmOpen} title="ยืนยันการลบ Brand?"
        description="Brand นี้จะถูกลบถาวร" confirmLabel="ลบเลย"
        onConfirm={handleDeleteConfirm} onCancel={() => setConfirmOpen(false)} />
    </>
  );
}