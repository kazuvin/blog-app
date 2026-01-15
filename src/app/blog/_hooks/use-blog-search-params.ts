"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { SortOption } from "@/lib/blog-utils";

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

  const selectedTag = useMemo(() => {
    return searchParams.get("tag") ?? null;
  }, [searchParams]);

  const sortOption = useMemo((): SortOption => {
    const sort = searchParams.get("sort");
    if (sort && isValidSortOption(sort)) {
      return sort;
    }
    return DEFAULT_SORT;
  }, [searchParams]);

  const updateUrl = useCallback(
    (updates: { q?: string; tag?: string | null; sort?: SortOption }) => {
      const params = new URLSearchParams(searchParams.toString());

      // Handle search query
      if (updates.q !== undefined) {
        if (updates.q.trim()) {
          params.set("q", updates.q.trim());
        } else {
          params.delete("q");
        }
      }

      // Handle tag
      if (updates.tag !== undefined) {
        if (updates.tag) {
          params.set("tag", updates.tag);
        } else {
          params.delete("tag");
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

  const setSelectedTag = useCallback(
    (tag: string | null) => {
      updateUrl({ tag });
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
    selectedTag,
    sortOption,
    setSearchQuery,
    setSelectedTag,
    setSortOption,
  };
}
