"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

/**
 * Fully dynamic, reusable table with search, filters, pagination
 * and configurable action buttons.
 *
 * Props
 * ─────────────────────────────────────────────────────────────
 * @param {string}   searchPlaceholder  – placeholder for the search box (omit to hide search)
 * @param {Array}    filters            – [{ key, placeholder, type:"input"|"select", options?:[{value,label}] }]
 * @param {object}   headerAction       – { label, icon?, variant?, size?, onClick } renders a button next to "Reset Filters"
 * @param {Array}    columns            – [{ key, header, render?(row), prefix? }]
 *                                        • prefix on id column produces e.g. "USR-a2f4…"
 *                                        • render overrides default cell output
 * @param {object}   statusConfig       – { [statusValue]: { label, className } }  used when col.key === "status"
 * @param {Array}    actions            – [{ label, icon?, variant, size, show?(row), onClick(row) }]
 * @param {string}   emptyMessage       – shown when no rows
 *
 * Data (caller owns fetching)
 * @param {Array}    data               – rows for the current page
 * @param {boolean}  loading
 * @param {number}   total              – total result count
 * @param {number}   page               – current 1-based page
 * @param {number}   totalPages
 * @param {function} onPageChange       – (newPage) =>
 * @param {function} onFiltersChange    – ({ search, ...filterValues }) => called with debounced values
 */
export function DynamicTable({
  searchPlaceholder,
  filters = [],
  headerAction,
  columns = [],
  statusConfig = {},
  actions = [],
  emptyMessage = "No results found.",

  data = [],
  loading = false,
  total = 0,
  page = 1,
  totalPages = 1,
  onPageChange,
  onFiltersChange,
}) {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [debouncedSearch] = useDebounce(search, 400);
  const [debouncedFilters] = useDebounce(filterValues, 400);

  useEffect(() => {
    onFiltersChange?.({ search: debouncedSearch, ...debouncedFilters });
  }, [debouncedSearch, debouncedFilters]);

  useEffect(() => {
    onPageChange?.(1);
  }, [debouncedSearch, debouncedFilters]);

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    if (search || Object.values(filterValues).some((v) => v)) {
      setSearch("");
      setFilterValues({});
    }
  };

  function renderCell(col, row) {
    if (col.key === "status" && statusConfig[row.status]) {
      const cfg = statusConfig[row.status];
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium",
            cfg.className
          )}
        >
          {cfg.label}
        </span>
      );
    }

    if (col.render) return col.render(row);

    if (col.prefix) {
      const shortId = String(row[col.key] || "").split("-")[0].toUpperCase();
      return `${col.prefix}-${shortId}`;
    }

    return row[col.key] ?? "—";
  }

  const hasActions = actions.length > 0;

  return (
    <div className="min-w-0 w-full max-w-full space-y-5">
      {/* Filters */}
      <Card className="flex flex-row flex-wrap px-4 items-center gap-3">
        {searchPlaceholder && (
          <div className="relative min-w-[200px] flex-1 sm:max-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>
        )}

        {filters.map((filter) =>
          filter.type === "select" ? (
            <Select
              key={filter.key}
              value={filterValues[filter.key] || ""}
              onValueChange={(v) =>
                handleFilterChange(filter.key, v === "__all__" ? "" : v)
              }
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

        {headerAction && (
          <Button
            variant={headerAction.variant || "dark"}
            size={headerAction.size || "rounded"}
            onClick={headerAction.onClick}
          >
            {headerAction.icon && <headerAction.icon className="size-4" />}
            {headerAction.label}
          </Button>
        )}
      </Card>

      {/* Table */}
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
              {hasActions && (
                <th className="px-4 py-3 text-sm font-medium uppercase text-foreground-light">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="py-12 text-center"
                >
                  <Loader2 className="mx-auto size-6 animate-spin text-primary" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-sm font-normal whitespace-nowrap"
                    >
                      {renderCell(col, row)}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {actions.map((act) => {
                          if (act.show && !act.show(row)) 
                            return null;
                          const Icon = act.icon;
                          return (
                            <Button
                              key={act.label}
                              variant={typeof act.variant === "function" ? act.variant(row) : act.variant || "default"}
                              size={act.size || "rounded"}
                              onClick={() => act.onClick(row)}
                              className={cn(act.className)}
                            >
                              {Icon && <Icon className="size-3.5" />}
                              {typeof act.label === "function"
                                ? act.label(row)
                                : act.label}
                            </Button>
                          );
                        })}
                      </div>
                    </td>
                  )}
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
