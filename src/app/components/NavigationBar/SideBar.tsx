"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

// แยกตาม role
const NAV_ADMIN = [
  { href: "/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
  { href: "/satisfaction", label: "Satisfaction", icon: "bi-person-badge" },
  { href: "/usermanager", label: "Users", icon: "bi-people" },
  { href: "/groupmanager", label: "Groups", icon: "bi-layers-half" },
  {
    href: "/login",
    label: "ออกจากระบบ",
    icon: "bi-box-arrow-right",
    isLogout: true,
  },
];

const NAV_USER = [
  { href: "/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
  { href: "/satisfaction", label: "Satisfaction", icon: "bi-person-badge" },
  {
    href: "/login",
    label: "ออกจากระบบ",
    icon: "bi-box-arrow-right",
    isLogout: true,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  // เลือก nav ตาม role
  const NAV_ITEMS = role === 2 ? NAV_ADMIN : NAV_USER;

  const getNavLinkClass = (path: string) => {
    const baseClass =
      "d-flex align-items-center gap-3 px-4 py-3 rounded-4 text-decoration-none transition-all";
    const isActive = pathname === path;
    return isActive
      ? `${baseClass} bg-success bg-opacity-10 text-success fw-bold shadow-sm`
      : `${baseClass} text-muted fw-semibold hover-bg-light`;
  };

  return (
    <aside
      className="sidebar d-flex flex-column no-scrollbar border-end"
      style={{
        width: "275px",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
      }}
    >
      <div className="p-4 d-flex flex-column gap-4">
        {/* Logo */}
        <div className="d-flex align-items-center gap-3 px-2">
          <div
            className="text-white d-flex align-items-center justify-content-center shadow-lg"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "1rem",
              background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
            }}
          >
            <i className="bi bi-emoji-smile" style={{ fontSize: "1.5rem" }}></i>
          </div>
          <div className="d-flex flex-column">
            <h1
              className="mb-0 fw-bold text-dark"
              style={{ fontSize: "1.125rem", lineHeight: "1.2" }}
            >
              Brand
            </h1>
            <p
              className="mb-0 text-muted"
              style={{ fontSize: "0.75rem", fontWeight: 500 }}
            >
              Branch Name
            </p>
          </div>
        </div>

        <nav className="d-flex flex-column gap-2">
          {NAV_ITEMS.map((item) =>
            item.isLogout ? (
              <button
                key="logout"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="d-flex align-items-center gap-3 px-4 py-3 rounded-4 text-decoration-none transition-all text-muted fw-semibold border-0 bg-transparent text-start w-100"
              >
                <i className={`bi ${item.icon} fs-5`}></i>
                <span>{item.label}</span>
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={getNavLinkClass(item.href)}
              >
                <i className={`bi ${item.icon} fs-5`}></i>
                <span>{item.label}</span>
              </Link>
            ),
          )}
        </nav>
      </div>

      {/* Profile + Logout */}
      <div className="mt-auto p-4 d-flex flex-column gap-2">
        {/* Profile Card */}
        <div className="bg-light p-3 rounded-4 border d-flex align-items-center gap-3">
          <div
            className="rounded-circle border border-2 border-white shadow-sm flex-shrink-0"
            style={{
              width: "40px",
              height: "40px",
              backgroundImage: `url('https://ui-avatars.com/api/?name=${session?.user?.name ?? "Admin"}&background=10b981&color=ffffff')`,
              backgroundSize: "cover",
            }}
          />
          <div className="flex-grow-1 overflow-hidden">
            <p className="mb-0 fw-bold text-truncate text-dark small">
              {session?.user?.name ?? "Admin"}
            </p>
            <p
              className="mb-0 text-muted text-truncate"
              style={{ fontSize: "0.75rem" }}
            >
              {role === 2 ? "Administrator" : "User"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
// --- Component 2: Group Management Sidebar ---
export function GroupSidebar() {
  const brands = Array(7).fill({ name: "Brand Name", branches: 5 });

  return (
    <aside
      className="col-md-4 border-end bg-light-subtle d-flex flex-column p-0"
      style={{ minWidth: "250px", height: "100vh", position: "sticky", top: 0 }}
    >
      <div className="p-3 border-bottom bg-white">
        <div className="form-check d-flex align-items-center gap-2">
          <input className="form-check-input" type="checkbox" id="selectAll" />
          <label
            className="form-check-label small fw-bold text-uppercase text-muted pt-1 cursor-pointer"
            htmlFor="selectAll"
          >
            Select All Brands
          </label>
        </div>
      </div>

      <div className="flex-grow-1 overflow-auto p-2 no-scrollbar">
        {brands.map((brand, idx) => (
          <div
            key={idx}
            className="p-3 mb-2 rounded-4 bg-white shadow-sm border d-flex align-items-center justify-content-between cursor-pointer hover-bg-light transition-all"
          >
            <div className="d-flex align-items-center gap-3">
              <input className="form-check-input" type="checkbox" />
              <div>
                <div className="fw-bold text-dark small">{brand.name}</div>
                <div className="text-muted" style={{ fontSize: "11px" }}>
                  {brand.branches} Branches
                </div>
              </div>
            </div>
            <i className="bi bi-chevron-right text-success"></i>
          </div>
        ))}
      </div>
    </aside>
  );
}
