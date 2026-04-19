"use client";

import { CategoryForm } from "@/components/dashboard/Blogs/CategoryForm";

export default function CreateBlogCategoryPage() {
  return (
    <div className="min-w-0 w-full max-w-full">
      <CategoryForm mode="create" />
    </div>
  );
}
