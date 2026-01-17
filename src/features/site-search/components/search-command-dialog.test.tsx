import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchCommandDialog } from "./search-command-dialog";

// モックナビゲーション
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

/**
 * SearchCommandDialog 仕様
 *
 * 目的: サイト内検索のためのコマンドパレット風ダイアログ
 * 用途: Cmd+K/Ctrl+K または検索ボタンから開く全サイト検索UI
 */
describe("SearchCommandDialog", () => {
  const mockSearchItems = [
    {
      type: "page" as const,
      title: "Home",
      description: "ホームページ",
      href: "/",
    },
    {
      type: "page" as const,
      title: "About",
      description: "About page",
      href: "/about",
    },
    {
      type: "blog" as const,
      title: "First Blog Post",
      description: "最初のブログ記事",
      href: "/blog/first-post",
      tags: ["tech"],
    },
    {
      type: "blog" as const,
      title: "Second Blog Post",
      description: "2番目のブログ記事",
      href: "/blog/second-post",
      tags: ["life"],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================
  // 初期状態 (Initial State)
  // ===========================================
  describe("初期状態 (Initial State)", () => {
    it("open=falseのときダイアログが表示されないこと", () => {
      render(
        <SearchCommandDialog open={false} onOpenChange={vi.fn()} searchItems={mockSearchItems} />
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("open=trueのときダイアログが表示されること", () => {
      render(
        <SearchCommandDialog open={true} onOpenChange={vi.fn()} searchItems={mockSearchItems} />
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("検索入力フィールドが表示されること", () => {
      render(
        <SearchCommandDialog open={true} onOpenChange={vi.fn()} searchItems={mockSearchItems} />
      );

      expect(screen.getByRole("searchbox")).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/検索/i)).toBeInTheDocument();
    });

    it("初期状態で全てのアイテムが表示されること", () => {
      render(
        <SearchCommandDialog open={true} onOpenChange={vi.fn()} searchItems={mockSearchItems} />
      );

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("First Blog Post")).toBeInTheDocument();
      expect(screen.getByText("Second Blog Post")).toBeInTheDocument();
    });

    it("ページとブログのセクションに分かれていること", () => {
      render(
        <SearchCommandDialog open={true} onOpenChange={vi.fn()} searchItems={mockSearchItems} />
      );

      expect(screen.getByText("ページ")).toBeInTheDocument();
      expect(screen.getByText("ブログ記事")).toBeInTheDocument();
    });
  });

  // ===========================================
  // 検索機能 (Search Functionality)
  // ===========================================
  describe("検索機能 (Search Functionality)", () => {
    it("検索クエリでアイテムがフィルタされること", async () => {
      const user = userEvent.setup();

      render(
        <SearchCommandDialog open={true} onOpenChange={vi.fn()} searchItems={mockSearchItems} />
      );

      await user.type(screen.getByRole("searchbox"), "About");

      await waitFor(() => {
        expect(screen.getByText("About")).toBeInTheDocument();
        expect(screen.queryByText("Home")).not.toBeInTheDocument();
        expect(screen.queryByText("First Blog Post")).not.toBeInTheDocument();
      });
    });

    it("日本語で検索できること", async () => {
      const user = userEvent.setup();

      render(
        <SearchCommandDialog open={true} onOpenChange={vi.fn()} searchItems={mockSearchItems} />
      );

      await user.type(screen.getByRole("searchbox"), "最初");

      await waitFor(() => {
        expect(screen.getByText("First Blog Post")).toBeInTheDocument();
        expect(screen.queryByText("Second Blog Post")).not.toBeInTheDocument();
      });
    });

    it("検索結果が0件のときメッセージを表示すること", async () => {
      const user = userEvent.setup();

      render(
        <SearchCommandDialog open={true} onOpenChange={vi.fn()} searchItems={mockSearchItems} />
      );

      await user.type(screen.getByRole("searchbox"), "存在しないページ");

      await waitFor(() => {
        expect(screen.getByText(/見つかりませんでした/i)).toBeInTheDocument();
      });
    });

    it("大文字小文字を区別しないで検索すること", async () => {
      const user = userEvent.setup();

      render(
        <SearchCommandDialog open={true} onOpenChange={vi.fn()} searchItems={mockSearchItems} />
      );

      await user.type(screen.getByRole("searchbox"), "about");

      await waitFor(() => {
        expect(screen.getByText("About")).toBeInTheDocument();
      });
    });
  });

  // ===========================================
  // ユーザー操作 (User Interactions)
  // ===========================================
  describe("ユーザー操作 (User Interactions)", () => {
    it("アイテムをクリックしたらナビゲートすること", async () => {
      const user = userEvent.setup();
      const mockOnOpenChange = vi.fn();

      render(
        <SearchCommandDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          searchItems={mockSearchItems}
        />
      );

      await user.click(screen.getByText("About"));

      expect(mockPush).toHaveBeenCalledWith("/about");
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("Escapeキーでダイアログが閉じること", async () => {
      const user = userEvent.setup();
      const mockOnOpenChange = vi.fn();

      render(
        <SearchCommandDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          searchItems={mockSearchItems}
        />
      );

      // Radix DialogがEscapeを処理してonOpenChangeを呼ぶ
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("キーボードで選択してEnterでナビゲートすること", async () => {
      const user = userEvent.setup();
      const mockOnOpenChange = vi.fn();

      render(
        <SearchCommandDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          searchItems={mockSearchItems}
        />
      );

      // 初期状態でindex=0（Homeが選択状態）なので、そのままEnterでナビゲート
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/");
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  // ===========================================
  // アクセシビリティ (Accessibility)
  // ===========================================
  describe("アクセシビリティ (Accessibility)", () => {
    it("検索入力にaria-labelがあること", () => {
      render(
        <SearchCommandDialog open={true} onOpenChange={vi.fn()} searchItems={mockSearchItems} />
      );

      // 検索ボックスにaria-labelが設定されている
      expect(screen.getByRole("searchbox")).toHaveAttribute("aria-label", "サイト内検索");
    });

    it("ダイアログにaria-labelがあること", () => {
      render(
        <SearchCommandDialog open={true} onOpenChange={vi.fn()} searchItems={mockSearchItems} />
      );

      expect(screen.getByRole("dialog", { name: /サイト内検索/i })).toBeInTheDocument();
    });

    it("ダイアログが開いたときに入力にフォーカスされること", async () => {
      render(
        <SearchCommandDialog open={true} onOpenChange={vi.fn()} searchItems={mockSearchItems} />
      );

      // フォーカスが設定されるまで待機
      await waitFor(() => {
        expect(screen.getByRole("searchbox")).toHaveFocus();
      });
    });
  });

  // ===========================================
  // エッジケース (Edge Cases)
  // ===========================================
  describe("エッジケース (Edge Cases)", () => {
    it("空のsearchItemsを処理すること", () => {
      render(<SearchCommandDialog open={true} onOpenChange={vi.fn()} searchItems={[]} />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText(/見つかりませんでした/i)).toBeInTheDocument();
    });

    it("特殊文字を含む検索クエリを処理すること", async () => {
      const user = userEvent.setup();

      render(
        <SearchCommandDialog open={true} onOpenChange={vi.fn()} searchItems={mockSearchItems} />
      );

      // ブラケットはuserEventの特殊文字なので、{ }でエスケープ
      await user.type(screen.getByRole("searchbox"), "{[}test{]}");

      await waitFor(() => {
        expect(screen.getByText(/見つかりませんでした/i)).toBeInTheDocument();
      });
    });
  });

  // ===========================================
  // キーボードショートカットヒント (Keyboard Hint)
  // ===========================================
  describe("キーボードショートカットヒント (Keyboard Hint)", () => {
    it("キーボードショートカットのヒントが表示されること", () => {
      render(
        <SearchCommandDialog open={true} onOpenChange={vi.fn()} searchItems={mockSearchItems} />
      );

      // フッターに「ESC で閉じる」のヒントがある
      expect(screen.getByText("ESC で閉じる")).toBeInTheDocument();
    });
  });
});
