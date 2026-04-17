"use client";

import { use } from "react";
import { ApplicationDetail } from "@/components/dashboard/Applications/ApplicationDetail";

const infoSections = [
  {
    title: "Personal Information",
    fields: [
      { label: "Name", valueKey: "fullName" },
      { label: "Phone", valueKey: "phone" },
      { label: "Email", valueKey: "email" },
      {
        label: "Address",
        render: (user, fullAddress) => fullAddress || "—",
      },
    ],
  },
  {
    title: "Other Information",
    fields: [
      { label: "CDL Number", valueKey: "cdlNumber" },
      { label: "Years of Experience", valueKey: "yearsExperience" },
      { label: "Equipment Type", valueKey: "equipmentType" },
    ],
  },
];

export default function DriverDetailPage({ params }) {
  const { id } = use(params);
  return (
    <ApplicationDetail
      pageTitle="Driver Detail Page"
      idPrefix="DRIV-APP"
      roleSlug="driver"
      userId={id}
      infoSections={infoSections}
      backHref="/admin/applications/driver"
    />
  );
}
