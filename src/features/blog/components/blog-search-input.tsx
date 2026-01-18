"use client";

import { SearchIcon } from "@/components/icons";
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
        <SearchIcon className="size-4 text-foreground/50" />
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
