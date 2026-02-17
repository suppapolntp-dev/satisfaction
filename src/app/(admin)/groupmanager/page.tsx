"use client";

import React from "react";
import { BtnCreate } from "@/app/components/UI/Button"; 
import { PageHeader } from "@/app/components/UI/PageHeader";
import { GroupForm } from "@/app/components/Form/FormCard";

export default function GroupManagerPage() {
  return (
    <>
      <div className="d-flex vh-100 bg-light overflow-hidden">
        <main className="flex-grow-1 d-flex flex-column bg-white shadow-sm border vh-100">
          <PageHeader title="GroupManagement" subtitle="create new groups and manage access privileges"></PageHeader>

          <div
            className="px-4 pb-4 mx-auto w-100 d-flex flex-column gap-4 py-4 overflow-auto"
            style={{ maxWidth: "auto" }}
          >
            <GroupForm></GroupForm>

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
                    Group List
                  </h3>
                  <p
                    className="mb-0 text-muted"
                    style={{ fontSize: "0.75rem" }}
                  >
                    List group name and manage access privileges
                  </p>
                </div>
                <div className="d-flex justify-content-end gap-2 ms-auto">
                  <button className="btn btn-light btn-sm border">
                    <i className="bi bi-filter"></i>
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
                        Group name
                      </th>
                      <th
                        className="px-4 py-3 border-0 text-center"
                        style={{ width: "20%" }}
                      >
                        Member
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
                        info เอาเมาท์ไปวางแล้วข้อความขึ้นให้อ่าน
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
