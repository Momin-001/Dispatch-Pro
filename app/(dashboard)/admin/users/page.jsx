"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Loader2, UserPlus, Search } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

// Layout & UI Components
import { PageHeader, FilterBar } from "@/components/dashboard/PageLayout/PageLayout";
import { DataTable } from "@/components/dashboard/PageLayout/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/axios";
import { ROLE_OPTIONS, ROLE_LABELS } from "@/lib/helpers";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/auth-context";
import { UserStatusBadge } from "@/components/helpers";

export default function UsersPage() {
  const { hasPermission } = useAuth();
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Debounce values so we don't spam the API
  const [debouncedSearch] = useDebounce(search, 400);

  // Dialog States
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [pendingSuspend, setPendingSuspend] = useState(null);
  const [newUser, setNewUser] = useState({ fullName: "", email: "", role: "" });
  const [creating, setCreating] = useState(false);
  const [suspendLoading, setSuspendLoading] = useState(false);

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

  const suspendLabel = pendingSuspend?.status === "suspended" ? "Activate" : "Suspend";

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

  const filtersKey = `${debouncedSearch}|${roleFilter}|${statusFilter}`;
  const prevFiltersKeyRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      if (debouncedSearch) 
        params.set("search", debouncedSearch);
      if (roleFilter && roleFilter !== "all") 
        params.set("role", roleFilter);
      if (statusFilter && statusFilter !== "all") 
        params.set("status", statusFilter);

      const { data: res } = await api.get(`/api/admin/users?${params.toString()}`);
      setData(res.data.users);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      /* axios interceptor handles errors */
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, roleFilter, statusFilter]);

  useEffect(() => {
    const prev = prevFiltersKeyRef.current;
    const filtersChanged = prev !== null && prev !== filtersKey;

    if (filtersChanged && page !== 1) {
      prevFiltersKeyRef.current = filtersKey;
      setPage(1);
      return;
    }

    prevFiltersKeyRef.current = filtersKey;
    fetchData();
  }, [filtersKey, page, fetchData]);

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
  };


  const columns = [
    {
      key: "id",
      header: "ID",
      render: (row) => `USR-${String(row.id || "").split("-")[0].toUpperCase()}`
    },
    { key: "fullName", header: "Full Name" },
    { key: "email", header: "Email" },
    {
      key: "roleName",
      header: "Role",
      render: (row) => ROLE_LABELS[row.roleName] || row.roleName,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        return (
         <UserStatusBadge status={row.status} />
        );
      }
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (row) => row.createdAt ? format(new Date(row.createdAt), "MMM dd, yyyy") : "—",
    },
    {
      key: "actions",
      header: "Action",
      render: (row) => {
        // Action logic moved out of the table loop and into the column definition
        if (row.roleName === "admin")
          return null;
        const isSuspended = row.status === "suspended";
        return (
          <>
              <Button
                variant={isSuspended ? "dark" : "destructive"}
                size="rounded"
                onClick={() => {
                  setPendingSuspend(row);
                  setSuspendDialogOpen(true);
                }}
              >
                {isSuspended ? "Activate" : "Suspend"}
              </Button>
          </>
        );
      }
    }
  ];

  return (
    <div className="min-w-0 w-full max-w-full space-y-5">

      {/* 1. Header Area */}
      <PageHeader
        title="Users Management"
        description="Manage all users, roles and account statuses"
      >
          <Button variant="dark" size="lg" onClick={() => setAddDialogOpen(true)}>
            <UserPlus className="mr-2 size-4" />
          Add User
        </Button>
      </PageHeader>

      {/* 2. Optional Widget Area (You can drop any custom chart or banner here!) */}

      {/* 3. Filter Area */}
      <FilterBar
        onReset={
          search || roleFilter !== "all" || statusFilter !== "all"
            ? resetFilters
            : undefined
        }
      >
        <div className="relative min-w-[200px] flex-1 sm:max-w-[260px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="pl-9"
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLE_OPTIONS.map((r) => (
              <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending_approval">Pending</SelectItem>
            <SelectItem value="approved">Active</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      {/* 4. Table Area */}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="No users found."
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a user manually. A password setup link will be sent to their email.
            </DialogDescription>
          </DialogHeader>
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
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={creating}
              onClick={() => setAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="dark"
              disabled={creating}
              onClick={handleCreateUser}
              className="gap-2"
            >
              {creating && <Loader2 className="size-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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