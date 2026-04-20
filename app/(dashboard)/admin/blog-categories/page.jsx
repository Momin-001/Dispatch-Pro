"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";

import { PageHeader } from "@/components/dashboard/PageLayout/PageLayout";
import { DataTable } from "@/components/dashboard/PageLayout/DataTable";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { BlogCategoryStatusBadge } from "@/components/helpers";

export default function BlogCategoriesPage() {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("paginated", "true");
      params.set("page", String(page));

      const { data: res } = await api.get(
        `/api/admin/blog-categories?${params.toString()}`
      );
      setData(res.data.categories);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      /* axios interceptor */
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    {
      key: "id",
      header: "ID",
      render: (row) => `CAT-${String(row.id).padStart(3, "0")}`,
    },
    {
      key: "name",
      header: "Category Name",
      render: (row) => (
        <span className="font-medium text-foreground">{row.name}</span>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (row) => (
        <span className="line-clamp-1 max-w-[320px] text-muted-foreground">
          {row.description || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <BlogCategoryStatusBadge status={row.status} />,
    },
    {
      key: "totalPosts",
      header: "Total Posts",
      render: (row) => (row.totalPosts ?? 0).toLocaleString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Button
          type="button"
          variant="secondary-dark"
          className="rounded-full"
          onClick={() => router.push(`/admin/blog-categories/${row.id}`)}
        >
          <Pencil className="size-3" />
         
        </Button>
      ),
    },
  ];

  return (
    <div className="min-w-0 w-full max-w-full space-y-5">
      <PageHeader
        title="Blog Categories"
        description="Organize blog posts into structured topics"
      >
        <Button variant="dark" size="lg" asChild>
          <Link href="/admin/blog-categories/create">
            <Plus className="mr-2 size-4" />
            Create Category
          </Link>
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="No categories found."
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
