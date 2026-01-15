"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export interface SearchButtonProps extends Omit<ComponentProps<"button">, "children"> {
  onClick: () => void;
}

/**
 * サイト内検索ダイアログを開くトリガーボタン
 * ヘッダーに配置して使用
 */
export function SearchButton({ onClick, className, ...props }: SearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md border border-foreground/10 px-3 py-1.5",
        "text-foreground/60 text-sm transition-colors",
        "hover:bg-foreground/5 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2",
        className
      )}
      aria-label="サイト内検索を開く"
      {...props}
    >
      <SearchIcon className="size-4" />
      <span className="hidden sm:inline">検索</span>
      <kbd className="ml-2 hidden rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-foreground/40 text-xs sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}
