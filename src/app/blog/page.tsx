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
      <BlogListContainer posts={posts} />
    </>
  );
}
