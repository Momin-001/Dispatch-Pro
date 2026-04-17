"use client";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No results found.",
  total = 0,
  page = 1,
  totalPages = 1,
  onPageChange,
}) {
  return (
    <div className="space-y-4">
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
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <Loader2 className="mx-auto size-6 animate-spin text-primary" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="hover:bg-muted/30">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm font-normal whitespace-nowrap">
                      {/* If the column provides a custom render function, use it. Otherwise, output the key */}
                      {col.render ? col.render(row) : row[col.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "result" : "results"}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            className="px-3 py-5"
            disabled={page <= 1}
            onClick={() => onPageChange?.(Math.max(1, page - 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="flex h-10 min-w-10 items-center justify-center rounded-md border border-border bg-primary-dark px-2 text-sm font-medium text-background">
            {String(page).padStart(2, "0")}
          </span>
          <Button
            variant="outline"
            className="px-3 py-5"
            disabled={page >= totalPages}
            onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}