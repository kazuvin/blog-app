import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { getSortedPostsData } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description: "ブログ記事一覧",
};

export default function BlogPage() {
  const posts = getSortedPostsData();

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">Blog</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <time className="text-foreground/60 text-sm">{post.date}</time>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{post.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
