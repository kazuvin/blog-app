import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAnimationFrame } from "./use-animation-frame";

describe("useAnimationFrame", () => {
  let frameCallbacks: Map<number, FrameRequestCallback>;
  let frameId: number;
  let currentTime: number;

  beforeEach(() => {
    frameCallbacks = new Map();
    frameId = 0;
    currentTime = 0;

    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frameId++;
      frameCallbacks.set(frameId, callback);
      return frameId;
    });

    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      frameCallbacks.delete(id);
    });

    vi.stubGlobal("performance", {
      now: () => currentTime,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const advanceFrame = (ms: number) => {
    currentTime += ms;
    const callbacks = new Map(frameCallbacks);
    frameCallbacks.clear();
    for (const callback of callbacks.values()) {
      callback(currentTime);
    }
  };

  it("should call callback on each frame when autoStart is true", () => {
    const callback = vi.fn();

    renderHook(() => useAnimationFrame(callback));

    // First frame
    act(() => {
      advanceFrame(16);
    });

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        time: expect.any(Number),
        delta: expect.any(Number),
      })
    );
  });

  it("should not start automatically when autoStart is false", () => {
    const callback = vi.fn();

    renderHook(() => useAnimationFrame(callback, { autoStart: false }));

    act(() => {
      advanceFrame(16);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should start when start is called", () => {
    const callback = vi.fn();

    const { result } = renderHook(() => useAnimationFrame(callback, { autoStart: false }));

    act(() => {
      result.current.start();
    });

    act(() => {
      advanceFrame(16);
    });

    expect(callback).toHaveBeenCalled();
  });

  it("should stop when stop is called", () => {
    const callback = vi.fn();

    const { result } = renderHook(() => useAnimationFrame(callback));

    // First frame
    act(() => {
      advanceFrame(16);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.stop();
    });

    // Try to advance more frames
    act(() => {
      advanceFrame(16);
    });

    // Should still be 1 call (no new calls after stop)
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should provide time since animation started", () => {
    const callback = vi.fn();

    renderHook(() => useAnimationFrame(callback));

    // Advance 100ms
    act(() => {
      advanceFrame(100);
    });

    const firstCall = callback.mock.calls[0][0];
    expect(firstCall.time).toBeCloseTo(0, 5);

    // Advance another 100ms
    act(() => {
      advanceFrame(100);
    });

    const secondCall = callback.mock.calls[1][0];
    expect(secondCall.time).toBeCloseTo(100, 5);
  });

  it("should provide delta time between frames", () => {
    const callback = vi.fn();

    renderHook(() => useAnimationFrame(callback));

    // First frame at 16ms
    act(() => {
      advanceFrame(16);
    });

    // Second frame at 32ms
    act(() => {
      advanceFrame(16);
    });

    const secondCall = callback.mock.calls[1][0];
    expect(secondCall.delta).toBeCloseTo(16, 5);
  });

  it("should return controls object", () => {
    const callback = vi.fn();

    const { result } = renderHook(() => useAnimationFrame(callback));

    expect(typeof result.current.start).toBe("function");
    expect(typeof result.current.stop).toBe("function");
    expect(typeof result.current.isRunning).toBe("boolean");
  });

  it("should cleanup on unmount", () => {
    const callback = vi.fn();

    const { unmount } = renderHook(() => useAnimationFrame(callback));

    unmount();

    // Should not throw after unmount
    expect(() => {
      advanceFrame(16);
    }).not.toThrow();
  });

  it("should not start again if already running", () => {
    const callback = vi.fn();

    const { result } = renderHook(() => useAnimationFrame(callback));

    // Call start multiple times
    act(() => {
      result.current.start();
      result.current.start();
      result.current.start();
    });

    act(() => {
      advanceFrame(16);
    });

    // Should only have one callback scheduled
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should use latest callback reference", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { rerender } = renderHook(({ cb }) => useAnimationFrame(cb), {
      initialProps: { cb: callback1 },
    });

    // First frame with callback1
    act(() => {
      advanceFrame(16);
    });

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    // Update callback
    rerender({ cb: callback2 });

    // Second frame should use callback2
    act(() => {
      advanceFrame(16);
    });

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});
