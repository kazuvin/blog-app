"use client";

import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface BlogSearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

export function BlogSearchInput({ searchQuery, onSearchChange, className }: BlogSearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="size-4 text-foreground/50"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <Input
        type="search"
        role="searchbox"
        placeholder="記事を検索..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
        inputSize="md"
        aria-label="記事を検索"
      />
    </div>
  );
}
