"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Badge, Card, CardContent, CardHeader } from "@/components/ui";
import { getAllTags, getPostsByTag, type PostMeta, searchPosts, sortPosts } from "@/lib/blog-utils";
import { useBlogSearchParams } from "../_hooks/use-blog-search-params";
import { BlogSearchInput } from "./blog-search-input";
import { BlogSortSelector } from "./blog-sort-selector";
import { BlogTagFilter } from "./blog-tag-filter";

export interface BlogListContainerProps {
  posts: PostMeta[];
}

export function BlogListContainer({ posts }: BlogListContainerProps) {
  const { searchQuery, selectedTag, sortOption, setSearchQuery, setSelectedTag, setSortOption } =
    useBlogSearchParams();

  const allTags = useMemo(() => getAllTags(posts), [posts]);

  const filteredAndSortedPosts = useMemo(() => {
    const searched = searchPosts(posts, searchQuery);
    const filtered = getPostsByTag(searched, selectedTag);
    return sortPosts(filtered, sortOption);
  }, [posts, selectedTag, sortOption, searchQuery]);

  return (
    <div className="space-y-6">
      <BlogSearchInput searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <BlogTagFilter tags={allTags} selectedTag={selectedTag} onTagSelect={setSelectedTag} />
        <BlogSortSelector currentSort={sortOption} onSortChange={setSortOption} />
      </div>

      {filteredAndSortedPosts.length === 0 ? (
        <div className="py-12 text-center text-foreground/60">
          <p>該当する記事が見つかりませんでした。</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAndSortedPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <h2 className="font-semibold text-xl">{post.title}</h2>
                  <div className="flex items-center gap-3">
                    <time className="text-foreground/60 text-sm">{post.date}</time>
                    {post.tags.length > 0 && (
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
          ))}
        </div>
      )}
    </div>
  );
}
