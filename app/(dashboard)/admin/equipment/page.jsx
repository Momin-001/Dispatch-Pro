"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Pencil, Plus, Search } from "lucide-react";
import { useDebounce } from "use-debounce";

import api from "@/lib/axios";
import { PageHeader, FilterBar } from "@/components/dashboard/PageLayout/PageLayout";
import { DataTable } from "@/components/dashboard/PageLayout/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EquipmentStatusBadge } from "@/components/helpers";

export default function EquipmentPage() {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("__all__");
  const [debouncedSearch] = useDebounce(search, 400);

  const filtersKey = `${debouncedSearch}|${statusFilter}`;
  const prevFiltersKeyRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (statusFilter && statusFilter !== "__all__") params.set("status", statusFilter);

      const { data: res } = await api.get(`/api/admin/equipment?${params.toString()}`);
      setData(res.data.equipment);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      /* axios interceptor */
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

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
    setStatusFilter("__all__");
  };

  const columns = [
    {
      key: "id",
      header: "Equipment Id",
      render: (row) => `EQ-${String(row.id || "").split("-")[0].toUpperCase()}`,
    },
    { key: "equipmentType", header: "Equipment Type" },
    {
      key: "status",
      header: "Status",
      render: (row) => <EquipmentStatusBadge status={row.status} />,
    },
    {
      key: "inspectionExpiry",
      header: "Inspection Expiry",
      render: (row) =>
        row.inspectionExpiry
          ? format(new Date(row.inspectionExpiry), "MMM dd, yyyy")
          : "—",
    },
    {
      key: "actions",
      header: "Action",
      render: (row) => (
        <Button
          type="button"
          variant="secondary-dark"
          className="rounded-full"
          onClick={() => router.push(`/admin/equipment/${row.id}`)}
        >
          <Pencil className="size-3" />
        </Button>
      ),
    },
  ];

  return (
    <div className="min-w-0 w-full max-w-full space-y-5">
      <PageHeader
        title="Equipment Management"
        description="Manage all the system equipment"
      >
        <Button variant="dark" size="lg" asChild>
          <Link href="/admin/equipment/create">
            <Plus className="mr-2 size-4" />
            Add Equipment
          </Link>
        </Button>
      </PageHeader>

      <FilterBar
        onReset={search || statusFilter !== "__all__" ? resetFilters : undefined}
      >
        <div className="relative min-w-[200px] flex-1 sm:max-w-[320px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search equipment type"
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="No equipment found."
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

