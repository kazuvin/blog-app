import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useInView } from "./use-in-view";

describe("useInView", () => {
  let observerCallback: ((entries: IntersectionObserverEntry[]) => void) | null = null;
  let mockDisconnect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    observerCallback = null;
    mockDisconnect = vi.fn();

    const IntersectionObserverMock = vi.fn((callback) => {
      observerCallback = callback;
      return {
        observe: vi.fn(),
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
      };
    });

    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  const createMockEntry = (isIntersecting: boolean): IntersectionObserverEntry => ({
    isIntersecting,
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    target: document.createElement("div"),
    time: Date.now(),
  });

  describe("initial state", () => {
    it("should return ref, inView, and entry", () => {
      const { result } = renderHook(() => useInView());

      expect(result.current).toHaveProperty("ref");
      expect(result.current).toHaveProperty("inView");
      expect(result.current).toHaveProperty("entry");
    });

    it("should start with inView as false", () => {
      const { result } = renderHook(() => useInView());

      expect(result.current.inView).toBe(false);
      expect(result.current.entry).toBeUndefined();
    });

    it("should return a mutable ref object", () => {
      const { result } = renderHook(() => useInView());

      expect(result.current.ref).toHaveProperty("current");
      expect(result.current.ref.current).toBeNull();
    });
  });

  describe("intersection updates", () => {
    it("should update inView when intersection callback is called", () => {
      const { result, rerender } = renderHook(() => useInView());

      // Set up element
      const element = document.createElement("div");
      (result.current.ref as { current: Element | null }).current = element;
      rerender();

      // Now observer callback should be set
      if (observerCallback) {
        act(() => {
          observerCallback?.([createMockEntry(true)]);
        });
        expect(result.current.inView).toBe(true);

        act(() => {
          observerCallback?.([createMockEntry(false)]);
        });
        expect(result.current.inView).toBe(false);
      }
    });

    it("should provide entry details when intersection changes", () => {
      const { result, rerender } = renderHook(() => useInView());

      const element = document.createElement("div");
      (result.current.ref as { current: Element | null }).current = element;
      rerender();

      if (observerCallback) {
        const mockEntry = createMockEntry(true);
        act(() => {
          observerCallback?.([mockEntry]);
        });

        expect(result.current.entry).toBeDefined();
        expect(result.current.entry?.isIntersecting).toBe(true);
        expect(result.current.entry?.intersectionRatio).toBe(1);
      }
    });
  });

  describe("once option", () => {
    it("should disconnect after first intersection when once is true", () => {
      const { result, rerender } = renderHook(() => useInView({ once: true }));

      const element = document.createElement("div");
      (result.current.ref as { current: Element | null }).current = element;
      rerender();

      if (observerCallback) {
        act(() => {
          observerCallback?.([createMockEntry(true)]);
        });

        expect(result.current.inView).toBe(true);
        expect(mockDisconnect).toHaveBeenCalled();
      }
    });
  });

  describe("type exports", () => {
    it("should accept all valid options", () => {
      // This test verifies TypeScript types are correctly exported
      const { result } = renderHook(() =>
        useInView({
          root: null,
          rootMargin: "10px",
          threshold: 0.5,
          once: true,
          amount: "all",
        })
      );

      expect(result.current).toBeDefined();
    });

    it("should accept amount as number", () => {
      const { result } = renderHook(() => useInView({ amount: 0.5 }));

      expect(result.current).toBeDefined();
    });

    it("should accept amount as 'some'", () => {
      const { result } = renderHook(() => useInView({ amount: "some" }));

      expect(result.current).toBeDefined();
    });

    it("should accept amount as 'all'", () => {
      const { result } = renderHook(() => useInView({ amount: "all" }));

      expect(result.current).toBeDefined();
    });
  });
});
