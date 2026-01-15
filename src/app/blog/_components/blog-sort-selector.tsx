"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import type { SortOption } from "@/lib/blog-utils";

export interface BlogSortSelectorProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortLabels: Record<SortOption, string> = {
  "date-desc": "新しい順",
  "date-asc": "古い順",
  "title-asc": "タイトル昇順",
  "title-desc": "タイトル降順",
};

const sortOptions: SortOption[] = ["date-desc", "date-asc", "title-asc", "title-desc"];

export function BlogSortSelector({ currentSort, onSortChange }: BlogSortSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 font-medium text-sm transition-colors hover:bg-surface"
        aria-haspopup="true"
      >
        <span>並び替え:</span>
        <span className="text-foreground/80">{sortLabels[currentSort]}</span>
        <svg
          className="h-4 w-4 text-foreground/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onSortChange(option)}
            className={currentSort === option ? "bg-primary/10 text-primary" : ""}
          >
            {sortLabels[option]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
