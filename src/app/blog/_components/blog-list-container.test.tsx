import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PostMeta, SortOption } from "@/lib/blog-utils";
import { BlogListContainer } from "./blog-list-container";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock state for useBlogSearchParams
const createMockHookState = () => ({
  searchQuery: "",
  selectedTag: null as string | null,
  sortOption: "date-desc" as SortOption,
  setSearchQuery: vi.fn(),
  setSelectedTag: vi.fn(),
  setSortOption: vi.fn(),
});

let mockHookState = createMockHookState();

// Mock useBlogSearchParams hook
vi.mock("../_hooks/use-blog-search-params", () => ({
  useBlogSearchParams: () => mockHookState,
}));

describe("BlogListContainer", () => {
  const mockPosts: PostMeta[] = [
    {
      slug: "typescript-guide",
      title: "TypeScript Complete Guide",
      date: "2024-01-10",
      description: "Learn TypeScript from scratch with practical examples",
      tags: ["typescript", "programming"],
    },
    {
      slug: "nextjs-tutorial",
      title: "Next.js App Router Tutorial",
      date: "2024-01-15",
      description: "Build modern web apps with Next.js and React",
      tags: ["nextjs", "react"],
    },
    {
      slug: "react-tips",
      title: "React Performance Tips",
      date: "2024-01-20",
      description: "Optimize your React applications for better performance",
      tags: ["react", "performance"],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock state
    mockHookState = createMockHookState();
  });

  describe("初期状態 (Initial State)", () => {
    it("should render all posts initially", () => {
      render(<BlogListContainer posts={mockPosts} />);

      expect(screen.getByText("TypeScript Complete Guide")).toBeInTheDocument();
      expect(screen.getByText("Next.js App Router Tutorial")).toBeInTheDocument();
      expect(screen.getByText("React Performance Tips")).toBeInTheDocument();
    });

    it("should render search input", () => {
      render(<BlogListContainer posts={mockPosts} />);

      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });

    it("should render tag filter", () => {
      render(<BlogListContainer posts={mockPosts} />);

      // Tag filter buttons (using role=button to distinguish from badge spans)
      const tagButtons = screen.getAllByRole("button");
      const tagButtonTexts = tagButtons.map((btn) => btn.textContent);
      expect(tagButtonTexts).toContain("typescript");
      expect(tagButtonTexts).toContain("react");
    });

    it("should render sort selector", () => {
      render(<BlogListContainer posts={mockPosts} />);

      expect(screen.getByRole("button", { name: /新しい順|sort/i })).toBeInTheDocument();
    });
  });

  describe("検索機能 (Search Functionality)", () => {
    it("should call setSearchQuery when user types in search input", async () => {
      const user = userEvent.setup();

      render(<BlogListContainer posts={mockPosts} />);

      const searchInput = screen.getByRole("searchbox");
      await user.type(searchInput, "T");

      expect(mockHookState.setSearchQuery).toHaveBeenCalled();
    });

    it("should filter posts when searchQuery state changes", () => {
      mockHookState.searchQuery = "TypeScript";

      render(<BlogListContainer posts={mockPosts} />);

      expect(screen.getByText("TypeScript Complete Guide")).toBeInTheDocument();
      expect(screen.queryByText("Next.js App Router Tutorial")).not.toBeInTheDocument();
      expect(screen.queryByText("React Performance Tips")).not.toBeInTheDocument();
    });

    it("should filter posts by description", () => {
      mockHookState.searchQuery = "practical examples";

      render(<BlogListContainer posts={mockPosts} />);

      expect(screen.getByText("TypeScript Complete Guide")).toBeInTheDocument();
      expect(screen.queryByText("Next.js App Router Tutorial")).not.toBeInTheDocument();
    });

    it("should filter posts by tags", () => {
      mockHookState.searchQuery = "performance";

      render(<BlogListContainer posts={mockPosts} />);

      expect(screen.getByText("React Performance Tips")).toBeInTheDocument();
      expect(screen.queryByText("TypeScript Complete Guide")).not.toBeInTheDocument();
    });

    it("should show empty state when no posts match search", () => {
      mockHookState.searchQuery = "nonexistent content xyz";

      render(<BlogListContainer posts={mockPosts} />);

      expect(screen.getByText(/該当する記事が見つかりませんでした/)).toBeInTheDocument();
    });
  });

  describe("タグフィルター (Tag Filter)", () => {
    it("should call setSelectedTag when tag is clicked", async () => {
      const user = userEvent.setup();

      render(<BlogListContainer posts={mockPosts} />);

      await user.click(screen.getByRole("button", { name: "react" }));

      expect(mockHookState.setSelectedTag).toHaveBeenCalledWith("react");
    });

    it("should filter posts when selectedTag state changes", () => {
      mockHookState.selectedTag = "react";

      render(<BlogListContainer posts={mockPosts} />);

      expect(screen.getByText("Next.js App Router Tutorial")).toBeInTheDocument();
      expect(screen.getByText("React Performance Tips")).toBeInTheDocument();
      expect(screen.queryByText("TypeScript Complete Guide")).not.toBeInTheDocument();
    });
  });

  describe("検索とフィルターの組み合わせ (Search Combined with Tag Filter)", () => {
    it("should apply both search and tag filter", () => {
      mockHookState.selectedTag = "react";
      mockHookState.searchQuery = "performance";

      render(<BlogListContainer posts={mockPosts} />);

      // Should only show React Performance Tips (matches both react tag and performance search)
      expect(screen.getByText("React Performance Tips")).toBeInTheDocument();
      expect(screen.queryByText("Next.js App Router Tutorial")).not.toBeInTheDocument();
    });
  });

  describe("空状態 (Empty State)", () => {
    it("should render empty state when posts array is empty", () => {
      render(<BlogListContainer posts={[]} />);

      expect(screen.getByText(/該当する記事が見つかりませんでした/)).toBeInTheDocument();
    });
  });
});
