import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type BlogListSkeletonProps = ComponentProps<"output"> & {
  /** 表示するカードスケルトンの数 */
  cardCount?: number;
};

/**
 * ブログリストのローディング状態を表示するスケルトンコンポーネント
 * Suspenseのfallbackとして使用
 */
export function BlogListSkeleton({ cardCount = 3, className, ...props }: BlogListSkeletonProps) {
  return (
    <output
      aria-busy="true"
      aria-label="読み込み中"
      className={cn("block space-y-6", className)}
      {...props}
    >
      {/* 検索入力スケルトン */}
      <div
        data-testid="search-skeleton"
        className="h-10 w-full animate-pulse rounded-md bg-foreground/10"
      />

      {/* タグフィルタースケルトン */}
      <div className="flex gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={`tag-${i}`}
            data-testid="tag-skeleton"
            className="h-8 w-24 animate-pulse rounded-full bg-foreground/10"
          />
        ))}
      </div>

      {/* 記事カードスケルトン */}
      <div className="space-y-4">
        {Array.from({ length: cardCount }, (_, i) => `card-skeleton-${i}`).map((id) => (
          <div
            key={id}
            data-testid="card-skeleton"
            className="h-32 animate-pulse rounded-lg bg-foreground/10"
          />
        ))}
      </div>
    </output>
  );
}
