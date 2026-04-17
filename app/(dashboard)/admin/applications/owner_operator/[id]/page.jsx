"use client";

import { use } from "react";
import { format } from "date-fns";
import { ApplicationDetail } from "@/components/dashboard/Applications/ApplicationDetail";

function formatDate(value) {
  if (value == null || value === "") return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "MMM d, yyyy");
}

const infoSections = [
  {
    title: "Personal Information",
    fields: [
      { label: "Name", valueKey: "fullName" },
      { label: "Email", valueKey: "email" },
      { label: "Phone", valueKey: "phone" },
      {
        label: "Address",
        render: (user, fullAddress) => fullAddress || "—",
      },
    ],
  },
  {
    title: "Equipment Information",
    fields: [
      { label: "Equipment type", valueKey: "equipmentType" },
      { label: "Year", valueKey: "vehicleYear" },
      { label: "VIN", valueKey: "vinNumber" },
      {
        label: "Insurance expiry",
        render: (user) => formatDate(user.insuranceExpiry),
      },
      {
        label: "Inspection expiry",
        render: (user) => formatDate(user.inspectionExpiry),
      },
    ],
  },
];

export default function OwnerOperatorDetailPage({ params }) {
  const { id } = use(params);
  return (
    <ApplicationDetail
      pageTitle="Owner Operator Detail Page"
      idPrefix="OO-APP"
      roleSlug="owner_operator"
      userId={id}
      infoSections={infoSections}
      backHref="/admin/applications/owner_operator"
    />
  );
}
