import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { getDefined } from "@/test/assert";
import { useShowcasesStore } from "../stores";
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

describe("ShowcasesContainer", () => {
  beforeEach(() => {
    useShowcasesStore.setState({
      isDialogOpen: false,
      displayItem: null,
    });
  });

  describe("初期表示", () => {
    it("ページタイトルが表示されること", () => {
      render(<ShowcasesContainer items={mockItems} />);

      expect(screen.getByText("Component Showcases")).toBeInTheDocument();
    });

    it("ページの説明が表示されること", () => {
      render(<ShowcasesContainer items={mockItems} />);

      expect(
        screen.getByText(
          "A collection of presentation components for verification and testing purposes."
        )
      ).toBeInTheDocument();
    });

    it("すべてのショーケースアイテムが表示されること", () => {
      render(<ShowcasesContainer items={mockItems} />);

      expect(screen.getByText("Button")).toBeInTheDocument();
      expect(screen.getByText("Input")).toBeInTheDocument();
      expect(screen.getByText("Card")).toBeInTheDocument();
    });

    it("アイテムの説明が表示されること", () => {
      render(<ShowcasesContainer items={mockItems} />);

      expect(screen.getByText("Interactive button component")).toBeInTheDocument();
      expect(screen.getByText("Text input component")).toBeInTheDocument();
      expect(screen.getByText("Container card component")).toBeInTheDocument();
    });

    it("各アイテムのプレビューコンテンツが表示されること", () => {
      render(<ShowcasesContainer items={mockItems} />);

      expect(screen.getByTestId("button-preview")).toBeInTheDocument();
      expect(screen.getByTestId("input-preview")).toBeInTheDocument();
      expect(screen.getByTestId("card-preview")).toBeInTheDocument();
    });

    it("初期状態ではダイアログが表示されないこと", () => {
      render(<ShowcasesContainer items={mockItems} />);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Store状態との統合", () => {
    it("初期状態で選択アイテムがnullであること", () => {
      render(<ShowcasesContainer items={mockItems} />);

      expect(useShowcasesStore.getState().displayItem).toBeNull();
      expect(useShowcasesStore.getState().isDialogOpen).toBe(false);
    });

    it("カードをクリックするとストアの選択アイテムが更新されること", async () => {
      const user = userEvent.setup();

      render(<ShowcasesContainer items={mockItems} />);

      const buttons = screen.getAllByRole("button");
      await user.click(getDefined(buttons[0])); // 最初のカード（Button）をクリック

      expect(useShowcasesStore.getState().displayItem).toEqual(mockItems[0]);
      expect(useShowcasesStore.getState().isDialogOpen).toBe(true);
    });
  });

  describe("ダイアログの開閉", () => {
    it("カードをクリックするとダイアログが開くこと", async () => {
      const user = userEvent.setup();

      render(<ShowcasesContainer items={mockItems} />);

      // カードをクリック
      const buttons = screen.getAllByRole("button");
      await user.click(getDefined(buttons[0]));

      // ダイアログが開く
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("選択したアイテムのコンテンツがダイアログに表示されること", async () => {
      const user = userEvent.setup();

      render(<ShowcasesContainer items={mockItems} />);

      // 最初のカード（Button）をクリック
      const buttons = screen.getAllByRole("button");
      await user.click(getDefined(buttons[0]));

      // ダイアログ内のコンテンツを確認
      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByText("Button")).toBeInTheDocument();
      expect(within(dialog).getByText("Interactive button component")).toBeInTheDocument();
      expect(screen.getByTestId("button-demo")).toBeInTheDocument();
    });

    it("閉じるボタンをクリックするとダイアログが閉じること", async () => {
      const user = userEvent.setup();

      render(<ShowcasesContainer items={mockItems} />);

      // カードをクリックしてダイアログを開く
      const cardButtons = screen.getAllByRole("button");
      await user.click(getDefined(cardButtons[0]));

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // クローズボタンをクリック
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      // ダイアログが閉じる
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("Escapeキーを押すとダイアログが閉じること", async () => {
      const user = userEvent.setup();

      render(<ShowcasesContainer items={mockItems} />);

      // カードをクリックしてダイアログを開く
      const buttons = screen.getAllByRole("button");
      await user.click(getDefined(buttons[0]));

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Escapeキーを押す
      await user.keyboard("{Escape}");

      // ダイアログが閉じる
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("ダイアログを閉じてもアイテムは保持されること（アニメーション用）", async () => {
      const user = userEvent.setup();

      render(<ShowcasesContainer items={mockItems} />);

      // カードをクリック
      const cardButtons = screen.getAllByRole("button");
      await user.click(getDefined(cardButtons[0]));

      expect(useShowcasesStore.getState().displayItem).toEqual(mockItems[0]);

      // クローズボタンをクリック
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      // ダイアログは閉じるがアイテムは保持される（閉じるアニメーション用）
      expect(useShowcasesStore.getState().displayItem).toEqual(mockItems[0]);
      expect(useShowcasesStore.getState().isDialogOpen).toBe(false);
    });
  });

  describe("異なるアイテムの選択", () => {
    it("2番目のアイテムをクリックすると正しいコンテンツが表示されること", async () => {
      const user = userEvent.setup();

      render(<ShowcasesContainer items={mockItems} />);

      // 2番目のカード（Input）をクリック
      const buttons = screen.getAllByRole("button");
      await user.click(getDefined(buttons[1]));

      // ダイアログ内のコンテンツを確認
      expect(screen.getByTestId("input-demo")).toBeInTheDocument();
      expect(useShowcasesStore.getState().displayItem).toEqual(mockItems[1]);
    });

    it("3番目のアイテムをクリックすると正しいコンテンツが表示されること", async () => {
      const user = userEvent.setup();

      render(<ShowcasesContainer items={mockItems} />);

      // 3番目のカード（Card）をクリック
      const buttons = screen.getAllByRole("button");
      await user.click(getDefined(buttons[2]));

      // ダイアログ内のコンテンツを確認
      expect(screen.getByTestId("card-demo")).toBeInTheDocument();
      expect(useShowcasesStore.getState().displayItem).toEqual(mockItems[2]);
    });
  });

  describe("連続した操作", () => {
    it("ダイアログの開閉を複数回行えること", async () => {
      const user = userEvent.setup();

      render(<ShowcasesContainer items={mockItems} />);

      const cardButtons = screen.getAllByRole("button");

      // 1回目: 開く→閉じる
      await user.click(getDefined(cardButtons[0]));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /close/i }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // 2回目: 別のカードで開く→閉じる
      await user.click(getDefined(cardButtons[1]));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByTestId("input-demo")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // 3回目: また別のカードで開く
      await user.click(getDefined(cardButtons[2]));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByTestId("card-demo")).toBeInTheDocument();
    });
  });

  describe("空の配列", () => {
    it("アイテムが空でもページヘッダーが表示されること", () => {
      render(<ShowcasesContainer items={[]} />);

      expect(screen.getByText("Component Showcases")).toBeInTheDocument();
      expect(
        screen.getByText(
          "A collection of presentation components for verification and testing purposes."
        )
      ).toBeInTheDocument();
    });

    it("アイテムが空の場合はカードが表示されないこと", () => {
      render(<ShowcasesContainer items={[]} />);

      const buttons = screen.queryAllByRole("button");
      expect(buttons).toHaveLength(0);
    });
  });
});
