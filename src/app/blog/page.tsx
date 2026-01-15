import { Suspense } from "react";
import { getSortedPostsData } from "@/lib/blog";
import { BlogListContainer } from "./_components/blog-list-container";

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

function BlogListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-full animate-pulse rounded-md bg-foreground/10" />
      <div className="flex gap-4">
        <div className="h-8 w-24 animate-pulse rounded-full bg-foreground/10" />
        <div className="h-8 w-24 animate-pulse rounded-full bg-foreground/10" />
        <div className="h-8 w-24 animate-pulse rounded-full bg-foreground/10" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-foreground/10" />
        ))}
      </div>
    </div>
  );
}
