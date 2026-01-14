import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <nav className="mb-8">
        <Link href="/blog" className="text-foreground/60 transition-colors hover:text-foreground">
          ← Back to Blog
        </Link>
      </nav>
      <header className="mb-8">
        <h1 className="mb-4 font-bold text-4xl">{post.title}</h1>
        <time className="text-foreground/60">{post.date}</time>
      </header>
      <div
        className="prose prose-neutral dark:prose-invert max-w-none"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Blog content is server-rendered from markdown
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
