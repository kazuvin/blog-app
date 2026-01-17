import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAnimation } from "./use-animation";

describe("useAnimation", () => {
  let mockAnimation: {
    pause: ReturnType<typeof vi.fn>;
    play: ReturnType<typeof vi.fn>;
    cancel: ReturnType<typeof vi.fn>;
    finish: ReturnType<typeof vi.fn>;
    reverse: ReturnType<typeof vi.fn>;
    onfinish: (() => void) | null;
    oncancel: (() => void) | null;
  };

  beforeEach(() => {
    mockAnimation = {
      pause: vi.fn(),
      play: vi.fn(),
      cancel: vi.fn(),
      finish: vi.fn(),
      reverse: vi.fn(),
      onfinish: null,
      oncancel: null,
    };

    Element.prototype.animate = vi.fn(() => mockAnimation as unknown as Animation);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return initial state as idle", () => {
    const { result } = renderHook(() => useAnimation());

    expect(result.current.state).toBe("idle");
    expect(result.current.animation).toBeNull();
  });

  it("should start animation on an element", () => {
    const { result } = renderHook(() => useAnimation());
    const element = document.createElement("div");
    const keyframes = [{ opacity: 0 }, { opacity: 1 }];

    act(() => {
      result.current.start(element, keyframes);
    });

    expect(element.animate).toHaveBeenCalledWith(
      keyframes,
      expect.objectContaining({
        duration: 300,
        easing: "ease-out",
        delay: 0,
        iterations: 1,
        direction: "normal",
        fill: "forwards",
      })
    );
    expect(result.current.state).toBe("running");
  });

  it("should accept custom animation options", () => {
    const { result } = renderHook(() => useAnimation());
    const element = document.createElement("div");
    const keyframes = [{ opacity: 0 }, { opacity: 1 }];
    const options = {
      duration: 500,
      easing: "linear" as const,
      delay: 100,
    };

    act(() => {
      result.current.start(element, keyframes, options);
    });

    expect(element.animate).toHaveBeenCalledWith(
      keyframes,
      expect.objectContaining({
        duration: 500,
        easing: "linear",
        delay: 100,
      })
    );
  });

  it("should return null when element is null", () => {
    const { result } = renderHook(() => useAnimation());
    const keyframes = [{ opacity: 0 }, { opacity: 1 }];

    let animation: Animation | null = null;
    act(() => {
      animation = result.current.start(null, keyframes);
    });

    expect(animation).toBeNull();
    expect(result.current.state).toBe("idle");
  });

  it("should update state to finished when animation completes", () => {
    const { result } = renderHook(() => useAnimation());
    const element = document.createElement("div");
    const keyframes = [{ opacity: 0 }, { opacity: 1 }];

    act(() => {
      result.current.start(element, keyframes);
    });

    expect(result.current.state).toBe("running");

    // Trigger onfinish callback
    act(() => {
      mockAnimation.onfinish?.();
    });

    expect(result.current.state).toBe("finished");
  });

  it("should call onComplete callback when animation finishes", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useAnimation());
    const element = document.createElement("div");
    const keyframes = [{ opacity: 0 }, { opacity: 1 }];

    act(() => {
      result.current.start(element, keyframes, { onComplete });
    });

    act(() => {
      mockAnimation.onfinish?.();
    });

    expect(onComplete).toHaveBeenCalled();
  });

  it("should pause animation", () => {
    const { result } = renderHook(() => useAnimation());
    const element = document.createElement("div");
    const keyframes = [{ opacity: 0 }, { opacity: 1 }];

    act(() => {
      result.current.start(element, keyframes);
    });

    act(() => {
      result.current.pause();
    });

    expect(mockAnimation.pause).toHaveBeenCalled();
    expect(result.current.state).toBe("paused");
  });

  it("should resume paused animation", () => {
    const { result } = renderHook(() => useAnimation());
    const element = document.createElement("div");
    const keyframes = [{ opacity: 0 }, { opacity: 1 }];

    act(() => {
      result.current.start(element, keyframes);
    });

    act(() => {
      result.current.pause();
    });

    expect(result.current.state).toBe("paused");

    act(() => {
      result.current.resume();
    });

    expect(mockAnimation.play).toHaveBeenCalled();
    expect(result.current.state).toBe("running");
  });

  it("should cancel animation", () => {
    const { result } = renderHook(() => useAnimation());
    const element = document.createElement("div");
    const keyframes = [{ opacity: 0 }, { opacity: 1 }];

    act(() => {
      result.current.start(element, keyframes);
    });

    act(() => {
      result.current.cancel();
    });

    expect(mockAnimation.cancel).toHaveBeenCalled();
    expect(result.current.state).toBe("idle");
  });

  it("should finish animation immediately", () => {
    const { result } = renderHook(() => useAnimation());
    const element = document.createElement("div");
    const keyframes = [{ opacity: 0 }, { opacity: 1 }];

    act(() => {
      result.current.start(element, keyframes);
    });

    act(() => {
      result.current.finish();
    });

    expect(mockAnimation.finish).toHaveBeenCalled();
  });

  it("should reverse animation", () => {
    const { result } = renderHook(() => useAnimation());
    const element = document.createElement("div");
    const keyframes = [{ opacity: 0 }, { opacity: 1 }];

    act(() => {
      result.current.start(element, keyframes);
    });

    act(() => {
      result.current.reverse();
    });

    expect(mockAnimation.reverse).toHaveBeenCalled();
  });

  it("should cancel existing animation when starting a new one", () => {
    const { result } = renderHook(() => useAnimation());
    const element = document.createElement("div");
    const keyframes1 = [{ opacity: 0 }, { opacity: 1 }];
    const keyframes2 = [{ transform: "scale(1)" }, { transform: "scale(1.5)" }];

    act(() => {
      result.current.start(element, keyframes1);
    });

    const firstAnimation = mockAnimation;

    act(() => {
      result.current.start(element, keyframes2);
    });

    expect(firstAnimation.cancel).toHaveBeenCalled();
  });
});
