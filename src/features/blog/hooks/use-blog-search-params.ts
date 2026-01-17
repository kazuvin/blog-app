"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { SortOption } from "../lib/blog-utils";

const VALID_SORT_OPTIONS: SortOption[] = ["date-desc", "date-asc", "title-asc", "title-desc"];
const DEFAULT_SORT: SortOption = "date-desc";

function isValidSortOption(value: string): value is SortOption {
  return VALID_SORT_OPTIONS.includes(value as SortOption);
}

export function useBlogSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = useMemo(() => {
    return (searchParams.get("q") ?? "").trim();
  }, [searchParams]);

  const selectedTags = useMemo((): string[] => {
    const tags = searchParams.get("tags");
    if (!tags) return [];
    return tags.split(",").filter((t) => t.trim() !== "");
  }, [searchParams]);

  const sortOption = useMemo((): SortOption => {
    const sort = searchParams.get("sort");
    if (sort && isValidSortOption(sort)) {
      return sort;
    }
    return DEFAULT_SORT;
  }, [searchParams]);

  const updateUrl = useCallback(
    (updates: { q?: string; tags?: string[]; sort?: SortOption }) => {
      const params = new URLSearchParams(searchParams.toString());

      // Handle search query
      if (updates.q !== undefined) {
        if (updates.q.trim()) {
          params.set("q", updates.q.trim());
        } else {
          params.delete("q");
        }
      }

      // Handle tags
      if (updates.tags !== undefined) {
        if (updates.tags.length > 0) {
          params.set("tags", updates.tags.join(","));
        } else {
          params.delete("tags");
        }
      }

      // Handle sort (don't include default in URL)
      if (updates.sort !== undefined) {
        if (updates.sort !== DEFAULT_SORT) {
          params.set("sort", updates.sort);
        } else {
          params.delete("sort");
        }
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setSearchQuery = useCallback(
    (query: string) => {
      updateUrl({ q: query });
    },
    [updateUrl]
  );

  const setSelectedTags = useCallback(
    (tags: string[]) => {
      updateUrl({ tags });
    },
    [updateUrl]
  );

  const setSortOption = useCallback(
    (sort: SortOption) => {
      updateUrl({ sort });
    },
    [updateUrl]
  );

  return {
    searchQuery,
    selectedTags,
    sortOption,
    setSearchQuery,
    setSelectedTags,
    setSortOption,
  };
}
