import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ShowcaseItem } from "../types";
import { ShowcaseDialog } from "./showcase-dialog";

// テスト用のモックデータ (Mock data for testing)
const mockItem: ShowcaseItem = {
  id: "test-1",
  name: "Test Dialog Title",
  description: "Test dialog description",
  preview: <div>Preview</div>,
  fullDemo: <div data-testid="full-demo">Full Demo Content</div>,
};

describe("ShowcaseDialog", () => {
  describe("初期表示 (Initial Rendering)", () => {
    it("should not render dialog when open is false", () => {
      const handleOpenChange = vi.fn();

      render(<ShowcaseDialog item={mockItem} open={false} onOpenChange={handleOpenChange} />);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should render dialog when open is true", () => {
      const handleOpenChange = vi.fn();

      render(<ShowcaseDialog item={mockItem} open={true} onOpenChange={handleOpenChange} />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should render item name as dialog title", () => {
      const handleOpenChange = vi.fn();

      render(<ShowcaseDialog item={mockItem} open={true} onOpenChange={handleOpenChange} />);

      expect(screen.getByText("Test Dialog Title")).toBeInTheDocument();
    });

    it("should render item description", () => {
      const handleOpenChange = vi.fn();

      render(<ShowcaseDialog item={mockItem} open={true} onOpenChange={handleOpenChange} />);

      expect(screen.getByText("Test dialog description")).toBeInTheDocument();
    });

    it("should render fullDemo content", () => {
      const handleOpenChange = vi.fn();

      render(<ShowcaseDialog item={mockItem} open={true} onOpenChange={handleOpenChange} />);

      expect(screen.getByTestId("full-demo")).toBeInTheDocument();
      expect(screen.getByText("Full Demo Content")).toBeInTheDocument();
    });
  });

  describe("nullアイテム (Null Item)", () => {
    it("should render dialog with empty content when item is null", () => {
      const handleOpenChange = vi.fn();

      render(<ShowcaseDialog item={null} open={true} onOpenChange={handleOpenChange} />);

      // ダイアログは開いているが、コンテンツは空
      // (Dialog is open but content is empty)
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should not throw error when item is null and dialog is open", () => {
      const handleOpenChange = vi.fn();

      expect(() => {
        render(<ShowcaseDialog item={null} open={true} onOpenChange={handleOpenChange} />);
      }).not.toThrow();
    });
  });

  describe("ユーザー操作 (User Interactions)", () => {
    it("should call onOpenChange with false when close button is clicked", async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(<ShowcaseDialog item={mockItem} open={true} onOpenChange={handleOpenChange} />);

      // クローズボタンをクリック (Click the close button)
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it("should call onOpenChange with false when Escape key is pressed", async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(<ShowcaseDialog item={mockItem} open={true} onOpenChange={handleOpenChange} />);

      await user.keyboard("{Escape}");

      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it("should call onOpenChange with false when overlay is clicked", async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(<ShowcaseDialog item={mockItem} open={true} onOpenChange={handleOpenChange} />);

      // オーバーレイをクリック (Click the overlay)
      const overlay = document.querySelector('[data-state="open"].fixed.inset-0');
      expect(overlay).toBeInTheDocument();

      await user.click(overlay as Element);

      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("アイテムの切り替え (Item Switching)", () => {
    it("should update content when item changes", () => {
      const handleOpenChange = vi.fn();

      const { rerender } = render(
        <ShowcaseDialog item={mockItem} open={true} onOpenChange={handleOpenChange} />
      );

      expect(screen.getByText("Test Dialog Title")).toBeInTheDocument();

      const newItem: ShowcaseItem = {
        id: "test-2",
        name: "New Dialog Title",
        description: "New description",
        preview: <div>New Preview</div>,
        fullDemo: <div data-testid="new-full-demo">New Full Demo</div>,
      };

      rerender(<ShowcaseDialog item={newItem} open={true} onOpenChange={handleOpenChange} />);

      expect(screen.getByText("New Dialog Title")).toBeInTheDocument();
      expect(screen.getByText("New description")).toBeInTheDocument();
      expect(screen.getByTestId("new-full-demo")).toBeInTheDocument();
    });
  });

  describe("ダイアログサイズ (Dialog Size)", () => {
    it("should render with lg size variant", () => {
      const handleOpenChange = vi.fn();

      render(<ShowcaseDialog item={mockItem} open={true} onOpenChange={handleOpenChange} />);

      // DialogContent は data-testid がないので、role で取得
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("max-w-lg");
    });
  });

  describe("複雑なfullDemoコンテンツ (Complex fullDemo Content)", () => {
    it("should render complex fullDemo with interactive elements", () => {
      const handleOpenChange = vi.fn();
      const complexItem: ShowcaseItem = {
        id: "complex",
        name: "Complex Demo",
        description: "Demo with complex content",
        preview: <div>Preview</div>,
        fullDemo: (
          <div data-testid="complex-demo">
            <h4>Section Title</h4>
            <button type="button">Interactive Button</button>
            <input type="text" placeholder="Input field" />
          </div>
        ),
      };

      render(<ShowcaseDialog item={complexItem} open={true} onOpenChange={handleOpenChange} />);

      expect(screen.getByTestId("complex-demo")).toBeInTheDocument();
      expect(screen.getByText("Section Title")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Interactive Button" })).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Input field")).toBeInTheDocument();
    });
  });
});
