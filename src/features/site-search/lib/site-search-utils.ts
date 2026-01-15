/**
 * サイト内検索のためのユーティリティ関数
 */

export type SearchItemType = "page" | "blog";

export interface SearchItem {
  type: SearchItemType;
  title: string;
  description: string;
  href: string;
  tags?: string[];
}

export interface GroupedSearchItems {
  page: SearchItem[];
  blog: SearchItem[];
}

/**
 * 検索クエリでアイテムをフィルタリング
 * タイトル、説明、タグのいずれかに部分一致するアイテムを返す
 * 大文字小文字は区別しない
 */
export function filterSearchItems(items: SearchItem[], query: string): SearchItem[] {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return items;
  }

  // 特殊文字をエスケープして安全な正規表現を作成
  const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedQuery, "i");

  return items.filter((item) => {
    // タイトルでマッチ
    if (regex.test(item.title)) {
      return true;
    }

    // 説明でマッチ
    if (regex.test(item.description)) {
      return true;
    }

    // タグでマッチ
    if (item.tags?.some((tag) => regex.test(tag))) {
      return true;
    }

    return false;
  });
}

/**
 * アイテムをタイプ別にグループ化
 */
export function groupSearchItemsByType(items: SearchItem[]): GroupedSearchItems {
  return {
    page: items.filter((item) => item.type === "page"),
    blog: items.filter((item) => item.type === "blog"),
  };
}
