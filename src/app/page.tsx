import Link from "next/link";
import { Badge, Card, CardContent, CardHeader } from "@/components";
import { getSortedPostsData } from "@/features/blog";

export default function Home() {
  const recentPosts = getSortedPostsData().slice(0, 3);

  return (
    <>
      {/* Introduction Section */}
      <section className="mb-16">
        <h1 className="mb-4 font-bold text-3xl">Introduction</h1>
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
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                <Card className="h-full">
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge>New</Badge>
                      <time className="text-foreground/60 text-sm">{post.date}</time>
                    </div>
                    <h3 className="font-semibold text-xl">{post.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80">{post.description}</p>
                  </CardContent>
                </Card>
              </Link>
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
