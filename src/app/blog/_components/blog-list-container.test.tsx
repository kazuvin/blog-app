import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PostMeta } from "@/lib/blog-utils";
import { BlogListContainer } from "./blog-list-container";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
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
    it("should filter posts by search query in title", async () => {
      const user = userEvent.setup();

      render(<BlogListContainer posts={mockPosts} />);

      const searchInput = screen.getByRole("searchbox");
      await user.type(searchInput, "TypeScript");

      expect(screen.getByText("TypeScript Complete Guide")).toBeInTheDocument();
      expect(screen.queryByText("Next.js App Router Tutorial")).not.toBeInTheDocument();
      expect(screen.queryByText("React Performance Tips")).not.toBeInTheDocument();
    });

    it("should filter posts by search query in description", async () => {
      const user = userEvent.setup();

      render(<BlogListContainer posts={mockPosts} />);

      const searchInput = screen.getByRole("searchbox");
      await user.type(searchInput, "practical examples");

      expect(screen.getByText("TypeScript Complete Guide")).toBeInTheDocument();
      expect(screen.queryByText("Next.js App Router Tutorial")).not.toBeInTheDocument();
    });

    it("should filter posts by search query in tags", async () => {
      const user = userEvent.setup();

      render(<BlogListContainer posts={mockPosts} />);

      const searchInput = screen.getByRole("searchbox");
      await user.type(searchInput, "performance");

      expect(screen.getByText("React Performance Tips")).toBeInTheDocument();
      expect(screen.queryByText("TypeScript Complete Guide")).not.toBeInTheDocument();
    });

    it("should show empty state when no posts match search", async () => {
      const user = userEvent.setup();

      render(<BlogListContainer posts={mockPosts} />);

      const searchInput = screen.getByRole("searchbox");
      await user.type(searchInput, "nonexistent content xyz");

      expect(screen.getByText(/該当する記事が見つかりませんでした/)).toBeInTheDocument();
    });

    it("should show all posts when search is cleared", async () => {
      const user = userEvent.setup();

      render(<BlogListContainer posts={mockPosts} />);

      const searchInput = screen.getByRole("searchbox");
      await user.type(searchInput, "TypeScript");

      expect(screen.queryByText("React Performance Tips")).not.toBeInTheDocument();

      await user.clear(searchInput);

      expect(screen.getByText("TypeScript Complete Guide")).toBeInTheDocument();
      expect(screen.getByText("Next.js App Router Tutorial")).toBeInTheDocument();
      expect(screen.getByText("React Performance Tips")).toBeInTheDocument();
    });
  });

  describe("検索とフィルターの組み合わせ (Search Combined with Tag Filter)", () => {
    it("should apply both search and tag filter", async () => {
      const user = userEvent.setup();

      render(<BlogListContainer posts={mockPosts} />);

      // First filter by react tag
      await user.click(screen.getByRole("button", { name: "react" }));

      // Then search for "performance"
      const searchInput = screen.getByRole("searchbox");
      await user.type(searchInput, "performance");

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
