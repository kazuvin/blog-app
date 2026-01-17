"use client";

import { useMemo } from "react";
import { staticPages } from "../data/site-pages";
import { useSearchCommand } from "../hooks/use-search-command";
import type { SearchItem } from "../lib/site-search-utils";
import { SearchButton } from "./search-button";
import { SearchCommandDialog } from "./search-command-dialog";

export interface SiteSearchContainerProps {
  /** ブログ記事の検索アイテム（サーバーコンポーネントから渡す） */
  blogItems?: SearchItem[];
  className?: string;
}

/**
 * サイト内検索のコンテナコンポーネント
 * 検索ボタン、ダイアログ、キーボードショートカットを統合
 */
export function SiteSearchContainer({ blogItems = [], className }: SiteSearchContainerProps) {
  const { isOpen, setIsOpen } = useSearchCommand();

  // 静的ページとブログ記事を結合
  const searchItems = useMemo<SearchItem[]>(() => [...staticPages, ...blogItems], [blogItems]);

  return (
    <>
      <SearchButton onClick={() => setIsOpen(true)} className={className} />
      <SearchCommandDialog open={isOpen} onOpenChange={setIsOpen} searchItems={searchItems} />
    </>
  );
}
