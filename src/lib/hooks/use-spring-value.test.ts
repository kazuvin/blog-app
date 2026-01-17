import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SpringPresets, useSpringValue } from "./use-spring-value";

describe("useSpringValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    let frameId = 0;
    const callbacks: Map<number, FrameRequestCallback> = new Map();

    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frameId++;
      callbacks.set(frameId, callback);
      return frameId;
    });

    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      callbacks.delete(id);
    });

    // Helper to advance animation frames
    vi.stubGlobal("advanceAnimationFrame", () => {
      const timestamp = performance.now();
      const currentCallbacks = new Map(callbacks);
      callbacks.clear();
      for (const callback of currentCallbacks.values()) {
        callback(timestamp);
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("should return initial value", () => {
    const { result } = renderHook(() => useSpringValue(0));

    expect(result.current.value).toBe(0);
    expect(result.current.velocity).toBe(0);
    expect(result.current.isAnimating).toBe(false);
  });

  it("should accept custom initial value", () => {
    const { result } = renderHook(() => useSpringValue(100));

    expect(result.current.value).toBe(100);
  });

  it("should start animating when set is called", () => {
    const { result } = renderHook(() => useSpringValue(0));

    act(() => {
      result.current.set(100);
    });

    expect(result.current.isAnimating).toBe(true);
  });

  it("should jump to value immediately without animation", () => {
    const { result } = renderHook(() => useSpringValue(0));

    act(() => {
      result.current.jump(100);
    });

    expect(result.current.value).toBe(100);
    expect(result.current.velocity).toBe(0);
    expect(result.current.isAnimating).toBe(false);
  });

  it("should stop animation when stop is called", () => {
    const { result } = renderHook(() => useSpringValue(0));

    act(() => {
      result.current.set(100);
    });

    expect(result.current.isAnimating).toBe(true);

    act(() => {
      result.current.stop();
    });

    expect(result.current.isAnimating).toBe(false);
  });

  it("should have correct methods and properties", () => {
    const { result } = renderHook(() => useSpringValue(0));

    expect(typeof result.current.value).toBe("number");
    expect(typeof result.current.velocity).toBe("number");
    expect(typeof result.current.isAnimating).toBe("boolean");
    expect(typeof result.current.set).toBe("function");
    expect(typeof result.current.jump).toBe("function");
    expect(typeof result.current.stop).toBe("function");
  });

  it("should accept spring config", () => {
    const { result } = renderHook(() =>
      useSpringValue(0, { stiffness: 200, damping: 20, mass: 2 })
    );

    expect(result.current.value).toBe(0);
  });

  it("should work with spring presets", () => {
    const { result } = renderHook(() => useSpringValue(0, SpringPresets.bouncy));

    expect(result.current.value).toBe(0);
  });

  it("should cancel animation on unmount", () => {
    const { result, unmount } = renderHook(() => useSpringValue(0));

    act(() => {
      result.current.set(100);
    });

    expect(result.current.isAnimating).toBe(true);

    unmount();

    // Should not throw after unmount
    expect(() => {
      vi.runAllTimers();
    }).not.toThrow();
  });

  describe("SpringPresets", () => {
    it("should have gentle preset", () => {
      expect(SpringPresets.gentle).toEqual({
        stiffness: 100,
        damping: 15,
        mass: 1,
      });
    });

    it("should have default preset", () => {
      expect(SpringPresets.default).toEqual({
        stiffness: 100,
        damping: 10,
        mass: 1,
      });
    });

    it("should have bouncy preset", () => {
      expect(SpringPresets.bouncy).toEqual({
        stiffness: 300,
        damping: 10,
        mass: 1,
      });
    });

    it("should have stiff preset", () => {
      expect(SpringPresets.stiff).toEqual({
        stiffness: 400,
        damping: 30,
        mass: 1,
      });
    });

    it("should have slow preset", () => {
      expect(SpringPresets.slow).toEqual({
        stiffness: 50,
        damping: 20,
        mass: 2,
      });
    });

    it("should have snappy preset", () => {
      expect(SpringPresets.snappy).toEqual({
        stiffness: 500,
        damping: 25,
        mass: 0.5,
      });
    });
  });
});
