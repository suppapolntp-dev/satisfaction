"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/app/components/UI/PageHeader";
import { ContentCard } from "@/app/components/UI/ContentCard";
import { TableContainer, TableHeader, TableBody } from "@/app/components/Table";
import { TableTipbox } from "@/app/components/Form/Tipbox";
import { ConfirmPopup, EditAreaPopup } from "@/app/components/UI/Popup";

type Area   = { areaId: number; areaName: string; description: string | null };
type Branch = { branchId: number; branchName: string; brandId: number };
type Brand  = { brandId: number; brandName: string };

const cols = [
  { label: "Area ID",   width: "15%" },
  { label: "Area Name", width: "30%" },
  { label: "Info",      width: "30%" },
  { label: "Action",    width: "25%" },
];

const lbl   = { fontSize: "0.7rem" };
const GREEN = "linear-gradient(135deg,#34d399,#10b981)";

export default function AreaManagerPage() {
  const [areas,    setAreas]    = useState<Area[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [brands,   setBrands]   = useState<Brand[]>([]);
  const [loading,  setLoading]  = useState(true);

  // create
  const [areaName,    setAreaName]    = useState("");
  const [description, setDescription] = useState("");
  const [creating,    setCreating]    = useState(false);

  // edit popup
  const [editingArea, setEditingArea] = useState<Area | null>(null);

  // delete
  const [confirmOpen,     setConfirmOpen]     = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    const [aRes, brRes, bdRes] = await Promise.all([
      fetch("/api/areas").then((r)   => r.json()),
      fetch("/api/branchs").then((r) => r.json()),
      fetch("/api/brands").then((r)  => r.json()),
    ]);
    if (aRes.success)  setAreas(aRes.data);
    if (brRes.success) setBranches(brRes.data);
    if (bdRes.success) setBrands(bdRes.data);
    setLoading(false);
  };
  useEffect(() => {(async () => { await fetchAll(); })();}, []);

  const handleCreate = async () => {
    if (!areaName.trim()) return alert("กรุณากรอกชื่อ Area");
    setCreating(true);
    const json = await fetch("/api/areas", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ areaName, description }),
    }).then((r) => r.json());
    if (json.success) { setAreaName(""); setDescription(""); fetchAll(); }
    else alert(json.error);
    setCreating(false);
  };

  const handleDeleteConfirm = async () => {
    setConfirmOpen(false);
    await fetch(`/api/areas?id=${pendingDeleteId}`, { method: "DELETE" });
    fetchAll();
    setPendingDeleteId(null);
  };

  return (
    <>
      <PageHeader title="จัดการ Area" subtitle="สร้างและจัดการ Area ในระบบ" />

      {/* ── Create Form ── */}
      <ContentCard title="สร้าง Area ใหม่" subtitle="เพิ่ม Area เข้าสู่ระบบ" icon="bi-map">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold text-muted mb-1" style={lbl}>AREA NAME *</label>
            <input className="form-control border-0 bg-light rounded-3" placeholder="e.g. กรุงเทพเหนือ"
              value={areaName} onChange={(e) => setAreaName(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold text-muted mb-1" style={lbl}>DESCRIPTION</label>
            <input className="form-control border-0 bg-light rounded-3" placeholder="รายละเอียด Area"
              value={description} onChange={(e) => setDescription(e.target.value)} />
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
      <ContentCard title="รายชื่อ Area ทั้งหมด" subtitle="จัดการ Area ในระบบ" icon="bi-map">
        <TableContainer>
          <TableHeader columns={cols} />
          <TableBody isEmpty={!loading && areas.length === 0} colSpan={cols.length}>
            {loading ? (
              <tr><td colSpan={cols.length} className="text-center py-4 text-muted">
                <span className="spinner-border spinner-border-sm me-2" />กำลังโหลด...
              </td></tr>
            ) : areas.map((a) => (
              <tr key={a.areaId}>
                <td className="text-center">{a.areaId}</td>
                <td className="text-center fw-bold">{a.areaName}</td>
                <td className="text-center text-muted"><TableTipbox message={a.description ?? "-"} /></td>
                <td className="text-center">
                  <div className="d-flex gap-2 justify-content-center">
                    <button onClick={() => setEditingArea(a)} className="btn btn-sm btn-outline-info rounded-3"><i className="bi bi-pencil" /></button>
                    <button onClick={() => { setPendingDeleteId(a.areaId); setConfirmOpen(true); }} className="btn btn-sm btn-outline-danger rounded-3"><i className="bi bi-trash" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </TableBody>
        </TableContainer>
      </ContentCard>

      {editingArea && (
        <EditAreaPopup
          area={editingArea} allBranches={branches} allBrands={brands}
          onClose={() => setEditingArea(null)} onSuccess={fetchAll}
        />
      )}

      <ConfirmPopup isOpen={confirmOpen} title="ยืนยันการลบ Area?" description="Area นี้จะถูกลบถาวร"
        confirmLabel="ลบเลย" onConfirm={handleDeleteConfirm} onCancel={() => setConfirmOpen(false)} />
    </>
  );
}