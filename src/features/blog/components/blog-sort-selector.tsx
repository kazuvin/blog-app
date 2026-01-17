"use client";

import { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import type { SortOption } from "../lib/blog-utils";

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
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    clearCloseTimeout();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveredRef.current) {
        setIsOpen(false);
      }
    }, 100);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleSelect = (option: SortOption) => {
    onSortChange(option);
    isHoveredRef.current = false;
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange} modal={false}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: wrapper for hover interaction */}
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <DropdownMenuTrigger
          className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-stone-200 bg-transparent px-3 py-2 text-sm outline-none transition-colors hover:bg-stone-100"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span>{sortLabels[currentSort]}</span>
          <svg
            className={cn(
              "h-4 w-4 text-foreground/60 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={0}
          className="mt-1"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => handleSelect(option)}
              className={currentSort === option ? "bg-primary/10 text-primary" : ""}
            >
              {sortLabels[option]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
