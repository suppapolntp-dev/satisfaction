import { TableContainer, TableHeader, TableBody } from "@/app/components/Table";

export default function GroupManagerPage() {
  const groupColumns = [
    { label: "Group name", width: "15%" },
    { label: "Member", width: "20%" },
    { label: "Branch", width: "20%" },
    { label: "Info", width: "20%" },
    { label: "Action", width: "15%" },
  ];

  return (
    <TableContainer>
      <TableHeader columns={groupColumns} />
      <TableBody isEmpty={true} colSpan={groupColumns.length} />
    </TableContainer>
  );
}