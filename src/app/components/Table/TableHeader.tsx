// app/components/table/TableHeader.tsx
import React from "react";

interface Column {
  label: string;
  width?: string;
}

export const TableHeader = ({ columns }: { columns: Column[] }) => (
  <thead className="table-light">
    <tr 
      className="text-uppercase text-muted" 
      style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
    >
      {columns.map((col, index) => (
        <th 
          key={index} 
          className="px-4 py-3 border-0 text-center" 
          style={{ width: col.width }}
        >
          {col.label}
        </th>
      ))}
    </tr>
  </thead>
);