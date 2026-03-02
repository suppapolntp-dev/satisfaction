// src/app/(admin)/usermanager/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { PageHeader }  from "@/app/components/UI/PageHeader";
import { ContentCard } from "@/app/components/UI/ContentCard";
import { TableContainer, TableHeader, TableBody } from "@/app/components/Table";
import { TableTipbox } from "@/app/components/Form/Tipbox";
import { ConfirmPopup, EditUserPopup } from "@/app/components/UI/Popup";
import { MultiSelect } from "@/app/components/Form/MultiSelect";

type Account = { userId: number; userName: string; roleId: number | null; areaId: number | null };
type Brand   = { brandId: number; brandName: string };
type Branch  = { branchId: number; branchName: string; brandId: number };
type Area    = { areaId:  number; areaName:  string };
type Role    = { roleId:  number; roleName:  string; isActive: number };

// username | brands | branches | area(tip) | role(tip) | action
const userColumns = [
  { label: "Username", width: "18%" },
  { label: "Brands",   width: "16%" },
  { label: "Branches", width: "22%" },
  { label: "Area",     width: "8%"  },
  { label: "Role",     width: "8%"  },
  { label: "Action",   width: "12%" },
];

const lbl   = (text: string) => (
  <label className="form-label fw-bold text-muted mb-1" style={{ fontSize: "0.7rem" }}>{text}</label>
);
const GREEN = "linear-gradient(135deg,#34d399,#10b981)";

export default function UserManagerPage() {
  const [users,         setUsers]         = useState<Account[]>([]);
  const [brands,        setBrands]        = useState<Brand[]>([]);
  const [branches,      setBranches]      = useState<Branch[]>([]);
  const [areas,         setAreas]         = useState<Area[]>([]);
  const [roles,         setRoles]         = useState<Role[]>([]);
  const [userBrandMap,  setUserBrandMap]  = useState<Record<number, number[]>>({});
  const [userBranchMap, setUserBranchMap] = useState<Record<number, number[]>>({});
  const [loading,       setLoading]       = useState(true);

  // create
  const [newUser,      setNewUser]      = useState("");
  const [newPass,      setNewPass]      = useState("");
  const [newConfirm,   setNewConfirm]   = useState("");
  const [newBrandIds,  setNewBrandIds]  = useState<Set<number>>(new Set());
  const [newBranchIds, setNewBranchIds] = useState<Set<number>>(new Set());
  const [newAreaId,    setNewAreaId]    = useState<number | "">("");
  const [newRoleId,    setNewRoleId]    = useState<number | "">("");
  const [showPass,     setShowPass]     = useState(false);
  const [creating,     setCreating]     = useState(false);

  const [editingUser,     setEditingUser]     = useState<Account | null>(null);
  const [confirmOpen,     setConfirmOpen]     = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const activeRoles   = roles.filter((r) => r.isActive === 1);
  const brandOptions  = brands.map((b) => ({ value: b.brandId, label: b.brandName }));
  const branchOptions = (newBrandIds.size > 0 ? branches.filter((b) => newBrandIds.has(b.brandId)) : branches)
    .map((b) => ({ value: b.branchId, label: b.branchName }));

  // helpers
  const nameList = (ids: number[], list: { id: number; name: string }[]) =>
    ids.length === 0 ? "—" : ids.map((id) => list.find((x) => x.id === id)?.name ?? String(id)).join(", ");

  const getBrandNames  = (u: Account) => nameList(userBrandMap[u.userId]  ?? [], brands.map((b)  => ({ id: b.brandId,  name: b.brandName  })));
  const getBranchNames = (u: Account) => nameList(userBranchMap[u.userId] ?? [], branches.map((b) => ({ id: b.branchId, name: b.branchName })));
  const getRoleName    = (u: Account) => roles.find((r) => r.roleId === u.roleId)?.roleName ?? "—";
  const getAreaName    = (u: Account) => areas.find((a) => a.areaId === u.areaId)?.areaName ?? "ไม่ระบุ";

  const fetchAll = async () => {
    setLoading(true);
    const [uRes, brRes, aRes, roRes, bdRes] = await Promise.all([
      fetch("/api/accounts").then((r) => r.json()),
      fetch("/api/branchs").then((r)  => r.json()),
      fetch("/api/areas").then((r)    => r.json()),
      fetch("/api/roles").then((r)    => r.json()),
      fetch("/api/brands").then((r)   => r.json()),
    ]);
    const us: Account[] = uRes.success ? uRes.data : [];
    if (uRes.success)  setUsers(us);
    if (brRes.success) setBranches(brRes.data);
    if (aRes.success)  setAreas(aRes.data);
    if (roRes.success) setRoles(roRes.data);
    if (bdRes.success) setBrands(bdRes.data);

    if (us.length > 0) {
      const [brdR, brR] = await Promise.all([
        Promise.all(us.map((u) => fetch(`/api/userbrand?userId=${u.userId}`).then((r)  => r.json()))),
        Promise.all(us.map((u) => fetch(`/api/userbranch?userId=${u.userId}`).then((r) => r.json()))),
      ]);
      const brdMap: Record<number, number[]> = {};
      const brMap:  Record<number, number[]> = {};
      brdR.forEach((res, i) => { if (res.success) brdMap[us[i].userId] = res.data.map((x: { brandId:  number }) => x.brandId);  });
      brR.forEach( (res, i) => { if (res.success) brMap[us[i].userId]  = res.data.map((x: { branchId: number }) => x.branchId); });
      setUserBrandMap(brdMap);
      setUserBranchMap(brMap);
    }
    setLoading(false);
  };
  useEffect(() => {(async () => {await fetchAll();})();}, []);

  const handleCreate = async () => {
    if (!newUser.trim())        return alert("กรุณากรอก Username");
    if (!newPass.trim())        return alert("กรุณากรอก Password");
    if (newPass !== newConfirm) return alert("Password ไม่ตรงกัน");
    if (!newRoleId)             return alert("กรุณาเลือก Role");
    setCreating(true);
    const json = await fetch("/api/accounts", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: newUser, userPassword: newPass, roleId: newRoleId, areaId: newAreaId || null }),
    }).then((r) => r.json());
    if (!json.success) { alert(json.error ?? "เกิดข้อผิดพลาด"); setCreating(false); return; }
    const userId = json.data?.insertId;
    if (userId) {
      await Promise.all([
        ...[...newBrandIds].map((brandId)   => fetch("/api/userbrand",  { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, brandId  }) })),
        ...[...newBranchIds].map((branchId) => fetch("/api/userbranch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, branchId }) })),
      ]);
    }
    setNewUser(""); setNewPass(""); setNewConfirm("");
    setNewBrandIds(new Set()); setNewBranchIds(new Set()); setNewAreaId(""); setNewRoleId("");
    fetchAll();
    setCreating(false);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteId) return;
    setConfirmOpen(false);
    await Promise.all([
      fetch(`/api/userbrand?userId=${pendingDeleteId}`,  { method: "DELETE" }),
      fetch(`/api/userbranch?userId=${pendingDeleteId}`, { method: "DELETE" }),
      fetch(`/api/accounts?id=${pendingDeleteId}`,       { method: "DELETE" }),
    ]);
    fetchAll();
    setPendingDeleteId(null);
  };

  return (
    <>
      <PageHeader title="จัดการผู้ใช้งาน" subtitle="สร้างและจัดการสิทธิ์การเข้าถึงของผู้ใช้" />

      {/* ── Create Form ── */}
      <ContentCard title="สร้างผู้ใช้งานใหม่" subtitle="ระบุรายละเอียดบัญชีและสิทธิ์" icon="bi-person-plus-fill">
        <div className="row g-3">
          <div className="col-md-4">
            {lbl("USERNAME *")}
            <input className="form-control border-0 bg-light rounded-3" placeholder="e.g. john_doe"
              value={newUser} onChange={(e) => setNewUser(e.target.value)} />
          </div>
          <div className="col-md-4">
            {lbl("PASSWORD *")}
            <div className="position-relative">
              <input type={showPass ? "text" : "password"} className="form-control border-0 bg-light rounded-3 pe-5"
                placeholder="••••••••" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
              <span className="material-symbols-outlined text-muted position-absolute end-0 top-50 translate-middle-y me-3"
                style={{ fontSize: 16, cursor: "pointer" }} onClick={() => setShowPass((v) => !v)}>
                {showPass ? "visibility_off" : "visibility"}
              </span>
            </div>
          </div>
          <div className="col-md-4">
            {lbl("CONFIRM PASSWORD *")}
            <input type={showPass ? "text" : "password"} className="form-control border-0 bg-light rounded-3"
              placeholder="••••••••" value={newConfirm} onChange={(e) => setNewConfirm(e.target.value)} />
          </div>

          <div className="col-md-3">
            {lbl(`BRANDS (${newBrandIds.size} เลือก)`)}
            <MultiSelect options={brandOptions} selected={newBrandIds}
              onChange={(next) => {
                setNewBrandIds(next);
                setNewBranchIds((prev) => {
                  const valid = new Set(branches.filter((b) => next.has(b.brandId)).map((b) => b.branchId));
                  return new Set([...prev].filter((id) => valid.has(id)));
                });
              }} placeholder="เลือก Brand..." />
          </div>
          <div className="col-md-3">
            {lbl(`BRANCHES (${newBranchIds.size} เลือก)`)}
            <MultiSelect options={branchOptions} selected={newBranchIds}
              onChange={setNewBranchIds} placeholder="เลือก Branch..." />
          </div>
          <div className="col-md-3">
            {lbl("AREA")}
            <select className="form-select border-0 bg-light rounded-3" value={newAreaId}
              onChange={(e) => setNewAreaId(Number(e.target.value) || "")}>
              <option value="">-- ไม่ระบุ --</option>
              {areas.map((a) => <option key={a.areaId} value={a.areaId}>{a.areaName}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            {lbl("ROLE *")}
            <select className="form-select border-0 bg-light rounded-3" value={newRoleId}
              onChange={(e) => setNewRoleId(Number(e.target.value) || "")}>
              <option value="">-- เลือก Role --</option>
              {activeRoles.map((r) => <option key={r.roleId} value={r.roleId}>{r.roleName}</option>)}
            </select>
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
      <ContentCard title="รายชื่อผู้ใช้งาน" subtitle="จัดการผู้ใช้ทั้งหมดในระบบ" icon="bi-people">
        <TableContainer>
          <TableHeader columns={userColumns} />
          <TableBody isEmpty={!loading && users.length === 0} colSpan={userColumns.length}>
            {loading ? (
              <tr><td colSpan={userColumns.length} className="text-center py-4 text-muted">
                <span className="spinner-border spinner-border-sm me-2" />กำลังโหลด...
              </td></tr>
            ) : users.map((u) => (
              <tr key={u.userId}>

                {/* Username — แสดงปกติ */}
                <td className="text-center fw-bold">{u.userName}</td>

                {/* Brands — แสดงปกติ ตัดด้วย ellipsis */}
                <td className="text-center small text-muted"
                  style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {getBrandNames(u)}
                </td>

                {/* Branches — แสดงปกติ ตัดด้วย ellipsis */}
                <td className="text-center small text-muted"
                  style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {getBranchNames(u)}
                </td>

                {/* Area → TableTipbox */}
                <td className="text-center">
                  <TableTipbox message={getAreaName(u)} />
                </td>

                {/* Role → TableTipbox */}
                <td className="text-center">
                  <TableTipbox message={getRoleName(u)} />
                </td>

                {/* Action */}
                <td className="text-center">
                  <div className="d-flex gap-2 justify-content-center">
                    <button onClick={() => setEditingUser(u)} className="btn btn-sm btn-outline-info rounded-3">
                      <i className="bi bi-pencil" />
                    </button>
                    <button onClick={() => { setPendingDeleteId(u.userId); setConfirmOpen(true); }}
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

      {editingUser && (
        <EditUserPopup
          user={{ ...editingUser, brandIds: userBrandMap[editingUser.userId] ?? [], branchIds: userBranchMap[editingUser.userId] ?? [] }}
          branches={branches} areas={areas} roles={roles} brands={brands}
          onClose={() => setEditingUser(null)} onSuccess={fetchAll}
        />
      )}
      <ConfirmPopup isOpen={confirmOpen} title="ยืนยันการลบผู้ใช้?"
        description="ข้อมูลผู้ใช้และสิทธิ์ทั้งหมดจะถูกลบถาวร" confirmLabel="ลบเลย"
        onConfirm={handleDeleteConfirm} onCancel={() => setConfirmOpen(false)} />
    </>
  );
}