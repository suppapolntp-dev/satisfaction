// src/app/components/NavigationBar/SideBar.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NAV_COMMON = [
  { href: "/dashboard", label: "Dashboard", icon: "bi-speedometer2", permKey: "canViewDashboard" },
  { href: "/satisfaction", label: "Satisfaction", icon: "bi-person-badge", permKey: "canViewSatisfaction" },
];
const NAV_MANAGE = [
  { href: "/usermanager", label: "Users", icon: "bi-people", permKey: "canManageUser" },
  { href: "/rolemanager", label: "Roles", icon: "bi-shield-check", permKey: "canManageRole" },
  { href: "/brandmanager", label: "Brands", icon: "bi-shop", permKey: "canManageBrand" },
  { href: "/branchmanager", label: "Branches", icon: "bi-geo-alt", permKey: "canManageBranch" },
  { href: "/areamanager", label: "Areas", icon: "bi-map", permKey: "canManageArea" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;

  // ── ดึง brand / branch ของสาขา ──
  const [brandName, setBrandName] = useState("Brand");
  const [branchName, setBranchName] = useState("Branch");
  const [brandLogo, setBrandLogo] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id as string;

    // ดึง brand ของ user
    fetch(`/api/userbrand?userId=${userId}`)
      .then((r) => r.json())
      .then(async (res) => {
        if (res.success && res.data?.length > 0) {
          const brandId = res.data[0].brandId;
          const bRes = await fetch(`/api/brands?id=${brandId}`).then((r) => r.json());
          if (bRes.success && bRes.data) {
            setBrandName(bRes.data.brandName ?? "Brand");
            setBrandLogo(bRes.data.brandImage ?? "");
          }
        }
      })
      .catch(() => {});

    // ดึง branch ของ user
    fetch(`/api/userbranch?userId=${userId}`)
      .then((r) => r.json())
      .then(async (res) => {
        if (res.success && res.data?.length > 0) {
          const branchId = res.data[0].branchId;
          const bRes = await fetch(`/api/branchs?id=${branchId}`).then((r) => r.json());
          if (bRes.success && bRes.data) {
            setBranchName(bRes.data.branchName ?? "Branch");
          }
        }
      })
      .catch(() => {});
  }, [user?.id]);

  const linkClass = (path: string) => {
    const base = "d-flex align-items-center gap-3 px-4 py-3 rounded-4 text-decoration-none transition-all";
    return pathname === path ? `${base} bg-success bg-opacity-10 text-success fw-bold shadow-sm` : `${base} text-muted fw-semibold`;
  };

  const visible = (permKey: string) => Number(user?.[permKey] ?? 0) === 1;
  const hasAnyManage = NAV_MANAGE.some((n) => visible(n.permKey));

  const userName = String(user?.name ?? "User");
  const roleName = String(user?.roleName ?? "—");

  return (
    <aside className="sidebar d-flex flex-column no-scrollbar border-end bg-white"
      style={{ width: "275px", height: "100vh", position: "sticky", top: 0, overflowY: "auto" }}>
      <div className="p-4 d-flex flex-column gap-4">

        {/* ── Logo + Brand/Branch ── */}
        <div className="d-flex align-items-center gap-3 px-2">
          {brandLogo ? (
            <img src={brandLogo} alt={brandName}
              className="shadow-sm"
              style={{ width: 48, height: 48, borderRadius: "1rem", objectFit: "cover" }} />
          ) : (
            <div className="text-white d-flex align-items-center justify-content-center shadow-lg"
              style={{ width: 48, height: 48, borderRadius: "1rem", background: "linear-gradient(135deg,#34d399,#10b981)" }}>
              <i className="bi bi-emoji-smile" style={{ fontSize: "1.5rem" }} />
            </div>
          )}
          <div className="overflow-hidden">
            <h1 className="mb-0 fw-bold text-dark text-truncate" style={{ fontSize: "1.05rem" }}>{brandName}</h1>
            <p className="mb-0 text-muted text-truncate" style={{ fontSize: "0.72rem" }}>{branchName}</p>
          </div>
        </div>

        {/* ── Common nav ── */}
        <nav className="d-flex flex-column gap-2">
          {NAV_COMMON.filter((n) => visible(n.permKey)).map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              <i className={`bi ${item.icon} fs-5`} /><span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* ── Management nav ── */}
        {hasAnyManage && (
          <div>
            <p className="text-muted fw-bold text-uppercase mb-2 px-4" style={{ fontSize: "0.65rem" }}>Management</p>
            <nav className="d-flex flex-column gap-2">
              {NAV_MANAGE.filter((n) => visible(n.permKey)).map((item) => (
                <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                  <i className={`bi ${item.icon} fs-5`} /><span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* ── Profile card ── */}
      <div className="mt-auto p-4">
        <div className="bg-light p-3 rounded-4 border d-flex align-items-center gap-3">
          {brandLogo ? (
            <img src={brandLogo} alt="logo" className="rounded-circle flex-shrink-0 border" style={{ width: 40, height: 40, objectFit: "cover" }} />
          ) : (
            <div className="rounded-circle flex-shrink-0" style={{ width: 40, height: 40,
              backgroundImage: `url('https://ui-avatars.com/api/?name=${userName}&background=10b981&color=ffffff')`, backgroundSize: "cover" }} />
          )}
          <div className="flex-grow-1 overflow-hidden">
            <p className="mb-0 fw-bold text-truncate text-dark small">{userName}</p>
            <p className="mb-0 text-muted text-truncate" style={{ fontSize: "0.72rem" }}>{roleName}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="btn btn-sm text-muted border-0 p-1" title="Logout">
            <i className="bi bi-box-arrow-right" />
          </button>
        </div>
      </div>
    </aside>
  );
}