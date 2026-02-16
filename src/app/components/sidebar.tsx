"use client";

import React from "react";
import Link from "next/link";

export function SbDashboard() {
  const getNavLinkClass = (path: string) => {
    const baseClass =
      "d-flex align-items-center gap-3 px-4 py-3 rounded-4 text-decoration-none transition-all";
    const activeClass =
      "bg-success bg-opacity-10 text-success fw-bold shadow-sm";
    const inactiveClass = "text-muted fw-semibold hover-bg-light";

    // ตัวอย่างการเช็ค path (สมมติว่าอยู่หน้า Dashboard)
    return path === "" //รอใส่โปรแกรม
      ? `${baseClass} ${activeClass}`
      : `${baseClass} ${inactiveClass}`;
  };

  return (
    <>
      <aside
        className="sidebar d-flex flex-column no-scrollbar"
        style={{
          width: "275px",
          height: "100vh",
          position: "sticky",
          top: 0,
          overflowY: "auto",
        }}
      >
        <div className="p-4 d-flex flex-column gap-4">
          {/* Logo Section */}
          <div className="d-flex align-items-center gap-3 px-2">
            <div
              className="bg-success text-white d-flex align-items-center justify-content-center shadow-lg"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "1rem",
                background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
              }}
            >
              <i
                className="bi bi-emoji-smile"
                style={{ fontSize: "1.5rem" }}
              ></i>
            </div>
            <div className="d-flex flex-column">
              <h1
                className="mb-0 fw-bold text-dark"
                style={{ fontSize: "1.125rem", lineHeight: "1.2" }}
              >
                brand
              </h1>
              <p
                className="mb-0 text-muted"
                style={{ fontSize: "0.75rem", fontWeight: 500 }}
              >
                Branch
              </p>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="d-flex flex-column gap-2">
            <Link href="/login" className={getNavLinkClass("/login")}>
              <i className="bi bi-people fs-5"></i>
              <span>login</span>
            </Link>
            <Link href="/customer" className={getNavLinkClass("/customer")}>
              <i className="bi bi-people fs-5"></i>
              <span>customer</span>
            </Link>
            <Link
              href="/usermanager"
              className={getNavLinkClass("/usermanager")}
            >
              <i className="bi bi-people fs-5"></i>
              <span>Users</span>
            </Link>
            <Link
              href="/groupmanager"
              className={getNavLinkClass("/groupmanager")}
            >
              <i className="bi bi-people fs-5"></i>
              <span>Groups</span>
            </Link>

            <Link href="/dashboard" className={getNavLinkClass("/dashboard")}>
              <i className="bi bi-bar-chart-fill fs-5"></i>
              <span>Dashboard</span>
            </Link>

            <Link href="/popup" className={getNavLinkClass("/popup")}>
              <i className="bi bi-bar-chart-fill fs-5"></i>
              <span>popup</span>
            </Link>
          </nav>
        </div>

        {/* User Profile Section */}
        <div className="p-4">
          <div className="bg-light p-3 rounded-4 border d-flex align-items-center gap-3 shadow-sm-hover">
            <div
              className="rounded-circle bg-secondary border border-2 border-white shadow-sm"
              style={{
                width: "40px",
                height: "40px",
                backgroundImage: `url('https://ui-avatars.com/api/?name=Alex+Morgan&background=random')`, // logo brand
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="flex-grow-1 overflow-hidden">
              <p
                className="mb-0 fw-bold text-truncate text-dark"
                style={{ fontSize: "0.875rem" }}
              >
                Branch
              </p>
              <p
                className="mb-0 text-muted text-truncate"
                style={{ fontSize: "0.75rem" }}
              >
                Group
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function SbGroupManagement() {
  return (
    <aside
      className="col-md-4 border-end bg-light-subtle d-flex flex-column p-0"
      style={{ minWidth: "200px" , height: "400px", position: "sticky", top: 0 }}
    >
      <div className="p-3 border-bottom bg-white">
        <div className="form-check d-flex align-items-center gap-2">
          <input className="form-check-input" type="checkbox" id="selectAll" />
          <label className="form-check-label small fw-bold text-uppercase text-muted pt-1">
            Select All Brands
          </label>
        </div>
      </div>

      <div className="flex-grow-1 overflow-auto p-2 no-scrollbar">
        <div className="p-3 mb-2 rounded-4 bg-white shadow-sm border d-flex align-items-center justify-content-between cursor-pointer">
          <div className="d-flex align-items-center gap-3">
            <input className="form-check-input" type="checkbox" />
            <div>
              <div className="fw-bold text-dark small">Brand</div>
              <div className="text-muted" style={{ fontSize: "11px" }}>
                Show branch count
              </div>
            </div>
          </div>
          <i className="bi bi-chevron-right text-success"></i>
        </div>
        <div className="p-3 mb-2 rounded-4 bg-white shadow-sm border d-flex align-items-center justify-content-between cursor-pointer">
          <div className="d-flex align-items-center gap-3">
            <input className="form-check-input" type="checkbox" />
            <div>
              <div className="fw-bold text-dark small">Brand</div>
              <div className="text-muted" style={{ fontSize: "11px" }}>
                Show branch count
              </div>
            </div>
          </div>
          <i className="bi bi-chevron-right text-success"></i>
        </div>
        <div className="p-3 mb-2 rounded-4 bg-white shadow-sm border d-flex align-items-center justify-content-between cursor-pointer">
          <div className="d-flex align-items-center gap-3">
            <input className="form-check-input" type="checkbox" />
            <div>
              <div className="fw-bold text-dark small">Brand</div>
              <div className="text-muted" style={{ fontSize: "11px" }}>
                Show branch count
              </div>
            </div>
          </div>
          <i className="bi bi-chevron-right text-success"></i>
        </div>
        <div className="p-3 mb-2 rounded-4 bg-white shadow-sm border d-flex align-items-center justify-content-between cursor-pointer">
          <div className="d-flex align-items-center gap-3">
            <input className="form-check-input" type="checkbox" />
            <div>
              <div className="fw-bold text-dark small">Brand</div>
              <div className="text-muted" style={{ fontSize: "11px" }}>
                Show branch count
              </div>
            </div>
          </div>
          <i className="bi bi-chevron-right text-success"></i>
        </div>
        <div className="p-3 mb-2 rounded-4 bg-white shadow-sm border d-flex align-items-center justify-content-between cursor-pointer">
          <div className="d-flex align-items-center gap-3">
            <input className="form-check-input" type="checkbox" />
            <div>
              <div className="fw-bold text-dark small">Brand</div>
              <div className="text-muted" style={{ fontSize: "11px" }}>
                Show branch count
              </div>
            </div>
          </div>
          <i className="bi bi-chevron-right text-success"></i>
        </div>
        <div className="p-3 mb-2 rounded-4 bg-white shadow-sm border d-flex align-items-center justify-content-between cursor-pointer">
          <div className="d-flex align-items-center gap-3">
            <input className="form-check-input" type="checkbox" />
            <div>
              <div className="fw-bold text-dark small">Brand</div>
              <div className="text-muted" style={{ fontSize: "11px" }}>
                Show branch count
              </div>
            </div>
          </div>
          <i className="bi bi-chevron-right text-success"></i>
        </div>
        <div className="p-3 mb-2 rounded-4 bg-white shadow-sm border d-flex align-items-center justify-content-between cursor-pointer">
          <div className="d-flex align-items-center gap-3">
            <input className="form-check-input" type="checkbox" />
            <div>
              <div className="fw-bold text-dark small">Brand</div>
              <div className="text-muted" style={{ fontSize: "11px" }}>
                Show branch count
              </div>
            </div>
          </div>
          <i className="bi bi-chevron-right text-success"></i>
        </div>
      </div>
    </aside>
  );
}
