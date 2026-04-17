import {
  LayoutDashboard,
  Users,
  Truck,
  FileText,
  BookOpen,
  Newspaper,
  BarChart3,
  ShieldCheck,
  Package,
  Bell,
  UserCog,
  ClipboardList,
} from "lucide-react";

/**
 * Each item:
 *   label, icon, href            – simple link
 *   label, icon, children[]      – accordion with sub-items
 *   requiredPermission           – hidden when user lacks this permission
 *   approvedOnly                 – hidden when user is NOT approved
 *   pendingOnly                  – shown ONLY when user is pending_password / pending_approval
 */

const admin = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  {
    label: "Applications",
    icon: ClipboardList,
    children: [
      { label: "Driver", href: "/admin/applications/driver" },
      { label: "Dispatcher", href: "/admin/applications/dispatcher" },
      { label: "Shipper", href: "/admin/applications/shipper" },
      { label: "Owner Operator", href: "/admin/applications/owner_operator" },
    ],
  },
  { label: "Users Management", 
    icon: Users, 
    children: [
      { label: "All Users", href: "/admin/users", requiredPermission: "users.view" },
      { label: "Roles & Permissions", href: "/admin/roles-permissions", requiredPermission: "permissions.manage" },
    ],
    requiredPermission: "users.view",
  },
  { label: "Loads", icon: Package, href: "/admin/loads", requiredPermission: "loads.view" },
  { label: "Equipment", icon: Truck, href: "/admin/equipment", requiredPermission: "equipment.view" },
  { label: "Documents", icon: FileText, href: "/admin/documents", requiredPermission: "documents.view" },
  {
    label: "LMS (Courses)",
    icon: BookOpen,
    children: [
      { label: "Courses", href: "/admin/courses" },
      { label: "Categories", href: "/admin/courses/categories" },
    ],
    requiredPermission: "courses.view",
  },
  { label: "Blog Management", icon: Newspaper, href: "/admin/blogs", requiredPermission: "blogs.view" },
  { label: "Reports", icon: BarChart3, href: "/admin/reports", requiredPermission: "reports.view" },
];

const dispatcher = [
  { label: "Verification", icon: ShieldCheck, href: "/dispatcher/verification", pendingOnly: true },
  { label: "Dashboard", icon: LayoutDashboard, href: "/dispatcher", approvedOnly: true },
  { label: "Load Management", icon: Package, href: "/dispatcher/loads", approvedOnly: true, requiredPermission: "loads.view" },
  { label: "Drivers", icon: Users, href: "/dispatcher/drivers", approvedOnly: true },
  { label: "Reports", icon: BarChart3, href: "/dispatcher/reports", approvedOnly: true, requiredPermission: "reports.view" },
  { label: "Training", icon: BookOpen, href: "/dispatcher/training", approvedOnly: true, requiredPermission: "courses.view" },
  { label: "Notifications", icon: Bell, href: "/dispatcher/notifications", approvedOnly: true, requiredPermission: "notifications.view" },
  { label: "Profile", icon: UserCog, href: "/dispatcher/profile", approvedOnly: true, requiredPermission: "profile.view" },
];

const driver = [
  { label: "Verification", icon: ShieldCheck, href: "/driver/verification", pendingOnly: true },
  { label: "Dashboard", icon: LayoutDashboard, href: "/driver", approvedOnly: true },
  { label: "My Loads", icon: Package, href: "/driver/loads", approvedOnly: true, requiredPermission: "loads.view" },
  { label: "Documents", icon: FileText, href: "/driver/documents", approvedOnly: true, requiredPermission: "documents.view" },
  { label: "Training", icon: BookOpen, href: "/driver/training", approvedOnly: true, requiredPermission: "courses.view" },
  { label: "Notifications", icon: Bell, href: "/driver/notifications", approvedOnly: true, requiredPermission: "notifications.view" },
  { label: "Profile", icon: UserCog, href: "/driver/profile", approvedOnly: true, requiredPermission: "profile.view" },
];

const shipper = [
  { label: "Verification", icon: ShieldCheck, href: "/shipper/verification", pendingOnly: true },
  { label: "Dashboard", icon: LayoutDashboard, href: "/shipper", approvedOnly: true },
  { label: "My Shipments", icon: Package, href: "/shipper/shipments", approvedOnly: true, requiredPermission: "loads.view" },
  { label: "Documents", icon: FileText, href: "/shipper/documents", approvedOnly: true, requiredPermission: "documents.view" },
  { label: "Reports", icon: BarChart3, href: "/shipper/reports", approvedOnly: true, requiredPermission: "reports.view" },
  { label: "Notifications", icon: Bell, href: "/shipper/notifications", approvedOnly: true, requiredPermission: "notifications.view" },
  { label: "Profile", icon: UserCog, href: "/shipper/profile", approvedOnly: true, requiredPermission: "profile.view" },
];

const owner_operator = [
  { label: "Verification", icon: ShieldCheck, href: "/owner_operator/verification", pendingOnly: true },
  { label: "Dashboard", icon: LayoutDashboard, href: "/owner_operator", approvedOnly: true },
  { label: "My Loads", icon: Package, href: "/owner_operator/loads", approvedOnly: true, requiredPermission: "loads.view" },
  { label: "My Equipment", icon: Truck, href: "/owner_operator/equipment", approvedOnly: true, requiredPermission: "equipment.view" },
  { label: "Reports", icon: BarChart3, href: "/owner_operator/reports", approvedOnly: true, requiredPermission: "reports.view" },
  { label: "Training", icon: BookOpen, href: "/owner_operator/training", approvedOnly: true, requiredPermission: "courses.view" },
  { label: "Notifications", icon: Bell, href: "/owner_operator/notifications", approvedOnly: true, requiredPermission: "notifications.view" },
  { label: "Profile", icon: UserCog, href: "/owner_operator/profile", approvedOnly: true, requiredPermission: "profile.view" },
];

export const NAV_BY_ROLE = { admin, dispatcher, driver, shipper, owner_operator };

export function getFilteredNav(role, status, hasPermission) {
  const items = NAV_BY_ROLE[role] || [];
  const isPending = status !== "approved";

  return items.filter((item) => {
    if (item.pendingOnly && !isPending) return false;
    if (item.approvedOnly && isPending) return false;
    if (item.requiredPermission && !hasPermission(item.requiredPermission)) return false;
    return true;
  });
}
