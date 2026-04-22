import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getDefined } from "@/test/assert";
import type { ShowcaseItem } from "../types";
import { ShowcaseGrid } from "./showcase-grid";

// テスト用のモックデータ
const mockItems: ShowcaseItem[] = [
  {
    id: "item-1",
    name: "Item One",
    description: "Description for item one",
    preview: <div data-testid="preview-1">Preview 1</div>,
    fullDemo: <div>Full Demo 1</div>,
  },
  {
    id: "item-2",
    name: "Item Two",
    description: "Description for item two",
    preview: <div data-testid="preview-2">Preview 2</div>,
    fullDemo: <div>Full Demo 2</div>,
  },
  {
    id: "item-3",
    name: "Item Three",
    description: "Description for item three",
    preview: <div data-testid="preview-3">Preview 3</div>,
    fullDemo: <div>Full Demo 3</div>,
  },
];

describe("ShowcaseGrid", () => {
  describe("初期表示", () => {
    it("グリッド内のすべてのアイテムが表示されること", () => {
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      expect(screen.getByText("Item One")).toBeInTheDocument();
      expect(screen.getByText("Item Two")).toBeInTheDocument();
      expect(screen.getByText("Item Three")).toBeInTheDocument();
    });

    it("アイテムの説明が表示されること", () => {
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      expect(screen.getByText("Description for item one")).toBeInTheDocument();
      expect(screen.getByText("Description for item two")).toBeInTheDocument();
      expect(screen.getByText("Description for item three")).toBeInTheDocument();
    });

    it("アイテムのプレビューが表示されること", () => {
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      expect(screen.getByTestId("preview-1")).toBeInTheDocument();
      expect(screen.getByTestId("preview-2")).toBeInTheDocument();
      expect(screen.getByTestId("preview-3")).toBeInTheDocument();
    });

    it("正しい数のボタンが表示されること", () => {
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(3);
    });
  });

  describe("空の配列", () => {
    it("配列が空の場合は何も表示されないこと", () => {
      const handleItemClick = vi.fn();

      const { container } = render(<ShowcaseGrid items={[]} onItemClick={handleItemClick} />);

      const buttons = screen.queryAllByRole("button");
      expect(buttons).toHaveLength(0);

      // グリッドコンテナは存在するが、子要素はない
      const grid = container.firstChild;
      expect(grid?.childNodes.length).toBe(0);
    });
  });

  describe("ユーザー操作", () => {
    it("最初のアイテムをクリックすると正しいアイテムでonItemClickが呼ばれること", async () => {
      const user = userEvent.setup();
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      const buttons = screen.getAllByRole("button");
      await user.click(getDefined(buttons[0]));

      expect(handleItemClick).toHaveBeenCalledTimes(1);
      expect(handleItemClick).toHaveBeenCalledWith(mockItems[0]);
    });

    it("2番目のアイテムをクリックすると正しいアイテムでonItemClickが呼ばれること", async () => {
      const user = userEvent.setup();
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      const buttons = screen.getAllByRole("button");
      await user.click(getDefined(buttons[1]));

      expect(handleItemClick).toHaveBeenCalledTimes(1);
      expect(handleItemClick).toHaveBeenCalledWith(mockItems[1]);
    });

    it("3番目のアイテムをクリックすると正しいアイテムでonItemClickが呼ばれること", async () => {
      const user = userEvent.setup();
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      const buttons = screen.getAllByRole("button");
      await user.click(getDefined(buttons[2]));

      expect(handleItemClick).toHaveBeenCalledTimes(1);
      expect(handleItemClick).toHaveBeenCalledWith(mockItems[2]);
    });

    it("複数のアイテムをクリックできること", async () => {
      const user = userEvent.setup();
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      const buttons = screen.getAllByRole("button");
      await user.click(getDefined(buttons[0]));
      await user.click(getDefined(buttons[1]));
      await user.click(getDefined(buttons[2]));

      expect(handleItemClick).toHaveBeenCalledTimes(3);
      expect(handleItemClick).toHaveBeenNthCalledWith(1, mockItems[0]);
      expect(handleItemClick).toHaveBeenNthCalledWith(2, mockItems[1]);
      expect(handleItemClick).toHaveBeenNthCalledWith(3, mockItems[2]);
    });
  });

  describe("単一アイテム", () => {
    it("単一アイテムでも正しくレンダリングされること", () => {
      const handleItemClick = vi.fn();
      const singleItem = [getDefined(mockItems[0])];

      render(<ShowcaseGrid items={singleItem} onItemClick={handleItemClick} />);

      expect(screen.getByText("Item One")).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(1);
    });
  });

  describe("グリッドレイアウト", () => {
    it("レスポンシブレイアウトのためのgridクラスを持つこと", () => {
      const handleItemClick = vi.fn();

      const { container } = render(
        <ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />
      );

      const grid = container.firstChild;
      expect(grid).toHaveClass("grid");
    });
  });
});
