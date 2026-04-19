"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Plus, Search, Pencil, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import { PageHeader, FilterBar } from "@/components/dashboard/PageLayout/PageLayout";
import { DataTable } from "@/components/dashboard/PageLayout/DataTable";
import { Button } from "@/components/ui/button";
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
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import api from "@/lib/axios";
import { BLOG_STATUS_OPTIONS } from "@/lib/helpers";
import { BlogStatusBadge } from "@/components/helpers";

export default function BlogsPage() {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("__all__");
  const [statusFilter, setStatusFilter] = useState("__all__");

  const [debouncedSearch] = useDebounce(search, 400);

  const [categories, setCategories] = useState([]);

  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(false);

  // Load categories for filter dropdown
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data: res } = await api.get(
          "/api/admin/blogs/categories?onlyActive=false"
        );
        if (active) setCategories(res.data.categories || []);
      } catch {
        /* axios interceptor */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtersKey = `${debouncedSearch}|${categoryFilter}|${statusFilter}`;
  const prevFiltersKeyRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (categoryFilter && categoryFilter !== "__all__") {
        params.set("categoryId", categoryFilter);
      }
      if (statusFilter && statusFilter !== "__all__") {
        params.set("status", statusFilter);
      }

      const { data: res } = await api.get(
        `/api/admin/blogs?${params.toString()}`
      );
      setData(res.data.blogs);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      /* axios interceptor */
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, categoryFilter, statusFilter]);

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
    setCategoryFilter("__all__");
    setStatusFilter("__all__");
  };

  const togglePublishLabel =
    pendingToggle?.status === "published" ? "Unpublish" : "Publish";

  const confirmTogglePublish = async () => {
    if (!pendingToggle) 
      return;
    setToggleLoading(true);
    const nextStatus = pendingToggle.status === "published" ? "draft" : "published";
    try {
      const { data: res } = await api.patch(
        `/api/admin/blogs/${pendingToggle.id}`,
        { status: nextStatus }
      );
      toast.success(res.message);
      setToggleDialogOpen(false);
      setPendingToggle(null);
      await fetchData();
    } catch {
      /* axios interceptor */
    } finally {
      setToggleLoading(false);
    }
  };

  const columns = [
    {
      key: "id",
      header: "ID",
      render: (row) =>
        `BLOG-${String(row.id || "").split("-")[0].toUpperCase()}`,
    },
    {
      key: "title",
      header: "Title",
      render: (row) => (
        <span className="font-medium text-foreground line-clamp-1 max-w-[280px]">
          {row.title}
        </span>
      ),
    },
    {
      key: "categoryName",
      header: "Category",
      render: (row) => row.categoryName || "—",
    },
    { key: "author", header: "Author" },
    {
      key: "status",
      header: "Status",
      render: (row) => <BlogStatusBadge status={row.status} />,
    },
    {
      key: "createdAt",
      header: "Published Date",
      render: (row) =>
        row.createdAt ? format(new Date(row.createdAt), "MMM dd, yyyy") : "—",
    },
    {
      key: "views",
      header: "Views",
      render: (row) => (row.views ?? 0).toLocaleString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => {
        const isPublished = row.status === "published";
        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={isPublished ? "destructive" : "dark"}
              
              onClick={() => {
                setPendingToggle(row);
                setToggleDialogOpen(true);
              }}
              className="gap-1"
            >
              {isPublished ? (
                <>
                  Unpublish
                </>
              ) : (
                <>
                  Publish
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary-dark"
              className="rounded-full"
              onClick={() => router.push(`/admin/blogs/${row.id}`)}
            >
              <Pencil className="size-3" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-w-0 w-full max-w-full space-y-5">
      <PageHeader
        title="Blog Posts"
        description="Create, manage and publish company blog articles"
      >
        <Button variant="dark" size="lg" asChild>
          <Link href="/admin/blogs/create">
            <Plus className="mr-2 size-4" />
            Create Blog
          </Link>
        </Button>
      </PageHeader>

      <FilterBar
        onReset={
          search ||
          categoryFilter !== "__all__" ||
          statusFilter !== "__all__"
            ? resetFilters
            : undefined
        }
      >
        <div className="relative min-w-[200px] flex-1 sm:max-w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author"
            className="pl-9"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Statuses</SelectItem>
            {BLOG_STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="No blog posts found."
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <AlertDialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {togglePublishLabel} this blog post?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingToggle?.status === "published"
                ? "This will move the blog back to draft and remove it from public listings."
                : "This will publish the blog so it becomes visible on the public site."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={toggleLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant={
                pendingToggle?.status === "published" ? "destructive" : "dark"
              }
              disabled={toggleLoading}
              onClick={(e) => {
                e.preventDefault();
                confirmTogglePublish();
              }}
            >
              {toggleLoading && (
                <Loader2 className="mr-1 size-4 animate-spin" />
              )}
              {togglePublishLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
