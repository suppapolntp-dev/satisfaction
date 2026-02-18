"use client";

import React from "react";
import { PageHeader } from "@/app/components/UI/PageHeader";
import { UserForm } from "@/app/components/Form/FormCard";
import { ContentCard } from "@/app/components/UI/ContentCard";
import { TableContainer,TableHeader,TableBody } from "@/app/components/Table";

export default function UserManagerPage() {
  const userColumns = [
    { label: "User ID", width: "15%" },
    { label: "Brand", width: "20%" },
    { label: "Branch", width: "20%" },
    { label: "Status", width: "20%" },
    { label: "Action", width: "15%" },
  ];
  return (
    <>
      <div className="d-flex min-vh-100 bg-light overflow-hidden">
        <main className="flex-grow-1 d-flex flex-column bg-white shadow-sm border vh-100">
          <PageHeader
            title="UserManagement"
            subtitle="create new users and manage access privileges"
          />
          <div
            className="px-4 pb-4 mx-auto w-100 d-flex flex-column gap-4 py-4 overflow-auto"
            style={{ maxWidth: "1600px" }}
          >
            <UserForm></UserForm>

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
