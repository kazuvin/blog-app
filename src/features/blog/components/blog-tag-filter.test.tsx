import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BlogTagFilter } from "./blog-tag-filter";

describe("BlogTagFilter", () => {
  const mockTags = ["nextjs", "react", "typescript"];
  const mockOnTagSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("初期状態 (Initial State)", () => {
    it("should render all available tags as badges", () => {
      render(<BlogTagFilter tags={mockTags} selectedTag={null} onTagSelect={mockOnTagSelect} />);

      expect(screen.getByText("nextjs")).toBeInTheDocument();
      expect(screen.getByText("react")).toBeInTheDocument();
      expect(screen.getByText("typescript")).toBeInTheDocument();
    });

    it("should render 'All' button to clear filter", () => {
      render(<BlogTagFilter tags={mockTags} selectedTag={null} onTagSelect={mockOnTagSelect} />);

      expect(screen.getByRole("button", { name: /all|すべて/i })).toBeInTheDocument();
    });

    it("should not render anything when tags array is empty", () => {
      const { container } = render(
        <BlogTagFilter tags={[]} selectedTag={null} onTagSelect={mockOnTagSelect} />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("選択状態 (Selection State)", () => {
    it("should highlight the selected tag", () => {
      render(<BlogTagFilter tags={mockTags} selectedTag="react" onTagSelect={mockOnTagSelect} />);

      const reactTag = screen.getByText("react");
      expect(reactTag).toHaveAttribute("data-selected", "true");
    });

    it("should highlight 'All' button when no tag is selected", () => {
      render(<BlogTagFilter tags={mockTags} selectedTag={null} onTagSelect={mockOnTagSelect} />);

      const allButton = screen.getByRole("button", { name: /all|すべて/i });
      expect(allButton).toHaveAttribute("data-selected", "true");
    });
  });

  describe("ユーザー操作 (User Interactions)", () => {
    it("should call onTagSelect with tag name when tag is clicked", async () => {
      const user = userEvent.setup();

      render(<BlogTagFilter tags={mockTags} selectedTag={null} onTagSelect={mockOnTagSelect} />);

      await user.click(screen.getByText("typescript"));

      expect(mockOnTagSelect).toHaveBeenCalledWith("typescript");
    });

    it("should call onTagSelect with null when 'All' button is clicked", async () => {
      const user = userEvent.setup();

      render(<BlogTagFilter tags={mockTags} selectedTag="react" onTagSelect={mockOnTagSelect} />);

      await user.click(screen.getByRole("button", { name: /all|すべて/i }));

      expect(mockOnTagSelect).toHaveBeenCalledWith(null);
    });
  });

  describe("アクセシビリティ (Accessibility)", () => {
    it("should have accessible role for tag buttons", () => {
      render(<BlogTagFilter tags={mockTags} selectedTag={null} onTagSelect={mockOnTagSelect} />);

      const tagButtons = screen.getAllByRole("button");
      expect(tagButtons.length).toBeGreaterThan(0);
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();

      render(<BlogTagFilter tags={mockTags} selectedTag={null} onTagSelect={mockOnTagSelect} />);

      // Tab to first button and press Enter
      await user.tab();
      await user.keyboard("{Enter}");

      expect(mockOnTagSelect).toHaveBeenCalled();
    });
  });
});
