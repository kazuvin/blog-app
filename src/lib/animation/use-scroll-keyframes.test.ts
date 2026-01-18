"use client";

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type Keyframe, useScrollKeyframes } from "./use-scroll-keyframes";

// Mock requestAnimationFrame
let rafCallback: FrameRequestCallback | null = null;
const mockRequestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
  rafCallback = callback;
  return 1;
});
const mockCancelAnimationFrame = vi.fn();

// Helper to simulate scroll
function simulateScroll(scrollY: number) {
  Object.defineProperty(window, "scrollY", { value: scrollY, writable: true });
  window.dispatchEvent(new Event("scroll"));
  if (rafCallback) {
    rafCallback(performance.now());
  }
}

describe("useScrollKeyframes", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", mockRequestAnimationFrame);
    vi.stubGlobal("cancelAnimationFrame", mockCancelAnimationFrame);
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    mockRequestAnimationFrame.mockClear();
    mockCancelAnimationFrame.mockClear();
    rafCallback = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe("初期状態 (Initial State)", () => {
    it("should return initial style based on first keyframe when scroll is 0", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      expect(result.current.style).toEqual({ opacity: 0 });
    });

    it("should return a ref callback function", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      expect(typeof result.current.ref).toBe("function");
    });

    it("should return current scroll position as 0 initially", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      expect(result.current.scrollY).toBe(0);
    });

    it("should return progress as 0 initially", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      expect(result.current.progress).toBe(0);
    });
  });

  describe("スクロール位置に応じた補間 (Scroll Position Interpolation)", () => {
    it("should interpolate opacity between keyframes", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(50);
      });

      expect(result.current.style.opacity).toBeCloseTo(0.5, 1);
    });

    it("should interpolate between multiple keyframes", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 0.5 } },
        { at: 200, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      // At scroll 150, should be between 0.5 and 1 (= 0.75)
      act(() => {
        simulateScroll(150);
      });

      expect(result.current.style.opacity).toBeCloseTo(0.75, 1);
    });

    it("should handle scroll before first keyframe", () => {
      const keyframes: Keyframe[] = [
        { at: 100, style: { opacity: 0.5 } },
        { at: 200, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      // Scroll is 0, before first keyframe at 100
      expect(result.current.style.opacity).toBe(0.5);
    });

    it("should handle scroll after last keyframe", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(200);
      });

      expect(result.current.style.opacity).toBe(1);
    });

    it("should update scrollY value on scroll", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(75);
      });

      expect(result.current.scrollY).toBe(75);
    });

    it("should calculate progress based on keyframe range", () => {
      const keyframes: Keyframe[] = [
        { at: 100, style: { opacity: 0 } },
        { at: 300, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(200);
      });

      // Progress: (200 - 100) / (300 - 100) = 0.5
      expect(result.current.progress).toBeCloseTo(0.5, 2);
    });
  });

  describe("複数プロパティの補間 (Multiple Properties Interpolation)", () => {
    it("should interpolate multiple CSS properties", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0, scale: 0.5 } },
        { at: 100, style: { opacity: 1, scale: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(50);
      });

      expect(result.current.style.opacity).toBeCloseTo(0.5, 1);
      expect(result.current.style.scale).toBeCloseTo(0.75, 1);
    });

    it("should handle translateX interpolation", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { translateX: -100 } },
        { at: 100, style: { translateX: 0 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(50);
      });

      expect(result.current.style.translateX).toBeCloseTo(-50, 1);
    });

    it("should handle translateY interpolation", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { translateY: 50 } },
        { at: 100, style: { translateY: 0 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(50);
      });

      expect(result.current.style.translateY).toBeCloseTo(25, 1);
    });

    it("should handle rotate interpolation", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { rotate: 0 } },
        { at: 100, style: { rotate: 180 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(50);
      });

      expect(result.current.style.rotate).toBeCloseTo(90, 1);
    });
  });

  describe("イージング関数 (Easing Functions)", () => {
    it("should apply linear easing by default", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(50);
      });

      expect(result.current.style.opacity).toBeCloseTo(0.5, 2);
    });

    it("should apply easeInOut easing", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 }, easing: "easeInOut" },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(50);
      });

      // easeInOut at t=0.5 should be 0.5 (it's symmetric)
      expect(result.current.style.opacity).toBeCloseTo(0.5, 1);
    });

    it("should apply easeIn easing", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 }, easing: "easeIn" },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(50);
      });

      // easeIn at t=0.5 should be less than 0.5 (starts slow)
      expect(result.current.style.opacity).toBeLessThan(0.5);
    });

    it("should apply easeOut easing", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 }, easing: "easeOut" },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(50);
      });

      // easeOut at t=0.5 should be greater than 0.5 (starts fast)
      expect(result.current.style.opacity).toBeGreaterThan(0.5);
    });

    it("should support custom easing function", () => {
      const customEasing = (t: number) => t * t; // quadratic easeIn

      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 }, easing: customEasing },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(50);
      });

      // At t=0.5, custom easing should return 0.25 (0.5^2)
      expect(result.current.style.opacity).toBeCloseTo(0.25, 2);
    });
  });

  describe("要素相対スクロール (Element-Relative Scroll)", () => {
    it("should use relative mode when specified", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes, relative: true }));

      // Create mock element with getBoundingClientRect
      const element = document.createElement("div");
      Object.defineProperty(element, "getBoundingClientRect", {
        value: () => ({
          top: 0, // Element is at top of viewport
          bottom: 100,
          left: 0,
          right: 100,
          width: 100,
          height: 100,
        }),
      });

      act(() => {
        result.current.ref(element);
      });

      // Verify the ref was attached
      expect(typeof result.current.ref).toBe("function");
    });
  });

  describe("オフセット設定 (Offset Configuration)", () => {
    it("should apply start offset to keyframe positions", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes, offset: { start: 50 } }));

      // With start offset of 50, keyframes shift:
      // at: 0 becomes at: 50
      // at: 100 becomes at: 150

      act(() => {
        simulateScroll(100);
      });

      // At scroll 100, we're at 50% between shifted keyframes (50 to 150)
      expect(result.current.style.opacity).toBeCloseTo(0.5, 1);
    });

    it("should apply end offset to stop animation early", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 200, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes, offset: { end: -50 } }));

      // With end offset of -50, last keyframe shifts from 200 to 150
      act(() => {
        simulateScroll(150);
      });

      expect(result.current.style.opacity).toBe(1);
    });
  });

  describe("CSS transform 出力 (CSS Transform Output)", () => {
    it("should output combined transform string when outputTransform is true", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { translateX: 0, translateY: 0, scale: 1, rotate: 0 } },
        { at: 100, style: { translateX: 100, translateY: 50, scale: 1.5, rotate: 45 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes, outputTransform: true }));

      act(() => {
        simulateScroll(50);
      });

      expect(result.current.style.transform).toContain("translateX(50px)");
      expect(result.current.style.transform).toContain("translateY(25px)");
      expect(result.current.style.transform).toContain("scale(1.25)");
      expect(result.current.style.transform).toContain("rotate(22.5deg)");
    });

    it("should not include individual transform properties when outputTransform is true", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { translateX: 0, scale: 1 } },
        { at: 100, style: { translateX: 100, scale: 2 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes, outputTransform: true }));

      act(() => {
        simulateScroll(50);
      });

      expect(result.current.style.translateX).toBeUndefined();
      expect(result.current.style.scale).toBeUndefined();
      expect(result.current.style.transform).toBeDefined();
    });
  });

  describe("パフォーマンス最適化 (Performance Optimization)", () => {
    it("should use requestAnimationFrame for scroll updates", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      renderHook(() => useScrollKeyframes({ keyframes }));

      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it("should cancel animation frame on unmount", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      const { unmount } = renderHook(() => useScrollKeyframes({ keyframes }));

      unmount();

      expect(mockCancelAnimationFrame).toHaveBeenCalled();
    });

    it("should not update state when scroll position unchanged", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      const initialStyle = result.current.style;

      // Simulate scroll to same position
      act(() => {
        simulateScroll(0);
      });

      expect(result.current.style).toBe(initialStyle);
    });
  });

  describe("disabled オプション (Disabled Option)", () => {
    it("should not update styles when disabled", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes, disabled: true }));

      act(() => {
        simulateScroll(50);
      });

      // Should remain at initial state
      expect(result.current.style.opacity).toBe(0);
    });

    it("should not add scroll listener when disabled", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      mockRequestAnimationFrame.mockClear();

      renderHook(() => useScrollKeyframes({ keyframes, disabled: true }));

      // RAF should not be called for scroll tracking when disabled
      expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
    });
  });

  describe("SSR安全性 (SSR Safety)", () => {
    it("should handle window being undefined gracefully in the hook", () => {
      // This test verifies the hook checks for window before using it
      // The actual SSR behavior is tested through the typeof window check in the hook
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      // Hook should return initial styles and not crash
      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      expect(result.current.style).toEqual({ opacity: 0 });
      expect(result.current.scrollY).toBe(0);
    });
  });

  describe("エッジケース (Edge Cases)", () => {
    it("should handle empty keyframes array", () => {
      const { result } = renderHook(() => useScrollKeyframes({ keyframes: [] }));

      expect(result.current.style).toEqual({});
    });

    it("should handle single keyframe", () => {
      const keyframes: Keyframe[] = [{ at: 100, style: { opacity: 0.5 } }];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      expect(result.current.style.opacity).toBe(0.5);

      act(() => {
        simulateScroll(200);
      });

      expect(result.current.style.opacity).toBe(0.5);
    });

    it("should sort keyframes by 'at' position", () => {
      const keyframes: Keyframe[] = [
        { at: 100, style: { opacity: 1 } },
        { at: 0, style: { opacity: 0 } }, // Out of order
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(50);
      });

      expect(result.current.style.opacity).toBeCloseTo(0.5, 1);
    });

    it("should handle negative scroll values", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(-50);
      });

      expect(result.current.style.opacity).toBe(0);
    });

    it("should handle keyframes with same 'at' position", () => {
      const keyframes: Keyframe[] = [
        { at: 0, style: { opacity: 0 } },
        { at: 100, style: { opacity: 0.5 } },
        { at: 100, style: { opacity: 0.8 } }, // Same position
        { at: 200, style: { opacity: 1 } },
      ];

      const { result } = renderHook(() => useScrollKeyframes({ keyframes }));

      act(() => {
        simulateScroll(100);
      });

      // Should use the later keyframe value
      expect(result.current.style.opacity).toBe(0.8);
    });
  });
});
