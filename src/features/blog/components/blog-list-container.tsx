"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge, Card, CardContent, CardHeader } from "@/components/ui";
import { useDebounce } from "@/hooks";
import { useBlogSearchParams } from "../hooks/use-blog-search-params";
import {
  getAllTags,
  getPostsByTags,
  type PostMeta,
  searchPosts,
  sortPosts,
} from "../lib/blog-utils";
import { BlogSearchInput } from "./blog-search-input";
import { BlogSortSelector } from "./blog-sort-selector";
import { BlogTagFilter } from "./blog-tag-filter";

const SEARCH_DEBOUNCE_MS = 300;

export interface BlogListContainerProps {
  posts: PostMeta[];
}

export function BlogListContainer({ posts }: BlogListContainerProps) {
  const { searchQuery, selectedTags, sortOption, setSearchQuery, setSelectedTags, setSortOption } =
    useBlogSearchParams();

  // Local state for immediate input feedback
  const [inputValue, setInputValue] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(inputValue, SEARCH_DEBOUNCE_MS);

  // Track the last value we synced to URL to detect external changes
  const lastSyncedToUrlRef = useRef(searchQuery);

  // Sync debounced value to URL params
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      lastSyncedToUrlRef.current = debouncedSearchQuery;
      setSearchQuery(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, searchQuery, setSearchQuery]);

  // Sync URL params to input value (e.g., browser back/forward)
  useEffect(() => {
    // Only sync back if URL changed from an external source (not from our debounced sync)
    if (searchQuery !== lastSyncedToUrlRef.current) {
      lastSyncedToUrlRef.current = searchQuery;
      setInputValue(searchQuery);
    }
  }, [searchQuery]);

  const allTags = useMemo(() => getAllTags(posts), [posts]);

  const filteredAndSortedPosts = useMemo(() => {
    const searched = searchPosts(posts, searchQuery);
    const filtered = getPostsByTags(searched, selectedTags);
    return sortPosts(filtered, sortOption);
  }, [posts, selectedTags, sortOption, searchQuery]);

  return (
    <div className="space-y-6">
      <BlogSearchInput searchQuery={inputValue} onSearchChange={setInputValue} />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <BlogTagFilter tags={allTags} selectedTags={selectedTags} onTagSelect={setSelectedTags} />
        </div>
        <div className="shrink-0">
          <BlogSortSelector currentSort={sortOption} onSortChange={setSortOption} />
        </div>
      </div>

      {filteredAndSortedPosts.length === 0 ? (
        <div className="py-12 text-center text-foreground/60">
          <p>該当する記事が見つかりませんでした。</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAndSortedPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
              <Card>
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
