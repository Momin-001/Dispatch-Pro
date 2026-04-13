"use client";

import { use } from "react";
import { ApplicationDetail } from "@/components/dashboard/applications/ApplicationDetail";

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
    title: "Company Information",
    fields: [
      { label: "Company name", valueKey: "companyName" },
      { label: "Company size", valueKey: "companySize" },
      { label: "Website", valueKey: "website" },
      {
        label: "Business Address",
        render: (user) =>
          [user.businessAddress, user.businessCity, user.businessState].filter(Boolean).join(", ") ||
          "—",
      },
      { label: "Industry", valueKey: "industry" },
    ],
  },
  {
    title: "Equipment Information",
    fields: [
      { label: "Average monthly loads", valueKey: "monthlyLoadEstimate" },
      { label: "Equipment type", valueKey: "equipmentType" },
      {
        label: "Typical routes (from → to)",
        render: (user) => {
          const from = user.typicalRouteFrom?.trim();
          const to = user.typicalRouteTo?.trim();
          if (!from && !to) return "—";
          return `${from || "—"} → ${to || "—"}`;
        },
      },
      { label: "Special handling", valueKey: "specialHandling" },
    ],
  },
];

export default function ShipperDetailPage({ params }) {
  const { id } = use(params);
  return (
    <ApplicationDetail
      pageTitle="Shipper Detail Page"
      idPrefix="SHP-APP"
      roleSlug="shipper"
      userId={id}
      infoSections={infoSections}
      backHref="/admin/applications/shipper"
    />
  );
}
