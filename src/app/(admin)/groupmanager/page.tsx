"use client";

import React from "react";
import { PageHeader } from "@/app/components/UI/PageHeader";
import { GroupForm } from "@/app/components/Form/FormCard";
import { ContentCard } from "@/app/components/UI/ContentCard";
import { TableContainer, TableHeader, TableBody } from "@/app/components/Table";

export default function GroupManagerPage() {
  const userColumns = [
    { label: "Group", width: "15%" },
    { label: "Members", width: "20%" },
    { label: "Branch", width: "20%" },
    { label: "info", width: "20%" },
    { label: "Action", width: "15%" },
  ];
  return (
    <>
      <div className="d-flex vh-100 bg-light overflow-hidden">
        <main className="flex-grow-1 d-flex flex-column bg-white border vh-100">
          <PageHeader
            title="GroupManagement"
            subtitle="create new groups and manage access privileges"
          ></PageHeader>

          <div
            className="px-4 pb-4 mx-auto w-100 d-flex flex-column gap-4 py-4 overflow-auto border shadow-sm"
            style={{ maxWidth: "auto" }}
          >
            <GroupForm></GroupForm>

            <ContentCard
              title="User List"
              subtitle="Manage your team"
              icon="bi-people"
            >
              <TableContainer>
                <TableHeader columns={userColumns} />
                <TableBody isEmpty={true} colSpan={userColumns.length} />
              </TableContainer>
            </ContentCard>
          </div>
        </main>
      </div>
    </>
  );
}
