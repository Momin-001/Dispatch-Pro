import { Clock, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

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
  
  export const DOC_STATUS = {
    pending: { label: "Pending", icon: Clock, className: "text-amber-600 bg-amber-50" },
    approved: { label: "Approved", icon: CheckCircle2, className: "text-green-600 bg-green-50" },
    rejected: { label: "Rejected", icon: XCircle, className: "text-red-600 bg-red-50" },
    reupload_requested: { label: "Re-upload", icon: RotateCcw, className: "text-orange-600 bg-orange-50" },
  };
  
  export const USER_STATUS = {
    pending_approval: { label: "Pending", className: "bg-amber-100 text-amber-700" },
    approved: { label: "Approved", className: "bg-green-100 text-green-700" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
    suspended: { label: "Suspended", className: "bg-gray-100 text-gray-700" },
  };

  export const ROLE_DASHBOARD_MAP = {
    admin: "/admin",
    driver: "/driver",
    dispatcher: "/dispatcher",
    shipper: "/shipper",
    owner_operator: "/owner_operator",
  };
  
  export const ROLE_API_MAP = {
    admin: "/api/admin",
    driver: "/api/driver",
    dispatcher: "/api/dispatcher",
    shipper: "/api/shipper",
    owner_operator: "/api/owner_operator",
  };

/** Rows shown on Admin → Roles & Permissions matrix (order matters). */
export const PERMISSION_MATRIX_ROWS = [
  { key: "users.edit", label: "Approve Users" },
  { key: "loads.create", label: "Create load" },
  { key: "loads.edit", label: "Update Load Status" },
  { key: "documents.upload", label: "Upload Documents" },
  { key: "courses.create", label: "Create course" },
  { key: "courses.purchase", label: "Purchase course" },
];

/** Admin column: fixed badge — `tick` | `cross` (not editable). */
export const ADMIN_PERMISSION_MATRIX_DISPLAY = {
  "users.edit": "tick",
  "loads.create": "tick",
  "loads.edit": "tick",
  "documents.upload": "cross",
  "courses.create": "tick",
  "courses.purchase": "cross",
};

/** Non-admin roles only: `toggle` = bound to DB; `cross` = not applicable. */
export const ROLE_PERMISSION_MATRIX_CELL = {
  dispatcher: {
    "users.edit": "cross",
    "loads.create": "toggle",
    "loads.edit": "cross",
    "documents.upload": "cross",
    "courses.create": "cross",
    "courses.purchase": "toggle",
  },
  driver: {
    "users.edit": "cross",
    "loads.create": "cross",
    "loads.edit": "toggle",
    "documents.upload": "toggle",
    "courses.create": "cross",
    "courses.purchase": "toggle",
  },
  shipper: {
    "users.edit": "cross",
    "loads.create": "cross",
    "loads.edit": "cross",
    "documents.upload": "cross",
    "courses.create": "cross",
    "courses.purchase": "cross",
  },
  owner_operator: {
    "users.edit": "cross",
    "loads.create": "cross",
    "loads.edit": "cross",
    "documents.upload": "toggle",
    "courses.create": "cross",
    "courses.purchase": "toggle",
  },
};

export const PERMISSION_MATRIX_ROLE_ORDER = [
  "admin",
  "dispatcher",
  "driver",
  "shipper",
  "owner_operator",
];