import type { SearchItem } from "../lib/site-search-utils";

/**
 * 静的ページの検索アイテム
 */
export const staticPages: SearchItem[] = [
  {
    type: "page",
    title: "Home",
    description: "ホームページ",
    href: "/",
  },
  {
    type: "page",
    title: "Blog",
    description: "ブログ記事一覧",
    href: "/blog",
  },
  {
    type: "page",
    title: "Showcases",
    description: "プロジェクトの紹介",
    href: "/showcases",
  },
  {
    type: "page",
    title: "About",
    description: "サイトについて",
    href: "/about",
  },
];
