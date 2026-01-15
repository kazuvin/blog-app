import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SortOption } from "@/lib/blog";
import { BlogSortSelector } from "./blog-sort-selector";

describe("BlogSortSelector", () => {
  const mockOnSortChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("初期状態 (Initial State)", () => {
    it("should render with current sort option displayed", () => {
      render(<BlogSortSelector currentSort="date-desc" onSortChange={mockOnSortChange} />);

      expect(screen.getByText(/新しい順|newest/i)).toBeInTheDocument();
    });

    it("should display correct label for each sort option", () => {
      const sortLabels: Record<SortOption, RegExp> = {
        "date-desc": /新しい順|newest first/i,
        "date-asc": /古い順|oldest first/i,
        "title-asc": /タイトル昇順|title a-z/i,
        "title-desc": /タイトル降順|title z-a/i,
      };

      for (const [sortOption, labelRegex] of Object.entries(sortLabels)) {
        const { unmount } = render(
          <BlogSortSelector
            currentSort={sortOption as SortOption}
            onSortChange={mockOnSortChange}
          />
        );

        expect(screen.getByText(labelRegex)).toBeInTheDocument();
        unmount();
      }
    });
  });

  describe("ユーザー操作 (User Interactions)", () => {
    it("should open dropdown when clicked", async () => {
      const user = userEvent.setup();

      render(<BlogSortSelector currentSort="date-desc" onSortChange={mockOnSortChange} />);

      await user.click(screen.getByRole("button"));

      // All sort options should be visible
      expect(screen.getByText(/古い順|oldest first/i)).toBeInTheDocument();
      expect(screen.getByText(/タイトル昇順|title a-z/i)).toBeInTheDocument();
    });

    it("should call onSortChange with selected option", async () => {
      const user = userEvent.setup();

      render(<BlogSortSelector currentSort="date-desc" onSortChange={mockOnSortChange} />);

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByText(/古い順|oldest first/i));

      expect(mockOnSortChange).toHaveBeenCalledWith("date-asc");
    });

    it("should close dropdown after selecting an option", async () => {
      const user = userEvent.setup();

      render(<BlogSortSelector currentSort="date-desc" onSortChange={mockOnSortChange} />);

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByText(/古い順|oldest first/i));

      // Dropdown should be closed (only the selected option should be visible)
      expect(screen.queryByText(/タイトル昇順|title a-z/i)).not.toBeInTheDocument();
    });
  });

  describe("アクセシビリティ (Accessibility)", () => {
    it("should have accessible button with dropdown role", () => {
      render(<BlogSortSelector currentSort="date-desc" onSortChange={mockOnSortChange} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-haspopup", "true");
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();

      render(<BlogSortSelector currentSort="date-desc" onSortChange={mockOnSortChange} />);

      // Open with Enter
      await user.tab();
      await user.keyboard("{Enter}");

      // Options should be visible
      expect(screen.getByText(/古い順|oldest first/i)).toBeInTheDocument();
    });
  });
});
