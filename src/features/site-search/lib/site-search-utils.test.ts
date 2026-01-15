import { describe, expect, it } from "vitest";
import { filterSearchItems, groupSearchItemsByType, type SearchItem } from "./site-search-utils";

/**
 * site-search-utils 仕様
 *
 * 目的: サイト内検索のためのフィルタリングとグルーピング関数
 * 用途: 検索クエリに基づいてアイテムをフィルタし、タイプ別にグループ化
 */
describe("site-search-utils", () => {
  const mockSearchItems: SearchItem[] = [
    {
      type: "page",
      title: "Home",
      description: "Welcome to our homepage",
      href: "/",
    },
    {
      type: "page",
      title: "About",
      description: "Learn about us",
      href: "/about",
    },
    {
      type: "page",
      title: "Showcases",
      description: "プロジェクトの一覧",
      href: "/showcases",
    },
    {
      type: "blog",
      title: "Getting Started with TypeScript",
      description: "A beginner's guide to TypeScript",
      href: "/blog/typescript-intro",
      tags: ["typescript", "beginner"],
    },
    {
      type: "blog",
      title: "Advanced React Patterns",
      description: "高度なReactパターンについて",
      href: "/blog/react-patterns",
      tags: ["react", "advanced"],
    },
    {
      type: "blog",
      title: "日本語タイトルの記事",
      description: "日本語の説明文",
      href: "/blog/japanese-article",
      tags: ["日本語"],
    },
  ];

  // ===========================================
  // filterSearchItems
  // ===========================================
  describe("filterSearchItems", () => {
    describe("空クエリ (Empty Query)", () => {
      it("空文字列のとき全アイテムを返すこと", () => {
        const result = filterSearchItems(mockSearchItems, "");

        expect(result).toEqual(mockSearchItems);
      });

      it("空白のみのとき全アイテムを返すこと", () => {
        const result = filterSearchItems(mockSearchItems, "   ");

        expect(result).toEqual(mockSearchItems);
      });
    });

    describe("タイトル検索 (Title Search)", () => {
      it("タイトルに部分一致するアイテムを返すこと", () => {
        const result = filterSearchItems(mockSearchItems, "About");

        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("About");
      });

      it("大文字小文字を区別しないこと", () => {
        const result = filterSearchItems(mockSearchItems, "about");

        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("About");
      });

      it("複数のマッチを返すこと", () => {
        const result = filterSearchItems(mockSearchItems, "Home");

        expect(result).toHaveLength(1);
      });
    });

    describe("説明検索 (Description Search)", () => {
      it("説明文に一致するアイテムを返すこと", () => {
        const result = filterSearchItems(mockSearchItems, "beginner");

        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("Getting Started with TypeScript");
      });

      it("日本語の説明文で検索できること", () => {
        const result = filterSearchItems(mockSearchItems, "プロジェクト");

        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("Showcases");
      });
    });

    describe("タグ検索 (Tag Search)", () => {
      it("タグに一致するアイテムを返すこと", () => {
        const result = filterSearchItems(mockSearchItems, "typescript");

        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("Getting Started with TypeScript");
      });

      it("日本語タグで検索できること", () => {
        const result = filterSearchItems(mockSearchItems, "日本語");

        // 「日本語タイトルの記事」がタイトルとタグの両方で一致（1件）
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("日本語タイトルの記事");
      });
    });

    describe("複合検索 (Combined Search)", () => {
      it("タイトル、説明、タグのいずれかに一致すれば返すこと", () => {
        const result = filterSearchItems(mockSearchItems, "React");

        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("Advanced React Patterns");
      });
    });

    describe("エッジケース (Edge Cases)", () => {
      it("一致なしのとき空配列を返すこと", () => {
        const result = filterSearchItems(mockSearchItems, "xyznonexistent");

        expect(result).toEqual([]);
      });

      it("空の配列を処理すること", () => {
        const result = filterSearchItems([], "test");

        expect(result).toEqual([]);
      });

      it("特殊文字を含むクエリを安全に処理すること", () => {
        // 正規表現の特殊文字がエスケープされること
        const result = filterSearchItems(mockSearchItems, "[test]");

        expect(result).toEqual([]);
      });

      it("特殊文字を含むクエリでクラッシュしないこと", () => {
        // 正規表現の特殊文字を含むクエリ
        // biome-ignore lint/suspicious/noTemplateCurlyInString: テスト用の特殊文字
        const specialChars = ".*+?^${}()|[]\\\\";
        expect(() => {
          filterSearchItems(mockSearchItems, specialChars);
        }).not.toThrow();
      });
    });
  });

  // ===========================================
  // groupSearchItemsByType
  // ===========================================
  describe("groupSearchItemsByType", () => {
    it("アイテムをタイプ別にグループ化すること", () => {
      const result = groupSearchItemsByType(mockSearchItems);

      expect(result.page).toHaveLength(3);
      expect(result.blog).toHaveLength(3);
    });

    it("空配列で空のグループを返すこと", () => {
      const result = groupSearchItemsByType([]);

      expect(result.page).toHaveLength(0);
      expect(result.blog).toHaveLength(0);
    });

    it("ページのみの場合、ブログが空であること", () => {
      const pages = mockSearchItems.filter((item) => item.type === "page");
      const result = groupSearchItemsByType(pages);

      expect(result.page).toHaveLength(3);
      expect(result.blog).toHaveLength(0);
    });

    it("ブログのみの場合、ページが空であること", () => {
      const blogs = mockSearchItems.filter((item) => item.type === "blog");
      const result = groupSearchItemsByType(blogs);

      expect(result.page).toHaveLength(0);
      expect(result.blog).toHaveLength(3);
    });

    it("元の配列を変更しないこと", () => {
      const original = [...mockSearchItems];
      groupSearchItemsByType(mockSearchItems);

      expect(mockSearchItems).toEqual(original);
    });
  });
});
