import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlogListSkeleton } from "./blog-list-skeleton";

/**
 * BlogListSkeleton 仕様
 *
 * 目的: ブログリストのローディング状態を表示するスケルトンコンポーネント
 * 用途: Suspenseのfallbackとして使用
 */
describe("BlogListSkeleton", () => {
  // ===========================================
  // 初期状態
  // ===========================================
  describe("初期状態 (Initial State)", () => {
    it("should render without crashing", () => {
      render(<BlogListSkeleton />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should have aria-busy attribute for accessibility", () => {
      render(<BlogListSkeleton />);
      expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    });

    it("should have accessible loading label", () => {
      render(<BlogListSkeleton />);
      expect(screen.getByLabelText(/読み込み中|loading/i)).toBeInTheDocument();
    });
  });

  // ===========================================
  // 構造
  // ===========================================
  describe("構造 (Structure)", () => {
    it("should render search input skeleton", () => {
      render(<BlogListSkeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId("skeleton");
      // 検索入力スケルトン
      expect(skeleton.querySelector("[data-testid='search-skeleton']")).toBeInTheDocument();
    });

    it("should render tag filter skeletons", () => {
      render(<BlogListSkeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId("skeleton");
      // タグフィルタースケルトン（3つ）
      const tagSkeletons = skeleton.querySelectorAll("[data-testid='tag-skeleton']");
      expect(tagSkeletons.length).toBe(3);
    });

    it("should render post card skeletons", () => {
      render(<BlogListSkeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId("skeleton");
      // 記事カードスケルトン（デフォルト3つ）
      const cardSkeletons = skeleton.querySelectorAll("[data-testid='card-skeleton']");
      expect(cardSkeletons.length).toBe(3);
    });
  });

  // ===========================================
  // Props
  // ===========================================
  describe("Props", () => {
    it("should accept custom cardCount prop", () => {
      render(<BlogListSkeleton cardCount={5} data-testid="skeleton" />);
      const skeleton = screen.getByTestId("skeleton");
      const cardSkeletons = skeleton.querySelectorAll("[data-testid='card-skeleton']");
      expect(cardSkeletons.length).toBe(5);
    });

    it("should merge custom className", () => {
      render(<BlogListSkeleton className="custom-class" data-testid="skeleton" />);
      expect(screen.getByTestId("skeleton")).toHaveClass("custom-class");
    });
  });

  // ===========================================
  // アニメーション
  // ===========================================
  describe("アニメーション (Animation)", () => {
    it("should have pulse animation class on skeleton elements", () => {
      render(<BlogListSkeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId("skeleton");
      const searchSkeleton = skeleton.querySelector("[data-testid='search-skeleton']");
      expect(searchSkeleton).toHaveClass("animate-pulse");
    });
  });
});
