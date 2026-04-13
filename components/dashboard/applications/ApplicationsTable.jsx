"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Eye,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { Card } from "@/components/ui/card";

const STATUS_LABELS = {
  pending_approval: { label: "Pending", className: "bg-amber-100 text-amber-700" }, 
  approved: { label: "Approved", className: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  suspended: { label: "Suspended", className: "bg-gray-100 text-gray-700" },
};

function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-2 text-xs font-medium",
        STATUS_LABELS[status]?.className || "bg-gray-100 text-gray-700"
      )}
    >
      {STATUS_LABELS[status]?.label || status}
    </span>
  );
}

/**
 * Shared applications table component.
 *
 * @param {string}   title          – e.g. "Driver Applications"
 * @param {string}   subtitle       – description below title
 * @param {string}   roleSlug       – URL slug sent to the API (e.g. "driver", "owner-operator")
 * @param {Array}    columns        – [{ key, header, render? }]
 * @param {Array}    filters        – [{ key, placeholder, type: "input"|"select", options? }]
 * @param {string}   searchPlaceholder
 * @param {function} detailHref      – (row) => href string for detail page
 */
export function ApplicationsTable({
  title,
  subtitle,
  roleSlug,
  columns,
  filters = [],
  searchPlaceholder = "Search (name/email)",
  detailHref,
}) {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [debouncedSearch] = useDebounce(search, 400);
  const [debouncedFilters] = useDebounce(filterValues, 400);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      if (debouncedSearch) params.set("search", debouncedSearch);
      for (const [key, val] of Object.entries(debouncedFilters)) {
        if (val) params.set(key, val);
      }
      const { data: res } = await api.get(
        `/api/admin/applications/${roleSlug}?${params.toString()}`
      );
      setData(res.data.applications);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      /* axios interceptor */
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, debouncedFilters, roleSlug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedFilters]);

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    if (search !== "" || Object.values(filterValues).some(value => value !== "")) {
      setSearch("");
      setFilterValues({});
      setPage(1);
    }
  };

  const openConfirm = (userId, action) => {
    setPendingAction({ userId, action });
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!pendingAction) return;
    setActionLoading(true);
    try {
      const { data: res } = await api.patch("/api/admin/applications/status", {
        userId: pendingAction.userId,
        action: pendingAction.action,
      });
      toast.success(res.message);
      setDialogOpen(false);
      setPendingAction(null);
      await fetchData();
    } catch {
      /* axios interceptor */
    } finally {
      setActionLoading(false);
    }
  };

  const actionLabel = pendingAction?.action === "approved" ? "Approve" : "Reject";

  return (
    <div className="min-w-0 w-full max-w-full space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {/* Filters */}
      <Card className="flex flex-row flex-wrap px-4 items-center gap-3">
        <div className="relative min-w-[200px] flex-1 sm:max-w-[260px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>

        {filters.map((filter) =>
          filter.type === "select" ? (
            <Select
              key={filter.key}
              value={filterValues[filter.key] || ""}
              onValueChange={(v) => handleFilterChange(filter.key, v === "__all__" ? "" : v)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All</SelectItem>
                {filter.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              key={filter.key}
              value={filterValues[filter.key] || ""}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              placeholder={filter.placeholder}
              className="w-[160px]"
            />
          )
        )}

        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary-dark hover:text-primary-dark/80"
        >
          <RotateCcw className="size-3.5" />
          Reset Filters
        </button>
      </Card>

      {/* Table — min-w-0 + overflow-x lets table scroll inside flex layouts (min-width:auto bug) */}
      <div className="min-w-0 w-full max-w-full overflow-x-auto overscroll-x-contain rounded-lg border border-border [scrollbar-width:thin]">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr style={{ backgroundColor: "#F9FAFB" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-sm font-medium uppercase text-foreground-light whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
              <th className="px-4 py-3 text-sm uppercase font-medium text-foreground-light">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-12 text-center">
                  <Loader2 className="mx-auto size-6 animate-spin text-primary" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  No applications found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm font-normal whitespace-nowrap">
                      {col.key === "status" ? (
                        <StatusBadge status={row.status} />
                      ) : col.render ? (
                        col.render(row)
                      ) : (
                        row[col.key] || "—"
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        title="View details"
                        className="text-primary-dark border-primary-dark rounded-full"
                        onClick={() => detailHref && router.push(detailHref(row))}
                      >
                        <Eye className="size-3" />
                      </Button>
                      {row.status !== "approved" && row.status !== "rejected" && (
                        <>
                          <Button
                            variant="light"
                            size="rounded"
                            onClick={() => openConfirm(row.id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="rounded"
                            onClick={() => openConfirm(row.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: count + pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "result" : "results"}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            className="px-3 py-5"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="flex h-10 min-w-10 text-background items-center bg-primary-dark justify-center rounded-md border border-border px-2 text-sm font-medium">
            {String(page).padStart(2, "0")}
          </span>
          <Button
            variant="outline"
            className="px-3 py-5"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Confirm dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionLabel} this user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.action === "approved"
                ? "This will approve the user and all their uploaded documents. They will gain full access to the system."
                : "This will reject the user and all their uploaded documents. They will not be able to access the system."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={pendingAction?.action === "approved" ? "light" : "destructive"}
              disabled={actionLoading}
              onClick={(e) => {
                e.preventDefault();
                confirmAction();
              }}
            >
              {actionLoading && <Loader2 className="mr-1 size-4 animate-spin" />}
              {actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
