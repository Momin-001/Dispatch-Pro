import { Clock, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export const DOC_STATUS = {
  pending: { label: "Pending", icon: Clock, className: "text-amber-600 bg-amber-50" },
  approved: { label: "Approved", icon: CheckCircle2, className: "text-green-600 bg-green-50" },
  rejected: { label: "Rejected", icon: XCircle, className: "text-red-600 bg-red-50" },
  reupload_requested: { label: "Re-upload", icon: RotateCcw, className: "text-orange-600 bg-orange-50" },
};

export function DocStatusBadge({ status, showIcon = true }) {
  const cfg = DOC_STATUS[status] || DOC_STATUS.pending;
  const Icon = cfg.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        cfg.className
      )}
    >
      {showIcon && Icon && <Icon className="size-3" />}
      {cfg.label}
    </span>
  );
}

export function getDownloadUrl(fileUrl) {
  if (!fileUrl) 
    return fileUrl;
  if (fileUrl.includes("/upload/")) {
    return fileUrl.replace("/upload/", "/upload/fl_attachment/");
  }
  return fileUrl;
}


export const USER_STATUS = {
  pending_approval: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", className: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  suspended: { label: "Suspended", className: "bg-gray-100 text-gray-700" },
};

export function UserStatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-2 text-xs font-medium",
        USER_STATUS[status]?.className || "bg-gray-100 text-gray-700"
      )}
    >
      {USER_STATUS[status]?.label || status}
    </span>
  );
}

export const ROLE_OPTIONS = [
  { value: "driver", label: "Driver" },
  { value: "dispatcher", label: "Dispatcher" },
  { value: "shipper", label: "Shipper" },
  { value: "owner_operator", label: "Owner Operator" },
];

export const ROLE_LABELS = {
  admin: "Admin",
  driver: "Driver",
  dispatcher: "Dispatcher",
  shipper: "Shipper",
  owner_operator: "Owner Operator",
};