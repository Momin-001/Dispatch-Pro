import { BlogDetail } from "@/components/guest/Blogs/BlogDetail";

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  return <BlogDetail slug={slug} />;
}
