import Link from "next/link";
import { Card, CardContent } from "@/components";
import { BlogCard, getSortedPostsData } from "@/features/blog";

export const dynamic = "force-static";

export default function Home() {
  const recentPosts = getSortedPostsData().slice(0, 3);

  return (
    <>
      {/* Introduction Section */}
      <section className="mb-16">
        <h1 className="mb-4 font-bold text-3xl">kazuvin</h1>
        <p className="text-foreground/80 text-lg leading-relaxed">
          Welcome to my blog! I&apos;m a passionate developer who loves building web applications
          and sharing knowledge with the community. This is a placeholder bio that can be customized
          with your personal story, background, and what drives your work.
        </p>
      </section>

      {/* Recent Posts Section */}
      <section id="recent" className="mb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-bold text-3xl">Recent Posts</h2>
          <Link href="/blog" className="text-foreground/70 hover:text-foreground">
            View all →
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="grid gap-6">
            {recentPosts.map((post) => (
              <BlogCard key={post.slug} post={post} showNewBadge showTags={false} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-foreground/60">No posts available yet. Check back soon!</p>
            </CardContent>
          </Card>
        )}
      </section>
    </>
  );
}
