"use client";

import React from "react";
import { SbDashboard } from "@/app/components/sidebar";
import { BtnCreate } from "@/app/components/buttom";

export default function UserManagerPage() {
  return (
    <>
      <div className="d-flex min-vh-100 bg-light overflow-hidden">
        <SbDashboard></SbDashboard>
        <main className="flex-grow-1 d-flex flex-column bg-white shadow-sm border vh-100">
          <header className="d-flex align-items-center justify-content-between px-4 py-4 bg-white border-bottom">
            <div className="d-flex flex-column gap-1">
              <h2
                className="mb-0 fw-bold"
                style={{ fontSize: "1.5rem", letterSpacing: "-0.02em" }}
              >
                UserManagement
              </h2>
              <p
                className="mb-0 text-muted"
                style={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                create new users and manage access privileges
              </p>
            </div>
          </header>

          <div
            className="px-4 pb-4 mx-auto w-100 d-flex flex-column gap-4 py-4 overflow-auto"
            style={{ maxWidth: "1600px" }}
          >
            <div className="bg-white rounded-4 p-4 d-flex flex-column border">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-white d-flex align-items-center justify-content-center border rounded-3 shadow-sm"
                  style={{ width: "48px", height: "48px", color: "#10b981" }}
                >
                  <i className="bi bi-person-plus fs-4"></i>
                </div>
                <div>
                  <h3 className="mb-0 fw-bold" style={{ fontSize: "1rem" }}>
                    create new user
                  </h3>
                  <p
                    className="mb-0 text-muted"
                    style={{ fontSize: "0.75rem" }}
                  >
                    for branch access charts
                  </p>
                </div>
              </div>
              <div
                className="row g-3 fw-bold w-100 text-uppercase d-flex align-items-center justify-content-between mt-2"
                style={{ fontSize: 0.65 + "rem" }}
              >
                <div className="col-md-4">
                  <label>user id</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="col-md-4">
                  <label>password</label>
                  <input type="password" className="form-control" />
                </div>
                <div className="col-md-4">
                  <label>confirm password</label>
                  <input type="password" className="form-control" />
                </div>
              </div>
              <div
                className="row g-3 fw-bold w-100 text-uppercase d-flex align-items-center justify-content-between mt-2"
                style={{ fontSize: 0.65 + "rem" }}
              >
                <div className="col-md-4">
                  <label>branch</label>
                  <select className="form-select">
                    <option value="branch1" selected>
                      branch1
                    </option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label>branch</label>
                  <select className="form-select">
                    <option value="branch1" selected>
                      branch1
                    </option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label>group</label>
                  <select className="form-select">
                    <option value="1" selected>
                      User
                    </option>
                    <option value="2" selected>
                      operation
                    </option>
                  </select>
                </div>
              </div>
              <BtnCreate></BtnCreate>
            </div>

            <div className="bg-white rounded-4 p-4 d-flex flex-column border">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="bg-white d-flex align-items-center justify-content-center border rounded-3 shadow-sm"
                  style={{ width: "48px", height: "48px", color: "#10b981" }}
                >
                  <i className="bi bi-person fs-4"></i>
                </div>
                <div>
                  <h3 className="mb-0 fw-bold" style={{ fontSize: "1rem" }}>
                    User List
                  </h3>
                  <p
                    className="mb-0 text-muted"
                    style={{ fontSize: "0.75rem" }}
                  >
                    List user id and manage access privileges
                  </p>
                </div>
                <div className="d-flex justify-content-end gap-2 ms-auto">
                  <button className="btn btn-light btn-sm border">
                    <i className="bi bi-filter"></i>
                  </button>
                  <button className="btn btn-light btn-sm border">
                    <i className="bi bi-download"></i>
                  </button>
                  <button
                    className="btn btn-light btn-sm border"
                    title="Export Data"
                  >
                    <i className="bi bi-upload"></i>{" "}
                    {/* ใช้ bi-upload หรือ bi-box-arrow-up สำหรับ Export */}
                  </button>
                </div>
              </div>
              <div
                className="table-responsive"
                style={{ marginLeft: "-1.5rem", marginRight: "-1.5rem" }}
              >
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr
                      className="text-uppercase text-muted"
                      style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
                    >
                      <th
                        className="px-4 py-3 border-0 text-center"
                        style={{ width: "15%" }}
                      >
                        User ID
                      </th>
                      <th
                        className="px-4 py-3 border-0 text-center"
                        style={{ width: "20%" }}
                      >
                        Brand
                      </th>
                      <th
                        className="px-4 py-3 border-0 text-center"
                        style={{ width: "20%" }}
                      >
                        Branch
                      </th>
                      <th
                        className="px-4 py-3 border-0 text-center"
                        style={{ width: "20%" }}
                      >
                        Status
                      </th>
                      <th
                        className="px-4 py-3 border-0 text-center"
                        style={{ width: "15%" }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody id="tableBody" className="border-top-0">
                    <tr id="emptyRow">
                      <td colSpan={10} className="text-center py-5">
                        No User
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
