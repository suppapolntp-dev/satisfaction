// app/components/table/TableBody.tsx
import React from "react";

export const TableBody = ({ children, isEmpty = false, colSpan = 5 }: { 
  children?: React.ReactNode, 
  isEmpty?: boolean, 
  colSpan?: number 
}) => (
  <tbody className="border-top-0">
    {isEmpty ? (
      <tr>
        <td colSpan={colSpan} className="text-center py-5">
          No Data
        </td>
      </tr>
    ) : (
      children
    )}
  </tbody>
);