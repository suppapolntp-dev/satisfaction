// app/components/table/TableContainer.tsx
import React from "react";

export const TableContainer = ({ children }: { children: React.ReactNode }) => (
  <div 
    className="table-responsive " 
    style={{ marginLeft: "-1.5rem", marginRight: "-1.5rem" }}
  >
    <table className="table table-hover mb-0 align-middle ">
      {children}
    </table>
  </div>
);