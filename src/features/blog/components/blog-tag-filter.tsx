"use client";

import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface BlogTagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tags: string[]) => void;
}

export function BlogTagFilter({ tags, selectedTags, onTagSelect }: BlogTagFilterProps) {
  if (tags.length === 0) {
    return null;
  }

  const isAllSelected = selectedTags.length === 0;

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagSelect(selectedTags.filter((t) => t !== tag));
    } else {
      onTagSelect([...selectedTags, tag]);
    }
  };

  const handleAllClick = () => {
    onTagSelect([]);
  };

  return (
    <fieldset className="flex flex-wrap gap-2 border-none p-0" aria-label="Filter by tag">
      <button type="button" onClick={handleAllClick}>
        <Badge
          variant={isAllSelected ? "info" : "default"}
          size="md"
          data-selected={isAllSelected}
          className={cn(
            "cursor-pointer transition-colors",
            isAllSelected ? "ring-2 ring-primary/50" : "hover:bg-foreground/20"
          )}
        >
          All
        </Badge>
      </button>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button key={tag} type="button" onClick={() => handleTagClick(tag)}>
            <Badge
              variant={isSelected ? "info" : "default"}
              size="md"
              data-selected={isSelected}
              className={cn(
                "cursor-pointer transition-colors",
                isSelected ? "ring-2 ring-primary/50" : "hover:bg-foreground/20"
              )}
            >
              {tag}
            </Badge>
          </button>
        );
      })}
    </fieldset>
  );
}
