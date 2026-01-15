import Link from "next/link";
import { Badge, Button, Card, CardContent, CardHeader } from "@/components";
import { getSortedPostsData } from "@/features/blog";

export default function Home() {
  const recentPosts = getSortedPostsData().slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="mb-16 pt-4 text-center">
        <h1 className="mb-4 font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl">
          Welcome to My Blog
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-foreground/70 text-lg">
          Thoughts, stories, and ideas about web development, technology, and everything in between.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/blog">
            <Button variant="primary" size="lg">
              Explore Articles
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="secondary" size="lg">
              About Me
            </Button>
          </Link>
        </div>
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                <Card className="h-full transition-shadow hover:shadow-lg">
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

      {/* Call to Action Section */}
      <section className="rounded-lg bg-foreground/5 px-8 py-12 text-center">
        <h2 className="mb-4 font-bold text-2xl">Stay Updated</h2>
        <p className="mx-auto mb-6 max-w-xl text-foreground/70">
          Subscribe to get notified about new posts and updates.
        </p>
        <Button variant="primary" size="lg" disabled>
          Coming Soon
        </Button>
      </section>
    </>
  );
}
