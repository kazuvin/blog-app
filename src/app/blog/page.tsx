import { Suspense } from "react";
import { BlogListContainer, BlogListSkeleton, getSortedPostsData } from "@/features/blog";

export const dynamic = "force-static";

export const metadata = {
  title: "Blog",
  description: "ブログ記事一覧",
};

export default function BlogPage() {
  const posts = getSortedPostsData();

  return (
    <>
      <h1 className="mb-8 font-bold text-3xl">Blog</h1>
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogListContainer posts={posts} />
      </Suspense>
    </>
  );
}
