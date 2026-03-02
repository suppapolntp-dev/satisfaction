// src/app/(admin)/dashboard/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { OverallChart, SatisfactionChart, type StatsData } from "@/app/components/Statistic/chart";
import { PageHeader } from "@/app/components/UI/PageHeader";

type Brand  = { brandId: number; brandName: string };
type Branch = { branchId: number; branchName: string; brandId: number };

export default function DashboardPage() {
  const { data: session } = useSession();

  const canFilter =
    Number(session?.user?.canManageBrand  ?? 0) === 1 ||
    Number(session?.user?.canManageBranch ?? 0) === 1 ||
    Number(session?.user?.canManageArea   ?? 0) === 1 ||
    Number(session?.user?.canManageUser   ?? 0) === 1;

  const sessionBranchIds = (session?.user?.branchIds ?? []) as number[];

  const [brands,       setBrands]       = useState<Brand[]>([]);
  const [branches,     setBranches]     = useState<Branch[]>([]);
  const [filterBrand,  setFilterBrand]  = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [startDate,    setStartDate]    = useState("");
  const [endDate,      setEndDate]      = useState("");
  const [stats,        setStats]        = useState<StatsData | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [updatedAt,    setUpdatedAt]    = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/brands").then((r) => r.json()),
      fetch("/api/branchs").then((r) => r.json()),
    ]).then(([bd, br]) => {
      if (bd.success) setBrands(bd.data);
      if (br.success) setBranches(br.data);
    });
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (canFilter) {
      if (filterBranch)     p.set("branchId", filterBranch);
      else if (filterBrand) p.set("brandId",  filterBrand);
    } else if (sessionBranchIds.length > 0) {
      p.set("branchId", String(sessionBranchIds[0]));
    }
    if (startDate) p.set("startDate", startDate);
    if (endDate)   p.set("endDate",   endDate);

    const json = await fetch(`/api/satisfactions/stats?${p}`).then((r) => r.json());
    if (json.success) {
      setStats(json.data);
      setUpdatedAt(
        new Date().toLocaleDateString("th-TH", {
          year: "numeric", month: "short", day: "numeric",
          hour: "2-digit", minute: "2-digit",
        })
      );
    }
    setLoading(false);
  }, [canFilter, filterBrand, filterBranch, startDate, endDate, sessionBranchIds]);

  useEffect(() => {(async () => { await fetchStats(); })();}, [fetchStats]);

  const visibleBranches = filterBrand
    ? branches.filter((b) => b.brandId === Number(filterBrand))
    : branches;

  return (
    <>
      <PageHeader title="ภาพรวมแบบประเมิน" subtitle="ภาพรวมข้อมูลที่เกี่ยวข้องกับการประเมิน" />

      {/* ── Filter Card ── */}
      <div className="bg-light rounded-4 p-4 border">

        {/* Row 1: title + date controls + update button */}
        <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
        
          {/* icon + label */}
          <div className="d-flex align-items-center gap-2 me-2">
            <div className="bg-white d-flex align-items-center justify-content-center border rounded-3 shadow-sm"
              style={{ width: "40px", height: "40px", color: "#10b981" }}>
              <i className="bi bi-calendar-month" style={{ fontSize: "1.1rem" }} />
            </div>
            <div>
              <div className="fw-bold" style={{ fontSize: "0.9rem" }}>Filter</div>
              <div className="text-muted" style={{ fontSize: "0.65rem" }}>เลือกช่วงเวลาที่ต้องการ</div>
            </div>
          </div>

          {/* Preset */}
          <select
            className="form-select border-0 fw-bold bg-white rounded-3 shadow-sm"
            style={{ fontSize: "0.82rem", width: "auto" }}
            value=""
            onChange={(e) => {
              const days = Number(e.target.value);
              if (!days) { setStartDate(""); setEndDate(""); return; }
              const end   = new Date();
              const start = new Date();
              start.setDate(end.getDate() - (days - 1));
              const fmt = (d: Date) => d.toISOString().split("T")[0];
              setStartDate(fmt(start));
              setEndDate(fmt(end));
            }}
          >
            <option value="">ช่วงเวลา</option>
            <option value="1">วันนี้</option>
            <option value="7">7 วัน</option>
            <option value="30">1 เดือน</option>
            <option value="365">1 ปี</option>
          </select>

          {/* Date from–to */}
          <div className="d-flex align-items-center gap-2">
            <input type="date" className="form-control bg-white border-0 rounded-3 shadow-sm fw-semibold"
              style={{ fontSize: "0.78rem", width: "145px" }}
              value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span className="text-muted fw-bold small">–</span>
            <input type="date" className="form-control bg-white border-0 rounded-3 shadow-sm fw-semibold"
              style={{ fontSize: "0.78rem", width: "145px" }}
              value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          {/* Update button */}
          <button className="btn btn-success fw-bold rounded-3 px-4"
            style={{ backgroundColor: "#10b981", borderColor: "#10b981", fontSize: "0.875rem" }}
            onClick={fetchStats}>
            Update
          </button>
        </div>

        {/* Row 2: Brand / Branch — เฉพาะ user ที่มีสิทธิ์ */}
        {canFilter && (
          <div className="d-flex flex-wrap align-items-center gap-3 pt-3 border-top">
            <span className="text-muted fw-bold" style={{ fontSize: "0.72rem" }}>กรองตาม:</span>

            <select className="form-select border-0 fw-bold bg-white rounded-3 shadow-sm"
              style={{ fontSize: "0.875rem", width: "auto" }}
              value={filterBrand}
              onChange={(e) => { setFilterBrand(e.target.value); setFilterBranch(""); }}>
              <option value="">All Brands</option>
              {brands.map((b) => <option key={b.brandId} value={b.brandId}>{b.brandName}</option>)}
            </select>

            <select className="form-select border-0 fw-bold bg-white rounded-3 shadow-sm"
              style={{ fontSize: "0.875rem", width: "auto" }}
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}>
              <option value="">All Branches</option>
              {visibleBranches.map((b) => <option key={b.branchId} value={b.branchId}>{b.branchName}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* ── Charts ── */}
      <div className="row g-4">
        <SatisfactionChart data={stats} loading={loading} updatedAt={updatedAt} />
        <OverallChart      data={stats} loading={loading} />
      </div>
    </>
  );
}