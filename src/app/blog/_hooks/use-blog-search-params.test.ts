import { act, renderHook } from "@testing-library/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useBlogSearchParams } from "./use-blog-search-params";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
  usePathname: vi.fn(),
}));

describe("useBlogSearchParams", () => {
  const mockPush = vi.fn();
  const mockReplace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });
    vi.mocked(usePathname).mockReturnValue("/blog");
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReturnType<typeof useSearchParams>
    );
  });

  describe("初期状態 (Initial State)", () => {
    it("should return default values when no URL params exist", () => {
      const { result } = renderHook(() => useBlogSearchParams());

      expect(result.current.searchQuery).toBe("");
      expect(result.current.selectedTag).toBeNull();
      expect(result.current.sortOption).toBe("date-desc");
    });

    it("should initialize from URL search params", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        new URLSearchParams("q=react&tag=typescript&sort=title-asc") as ReturnType<
          typeof useSearchParams
        >
      );

      const { result } = renderHook(() => useBlogSearchParams());

      expect(result.current.searchQuery).toBe("react");
      expect(result.current.selectedTag).toBe("typescript");
      expect(result.current.sortOption).toBe("title-asc");
    });

    it("should use default sort when URL param is invalid", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        new URLSearchParams("sort=invalid-sort") as ReturnType<typeof useSearchParams>
      );

      const { result } = renderHook(() => useBlogSearchParams());

      expect(result.current.sortOption).toBe("date-desc");
    });
  });

  describe("URL パラメータ更新 (URL Parameter Updates)", () => {
    it("should update URL when search query changes", () => {
      const { result } = renderHook(() => useBlogSearchParams());

      act(() => {
        result.current.setSearchQuery("nextjs");
      });

      expect(mockReplace).toHaveBeenCalledWith("/blog?q=nextjs", { scroll: false });
    });

    it("should update URL when tag is selected", () => {
      const { result } = renderHook(() => useBlogSearchParams());

      act(() => {
        result.current.setSelectedTag("react");
      });

      expect(mockReplace).toHaveBeenCalledWith("/blog?tag=react", { scroll: false });
    });

    it("should update URL when sort option changes", () => {
      const { result } = renderHook(() => useBlogSearchParams());

      act(() => {
        result.current.setSortOption("title-asc");
      });

      expect(mockReplace).toHaveBeenCalledWith("/blog?sort=title-asc", { scroll: false });
    });

    it("should combine multiple params in URL", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        new URLSearchParams("q=react") as ReturnType<typeof useSearchParams>
      );

      const { result } = renderHook(() => useBlogSearchParams());

      act(() => {
        result.current.setSelectedTag("typescript");
      });

      expect(mockReplace).toHaveBeenCalledWith("/blog?q=react&tag=typescript", { scroll: false });
    });

    it("should remove param from URL when value is empty/null", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        new URLSearchParams("q=react&tag=typescript") as ReturnType<typeof useSearchParams>
      );

      const { result } = renderHook(() => useBlogSearchParams());

      act(() => {
        result.current.setSearchQuery("");
      });

      expect(mockReplace).toHaveBeenCalledWith("/blog?tag=typescript", { scroll: false });
    });

    it("should remove tag param when null is passed", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        new URLSearchParams("tag=typescript") as ReturnType<typeof useSearchParams>
      );

      const { result } = renderHook(() => useBlogSearchParams());

      act(() => {
        result.current.setSelectedTag(null);
      });

      expect(mockReplace).toHaveBeenCalledWith("/blog", { scroll: false });
    });

    it("should not include default sort in URL", () => {
      const { result } = renderHook(() => useBlogSearchParams());

      act(() => {
        result.current.setSortOption("date-desc");
      });

      // Default sort should not be in URL
      expect(mockReplace).toHaveBeenCalledWith("/blog", { scroll: false });
    });
  });

  describe("エッジケース (Edge Cases)", () => {
    it("should handle empty URL correctly", () => {
      const { result } = renderHook(() => useBlogSearchParams());

      expect(result.current.searchQuery).toBe("");
      expect(result.current.selectedTag).toBeNull();
      expect(result.current.sortOption).toBe("date-desc");
    });

    it("should trim search query whitespace", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        new URLSearchParams("q=  react  ") as ReturnType<typeof useSearchParams>
      );

      const { result } = renderHook(() => useBlogSearchParams());

      expect(result.current.searchQuery).toBe("react");
    });
  });
});
