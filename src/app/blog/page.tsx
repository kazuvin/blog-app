import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogListContainer, BlogListSkeleton, getSortedPostsData } from "@/features/blog";
import { pageMetadata } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  pathname: "/blog",
  title: "Blog",
  description: "ブログ記事一覧",
});

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
