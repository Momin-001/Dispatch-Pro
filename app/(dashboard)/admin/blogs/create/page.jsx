import { BlogForm } from "@/components/dashboard/Blogs/BlogForm";

export default function CreateBlogPage() {
  return (
    <div className="min-w-0 w-full max-w-full">
      <BlogForm mode="create" />
    </div>
  );
}
