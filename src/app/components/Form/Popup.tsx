"use client";
import { useState } from "react";
import { GroupSidebar } from "../NavigationBar/SideBar";

//สร้าง css กำหนด popup
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  backdropFilter: "blur(5px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  animation: "fadeIn 0.3s ease-out forwards",
};

const modalBoxStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "40px",
  borderRadius: "2.5rem",
  width: "90%",
  maxWidth: "500px",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  position: "relative",
  animation: "popIn 1.0s cubic-bezier(0.34, 1.56, 0.64, 1)",
};

export function ThankPopup({ onClick }: { onClick: () => void }) {
  return (
    <div style={overlayStyle} onClick={onClick}>
      <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "70px", color: "#10b981" }}
          >
            check_circle
          </span>
        </div>

        <h2 className="fw-black">Thank you!</h2>
        <p className="text-secondary">Your input helps us improve.</p>
      </div>
    </div>
  );
}

export function EditUserPopup() {
  // { onClick }: { onClick: () => void }
  return (
    <div
      style={overlayStyle}
      // onClick={onClick}
    >
      <div
        style={modalBoxStyle}
        // onClick={(e) => e.stopPropagation()}
      >
        <div
          className="fw-bold mb-4 d-flex align-items-center"
          style={{ fontSize: "25px" }}
        >
          <span
            className="bi bi-pencil-square me-3"
            style={{ fontSize: "30px", color: "#10b981" }}
          ></span>
          <h5 className="fw-bold">Edit User Profile</h5>
        </div>
        <form>
          <div style={{ fontSize: "0.8rem" }}>
            <div className="mt-2">
              <label className="fw-bold text-uppercase">
                User Id (Read-only)
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control form-control-lg mb-3 fw-bold bg-light pe-5"
                  readOnly
                  placeholder="crgmd30151"
                  style={{ fontSize: "0.8rem" }}
                />
                <span
                  className="material-symbols-outlined text-secondary position-absolute end-0 top-50 translate-middle-y me-3"
                  style={{ pointerEvents: "none" }}
                >
                  lock
                </span>
              </div>
            </div>
            <div className="bg-light rounded-4 p-4 d-flexm flex-column gap-2 border">
              <label className="fw-bold text-uppercase">Action</label>
              <select
                className="form-select border-0 fw-bold shadow-sm"
                style={{ fontSize: "0.8rem" }}
              >
                <option value="activate" selected>
                  Activate User
                </option>
                <option value="deactivate">Deactivate User</option>
              </select>
            </div>
            <div className="row g-3 mt-2">
              <div className="col-4">
                <label className="fw-bold text-uppercase">Brand</label>
                <select
                  className="form-select border-0 fw-bold shadow-sm"
                  style={{ fontSize: "0.8rem" }}
                >
                  <option value="activate" selected>
                    Activate User
                  </option>
                  <option value="deactivate">Deactivate User</option>
                </select>
              </div>
              <div className="col-4">
                <label className="fw-bold text-uppercase">Branch</label>
                <select
                  className="form-select border-0 fw-bold shadow-sm"
                  style={{ fontSize: "0.8rem" }}
                >
                  <option value="activate" selected>
                    Activate User
                  </option>
                  <option value="deactivate">Deactivate User</option>
                </select>
              </div>
              <div className="col-4">
                <label className="fw-bold text-uppercase">Group</label>
                <select
                  className="form-select border-0 fw-bold shadow-sm"
                  style={{ fontSize: "0.8rem" }}
                >
                  <option value="activate" selected>
                    Activate User
                  </option>
                  <option value="deactivate">Deactivate User</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function GroupManagePopup() {
  // { onClick }: { onClick: () => void }
  return (
    <div
      style={overlayStyle}
      // onClick={onClick}
    >
      <div
        style={{ ...modalBoxStyle, maxWidth: "800px" }}
        // onClick={(e) => e.stopPropagation()}
      >
        <div
          className="fw-bold mb-4 pb-4 d-flex border-bottom "
          style={{ fontSize: "25px" }}
        >
          <div className="align-items-center">
            <span
              className="bi bi bi-people-fill me-3"
              style={{ fontSize: "30px", color: "#10b981" }}
            ></span>
          </div>
          <div className="d-flex flex-column justify-content-center">
            <h5 className="fw-bold">Group Management</h5>
            <small
              className="text-secondary text-start"
              style={{ fontSize: "0.75rem" }}
            >
              setting access for group
            </small>
          </div>
        </div>
        <div
          className="d-flex flex-row w-100 bg-white"
          style={{ maxHeight: "400px" }}
        >
          <GroupSidebar />

          {/* Main Content ฝั่งขวา */}
          <div className="flex-grow-1 overflow-hidden d-flex flex-column bg-white">
            {/* Header: คงความโปร่งแต่กระชับพื้นที่ขึ้น */}
            <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom sticky-top bg-white z-1">
              <div>
                <h6
                  className="fw-extrabold mb-0 text-dark"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  Global Retail
                </h6>
                <p
                  className="text-muted fw-bold mb-0"
                  style={{ fontSize: "10px", opacity: 0.8 }}
                >
                  12 BRANCHES AVAILABLE
                </p>
              </div>
              <div className="d-flex align-items-center gap-2 bg-light-subtle px-2 py-1 rounded-3 border">
                <label
                  className="small fw-bold text-secondary"
                  style={{ fontSize: "10px" }}
                >
                  SELECT ALL
                </label>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input shadow-none cursor-pointer"
                    type="checkbox"
                    style={{ width: "2rem", height: "1rem" }}
                  />
                </div>
              </div>
            </div>

            {/* List Area: กำจัดช่องว่างระหว่างการ์ด (gap-0) */}
            <div className="flex-grow-1 overflow-auto no-scrollbar">
              <div className="d-flex flex-column">
                {/* --- Compact Item 1 --- */}
                <div
                  className="px-4 py-2 border-bottom d-flex align-items-center justify-content-between hover-bg-light transition-all"
                  style={{ cursor: "pointer", minHeight: "56px" }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <input
                      className="form-check-input border-secondary-subtle shadow-none m-0"
                      type="checkbox"
                      checked
                      readOnly
                      style={{ width: "0.9rem", height: "0.9rem" }}
                    />
                    <div className="d-flex flex-column">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="fw-bold text-dark"
                          style={{ fontSize: "0.85rem" }}
                        >
                          New York Main Branch
                        </span>
                        <span
                          className="badge bg-success-subtle text-success border border-success-subtle"
                          style={{ fontSize: "8px", padding: "1px 4px" }}
                        >
                          HQ
                        </span>
                      </div>
                      <div
                        className="text-muted d-flex align-items-center gap-1"
                        style={{ fontSize: "10px" }}
                      >
                        <span>#BR-001</span>
                        <span className="text-secondary-opacity-50">•</span>
                        <span>Lower Manhattan</span>
                        <span className="text-secondary-opacity-50">•</span>
                        <span className="fw-medium text-secondary">
                          <i className="bi bi-people me-1"></i>15
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- Compact Item 2 --- */}
                <div
                  className="px-4 py-2 border-bottom d-flex align-items-center justify-content-between hover-bg-light transition-all opacity-75"
                  style={{ cursor: "pointer", minHeight: "56px" }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <input
                      className="form-check-input border-secondary-subtle shadow-none m-0"
                      type="checkbox"
                      style={{ width: "0.9rem", height: "0.9rem" }}
                    />
                    <div className="d-flex flex-column">
                      <span
                        className="fw-bold text-secondary"
                        style={{ fontSize: "0.85rem" }}
                      >
                        London Headquarters
                      </span>
                      <span className="text-muted" style={{ fontSize: "10px" }}>
                        #BR-024 • Central London • 42 Staff
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
