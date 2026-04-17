import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { DOC_STATUS, USER_STATUS } from "@/lib/helpers";

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

export function PermissionTickBadge() {
  return (
    <span
      className="inline-flex size-6 items-center justify-center rounded-sm bg-primary-dark text-background"
      aria-hidden
    >
      <Check className="size-4" strokeWidth={2} />
    </span>
  );
}

export function PermissionCrossBadge() {
  return (
    <span
      className="inline-flex size-6 items-center justify-center rounded-sm bg-secondary-dark text-background"
      aria-hidden
    >
      <X className="size-4" strokeWidth={2} />
    </span>
  );
}
