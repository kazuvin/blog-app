import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import { beforeEach, describe, expect, it } from "vitest";
import { displayItemAtom, isDialogOpenAtom } from "../stores";
import type { ShowcaseItem } from "../types";
import { ShowcasesContainer } from "./showcases-container";

// テスト用のモックデータ
const mockItems: ShowcaseItem[] = [
  {
    id: "button",
    name: "Button",
    description: "Interactive button component",
    preview: <div data-testid="button-preview">Button Preview</div>,
    fullDemo: <div data-testid="button-demo">Button Full Demo</div>,
  },
  {
    id: "input",
    name: "Input",
    description: "Text input component",
    preview: <div data-testid="input-preview">Input Preview</div>,
    fullDemo: <div data-testid="input-demo">Input Full Demo</div>,
  },
  {
    id: "card",
    name: "Card",
    description: "Container card component",
    preview: <div data-testid="card-preview">Card Preview</div>,
    fullDemo: <div data-testid="card-demo">Card Full Demo</div>,
  },
];

// テスト用のラッパーコンポーネント
function TestWrapper({
  children,
  store,
}: {
  children: React.ReactNode;
  store: ReturnType<typeof createStore>;
}) {
  return <Provider store={store}>{children}</Provider>;
}

describe("ShowcasesContainer", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    // 各テスト前に新しいストアを作成
    store = createStore();
  });

  describe("初期表示", () => {
    it("ページタイトルが表示されること", () => {
      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      expect(screen.getByText("Component Showcases")).toBeInTheDocument();
    });

    it("ページの説明が表示されること", () => {
      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      expect(
        screen.getByText(
          "A collection of presentation components for verification and testing purposes."
        )
      ).toBeInTheDocument();
    });

    it("すべてのショーケースアイテムが表示されること", () => {
      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      expect(screen.getByText("Button")).toBeInTheDocument();
      expect(screen.getByText("Input")).toBeInTheDocument();
      expect(screen.getByText("Card")).toBeInTheDocument();
    });

    it("アイテムの説明が表示されること", () => {
      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      expect(screen.getByText("Interactive button component")).toBeInTheDocument();
      expect(screen.getByText("Text input component")).toBeInTheDocument();
      expect(screen.getByText("Container card component")).toBeInTheDocument();
    });

    it("各アイテムのプレビューコンテンツが表示されること", () => {
      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      expect(screen.getByTestId("button-preview")).toBeInTheDocument();
      expect(screen.getByTestId("input-preview")).toBeInTheDocument();
      expect(screen.getByTestId("card-preview")).toBeInTheDocument();
    });

    it("初期状態ではダイアログが表示されないこと", () => {
      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Jotai状態との統合", () => {
    it("初期状態で選択アイテムがnullであること", () => {
      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      expect(store.get(displayItemAtom)).toBeNull();
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });

    it("カードをクリックするとストアの選択アイテムが更新されること", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole("button");
      await user.click(buttons[0]); // 最初のカード（Button）をクリック

      expect(store.get(displayItemAtom)).toEqual(mockItems[0]);
      expect(store.get(isDialogOpenAtom)).toBe(true);
    });
  });

  describe("ダイアログの開閉", () => {
    it("カードをクリックするとダイアログが開くこと", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      // カードをクリック
      const buttons = screen.getAllByRole("button");
      await user.click(buttons[0]);

      // ダイアログが開く
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("選択したアイテムのコンテンツがダイアログに表示されること", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      // 最初のカード（Button）をクリック
      const buttons = screen.getAllByRole("button");
      await user.click(buttons[0]);

      // ダイアログ内のコンテンツを確認
      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByText("Button")).toBeInTheDocument();
      expect(within(dialog).getByText("Interactive button component")).toBeInTheDocument();
      expect(screen.getByTestId("button-demo")).toBeInTheDocument();
    });

    it("閉じるボタンをクリックするとダイアログが閉じること", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      // カードをクリックしてダイアログを開く
      const cardButtons = screen.getAllByRole("button");
      await user.click(cardButtons[0]);

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // クローズボタンをクリック
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      // ダイアログが閉じる
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("Escapeキーを押すとダイアログが閉じること", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      // カードをクリックしてダイアログを開く
      const buttons = screen.getAllByRole("button");
      await user.click(buttons[0]);

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Escapeキーを押す
      await user.keyboard("{Escape}");

      // ダイアログが閉じる
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("ダイアログを閉じてもアイテムは保持されること（アニメーション用）", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      // カードをクリック
      const cardButtons = screen.getAllByRole("button");
      await user.click(cardButtons[0]);

      expect(store.get(displayItemAtom)).toEqual(mockItems[0]);

      // クローズボタンをクリック
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      // ダイアログは閉じるがアイテムは保持される（閉じるアニメーション用）
      expect(store.get(displayItemAtom)).toEqual(mockItems[0]);
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });
  });

  describe("異なるアイテムの選択", () => {
    it("2番目のアイテムをクリックすると正しいコンテンツが表示されること", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      // 2番目のカード（Input）をクリック
      const buttons = screen.getAllByRole("button");
      await user.click(buttons[1]);

      // ダイアログ内のコンテンツを確認
      expect(screen.getByTestId("input-demo")).toBeInTheDocument();
      expect(store.get(displayItemAtom)).toEqual(mockItems[1]);
    });

    it("3番目のアイテムをクリックすると正しいコンテンツが表示されること", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      // 3番目のカード（Card）をクリック
      const buttons = screen.getAllByRole("button");
      await user.click(buttons[2]);

      // ダイアログ内のコンテンツを確認
      expect(screen.getByTestId("card-demo")).toBeInTheDocument();
      expect(store.get(displayItemAtom)).toEqual(mockItems[2]);
    });
  });

  describe("連続した操作", () => {
    it("ダイアログの開閉を複数回行えること", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      const cardButtons = screen.getAllByRole("button");

      // 1回目: 開く→閉じる
      await user.click(cardButtons[0]);
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /close/i }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // 2回目: 別のカードで開く→閉じる
      await user.click(cardButtons[1]);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByTestId("input-demo")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // 3回目: また別のカードで開く
      await user.click(cardButtons[2]);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByTestId("card-demo")).toBeInTheDocument();
    });
  });

  describe("空の配列", () => {
    it("アイテムが空でもページヘッダーが表示されること", () => {
      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={[]} />
        </TestWrapper>
      );

      expect(screen.getByText("Component Showcases")).toBeInTheDocument();
      expect(
        screen.getByText(
          "A collection of presentation components for verification and testing purposes."
        )
      ).toBeInTheDocument();
    });

    it("アイテムが空の場合はカードが表示されないこと", () => {
      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={[]} />
        </TestWrapper>
      );

      const buttons = screen.queryAllByRole("button");
      expect(buttons).toHaveLength(0);
    });
  });
});
