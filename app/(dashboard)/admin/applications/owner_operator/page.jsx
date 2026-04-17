"use client";

import { format } from "date-fns";
import { ApplicationsTable } from "@/components/dashboard/Applications/ApplicationsTable";

const columns = [
  { key: "fullName", header: "Name" },
  {
    key: "equipmentType",
    header: "Equipment",
    render: (row) => row.equipmentType || "—",
  },
  {
    key: "yearsExperience",
    header: "Experience",
    render: (row) => (row.yearsExperience ? `${row.yearsExperience} yrs` : "—"),
  },
  { key: "state", header: "State" },
  { key: "status", header: "Status" },
  {
    key: "createdAt",
    header: "Applied",
    render: (row) =>
      row.createdAt ? format(new Date(row.createdAt), "MMM dd") : "—",
  },
];

const filters = [
  { key: "experience", placeholder: "Experience", type: "input" },
  { key: "equipmentType", placeholder: "Equipment type", type: "input" },
  { key: "state", placeholder: "State", type: "input" },
  {
    key: "status",
    placeholder: "Status",
    type: "select",
    options: [
      { value: "pending_approval", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
      { value: "suspended", label: "Suspended" },
    ],
  },
];

export default function OwnerOperatorApplicationsPage() {
  return (
    <ApplicationsTable
      title="Owner Operator Applications"
      subtitle="Review and manage owner operator job applications"
      roleSlug="owner_operator"
      columns={columns}
      filters={filters}
      searchPlaceholder="Search (name)"
      detailHref={(row) => `/admin/applications/owner_operator/${row.id}`}
    />
  );
}
