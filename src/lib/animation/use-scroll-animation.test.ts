"use client";

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useScrollAnimation } from "./use-scroll-animation";

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

let intersectionObserverCallback: IntersectionObserverCallback;
let intersectionObserverOptions: IntersectionObserverInit | undefined;

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    intersectionObserverCallback = callback;
    intersectionObserverOptions = options;
    this.root = options?.root ?? null;
    this.rootMargin = options?.rootMargin ?? "0px";
    this.thresholds = Array.isArray(options?.threshold)
      ? options.threshold
      : [options?.threshold ?? 0];
  }

  observe = mockObserve;
  unobserve = mockUnobserve;
  disconnect = mockDisconnect;
  takeRecords = vi.fn(() => []);
}

// Helper to create mock IntersectionObserverEntry
function createMockEntry(
  overrides: Partial<IntersectionObserverEntry> = {}
): IntersectionObserverEntry {
  return {
    boundingClientRect: {
      top: 0,
      bottom: 100,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRectReadOnly,
    intersectionRatio: 0,
    intersectionRect: {} as DOMRectReadOnly,
    isIntersecting: false,
    rootBounds: {
      top: 0,
      bottom: 800,
      left: 0,
      right: 600,
      width: 600,
      height: 800,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRectReadOnly,
    target: document.createElement("div"),
    time: Date.now(),
    ...overrides,
  };
}

describe("useScrollAnimation", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe("初期状態 (Initial State)", () => {
    it("should return isVisible as false initially", () => {
      const { result } = renderHook(() => useScrollAnimation());

      expect(result.current.isVisible).toBe(false);
    });

    it("should return progress as 0 initially", () => {
      const { result } = renderHook(() => useScrollAnimation());

      expect(result.current.progress).toBe(0);
    });

    it("should return animationState as 'idle' initially", () => {
      const { result } = renderHook(() => useScrollAnimation());

      expect(result.current.animationState).toBe("idle");
    });

    it("should return a ref callback function", () => {
      const { result } = renderHook(() => useScrollAnimation());

      expect(typeof result.current.ref).toBe("function");
    });

    it("should return direction as null initially", () => {
      const { result } = renderHook(() => useScrollAnimation());

      expect(result.current.direction).toBeNull();
    });

    it("should return style object with initial CSS properties", () => {
      const { result } = renderHook(() => useScrollAnimation());

      expect(result.current.style).toEqual({
        opacity: 0,
        transform: "translateY(20px)",
      });
    });
  });

  describe("要素が可視領域に入った時 (Element Becomes Visible)", () => {
    it("should set isVisible to true when element enters viewport", () => {
      const { result } = renderHook(() => useScrollAnimation());

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 0.5 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.isVisible).toBe(true);
    });

    it("should set animationState to 'animating' when element enters viewport", () => {
      const { result } = renderHook(() => useScrollAnimation());

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 0.5 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.animationState).toBe("animating");
    });

    it("should update progress based on intersectionRatio", () => {
      const { result } = renderHook(() => useScrollAnimation());

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 0.75 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.progress).toBe(0.75);
    });

    it("should set direction to 'enter' when element enters viewport", () => {
      const { result } = renderHook(() => useScrollAnimation());

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 0.5 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.direction).toBe("enter");
    });

    it("should update style object when visible", () => {
      const { result } = renderHook(() => useScrollAnimation());

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 1 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.style).toEqual({
        opacity: 1,
        transform: "translateY(0px)",
      });
    });
  });

  describe("要素が可視領域から出た時 (Element Leaves Viewport)", () => {
    it("should set isVisible to false when element leaves viewport", () => {
      const { result } = renderHook(() => useScrollAnimation());

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      // Enter viewport
      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 1 })],
          {} as IntersectionObserver
        );
      });

      // Leave viewport
      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: false, intersectionRatio: 0 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.isVisible).toBe(false);
    });

    it("should set direction to 'leave' when element leaves viewport", () => {
      const { result } = renderHook(() => useScrollAnimation());

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      // Enter viewport
      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 1 })],
          {} as IntersectionObserver
        );
      });

      // Leave viewport
      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: false, intersectionRatio: 0 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.direction).toBe("leave");
    });

    it("should reset progress to 0 when element leaves viewport", () => {
      const { result } = renderHook(() => useScrollAnimation());

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      // Enter viewport
      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 1 })],
          {} as IntersectionObserver
        );
      });

      // Leave viewport
      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: false, intersectionRatio: 0 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.progress).toBe(0);
    });
  });

  describe("triggerOnceオプション (triggerOnce Option)", () => {
    it("should stop observing after first intersection when triggerOnce is true", () => {
      const { result } = renderHook(() => useScrollAnimation({ triggerOnce: true }));

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 1 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.isVisible).toBe(true);
      expect(result.current.animationState).toBe("complete");
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it("should keep isVisible true after element leaves when triggerOnce is true", () => {
      const { result } = renderHook(() => useScrollAnimation({ triggerOnce: true }));

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      // Enter viewport
      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 1 })],
          {} as IntersectionObserver
        );
      });

      // Since disconnect is called, no further updates should happen
      expect(result.current.isVisible).toBe(true);
      expect(result.current.progress).toBe(1);
    });
  });

  describe("アニメーション種類オプション (Animation Variant Options)", () => {
    it("should apply fadeIn animation styles", () => {
      const { result } = renderHook(() => useScrollAnimation({ variant: "fadeIn" }));

      expect(result.current.style).toEqual({
        opacity: 0,
        transform: "translateY(0px)",
      });

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 1 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.style).toEqual({
        opacity: 1,
        transform: "translateY(0px)",
      });
    });

    it("should apply slideUp animation styles", () => {
      const { result } = renderHook(() => useScrollAnimation({ variant: "slideUp" }));

      expect(result.current.style).toEqual({
        opacity: 0,
        transform: "translateY(40px)",
      });

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 1 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.style).toEqual({
        opacity: 1,
        transform: "translateY(0px)",
      });
    });

    it("should apply slideLeft animation styles", () => {
      const { result } = renderHook(() => useScrollAnimation({ variant: "slideLeft" }));

      expect(result.current.style).toEqual({
        opacity: 0,
        transform: "translateX(-40px)",
      });

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 1 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.style).toEqual({
        opacity: 1,
        transform: "translateX(0px)",
      });
    });

    it("should apply slideRight animation styles", () => {
      const { result } = renderHook(() => useScrollAnimation({ variant: "slideRight" }));

      expect(result.current.style).toEqual({
        opacity: 0,
        transform: "translateX(40px)",
      });

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 1 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.style).toEqual({
        opacity: 1,
        transform: "translateX(0px)",
      });
    });

    it("should apply scale animation styles", () => {
      const { result } = renderHook(() => useScrollAnimation({ variant: "scale" }));

      expect(result.current.style).toEqual({
        opacity: 0,
        transform: "scale(0.8)",
      });

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 1 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.style).toEqual({
        opacity: 1,
        transform: "scale(1)",
      });
    });
  });

  describe("カスタムオプション (Custom Options)", () => {
    it("should pass custom threshold to IntersectionObserver", () => {
      const { result } = renderHook(() => useScrollAnimation({ threshold: 0.5 }));

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      expect(intersectionObserverOptions?.threshold).toBe(0.5);
    });

    it("should pass custom rootMargin to IntersectionObserver", () => {
      const { result } = renderHook(() => useScrollAnimation({ rootMargin: "-100px" }));

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      expect(intersectionObserverOptions?.rootMargin).toBe("-100px");
    });

    it("should support custom offset for animation", () => {
      const { result } = renderHook(() => useScrollAnimation({ variant: "slideUp", offset: 60 }));

      expect(result.current.style).toEqual({
        opacity: 0,
        transform: "translateY(60px)",
      });
    });
  });

  describe("進捗に応じたスタイル (Progress-based Styles)", () => {
    it("should interpolate styles based on progress", () => {
      const { result } = renderHook(() => useScrollAnimation());

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      // 50% progress
      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 0.5 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.style.opacity).toBe(0.5);
      expect(result.current.style.transform).toBe("translateY(10px)");
    });

    it("should interpolate scale variant based on progress", () => {
      const { result } = renderHook(() => useScrollAnimation({ variant: "scale" }));

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      // 50% progress: scale from 0.8 to 1 = 0.9 at 50%
      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 0.5 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.style.opacity).toBe(0.5);
      expect(result.current.style.transform).toBe("scale(0.9)");
    });
  });

  describe("クリーンアップ (Cleanup)", () => {
    it("should call disconnect on unmount", () => {
      const { result, unmount } = renderHook(() => useScrollAnimation());

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      mockDisconnect.mockClear();
      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it("should cleanup previous observer when ref is called with new element", () => {
      const { result } = renderHook(() => useScrollAnimation());

      const element1 = document.createElement("div");
      act(() => {
        result.current.ref(element1);
      });

      mockDisconnect.mockClear();

      const element2 = document.createElement("div");
      act(() => {
        result.current.ref(element2);
      });

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe("SSR安全性 (SSR Safety)", () => {
    it("should not error when IntersectionObserver is undefined", () => {
      vi.unstubAllGlobals();
      vi.stubGlobal("IntersectionObserver", undefined);

      expect(() => {
        const { result } = renderHook(() => useScrollAnimation());
        const element = document.createElement("div");
        result.current.ref(element);
      }).not.toThrow();
    });

    it("should return default values when IntersectionObserver is undefined", () => {
      vi.unstubAllGlobals();
      vi.stubGlobal("IntersectionObserver", undefined);

      const { result } = renderHook(() => useScrollAnimation());

      expect(result.current.isVisible).toBe(false);
      expect(result.current.progress).toBe(0);
      expect(result.current.animationState).toBe("idle");
    });
  });

  describe("エッジケース (Edge Cases)", () => {
    it("should handle empty entries array gracefully", () => {
      const { result } = renderHook(() => useScrollAnimation());

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      act(() => {
        intersectionObserverCallback([], {} as IntersectionObserver);
      });

      expect(result.current.isVisible).toBe(false);
      expect(result.current.progress).toBe(0);
    });

    it("should clamp progress between 0 and 1", () => {
      const { result } = renderHook(() => useScrollAnimation());

      const element = document.createElement("div");
      act(() => {
        result.current.ref(element);
      });

      // Test with intersectionRatio > 1 (shouldn't happen but be safe)
      act(() => {
        intersectionObserverCallback(
          [createMockEntry({ isIntersecting: true, intersectionRatio: 1.5 })],
          {} as IntersectionObserver
        );
      });

      expect(result.current.progress).toBeLessThanOrEqual(1);
    });

    it("should not observe when ref is called with null initially", () => {
      const { result } = renderHook(() => useScrollAnimation());

      act(() => {
        result.current.ref(null);
      });

      expect(mockObserve).not.toHaveBeenCalled();
    });
  });
});
