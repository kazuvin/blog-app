/**
 * サイトのルート定義
 *
 * ナビゲーションと検索で共有するページ情報の一元管理
 */

export interface RouteDefinition {
  /** ページのパス */
  href: string;
  /** ナビゲーションに表示するラベル */
  label: string;
  /** 検索結果に表示する説明 */
  description: string;
  /** ナビゲーションに表示するか */
  showInNav?: boolean;
}

/**
 * サイトのページ定義
 *
 * 新しいページを追加する場合はここに追加するだけで
 * ナビゲーションと検索の両方に反映される
 */
export const routes: RouteDefinition[] = [
  {
    href: "/",
    label: "Home",
    description: "ホームページ",
    showInNav: true,
  },
  {
    href: "/blog",
    label: "Blog",
    description: "ブログ記事一覧",
    showInNav: true,
  },
  {
    href: "/showcases",
    label: "Showcases",
    description: "プロジェクトの紹介",
    showInNav: true,
  },
  {
    href: "/about",
    label: "About",
    description: "サイトについて",
    showInNav: true,
  },
];

/** ナビゲーションに表示するルート */
export const navRoutes = routes.filter((route) => route.showInNav);

/** 検索対象のルート */
export const searchableRoutes = routes;
