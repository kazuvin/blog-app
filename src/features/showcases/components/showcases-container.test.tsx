import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import { beforeEach, describe, expect, it } from "vitest";
import { isDialogOpenAtom, selectedItemValueAtom } from "../stores";
import type { ShowcaseItem } from "../types";
import { ShowcasesContainer } from "./showcases-container";

// テスト用のモックデータ (Mock data for testing)
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

// テスト用のラッパーコンポーネント (Wrapper component for testing)
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
    // 各テスト前に新しいストアを作成 (Create a new store before each test)
    store = createStore();
  });

  describe("初期表示 (Initial Rendering)", () => {
    it("should render the page title", () => {
      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      expect(screen.getByText("Component Showcases")).toBeInTheDocument();
    });

    it("should render the page description", () => {
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

    it("should render all showcase items", () => {
      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      expect(screen.getByText("Button")).toBeInTheDocument();
      expect(screen.getByText("Input")).toBeInTheDocument();
      expect(screen.getByText("Card")).toBeInTheDocument();
    });

    it("should render item descriptions", () => {
      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      expect(screen.getByText("Interactive button component")).toBeInTheDocument();
      expect(screen.getByText("Text input component")).toBeInTheDocument();
      expect(screen.getByText("Container card component")).toBeInTheDocument();
    });

    it("should render preview content for each item", () => {
      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      expect(screen.getByTestId("button-preview")).toBeInTheDocument();
      expect(screen.getByTestId("input-preview")).toBeInTheDocument();
      expect(screen.getByTestId("card-preview")).toBeInTheDocument();
    });

    it("should not show dialog initially", () => {
      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Jotai状態との統合 (Jotai State Integration)", () => {
    it("should have null selected item initially", () => {
      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      expect(store.get(selectedItemValueAtom)).toBeNull();
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });

    it("should update selected item in store when card is clicked", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole("button");
      await user.click(buttons[0]); // Click the first card (Button)

      expect(store.get(selectedItemValueAtom)).toEqual(mockItems[0]);
      expect(store.get(isDialogOpenAtom)).toBe(true);
    });
  });

  describe("ダイアログの開閉 (Dialog Open/Close)", () => {
    it("should open dialog when a card is clicked", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      // カードをクリック (Click the card)
      const buttons = screen.getAllByRole("button");
      await user.click(buttons[0]);

      // ダイアログが開く (Dialog opens)
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should display selected item content in dialog", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      // 最初のカード（Button）をクリック (Click the first card - Button)
      const buttons = screen.getAllByRole("button");
      await user.click(buttons[0]);

      // ダイアログ内のコンテンツを確認 (Verify content in dialog)
      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByText("Button")).toBeInTheDocument();
      expect(within(dialog).getByText("Interactive button component")).toBeInTheDocument();
      expect(screen.getByTestId("button-demo")).toBeInTheDocument();
    });

    it("should close dialog when close button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      // カードをクリックしてダイアログを開く (Click card to open dialog)
      const cardButtons = screen.getAllByRole("button");
      await user.click(cardButtons[0]);

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // クローズボタンをクリック (Click close button)
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      // ダイアログが閉じる (Dialog closes)
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should close dialog when Escape key is pressed", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      // カードをクリックしてダイアログを開く (Click card to open dialog)
      const buttons = screen.getAllByRole("button");
      await user.click(buttons[0]);

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Escapeキーを押す (Press Escape key)
      await user.keyboard("{Escape}");

      // ダイアログが閉じる (Dialog closes)
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should clear selection in store when dialog is closed", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      // カードをクリック (Click card)
      const cardButtons = screen.getAllByRole("button");
      await user.click(cardButtons[0]);

      expect(store.get(selectedItemValueAtom)).toEqual(mockItems[0]);

      // クローズボタンをクリック (Click close button)
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      // ストアがクリアされる (Store is cleared)
      expect(store.get(selectedItemValueAtom)).toBeNull();
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });
  });

  describe("異なるアイテムの選択 (Selecting Different Items)", () => {
    it("should show correct content when second item is clicked", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      // 2番目のカード（Input）をクリック (Click second card - Input)
      const buttons = screen.getAllByRole("button");
      await user.click(buttons[1]);

      // ダイアログ内のコンテンツを確認 (Verify content in dialog)
      expect(screen.getByTestId("input-demo")).toBeInTheDocument();
      expect(store.get(selectedItemValueAtom)).toEqual(mockItems[1]);
    });

    it("should show correct content when third item is clicked", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      // 3番目のカード（Card）をクリック (Click third card - Card)
      const buttons = screen.getAllByRole("button");
      await user.click(buttons[2]);

      // ダイアログ内のコンテンツを確認 (Verify content in dialog)
      expect(screen.getByTestId("card-demo")).toBeInTheDocument();
      expect(store.get(selectedItemValueAtom)).toEqual(mockItems[2]);
    });
  });

  describe("連続した操作 (Sequential Operations)", () => {
    it("should allow opening and closing dialog multiple times", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper store={store}>
          <ShowcasesContainer items={mockItems} />
        </TestWrapper>
      );

      const cardButtons = screen.getAllByRole("button");

      // 1回目: 開く→閉じる (First: open -> close)
      await user.click(cardButtons[0]);
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /close/i }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // 2回目: 別のカードで開く→閉じる (Second: open different card -> close)
      await user.click(cardButtons[1]);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByTestId("input-demo")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // 3回目: また別のカードで開く (Third: open another card)
      await user.click(cardButtons[2]);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByTestId("card-demo")).toBeInTheDocument();
    });
  });

  describe("空の配列 (Empty Array)", () => {
    it("should render page header with empty items", () => {
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

    it("should not render any cards when items is empty", () => {
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
