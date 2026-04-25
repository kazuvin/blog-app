import Link from "next/link";
import { Badge, Card, CardContent, CardHeader } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { PostMeta } from "../lib/blog-utils";

export type BlogCardProps = {
  post: PostMeta;
  showNewBadge?: boolean;
  showTags?: boolean;
  className?: string;
};

export function BlogCard({
  post,
  showNewBadge = false,
  showTags = true,
  className,
}: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <Card className={cn("ease transition-colors hover:bg-surface-hover", className)}>
        <CardHeader>
          <h2 className="font-semibold text-xl">{post.title}</h2>
          <div className="flex items-center gap-3">
            {showNewBadge ? <Badge>New</Badge> : null}
            <time className="text-foreground/60 text-sm">{post.date}</time>
            {showTags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80">{post.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
