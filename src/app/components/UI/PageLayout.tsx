// src/app/components/UI/PageLayout.tsx
// ── wrapper layout ทุกหน้า admin (main + scroll area) ──
import React from "react";
import { PageHeader } from "./PageHeader";

interface PageLayoutProps {
  title:     string;
  subtitle:  string;
  children:  React.ReactNode;
  maxWidth?: number;  // default 1600
}

export function PageLayout({ title, subtitle, children, maxWidth = 1400 }: PageLayoutProps) {
  return (
    <div className="d-flex min-vh-100 bg-light overflow-hidden">
      <main className="flex-grow-1 d-flex flex-column bg-white shadow-sm border vh-100">
        <PageHeader title={title} subtitle={subtitle} />
        <div
          className="px-4 pb-4 mx-auto w-100 d-flex flex-column gap-4 py-4 overflow-auto"
          style={{ maxWidth }}>
          {children}
        </div>
      </main>
    </div>
  );
}