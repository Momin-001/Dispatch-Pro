"use client";

import { useState, useCallback, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { DynamicTable } from "@/components/dashboard/DynamicTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import api from "@/lib/axios";
import { ROLE_OPTIONS, ROLE_LABELS, USER_STATUS } from "@/components/dashboard/helpers";

const columns = [
  { key: "id", header: "ID", prefix: "USR" },
  { key: "fullName", header: "Full Name" },
  { key: "email", header: "Email" },
  {
    key: "roleName",
    header: "Role",
    render: (row) => ROLE_LABELS[row.roleName] || row.roleName,
  },
  { key: "status", header: "Status" },
  {
    key: "createdAt",
    header: "Joined",
    render: (row) =>
      row.createdAt ? format(new Date(row.createdAt), "MMM dd, yyyy") : "—",
  },
];

const filters = [
  {
    key: "role",
    placeholder: "Role",
    type: "select",
    options: ROLE_OPTIONS,
  },
  {
    key: "status",
    placeholder: "Status",
    type: "select",
    options: [
      { value: "pending_approval", label: "Pending" },
      { value: "approved", label: "Active" },
      { value: "rejected", label: "Rejected" },
      { value: "suspended", label: "Suspended" },
    ],
  },
];

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({});

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: "", email: "", role: "" });
  const [creating, setCreating] = useState(false);

  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [pendingSuspend, setPendingSuspend] = useState(null);
  const [suspendLoading, setSuspendLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      const { search, ...rest } = currentFilters;
      if (search) params.set("search", search);
      for (const [key, val] of Object.entries(rest)) {
        if (val) params.set(key, val);
      }
      const { data: res } = await api.get(`/api/admin/users?${params.toString()}`);
      setData(res.data.users);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      /* axios interceptor */
    } finally {
      setLoading(false);
    }
  }, [page, currentFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFiltersChange = useCallback((filters) => {
    setCurrentFilters(filters);
    setPage(1);
  }, []);

  const handleCreateUser = async () => {
    if (!newUser.fullName.trim() || !newUser.email.trim() || !newUser.role) {
      toast.error("All fields are required.");
      return;
    }
    setCreating(true);
    try {
      const { data: res } = await api.post("/api/auth/register", {
        fullName: newUser.fullName.trim(),
        email: newUser.email.trim(),
        role: newUser.role,
      });
      toast.success(res.message);
      setAddDialogOpen(false);
      setNewUser({ fullName: "", email: "", role: "" });
      await fetchData();
    } catch {
      /* axios interceptor */
    } finally {
      setCreating(false);
    }
  };

  const openSuspendDialog = (row) => {
    setPendingSuspend(row);
    setSuspendDialogOpen(true);
  };

  const confirmSuspend = async () => {
    if (!pendingSuspend) return;
    setSuspendLoading(true);
    const action =
      pendingSuspend.status === "suspended" ? "approved" : "suspended";
    try {
      const { data: res } = await api.patch("/api/admin/users/status", {
        userId: pendingSuspend.id,
        action,
      });
      toast.success(res.message);
      setSuspendDialogOpen(false);
      setPendingSuspend(null);
      await fetchData();
    } catch {
      /* axios interceptor */
    } finally {
      setSuspendLoading(false);
    }
  };

  const suspendLabel = pendingSuspend?.status === "suspended" ? "Activate" : "Suspend";

  const actions = [
    {
      label: (row) => (row.status === "suspended" ? "Activate" : "Suspend"),
      variant: (row) => (row.status === "suspended" ? "dark" : "destructive"),
      size: "rounded",
      show: (row) => row.roleName !== "admin",
      onClick: openSuspendDialog,
    },
  ];

  return (
    <div className="min-w-0 w-full max-w-full space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage all users, roles and account statuses
        </p>
      </div>

      <DynamicTable
        searchPlaceholder="Search by name or email"
        filters={filters}
        headerAction={{
          label: "Add User",
          icon: UserPlus,
          variant: "dark",
          size: "lg",
          onClick: () => {
            setNewUser({ fullName: "", email: "", role: "" });
            setAddDialogOpen(true);
          },
        }}
        columns={columns}
        statusConfig={USER_STATUS}
        actions={actions}
        emptyMessage="No users found."
        data={data}
        loading={loading}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onFiltersChange={handleFiltersChange}
      />

      {/* Add User Dialog */}
      <AlertDialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New User</AlertDialogTitle>
            <AlertDialogDescription>
              Create a user manually. A password setup link will be sent to their email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 px-1">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Full Name
              </label>
              <Input
                value={newUser.fullName}
                onChange={(e) =>
                  setNewUser((p) => ({ ...p, fullName: e.target.value }))
                }
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Role
              </label>
              <Select
                value={newUser.role}
                onValueChange={(v) =>
                  setNewUser((p) => ({ ...p, role: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={creating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="dark"
              disabled={creating}
              onClick={(e) => {
                e.preventDefault();
                handleCreateUser();
              }}
            >
              {creating && <Loader2 className="mr-1 size-4 animate-spin" />}
              Create
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend / Activate Dialog */}
      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{suspendLabel} this user?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingSuspend?.status === "suspended"
                ? "This will reactivate the user and restore their access to the system."
                : "This will suspend the user. They will not be able to log in or access any features."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={suspendLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={
                pendingSuspend?.status === "suspended" ? "light" : "destructive"
              }
              disabled={suspendLoading}
              onClick={(e) => {
                e.preventDefault();
                confirmSuspend();
              }}
            >
              {suspendLoading && (
                <Loader2 className="mr-1 size-4 animate-spin" />
              )}
              {suspendLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
