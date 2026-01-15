import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchButton } from "./search-button";

/**
 * SearchButton 仕様
 *
 * 目的: サイト内検索ダイアログを開くトリガーボタン
 * 用途: ヘッダーに配置して、クリックで検索ダイアログを開く
 */
describe("SearchButton", () => {
  // ===========================================
  // 初期状態 (Initial State)
  // ===========================================
  describe("初期状態 (Initial State)", () => {
    it("クラッシュせずにレンダリングされること", () => {
      render(<SearchButton onClick={vi.fn()} />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("検索アイコンが表示されること", () => {
      render(<SearchButton onClick={vi.fn()} />);

      // 検索アイコン（SVG）が存在することを確認
      expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
    });

    it("キーボードショートカットのヒントが表示されること", () => {
      render(<SearchButton onClick={vi.fn()} />);

      // Cmd+K または Ctrl+K のヒントが表示される
      expect(screen.getByText(/⌘K|Ctrl\+K/i)).toBeInTheDocument();
    });
  });

  // ===========================================
  // Props
  // ===========================================
  describe("Props", () => {
    it("カスタムclassNameが適用されること", () => {
      render(<SearchButton onClick={vi.fn()} className="custom-class" />);

      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });
  });

  // ===========================================
  // ユーザー操作 (User Interactions)
  // ===========================================
  describe("ユーザー操作 (User Interactions)", () => {
    it("クリック時にonClickが呼ばれること", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<SearchButton onClick={handleClick} />);
      await user.click(screen.getByRole("button"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("Enterキーで活性化すること", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<SearchButton onClick={handleClick} />);
      screen.getByRole("button").focus();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("Spaceキーで活性化すること", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<SearchButton onClick={handleClick} />);
      screen.getByRole("button").focus();
      await user.keyboard(" ");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // ===========================================
  // アクセシビリティ (Accessibility)
  // ===========================================
  describe("アクセシビリティ (Accessibility)", () => {
    it("aria-labelが設定されていること", () => {
      render(<SearchButton onClick={vi.fn()} />);

      expect(screen.getByLabelText(/検索/i)).toBeInTheDocument();
    });

    it("フォーカス可能であること", () => {
      render(<SearchButton onClick={vi.fn()} />);

      const button = screen.getByRole("button");
      button.focus();

      expect(button).toHaveFocus();
    });
  });

  // ===========================================
  // スタイリング (Styling)
  // ===========================================
  describe("スタイリング (Styling)", () => {
    it("ホバースタイルのクラスが適用されていること", () => {
      render(<SearchButton onClick={vi.fn()} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:bg-foreground/5");
    });

    it("フォーカス可視スタイルが適用されていること", () => {
      render(<SearchButton onClick={vi.fn()} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus-visible:ring-2");
    });
  });
});
