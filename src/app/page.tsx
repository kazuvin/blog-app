import Link from "next/link";
import { Badge, Button, Card, CardContent, CardHeader } from "@/components";
import { getSortedPostsData } from "@/features/blog";

export default function Home() {
  const recentPosts = getSortedPostsData().slice(0, 3);

  return (
    <>
      {/* About Section */}
      <section className="mb-16 pt-4">
        <h1 className="mb-8 font-bold text-3xl">About Me</h1>

        <div className="space-y-6">
          {/* Bio Section */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-xl">Introduction</h2>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                Welcome to my blog! I&apos;m a passionate developer who loves building web
                applications and sharing knowledge with the community. This is a placeholder bio
                that can be customized with your personal story, background, and what drives your
                work.
              </p>
            </CardContent>
          </Card>

          {/* Skills/Interests Section */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-xl">Skills &amp; Interests</h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="info">Next.js</Badge>
                <Badge variant="info">TypeScript</Badge>
                <Badge variant="info">React</Badge>
                <Badge variant="success">Web Development</Badge>
                <Badge variant="success">UI/UX Design</Badge>
                <Badge variant="default">Cloud Computing</Badge>
                <Badge variant="default">Performance Optimization</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-xl">Get in Touch</h2>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-foreground/80">
                Feel free to reach out if you&apos;d like to connect or collaborate on projects.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="md" disabled>
                  Email
                </Button>
                <Button variant="secondary" size="md" disabled>
                  GitHub
                </Button>
                <Button variant="secondary" size="md" disabled>
                  Twitter
                </Button>
                <Button variant="ghost" size="md" disabled>
                  LinkedIn
                </Button>
              </div>
              <p className="mt-3 text-foreground/60 text-sm">(Contact links will be added soon)</p>
            </CardContent>
          </Card>
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
    </>
  );
}
