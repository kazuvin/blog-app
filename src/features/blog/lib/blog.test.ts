import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock blog-data.json
vi.mock("../data/blog-data.json", () => ({
  default: {
    posts: [
      {
        slug: "post-2",
        title: "Post 2",
        date: "2024-01-20",
        description: "Description 2",
        tags: ["nextjs", "react"],
      },
      {
        slug: "post-3",
        title: "Post 3",
        date: "2024-01-15",
        description: "Description 3",
        tags: ["typescript", "tips"],
      },
      {
        slug: "post-1",
        title: "Post 1",
        date: "2024-01-10",
        description: "Description 1",
        tags: ["typescript"],
      },
    ],
    postContents: {
      "post-1": {
        slug: "post-1",
        title: "Post 1",
        date: "2024-01-10",
        description: "Description 1",
        tags: ["typescript"],
        content: "<p>Content 1</p>",
      },
      "post-2": {
        slug: "post-2",
        title: "Post 2",
        date: "2024-01-20",
        description: "Description 2",
        tags: ["nextjs", "react"],
        content: "<p>Content 2</p>",
      },
      "post-3": {
        slug: "post-3",
        title: "Post 3",
        date: "2024-01-15",
        description: "Description 3",
        tags: ["typescript", "tips"],
        content: "<p>Content 3</p>",
      },
    },
  },
}));

import {
  getAllPostSlugs,
  getAllTags,
  getPostBySlug,
  getPostsByTags,
  getSortedPostsData,
  type PostMeta,
  type SortOption,
  searchPosts,
  sortPosts,
} from "./blog";

describe("Blog Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSortedPostsData", () => {
    describe("基本機能 (Basic Functionality)", () => {
      it("should return posts sorted by date descending by default", () => {
        const posts = getSortedPostsData();

        expect(posts).toHaveLength(3);
        expect(posts[0].date).toBe("2024-01-20"); // newest first
        expect(posts[1].date).toBe("2024-01-15");
        expect(posts[2].date).toBe("2024-01-10"); // oldest last
      });

      it("should include tags in PostMeta when present", () => {
        const posts = getSortedPostsData();

        expect(posts[0].tags).toEqual(["nextjs", "react"]);
      });

      it("should return correct post metadata", () => {
        const posts = getSortedPostsData();

        expect(posts[0]).toEqual({
          slug: "post-2",
          title: "Post 2",
          date: "2024-01-20",
          description: "Description 2",
          tags: ["nextjs", "react"],
        });
      });
    });
  });

  describe("getAllPostSlugs", () => {
    it("should return all post slugs", () => {
      const slugs = getAllPostSlugs();

      expect(slugs).toHaveLength(3);
      expect(slugs).toContain("post-1");
      expect(slugs).toContain("post-2");
      expect(slugs).toContain("post-3");
    });
  });

  describe("getPostBySlug", () => {
    it("should return post with content for valid slug", async () => {
      const post = await getPostBySlug("post-1");

      expect(post).not.toBeNull();
      expect(post?.slug).toBe("post-1");
      expect(post?.title).toBe("Post 1");
      expect(post?.content).toBe("<p>Content 1</p>");
    });

    it("should return null for invalid slug", async () => {
      const post = await getPostBySlug("nonexistent");

      expect(post).toBeNull();
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

  describe("getPostsByTags", () => {
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
        const filtered = getPostsByTags(samplePosts, ["react"]);

        expect(filtered).toHaveLength(2);
        expect(filtered.map((p) => p.slug)).toContain("post-2");
        expect(filtered.map((p) => p.slug)).toContain("post-3");
      });

      it("should filter posts by multiple tags (AND logic)", () => {
        const filtered = getPostsByTags(samplePosts, ["react", "tips"]);

        expect(filtered).toHaveLength(1);
        expect(filtered[0].slug).toBe("post-3"); // Only post with both "react" and "tips"
      });

      it("should return all posts when tags array is empty", () => {
        const filtered = getPostsByTags(samplePosts, []);

        expect(filtered).toHaveLength(3);
      });

      it("should return empty array when no posts match the tags", () => {
        const filtered = getPostsByTags(samplePosts, ["nonexistent"]);

        expect(filtered).toHaveLength(0);
      });

      it("should be case-sensitive for tag matching", () => {
        const filtered = getPostsByTags(samplePosts, ["TypeScript"]);

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

  describe("searchPosts", () => {
    describe("検索機能 (Search Functionality)", () => {
      const samplePosts: PostMeta[] = [
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

      it("should return all posts when query is empty", () => {
        const results = searchPosts(samplePosts, "");

        expect(results).toHaveLength(3);
      });

      it("should return all posts when query is only whitespace", () => {
        const results = searchPosts(samplePosts, "   ");

        expect(results).toHaveLength(3);
      });

      it("should search by title (case-insensitive)", () => {
        const results = searchPosts(samplePosts, "typescript");

        expect(results).toHaveLength(1);
        expect(results[0].slug).toBe("typescript-guide");
      });

      it("should search by title with different case", () => {
        const results = searchPosts(samplePosts, "TYPESCRIPT");

        expect(results).toHaveLength(1);
        expect(results[0].slug).toBe("typescript-guide");
      });

      it("should search by description", () => {
        const results = searchPosts(samplePosts, "practical examples");

        expect(results).toHaveLength(1);
        expect(results[0].slug).toBe("typescript-guide");
      });

      it("should search by tags", () => {
        const results = searchPosts(samplePosts, "react");

        expect(results).toHaveLength(2);
        expect(results.map((p) => p.slug)).toContain("nextjs-tutorial");
        expect(results.map((p) => p.slug)).toContain("react-tips");
      });

      it("should return posts matching any of title, description, or tags", () => {
        const results = searchPosts(samplePosts, "performance");

        expect(results).toHaveLength(1);
        expect(results[0].slug).toBe("react-tips");
      });

      it("should return empty array when no posts match", () => {
        const results = searchPosts(samplePosts, "nonexistent keyword");

        expect(results).toHaveLength(0);
      });

      it("should handle partial matches", () => {
        const results = searchPosts(samplePosts, "Type");

        expect(results).toHaveLength(1);
        expect(results[0].slug).toBe("typescript-guide");
      });

      it("should not mutate the original array", () => {
        const original = [...samplePosts];
        searchPosts(samplePosts, "react");

        expect(samplePosts).toEqual(original);
      });
    });
  });
});
