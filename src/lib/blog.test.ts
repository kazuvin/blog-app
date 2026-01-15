import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock fs module
vi.mock("node:fs", () => ({
  default: {
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
  },
}));

// Mock gray-matter
vi.mock("gray-matter", () => ({
  default: vi.fn(),
}));

import fs from "node:fs";
import matter from "gray-matter";
import {
  getAllTags,
  getPostsByTag,
  getSortedPostsData,
  type PostMeta,
  type SortOption,
  sortPosts,
} from "./blog";

describe("Blog Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSortedPostsData", () => {
    describe("基本機能 (Basic Functionality)", () => {
      it("should return posts sorted by date descending by default", () => {
        vi.mocked(fs.readdirSync).mockReturnValue([
          "post-1.md",
          "post-2.md",
          "post-3.md",
        ] as unknown as ReturnType<typeof fs.readdirSync>);

        vi.mocked(fs.readFileSync)
          .mockReturnValueOnce("content1")
          .mockReturnValueOnce("content2")
          .mockReturnValueOnce("content3");

        vi.mocked(matter)
          .mockReturnValueOnce({
            data: {
              title: "Post 1",
              date: "2024-01-10",
              description: "Description 1",
              tags: ["typescript"],
            },
            content: "",
          } as unknown as ReturnType<typeof matter>)
          .mockReturnValueOnce({
            data: {
              title: "Post 2",
              date: "2024-01-20",
              description: "Description 2",
              tags: ["nextjs", "react"],
            },
            content: "",
          } as unknown as ReturnType<typeof matter>)
          .mockReturnValueOnce({
            data: {
              title: "Post 3",
              date: "2024-01-15",
              description: "Description 3",
              tags: ["typescript", "tips"],
            },
            content: "",
          } as unknown as ReturnType<typeof matter>);

        const posts = getSortedPostsData();

        expect(posts).toHaveLength(3);
        expect(posts[0].date).toBe("2024-01-20"); // newest first
        expect(posts[1].date).toBe("2024-01-15");
        expect(posts[2].date).toBe("2024-01-10"); // oldest last
      });

      it("should include tags in PostMeta when present", () => {
        vi.mocked(fs.readdirSync).mockReturnValue(["post-with-tags.md"] as unknown as ReturnType<
          typeof fs.readdirSync
        >);

        vi.mocked(fs.readFileSync).mockReturnValue("content");

        vi.mocked(matter).mockReturnValue({
          data: {
            title: "Post with Tags",
            date: "2024-01-15",
            description: "Description",
            tags: ["typescript", "nextjs"],
          },
          content: "",
        } as unknown as ReturnType<typeof matter>);

        const posts = getSortedPostsData();

        expect(posts[0].tags).toEqual(["typescript", "nextjs"]);
      });

      it("should return empty tags array when tags not specified in frontmatter", () => {
        vi.mocked(fs.readdirSync).mockReturnValue(["post-without-tags.md"] as unknown as ReturnType<
          typeof fs.readdirSync
        >);

        vi.mocked(fs.readFileSync).mockReturnValue("content");

        vi.mocked(matter).mockReturnValue({
          data: {
            title: "Post without Tags",
            date: "2024-01-15",
            description: "Description",
          },
          content: "",
        } as unknown as ReturnType<typeof matter>);

        const posts = getSortedPostsData();

        expect(posts[0].tags).toEqual([]);
      });
    });
  });

  describe("getAllTags", () => {
    describe("タグ収集 (Tag Collection)", () => {
      it("should return all unique tags from posts", () => {
        const posts: PostMeta[] = [
          {
            slug: "post-1",
            title: "Post 1",
            date: "2024-01-10",
            description: "Desc 1",
            tags: ["typescript", "react"],
          },
          {
            slug: "post-2",
            title: "Post 2",
            date: "2024-01-15",
            description: "Desc 2",
            tags: ["nextjs", "react"],
          },
          {
            slug: "post-3",
            title: "Post 3",
            date: "2024-01-20",
            description: "Desc 3",
            tags: ["typescript"],
          },
        ];

        const tags = getAllTags(posts);

        expect(tags).toContain("typescript");
        expect(tags).toContain("react");
        expect(tags).toContain("nextjs");
        expect(tags).toHaveLength(3); // unique tags only
      });

      it("should return sorted tags alphabetically", () => {
        const posts: PostMeta[] = [
          {
            slug: "post-1",
            title: "Post 1",
            date: "2024-01-10",
            description: "Desc 1",
            tags: ["typescript", "a-first"],
          },
          {
            slug: "post-2",
            title: "Post 2",
            date: "2024-01-15",
            description: "Desc 2",
            tags: ["nextjs", "react"],
          },
        ];

        const tags = getAllTags(posts);

        expect(tags).toEqual(["a-first", "nextjs", "react", "typescript"]);
      });

      it("should return empty array when no posts have tags", () => {
        const posts: PostMeta[] = [
          {
            slug: "post-1",
            title: "Post 1",
            date: "2024-01-10",
            description: "Desc 1",
            tags: [],
          },
        ];

        const tags = getAllTags(posts);

        expect(tags).toEqual([]);
      });

      it("should return empty array when posts array is empty", () => {
        const tags = getAllTags([]);

        expect(tags).toEqual([]);
      });
    });
  });

  describe("getPostsByTag", () => {
    describe("タグフィルタリング (Tag Filtering)", () => {
      const samplePosts: PostMeta[] = [
        {
          slug: "post-1",
          title: "TypeScript Guide",
          date: "2024-01-10",
          description: "Desc 1",
          tags: ["typescript", "programming"],
        },
        {
          slug: "post-2",
          title: "Next.js Tutorial",
          date: "2024-01-15",
          description: "Desc 2",
          tags: ["nextjs", "react"],
        },
        {
          slug: "post-3",
          title: "React Tips",
          date: "2024-01-20",
          description: "Desc 3",
          tags: ["react", "tips"],
        },
      ];

      it("should filter posts by single tag", () => {
        const filtered = getPostsByTag(samplePosts, "react");

        expect(filtered).toHaveLength(2);
        expect(filtered.map((p) => p.slug)).toContain("post-2");
        expect(filtered.map((p) => p.slug)).toContain("post-3");
      });

      it("should return all posts when tag is null or undefined", () => {
        const filteredNull = getPostsByTag(samplePosts, null);
        const filteredUndefined = getPostsByTag(samplePosts, undefined);

        expect(filteredNull).toHaveLength(3);
        expect(filteredUndefined).toHaveLength(3);
      });

      it("should return empty array when no posts match the tag", () => {
        const filtered = getPostsByTag(samplePosts, "nonexistent");

        expect(filtered).toHaveLength(0);
      });

      it("should be case-sensitive for tag matching", () => {
        const filtered = getPostsByTag(samplePosts, "TypeScript");

        expect(filtered).toHaveLength(0); // "typescript" !== "TypeScript"
      });
    });
  });

  describe("sortPosts", () => {
    describe("ソート機能 (Sorting)", () => {
      const samplePosts: PostMeta[] = [
        {
          slug: "post-b",
          title: "Beta Post",
          date: "2024-01-15",
          description: "Desc B",
          tags: ["tag-b"],
        },
        {
          slug: "post-a",
          title: "Alpha Post",
          date: "2024-01-20",
          description: "Desc A",
          tags: ["tag-a"],
        },
        {
          slug: "post-c",
          title: "Charlie Post",
          date: "2024-01-10",
          description: "Desc C",
          tags: ["tag-c"],
        },
      ];

      it("should sort by date descending (newest first)", () => {
        const sorted = sortPosts(samplePosts, "date-desc");

        expect(sorted[0].slug).toBe("post-a"); // 2024-01-20
        expect(sorted[1].slug).toBe("post-b"); // 2024-01-15
        expect(sorted[2].slug).toBe("post-c"); // 2024-01-10
      });

      it("should sort by date ascending (oldest first)", () => {
        const sorted = sortPosts(samplePosts, "date-asc");

        expect(sorted[0].slug).toBe("post-c"); // 2024-01-10
        expect(sorted[1].slug).toBe("post-b"); // 2024-01-15
        expect(sorted[2].slug).toBe("post-a"); // 2024-01-20
      });

      it("should sort by title ascending (A-Z)", () => {
        const sorted = sortPosts(samplePosts, "title-asc");

        expect(sorted[0].title).toBe("Alpha Post");
        expect(sorted[1].title).toBe("Beta Post");
        expect(sorted[2].title).toBe("Charlie Post");
      });

      it("should sort by title descending (Z-A)", () => {
        const sorted = sortPosts(samplePosts, "title-desc");

        expect(sorted[0].title).toBe("Charlie Post");
        expect(sorted[1].title).toBe("Beta Post");
        expect(sorted[2].title).toBe("Alpha Post");
      });

      it("should not mutate the original array", () => {
        const original = [...samplePosts];
        sortPosts(samplePosts, "date-asc");

        expect(samplePosts).toEqual(original);
      });

      it("should default to date-desc when invalid option provided", () => {
        const sorted = sortPosts(samplePosts, "invalid" as SortOption);

        expect(sorted[0].slug).toBe("post-a"); // newest first
      });
    });
  });
});
