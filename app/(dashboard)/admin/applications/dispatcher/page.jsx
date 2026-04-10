"use client";

import { format } from "date-fns";
import { ApplicationsTable } from "@/components/dashboard/applications/ApplicationsTable";

const columns = [
  { key: "fullName", header: "Name" },
  { key: "email", header: "Email" },
  { key: "yearsExperience", header: "Experience" ,
    render: (row) => (row.yearsExperience ? `${row.yearsExperience} yrs` : "—"),
  },
  { key: "region", header: "Region" },
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

export default function DispatcherApplicationsPage() {
  return (
    <ApplicationsTable
      title="Dispatcher Applications"
      subtitle="Review and manage dispatcher job applications"
      roleSlug="dispatcher"
      columns={columns}
      filters={filters}
      searchPlaceholder="Search (name/email/license)"
    />
  );
}
