import { BlogHero } from "@/components/guest/Blogs/Blog-Hero";
import { BlogPostsSection } from "@/components/guest/Blogs/Blog-Posts-Section";
import { BlogNewsletter } from "@/components/guest/Blogs/Blog-Newsletter";

export default function BlogsPage() {
  return (
    <>
      <BlogHero />
      <BlogPostsSection />
      <BlogNewsletter />
    </>
  );
}
