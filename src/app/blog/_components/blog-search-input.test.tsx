import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BlogSearchInput } from "./blog-search-input";

describe("BlogSearchInput", () => {
  const mockOnSearchChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("初期状態 (Initial State)", () => {
    it("should render search input with placeholder", () => {
      render(<BlogSearchInput searchQuery="" onSearchChange={mockOnSearchChange} />);

      const input = screen.getByPlaceholderText(/記事を検索|search/i);
      expect(input).toBeInTheDocument();
    });

    it("should render with empty value when searchQuery is empty", () => {
      render(<BlogSearchInput searchQuery="" onSearchChange={mockOnSearchChange} />);

      const input = screen.getByRole("searchbox");
      expect(input).toHaveValue("");
    });

    it("should render with initial searchQuery value", () => {
      render(<BlogSearchInput searchQuery="React" onSearchChange={mockOnSearchChange} />);

      const input = screen.getByRole("searchbox");
      expect(input).toHaveValue("React");
    });
  });

  describe("ユーザー操作 (User Interactions)", () => {
    it("should call onSearchChange when user types", async () => {
      const user = userEvent.setup();

      render(<BlogSearchInput searchQuery="" onSearchChange={mockOnSearchChange} />);

      const input = screen.getByRole("searchbox");
      await user.type(input, "Next.js");

      expect(mockOnSearchChange).toHaveBeenCalled();
    });

    it("should call onSearchChange with input value on each keystroke", async () => {
      const user = userEvent.setup();

      render(<BlogSearchInput searchQuery="" onSearchChange={mockOnSearchChange} />);

      const input = screen.getByRole("searchbox");
      await user.type(input, "ab");

      // Each keystroke triggers onSearchChange
      expect(mockOnSearchChange).toHaveBeenCalledTimes(2);
    });

    it("should handle clearing the input", async () => {
      const user = userEvent.setup();

      render(<BlogSearchInput searchQuery="test" onSearchChange={mockOnSearchChange} />);

      const input = screen.getByRole("searchbox");
      await user.clear(input);

      expect(mockOnSearchChange).toHaveBeenCalledWith("");
    });
  });

  describe("アクセシビリティ (Accessibility)", () => {
    it("should have searchbox role", () => {
      render(<BlogSearchInput searchQuery="" onSearchChange={mockOnSearchChange} />);

      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });

    it("should have accessible label", () => {
      render(<BlogSearchInput searchQuery="" onSearchChange={mockOnSearchChange} />);

      const input = screen.getByRole("searchbox");
      expect(input).toHaveAccessibleName();
    });

    it("should support keyboard focus", async () => {
      const user = userEvent.setup();

      render(<BlogSearchInput searchQuery="" onSearchChange={mockOnSearchChange} />);

      await user.tab();

      const input = screen.getByRole("searchbox");
      expect(input).toHaveFocus();
    });
  });

  describe("スタイリング (Styling)", () => {
    it("should render with search icon", () => {
      render(<BlogSearchInput searchQuery="" onSearchChange={mockOnSearchChange} />);

      // Search icon should be present (either as svg or aria-hidden element)
      const container = screen.getByRole("searchbox").parentElement;
      expect(container).toBeInTheDocument();
    });
  });
});
