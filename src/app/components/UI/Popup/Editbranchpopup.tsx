"use client";
import React, { useState } from "react";
import { overlay, modal, labelCss, GREEN } from "./Shared";
import type { BrandItem } from "./Shared";

interface EditBranchPopupProps {
  branch: {
    branchId:        number;
    brandId:         number | null;
    branchName:      string;
    branchShortName: string | null;
    branchAddress:   string | null;
    email:           string | null;
    contact:         string | null;
  };
  brands:  BrandItem[];
  onClose: () => void;
  onSave:  (data: Record<string, unknown>) => Promise<boolean>;
}

export function EditBranchPopup({ branch, brands, onClose, onSave }: EditBranchPopupProps) {
  const [editBranchId, setEditBranchId] = useState(String(branch.branchId));
  const [brandId,      setBrandId]      = useState<number | "">(branch.brandId ?? "");
  const [name,         setName]         = useState(branch.branchName);
  const [short,        setShort]        = useState(branch.branchShortName ?? "");
  const [address,      setAddress]      = useState(branch.branchAddress ?? "");
  const [email,        setEmail]        = useState(branch.email ?? "");
  const [contact,      setContact]      = useState(branch.contact ?? "");
  const [saving,       setSaving]       = useState(false);

  const handleSave = async () => {
    if (!editBranchId.trim()) return alert("กรุณากรอก Branch ID");
    if (!name.trim())         return alert("กรุณากรอกชื่อ Branch");
    setSaving(true);
    const data: Record<string, unknown> = {
      branchId:        branch.branchId,
      brandId:         brandId || null,
      branchName:      name,
      branchShortName: short   || null,
      branchAddress:   address || null,
      email:           email   || null,
      contact:         contact || null,
    };
    const newId = Number(editBranchId);
    if (newId !== branch.branchId) data.newBranchId = newId;
    await onSave(data);
    setSaving(false);
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={{ ...modal(560), padding: "2rem" }} onClick={(e) => e.stopPropagation()}>

        <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
          <div className="bg-success bg-opacity-10 d-flex align-items-center justify-content-center rounded-3"
            style={{ width: 40, height: 40, color: "#10b981" }}>
            <i className="bi bi-building fs-5" />
          </div>
          <div>
            <h6 className="fw-bold mb-0">แก้ไข Branch: {branch.branchName}</h6>
            <small className="text-muted">ID เดิม: {branch.branchId}</small>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-3">
            <label className="fw-bold text-muted text-uppercase mb-1" style={labelCss}>BRANCH ID *</label>
            <input className="form-control border-0 bg-light rounded-3 fw-bold" value={editBranchId}
              onChange={(e) => setEditBranchId(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="fw-bold text-muted text-uppercase mb-1" style={labelCss}>BRAND</label>
            <select className="form-select border-0 bg-light rounded-3" value={brandId}
              onChange={(e) => setBrandId(Number(e.target.value) || "")}>
              <option value="">-- ไม่ระบุ --</option>
              {brands.map((b) => <option key={b.brandId} value={b.brandId}>{b.brandName}</option>)}
            </select>
          </div>
          <div className="col-md-5">
            <label className="fw-bold text-muted text-uppercase mb-1" style={labelCss}>BRANCH NAME *</label>
            <input className="form-control border-0 bg-light rounded-3" value={name}
              onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="fw-bold text-muted text-uppercase mb-1" style={labelCss}>SHORT NAME</label>
            <input className="form-control border-0 bg-light rounded-3" value={short}
              onChange={(e) => setShort(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="fw-bold text-muted text-uppercase mb-1" style={labelCss}>EMAIL</label>
            <input type="email" className="form-control border-0 bg-light rounded-3" value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="fw-bold text-muted text-uppercase mb-1" style={labelCss}>CONTACT</label>
            <input className="form-control border-0 bg-light rounded-3" value={contact}
              onChange={(e) => setContact(e.target.value)} />
          </div>
          <div className="col-12">
            <label className="fw-bold text-muted text-uppercase mb-1" style={labelCss}>ADDRESS</label>
            <input className="form-control border-0 bg-light rounded-3" value={address}
              onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <button onClick={onClose} className="btn btn-light fw-bold px-4 rounded-3">ยกเลิก</button>
          <button onClick={handleSave} disabled={saving}
            className="btn fw-bold px-4 rounded-3 text-white border-0" style={{ background: GREEN }}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}