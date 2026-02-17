// app/dashboard/page.tsx
"use client";

import React from "react";
import { body } from "framer-motion/client";
import { OverallChart, SatisfactionChart } from "@/app/components/Statistic/chart";

export default function DashboardPage() {
  return (
    <>
      <div className="d-flex min-vh-100 bg-light overflow-hidden">
        <main className="flex-grow-1 d-flex flex-column bg-white shadow-sm border vh-100">
          <header
            className="flex-grow-1 d-flex align-items-center justify-content-between px-4 py-4 sticky-top bg-white border-bottom"
            style={{ zIndex: 20 }}
          >
            <div className="d-flex flex-column gap-1">
              <h2
                className="mb-0 fw-bold"
                style={{ fontSize: "1.5rem", letterSpacing: "-0.02em" }}
              >
                Overview
              </h2>
              <p
                className="mb-0 text-muted"
                style={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                Welcome back, heres whats happening.
              </p>
            </div>
          </header>

          {/* Content Area */}
          <div
            className="px-4 pb-4 mx-auto w-100 d-flex flex-column gap-4 py-4 overflow-auto"
            style={{ maxWidth: "1600px" }}
          >
            {/* Date Filter Bar */}
            <div className="bg-light rounded-4 p-4 d-flex flex-column flex-xl-row align-items-start align-items-xl-center justify-content-between gap-4 border">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-white d-flex align-items-center justify-content-center border rounded-3 shadow-sm"
                  style={{ width: "48px", height: "48px", color: "#10b981" }}
                >
                  <i className="bi bi-calendar-month fs-4"></i>
                </div>
                <div>
                  <h3 className="mb-0 fw-bold" style={{ fontSize: "1rem" }}>
                    Filter by Date
                  </h3>
                  <p
                    className="mb-0 text-muted"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Select a period to update charts
                  </p>
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row align-items-center gap-3 w-100 w-xl-auto bg-white p-2 rounded-4 border">
                <select
                  className="form-select border-0 fw-bold"
                  style={{ fontSize: "0.875rem", width: "auto" }}
                >
                  <option>Today</option>
                  <option selected>Last 7 Days</option>
                  <option>Custom Range</option>
                </select>
                <div className="vr d-none d-sm-block"></div>
                <div className="d-flex align-items-center gap-2 px-2">
                  <input
                    type="date"
                    className="form-control bg-light border-0 rounded-3 fw-semibold shadow-none"
                    defaultValue="2023-10-24"
                    style={{ fontSize: "0.75rem" }}
                  />
                  <span className="text-muted fw-bold small">to</span>
                  <input
                    type="date"
                    className="form-control bg-light border-0 rounded-3 fw-semibold shadow-none"
                    defaultValue="2023-10-31"
                    style={{ fontSize: "0.75rem" }}
                  />
                </div>
                <button
                  className="btn btn-success fw-bold rounded-4 px-4"
                  style={{
                    backgroundColor: "#10b981",
                    borderColor: "#10b981",
                    fontSize: "0.875rem",
                  }}
                >
                  Update
                </button>
              </div>
            </div>

            {/* Top Stats Cards */}
            <div className="row g-4">
              {/* Brand Card */}
              <div className="col-12 col-md-6 col-lg-3">
                <div className="card border rounded-4 h-100 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span
                        className="text-uppercase text-muted fw-bold"
                        style={{ fontSize: "0.625rem" }}
                      >
                        Brand
                      </span>
                      <i className="bi bi-shop text-muted"></i>
                    </div>
                    <select className="form-select border-0 p-0 fw-bold fs-5 shadow-none">
                      <option>All Brands</option>
                      {/* รอลงโปรแกรม */}
                    </select>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="col-12 col-md-6 col-lg-3">
                <div className="card border rounded-4 h-100 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span
                        className="text-uppercase text-muted fw-bold"
                        style={{ fontSize: "0.625rem" }}
                      >
                        Location
                      </span>
                      <i className="bi bi-geo-alt text-muted"></i>
                    </div>
                    <select className="form-select border-0 p-0 fw-bold fs-5 shadow-none">
                      <option>All Branches</option>
                    </select>
                    {/* รอลงโปรแกรม */}
                  </div>
                </div>
              </div>

              {/* Total Responses Highlight */}
              <div className="col-12 col-md-6 col-lg-3">
                <div className="card text-white h-100 border-0 rounded-4 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' }}>
                  <div className="card-body p-4"
                  >
                    <div className="d-flex align-items-center justify-content-between mb-2 opacity-75">
                      <span
                        className="text-uppercase fw-bold"
                        style={{ fontSize: "0.625rem" }}
                      >
                        Total Responses
                      </span>
                      <i className="bi bi-list-check fs-5"></i>
                    </div>
                    <div className="d-flex align-items-end gap-2 mt-3">
                      <h2
                        className="fw-bold mb-0"
                        style={{ fontSize: "2.25rem" }}
                      >
                        1,284 รอลงโปรแกรม
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              {/* NPS Score Card */}
              <div className="col-12 col-md-6 col-lg-3">
                <div className="text-white card border rounded-4 h-100 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' }}>
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span
                        className="text-uppercase fw-bold"
                        style={{ 
                          fontSize: "0.625rem" 
                        }}
                      >
                        NPS Score
                      </span>
                      <i className="bi bi-emoji-smile fs-5 text-success"></i>
                    </div>
                    <div className="d-flex align-items-end gap-2 mt-3">
                      <h2
                        className="fw-bold mb-0"
                        style={{ fontSize: "2.25rem" }}
                      >
                        72
                        {/* รอลงโปรแกรม */}
                      </h2>
                      <span
                        className="badge bg-white text-success border border-success-subtle rounded-2 mb-1"
                        style={{ fontSize: "0.75rem",  color: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' 
                        }}
                      >
                        Excellent
                        {/* รอลงโปรแกรม */}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Visuals Section */}
            <div className="row g-4">
              <SatisfactionChart></SatisfactionChart>
              <OverallChart></OverallChart>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
