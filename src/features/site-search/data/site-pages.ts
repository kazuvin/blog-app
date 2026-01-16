import { searchableRoutes } from "@/config/routes";
import type { SearchItem } from "../lib/site-search-utils";

/**
 * ルート定義から検索アイテムを生成
 *
 * src/config/routes.ts で定義されたルートから
 * 自動的に検索対象のページを生成
 */
export const staticPages: SearchItem[] = searchableRoutes.map((route) => ({
  type: "page" as const,
  title: route.label,
  description: route.description,
  href: route.href,
}));
