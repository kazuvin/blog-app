"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  filterSearchItems,
  groupSearchItemsByType,
  type SearchItem,
} from "../lib/site-search-utils";

export interface SearchCommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchItems: SearchItem[];
}

/**
 * サイト内検索のためのコマンドパレット風ダイアログ
 * Cmd+K/Ctrl+K で開くことを想定
 */
export function SearchCommandDialog({ open, onOpenChange, searchItems }: SearchCommandDialogProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // フィルタリングされたアイテム
  const filteredItems = useMemo(
    () => filterSearchItems(searchItems, searchQuery),
    [searchItems, searchQuery]
  );

  // グループ化されたアイテム
  const groupedItems = useMemo(() => groupSearchItemsByType(filteredItems), [filteredItems]);

  // フラットなアイテムリスト（キーボードナビゲーション用）
  const flatItems = useMemo(() => [...groupedItems.page, ...groupedItems.blog], [groupedItems]);

  // ダイアログが開いたときに入力にフォーカス
  useEffect(() => {
    if (open && inputRef.current) {
      // 少し遅延させてアニメーション後にフォーカス
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // ダイアログが閉じたときにリセット
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  // アイテム選択時の処理
  const handleSelect = useCallback(
    (item: SearchItem) => {
      router.push(item.href);
      onOpenChange(false);
    },
    [router, onOpenChange]
  );

  // キーボードナビゲーション（Input用）
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : prev));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (event.key === "Enter" && flatItems[selectedIndex]) {
        event.preventDefault();
        handleSelect(flatItems[selectedIndex]);
      }
    },
    [flatItems, selectedIndex, handleSelect, onOpenChange]
  );

  // 検索クエリ変更時に選択をリセット
  // biome-ignore lint/correctness/useExhaustiveDependencies: searchQueryの変更時に意図的にリセットする
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const hasResults = filteredItems.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <div
          role="dialog"
          aria-label="サイト内検索"
          aria-modal="true"
          className={cn(
            "fixed top-[20%] left-1/2 z-50 w-full max-w-lg -translate-x-1/2",
            "rounded-lg border border-foreground/10 bg-background shadow-lg",
            "data-[state=closed]:animate-out data-[state=open]:animate-in",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "focus:outline-none"
          )}
          data-state={open ? "open" : "closed"}
          onKeyDown={handleKeyDown}
        >
          {/* 検索入力 */}
          <div className="flex items-center border-foreground/10 border-b px-4">
            <SearchIcon className="mr-2 size-4 shrink-0 text-foreground/50" />
            <Input
              ref={inputRef}
              type="search"
              role="searchbox"
              placeholder="サイト内を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border-0 bg-transparent py-3 focus-visible:ring-0"
              aria-label="サイト内検索"
              autoFocus
            />
            <kbd className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-foreground/40 text-xs">
              ESC
            </kbd>
          </div>

          {/* 検索結果 */}
          <div className="max-h-[300px] overflow-y-auto p-2">
            {!hasResults ? (
              <div className="py-6 text-center text-foreground/60">
                検索結果が見つかりませんでした
              </div>
            ) : (
              <>
                {/* ページセクション */}
                {groupedItems.page.length > 0 && (
                  <div className="mb-2">
                    <div className="mb-1 px-2 font-medium text-foreground/40 text-xs uppercase tracking-wider">
                      ページ
                    </div>
                    {groupedItems.page.map((item, index) => (
                      <SearchResultItem
                        key={item.href}
                        item={item}
                        isSelected={index === selectedIndex}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                )}

                {/* ブログセクション */}
                {groupedItems.blog.length > 0 && (
                  <div>
                    <div className="mb-1 px-2 font-medium text-foreground/40 text-xs uppercase tracking-wider">
                      ブログ記事
                    </div>
                    {groupedItems.blog.map((item, index) => {
                      const globalIndex = groupedItems.page.length + index;
                      return (
                        <SearchResultItem
                          key={item.href}
                          item={item}
                          isSelected={globalIndex === selectedIndex}
                          onSelect={handleSelect}
                        />
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ヘルプフッター */}
          <div className="flex items-center justify-end border-foreground/10 border-t px-4 py-2 text-foreground/40 text-xs">
            <span>↑↓ で移動</span>
            <span className="mx-2">·</span>
            <span>Enter で選択</span>
            <span className="mx-2">·</span>
            <span>ESC で閉じる</span>
          </div>

          {/* スクリーンリーダー用の非表示タイトル */}
          <DialogTitle className="sr-only">サイト内検索</DialogTitle>
        </div>
      </DialogPortal>
    </Dialog>
  );
}

interface SearchResultItemProps {
  item: SearchItem;
  isSelected: boolean;
  onSelect: (item: SearchItem) => void;
}

function SearchResultItem({ item, isSelected, onSelect }: SearchResultItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={cn(
        "flex w-full flex-col items-start rounded-md px-2 py-2 text-left transition-colors",
        isSelected ? "bg-foreground/10 text-foreground" : "text-foreground/80 hover:bg-foreground/5"
      )}
    >
      <span className="font-medium">{item.title}</span>
      <span className="text-foreground/50 text-sm">{item.description}</span>
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
