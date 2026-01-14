import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ShowcaseItem } from "../types";
import { ShowcaseGrid } from "./showcase-grid";

// テスト用のモックデータ (Mock data for testing)
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
  describe("初期表示 (Initial Rendering)", () => {
    it("should render all items in the grid", () => {
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      expect(screen.getByText("Item One")).toBeInTheDocument();
      expect(screen.getByText("Item Two")).toBeInTheDocument();
      expect(screen.getByText("Item Three")).toBeInTheDocument();
    });

    it("should render item descriptions", () => {
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      expect(screen.getByText("Description for item one")).toBeInTheDocument();
      expect(screen.getByText("Description for item two")).toBeInTheDocument();
      expect(screen.getByText("Description for item three")).toBeInTheDocument();
    });

    it("should render item previews", () => {
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      expect(screen.getByTestId("preview-1")).toBeInTheDocument();
      expect(screen.getByTestId("preview-2")).toBeInTheDocument();
      expect(screen.getByTestId("preview-3")).toBeInTheDocument();
    });

    it("should render correct number of buttons", () => {
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(3);
    });
  });

  describe("空の配列 (Empty Array)", () => {
    it("should render nothing when items array is empty", () => {
      const handleItemClick = vi.fn();

      const { container } = render(<ShowcaseGrid items={[]} onItemClick={handleItemClick} />);

      const buttons = screen.queryAllByRole("button");
      expect(buttons).toHaveLength(0);

      // グリッドコンテナは存在するが、子要素はない
      // (Grid container exists but has no children)
      const grid = container.firstChild;
      expect(grid?.childNodes.length).toBe(0);
    });
  });

  describe("ユーザー操作 (User Interactions)", () => {
    it("should call onItemClick with the correct item when first item is clicked", async () => {
      const user = userEvent.setup();
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      const buttons = screen.getAllByRole("button");
      await user.click(buttons[0]);

      expect(handleItemClick).toHaveBeenCalledTimes(1);
      expect(handleItemClick).toHaveBeenCalledWith(mockItems[0]);
    });

    it("should call onItemClick with the correct item when second item is clicked", async () => {
      const user = userEvent.setup();
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      const buttons = screen.getAllByRole("button");
      await user.click(buttons[1]);

      expect(handleItemClick).toHaveBeenCalledTimes(1);
      expect(handleItemClick).toHaveBeenCalledWith(mockItems[1]);
    });

    it("should call onItemClick with the correct item when third item is clicked", async () => {
      const user = userEvent.setup();
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      const buttons = screen.getAllByRole("button");
      await user.click(buttons[2]);

      expect(handleItemClick).toHaveBeenCalledTimes(1);
      expect(handleItemClick).toHaveBeenCalledWith(mockItems[2]);
    });

    it("should allow clicking multiple items", async () => {
      const user = userEvent.setup();
      const handleItemClick = vi.fn();

      render(<ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />);

      const buttons = screen.getAllByRole("button");
      await user.click(buttons[0]);
      await user.click(buttons[1]);
      await user.click(buttons[2]);

      expect(handleItemClick).toHaveBeenCalledTimes(3);
      expect(handleItemClick).toHaveBeenNthCalledWith(1, mockItems[0]);
      expect(handleItemClick).toHaveBeenNthCalledWith(2, mockItems[1]);
      expect(handleItemClick).toHaveBeenNthCalledWith(3, mockItems[2]);
    });
  });

  describe("単一アイテム (Single Item)", () => {
    it("should render correctly with a single item", () => {
      const handleItemClick = vi.fn();
      const singleItem = [mockItems[0]];

      render(<ShowcaseGrid items={singleItem} onItemClick={handleItemClick} />);

      expect(screen.getByText("Item One")).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(1);
    });
  });

  describe("グリッドレイアウト (Grid Layout)", () => {
    it("should have grid class for responsive layout", () => {
      const handleItemClick = vi.fn();

      const { container } = render(
        <ShowcaseGrid items={mockItems} onItemClick={handleItemClick} />
      );

      const grid = container.firstChild;
      expect(grid).toHaveClass("grid");
    });
  });
});
