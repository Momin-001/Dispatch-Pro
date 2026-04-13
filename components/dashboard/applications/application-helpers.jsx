import { Clock, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const DOC_STATUS = {
    pending: { label: "Pending", icon: Clock, className: "text-amber-600 bg-amber-50" },
    approved: { label: "Approved", icon: CheckCircle2, className: "text-green-600 bg-green-50" },
    rejected: { label: "Rejected", icon: XCircle, className: "text-red-600 bg-red-50" },
    reupload_requested: { label: "Re-upload", icon: RotateCcw, className: "text-orange-600 bg-orange-50" },
  };
  
  export const DocStatusBadge = ({ status, showIcon = true }) => {
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
  };

export const getDownloadUrl = (fileUrl) => {
    if (!fileUrl) 
      return fileUrl;
    if (fileUrl.includes("/upload/")) {
      return fileUrl.replace("/upload/", "/upload/fl_attachment/");
    }
    return fileUrl;
  };

