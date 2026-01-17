"use client";

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useScrollPosition } from "./use-scroll-position";

describe("useScrollPosition", () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("初期状態 (Initial State)", () => {
    it("should return 0 as initial scroll position", () => {
      const { result } = renderHook(() => useScrollPosition());

      expect(result.current.scrollY).toBe(0);
    });

    it("should return isScrolled as false when at top", () => {
      const { result } = renderHook(() => useScrollPosition());

      expect(result.current.isScrolled).toBe(false);
    });

    it("should reflect current scrollY on mount", () => {
      Object.defineProperty(window, "scrollY", { value: 100, writable: true });

      const { result } = renderHook(() => useScrollPosition());

      expect(result.current.scrollY).toBe(100);
      expect(result.current.isScrolled).toBe(true);
    });
  });

  describe("スクロールイベント (Scroll Events)", () => {
    it("should update scrollY when window is scrolled", () => {
      const { result } = renderHook(() => useScrollPosition());

      act(() => {
        Object.defineProperty(window, "scrollY", { value: 150, writable: true });
        window.dispatchEvent(new Event("scroll"));
      });

      expect(result.current.scrollY).toBe(150);
    });

    it("should update isScrolled to true when scrollY > 0", () => {
      const { result } = renderHook(() => useScrollPosition());

      act(() => {
        Object.defineProperty(window, "scrollY", { value: 1, writable: true });
        window.dispatchEvent(new Event("scroll"));
      });

      expect(result.current.isScrolled).toBe(true);
    });

    it("should update isScrolled to false when scrollY = 0", () => {
      Object.defineProperty(window, "scrollY", { value: 100, writable: true });
      const { result } = renderHook(() => useScrollPosition());

      act(() => {
        Object.defineProperty(window, "scrollY", { value: 0, writable: true });
        window.dispatchEvent(new Event("scroll"));
      });

      expect(result.current.isScrolled).toBe(false);
    });
  });

  describe("カスタム閾値 (Custom Threshold)", () => {
    it("should use custom threshold for isScrolled calculation", () => {
      const { result } = renderHook(() => useScrollPosition({ threshold: 50 }));

      act(() => {
        Object.defineProperty(window, "scrollY", { value: 30, writable: true });
        window.dispatchEvent(new Event("scroll"));
      });

      expect(result.current.scrollY).toBe(30);
      expect(result.current.isScrolled).toBe(false);

      act(() => {
        Object.defineProperty(window, "scrollY", { value: 51, writable: true });
        window.dispatchEvent(new Event("scroll"));
      });

      expect(result.current.isScrolled).toBe(true);
    });
  });

  describe("クリーンアップ (Cleanup)", () => {
    it("should remove scroll listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() => useScrollPosition());
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    });
  });
});
