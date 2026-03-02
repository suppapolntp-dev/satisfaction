"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { overlay, modal, labelCss, GREEN } from "./Shared";
import type { BranchItem, AreaItem, RoleItem, BrandItem } from "./Shared";
import { BranchMultiSelect } from "./Branchmultiselect";

interface EditUserPopupProps {
  user: {
    userId:    number;
    userName:  string;
    brandIds:  number[];
    branchIds: number[];
    areaId:    number | null;
    roleId:    number | null;
  };
  branches:  BranchItem[];
  areas:     AreaItem[];
  roles:     RoleItem[];
  brands:    BrandItem[];
  onClose:   () => void;
  onSuccess: () => void;
}

export function EditUserPopup({ user, branches, areas, roles, brands, onClose, onSuccess }: EditUserPopupProps) {
  const { data: session } = useSession();
  const canEditRole = Number(session?.user?.canManageRole) === 1;
  const activeRoles = roles.filter((r) => r.isActive === 1);

  const [selBrandIds,  setSelBrandIds]  = useState<Set<number>>(new Set(user.brandIds));
  const [selBranchIds, setSelBranchIds] = useState<Set<number>>(new Set(user.branchIds));
  const [areaId,       setAreaId]       = useState<number | "">(user.areaId ?? "");
  const [roleId,       setRoleId]       = useState<number | "">(user.roleId ?? "");
  const [resetPw,      setResetPw]      = useState(false);
  const [newPw,        setNewPw]        = useState("");
  const [showPw,       setShowPw]       = useState(false);
  const [saving,       setSaving]       = useState(false);

  const brandOptions  = brands.map((b) => ({ value: b.brandId, label: b.brandName }));
  const branchOptions = (selBrandIds.size > 0
    ? branches.filter((b) => selBrandIds.has(b.brandId))
    : branches
  ).map((b) => ({ value: b.branchId, label: b.branchName, sub: brands.find((br) => br.brandId === b.brandId)?.brandName }));

  const handleSave = async () => {
    if (resetPw && !newPw.trim()) return alert("กรุณากรอก Password ใหม่");
    setSaving(true);

    const body: Record<string, unknown> = { userId: user.userId, areaId: areaId || null, roleId: roleId || null };
    if (resetPw && newPw) body.userPassword = newPw;
    const res = await fetch("/api/accounts", {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    if (!(await res.json()).success) { alert("บันทึกไม่สำเร็จ"); setSaving(false); return; }

    await Promise.all([
      fetch(`/api/userbrand?userId=${user.userId}`,  { method: "DELETE" }),
      fetch(`/api/userbranch?userId=${user.userId}`, { method: "DELETE" }),
    ]);
    await Promise.all([
      ...[...selBrandIds].map((brandId) =>
        fetch("/api/userbrand",  { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.userId, brandId }) })
      ),
      ...[...selBranchIds].map((branchId) =>
        fetch("/api/userbranch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.userId, branchId }) })
      ),
    ]);

    setSaving(false);
    onSuccess();
    onClose();
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={{ ...modal(580), padding: "2rem" }} onClick={(e) => e.stopPropagation()}>

        <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
          <span className="bi bi-person-gear fs-4 text-success" />
          <div>
            <h6 className="fw-bold mb-0">แก้ไขผู้ใช้งาน</h6>
            <small className="text-muted">{user.userName}</small>
          </div>
        </div>

        <div className="d-flex flex-column gap-3" style={{ fontSize: "0.85rem" }}>

          <div>
            <label className="fw-bold text-muted text-uppercase mb-1" style={labelCss}>Username</label>
            <div className="position-relative">
              <input readOnly value={user.userName} className="form-control bg-light border-0 fw-bold pe-5 rounded-3" />
              <span className="material-symbols-outlined text-muted position-absolute end-0 top-50 translate-middle-y me-3"
                style={{ fontSize: "16px", pointerEvents: "none" }}>lock</span>
            </div>
          </div>

          <div>
            <label className="fw-bold text-muted text-uppercase mb-1" style={labelCss}>
              Brands <span className="text-success">({selBrandIds.size} เลือก)</span>
            </label>
            <BranchMultiSelect
              options={brandOptions} selected={selBrandIds}
              onChange={(next) => {
                setSelBrandIds(next);
                setSelBranchIds((prev) => {
                  const valid = new Set(branches.filter((b) => next.has(b.brandId)).map((b) => b.branchId));
                  return new Set([...prev].filter((id) => valid.has(id)));
                });
              }}
            />
          </div>

          <div>
            <label className="fw-bold text-muted text-uppercase mb-1" style={labelCss}>
              Branches <span className="text-success">({selBranchIds.size} เลือก)</span>
            </label>
            <BranchMultiSelect options={branchOptions} selected={selBranchIds} onChange={setSelBranchIds} />
          </div>

          <div className="row g-2">
            <div className={canEditRole ? "col-6" : "col-12"}>
              <label className="fw-bold text-muted text-uppercase mb-1" style={labelCss}>Area</label>
              <select className="form-select border-0 bg-light rounded-3" value={areaId}
                onChange={(e) => setAreaId(Number(e.target.value) || "")}>
                <option value="">-- ไม่ระบุ --</option>
                {areas.map((a) => <option key={a.areaId} value={a.areaId}>{a.areaName}</option>)}
              </select>
            </div>
            {canEditRole && (
              <div className="col-6">
                <label className="fw-bold text-muted text-uppercase mb-1" style={labelCss}>Role</label>
                <select className="form-select border-0 bg-light rounded-3" value={roleId}
                  onChange={(e) => setRoleId(Number(e.target.value) || "")}>
                  <option value="">-- ไม่ระบุ --</option>
                  {activeRoles.map((r) => <option key={r.roleId} value={r.roleId}>{r.roleName}</option>)}
                </select>
              </div>
            )}
          </div>

          <div>
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="resetPw"
                checked={resetPw} onChange={(e) => setResetPw(e.target.checked)} />
              <label className="form-check-label fw-semibold small" htmlFor="resetPw">เปลี่ยน Password</label>
            </div>
            {resetPw && (
              <div className="position-relative mt-2">
                <input type={showPw ? "text" : "password"} value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="form-control border-0 bg-light pe-5 rounded-3" placeholder="New password" />
                <span className="material-symbols-outlined text-muted position-absolute end-0 top-50 translate-middle-y me-3"
                  style={{ fontSize: "16px", cursor: "pointer" }} onClick={() => setShowPw((v) => !v)}>
                  {showPw ? "visibility_off" : "visibility"}
                </span>
              </div>
            )}
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