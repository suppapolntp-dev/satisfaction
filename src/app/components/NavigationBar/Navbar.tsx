"use client";
import { useSession, signOut } from "next-auth/react";

/* ─── Login Navbar ─────────────────────────── */
export function NavbarLogin() {
  return (
    <nav className="navbar navbar-expand-lg bg-white sticky-top shadow-sm py-2">
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center justify-content-end ms-auto gap-3">
          <div className="lh-1 d-none d-sm-block text-end">
            <div className="fw-bold text-dark" style={{ fontSize: "1rem", letterSpacing: "-0.02em" }}>
              Satisfaction <span style={{ color: "#dc3545" }}>POS</span>
            </div>
            <small className="text-muted" style={{ fontSize: "0.5rem", textTransform: "uppercase" }}>
              Service Mind System
            </small>
          </div>
          <div
            className="text-white d-flex align-items-center justify-content-center shadow-lg"
            style={{ width: "48px", height: "48px", borderRadius: "1rem", background: "linear-gradient(135deg, #ff4d5a 0%, #dc3545 100%)" }}
          >
            <i className="bi bi-emoji-smile" style={{ fontSize: "1.5rem" }} />
          </div>
        </div>
      </div>
    </nav>
  );
}
