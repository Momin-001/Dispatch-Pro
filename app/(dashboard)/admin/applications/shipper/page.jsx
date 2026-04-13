"use client";

import { format } from "date-fns";
import { ApplicationsTable } from "@/components/dashboard/Applications/ApplicationsTable";

const columns = [
  { key: "fullName", header: "Name (Contact Person)" },
  { key: "companyName", header: "Company name" },
  { key: "industry", header: "Industry" },
  { key: "status", header: "Status" },
  {
    key: "createdAt",
    header: "Applied",
    render: (row) =>
      row.createdAt ? format(new Date(row.createdAt), "MMM dd") : "—",
  },
];

const filters = [
  { key: "industry", placeholder: "Industry", type: "input" },
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

export default function ShipperApplicationsPage() {
  return (
    <ApplicationsTable
      title="Shipper Applications"
      subtitle="Review and manage shipper job applications"
      roleSlug="shipper"
      columns={columns}
      filters={filters}
      searchPlaceholder="Search (name or company name)"
      detailHref={(row) => `/admin/applications/shipper/${row.id}`}
    />
  );
}
