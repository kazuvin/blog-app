"use client";

import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface BlogTagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export function BlogTagFilter({ tags, selectedTag, onTagSelect }: BlogTagFilterProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <fieldset className="flex flex-wrap gap-2 border-none p-0" aria-label="Filter by tag">
      <button
        type="button"
        onClick={() => onTagSelect(null)}
        data-selected={selectedTag === null}
        className={cn(
          "rounded-full px-3 py-1 font-medium text-sm transition-colors",
          selectedTag === null
            ? "bg-primary text-background"
            : "bg-foreground/10 text-foreground hover:bg-foreground/20"
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button key={tag} type="button" onClick={() => onTagSelect(tag)}>
          <Badge
            variant={selectedTag === tag ? "info" : "default"}
            size="md"
            data-selected={selectedTag === tag}
            className={cn(
              "cursor-pointer transition-colors",
              selectedTag === tag ? "ring-2 ring-primary/50" : "hover:bg-foreground/20"
            )}
          >
            {tag}
          </Badge>
        </button>
      ))}
    </fieldset>
  );
}
