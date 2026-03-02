"use client";
import React, { useEffect, useState } from "react";
import { overlay, modal, labelCss, GREEN } from "./Shared";
import type { BranchItem, BrandItem } from "./Shared";

interface EditAreaPopupProps {
  area: {
    areaId:      number;
    areaName:    string;
    description: string | null;
    canFilter?:  number;
  };
  allBranches: BranchItem[];
  allBrands:   BrandItem[];
  onClose:     () => void;
  onSuccess:   () => void;
}

export function EditAreaPopup({ area, allBranches, allBrands, onClose, onSuccess }: EditAreaPopupProps) {
  const [areaName,      setAreaName]      = useState(area.areaName);
  const [description,   setDescription]   = useState(area.description ?? "");
  const [canFilter,     setCanFilter]     = useState((area.canFilter ?? 0) === 1);
  const [activeBrandId, setActiveBrandId] = useState<number>(allBrands[0]?.brandId ?? 0);
  const [checked,       setChecked]       = useState<Set<number>>(new Set());
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);

  useEffect(() => {
    fetch(`/api/areabranch?areaId=${area.areaId}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success)
          setChecked(new Set((j.data as { branchId: number }[]).map((x) => x.branchId)));
        setLoading(false);
      });
  }, [area.areaId]);

  const brandBranches = allBranches.filter((b) => b.brandId === activeBrandId);
  const allChecked    = brandBranches.length > 0 && brandBranches.every((b) => checked.has(b.branchId));

  const toggle = (id: number) =>
    setChecked((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleAll = () => {
    const ids = brandBranches.map((b) => b.branchId);
    setChecked((p) => {
      const n = new Set(p);
      allChecked ? ids.forEach((id) => n.delete(id)) : ids.forEach((id) => n.add(id));
      return n;
    });
  };

  const handleSave = async () => {
    if (!areaName.trim()) return alert("กรุณากรอกชื่อ Area");
    setSaving(true);

    await fetch("/api/areas", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ areaId: area.areaId, areaName, description: description || null, canFilter: canFilter ? 1 : 0 }),
    });

    await fetch(`/api/areabranch?areaId=${area.areaId}`, { method: "DELETE" });
    await Promise.all([...checked].map((branchId) =>
      fetch("/api/areabranch", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ areaId: area.areaId, branchId }),
      })
    ));

    setSaving(false);
    onSuccess();
    onClose();
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={{ ...modal(780), padding: 0 }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <span className="bi bi-map fs-5 text-success" />
            <div>
              <h6 className="fw-bold mb-0">Area Management</h6>
              <small className="text-muted">จัดการชื่อและสาขาใน Area นี้</small>
            </div>
          </div>
          <label className="d-flex align-items-center gap-2 mb-0" style={{ cursor: "pointer" }}>
            <div className="form-check form-switch m-0">
              <input className="form-check-input" type="checkbox"
                checked={canFilter} onChange={(e) => setCanFilter(e.target.checked)} />
            </div>
            <div>
              <div className={`fw-bold small ${canFilter ? "text-success" : "text-muted"}`}>
                อนุญาตให้ Filter Dashboard
              </div>
              <div className="text-muted" style={{ fontSize: "10px" }}>
                {canFilter ? "user ใน area นี้เห็น filter ตาม brand/branch" : "เห็นแค่ยอดรวม"}
              </div>
            </div>
          </label>
        </div>

        {/* Area name + description */}
        <div className="d-flex gap-3 px-4 py-3 border-bottom">
          <div className="flex-grow-1">
            <label className="fw-bold text-muted text-uppercase mb-1" style={labelCss}>Area Name</label>
            <input className="form-control border-0 bg-light rounded-3" value={areaName}
              onChange={(e) => setAreaName(e.target.value)} placeholder="e.g. North Region" />
          </div>
          <div className="flex-grow-1">
            <label className="fw-bold text-muted text-uppercase mb-1" style={labelCss}>หมายเหตุ</label>
            <input className="form-control border-0 bg-light rounded-3" value={description}
              onChange={(e) => setDescription(e.target.value)} placeholder="ข้อมูลเพิ่มเติม" />
          </div>
        </div>

        {/* Body: Brand sidebar + Branch list */}
        <div className="d-flex" style={{ height: "340px" }}>

          {/* Brand sidebar */}
          <div className="border-end" style={{ width: "190px", overflowY: "auto" }}>
            {allBrands.map((brand) => {
              const total    = allBranches.filter((b) => b.brandId === brand.brandId).length;
              const selected = allBranches.filter((b) => b.brandId === brand.brandId && checked.has(b.branchId)).length;
              const active   = activeBrandId === brand.brandId;
              return (
                <div key={brand.brandId} onClick={() => setActiveBrandId(brand.brandId)}
                  className={`px-3 py-2 border-bottom d-flex align-items-center justify-content-between ${active ? "bg-success bg-opacity-10" : ""}`}
                  style={{ cursor: "pointer" }}>
                  <div>
                    <div className={`fw-bold small ${active ? "text-success" : "text-dark"}`}>{brand.brandName}</div>
                    <div className="text-muted" style={{ fontSize: "10px" }}>{selected}/{total} สาขา</div>
                  </div>
                  <i className={`bi bi-chevron-right small ${active ? "text-success" : "text-muted"}`} />
                </div>
              );
            })}
          </div>

          {/* Branch list */}
          <div className="flex-grow-1 d-flex flex-column overflow-hidden">
            <div className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom bg-white">
              <div>
                <div className="fw-bold small">{allBrands.find((b) => b.brandId === activeBrandId)?.brandName}</div>
                <div className="text-muted" style={{ fontSize: "10px" }}>{brandBranches.length} สาขา</div>
              </div>
              {brandBranches.length > 0 && (
                <label className="d-flex align-items-center gap-2 small fw-bold text-muted mb-0" style={{ cursor: "pointer" }}>
                  เลือกทั้งหมด
                  <input type="checkbox" className="form-check-input m-0" checked={allChecked} onChange={toggleAll} />
                </label>
              )}
            </div>
            <div className="flex-grow-1 overflow-auto">
              {loading ? (
                <div className="text-center py-4 text-muted small">
                  <span className="spinner-border spinner-border-sm me-2" />โหลด...
                </div>
              ) : brandBranches.length === 0 ? (
                <div className="text-center py-4 text-muted small">ไม่มีสาขาใน Brand นี้</div>
              ) : brandBranches.map((b) => (
                <label key={b.branchId}
                  className={`d-flex align-items-center gap-3 px-4 py-2 border-bottom w-100 mb-0 ${checked.has(b.branchId) ? "bg-success bg-opacity-10" : ""}`}
                  style={{ cursor: "pointer", minHeight: "48px" }}>
                  <input type="checkbox" className="form-check-input m-0"
                    checked={checked.has(b.branchId)} onChange={() => toggle(b.branchId)} />
                  <div>
                    <div className="fw-semibold small">{b.branchName}</div>
                    <div className="text-muted" style={{ fontSize: "10px" }}>#{b.branchId}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top">
          <span className="text-muted small">เลือกแล้ว {checked.size} สาขา</span>
          <div className="d-flex gap-2">
            <button onClick={onClose} className="btn btn-light fw-bold px-4 rounded-3">ยกเลิก</button>
            <button onClick={handleSave} disabled={saving}
              className="btn fw-bold px-4 rounded-3 text-white border-0" style={{ background: GREEN }}>
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}