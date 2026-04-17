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
      { label: "Region", valueKey: "region" },
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
      { label: "Experience", valueKey: "yearsExperience" },
    ],
  },
];

export default function DispatcherDetailPage({ params }) {
  const { id } = use(params);
  return (
    <ApplicationDetail
      pageTitle="Dispatcher Detail Page"
      idPrefix="DSP-APP"
      roleSlug="dispatcher"
      userId={id}
      infoSections={infoSections}
      backHref="/admin/applications/dispatcher"
    />
  );
}
