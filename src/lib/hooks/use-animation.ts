"use client";

import { useCallback, useRef, useState } from "react";

export type AnimationState = "idle" | "running" | "paused" | "finished";

export interface AnimationOptions {
  /**
   * Duration of the animation in milliseconds
   * @default 300
   */
  duration?: number;

  /**
   * Easing function for the animation
   * @default "ease-out"
   */
  easing?: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | string;

  /**
   * Delay before the animation starts in milliseconds
   * @default 0
   */
  delay?: number;

  /**
   * Number of times to repeat the animation.
   * Use Infinity for infinite loops.
   * @default 1
   */
  iterations?: number;

  /**
   * Direction of the animation
   * @default "normal"
   */
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";

  /**
   * How the animation applies styles before/after execution
   * @default "forwards"
   */
  fill?: "none" | "forwards" | "backwards" | "both";

  /**
   * Callback when animation completes
   */
  onComplete?: () => void;

  /**
   * Callback when animation is cancelled
   */
  onCancel?: () => void;
}

export interface AnimationControls {
  /**
   * Current state of the animation
   */
  state: AnimationState;

  /**
   * Start or restart the animation with the given keyframes
   */
  start: (
    element: Element | null,
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options?: AnimationOptions
  ) => Animation | null;

  /**
   * Pause the current animation
   */
  pause: () => void;

  /**
   * Resume the paused animation
   */
  resume: () => void;

  /**
   * Cancel the current animation
   */
  cancel: () => void;

  /**
   * Finish the animation immediately
   */
  finish: () => void;

  /**
   * Reverse the current animation
   */
  reverse: () => void;

  /**
   * The current Animation instance
   */
  animation: Animation | null;
}

const DEFAULT_OPTIONS: Required<Omit<AnimationOptions, "onComplete" | "onCancel">> = {
  duration: 300,
  easing: "ease-out",
  delay: 0,
  iterations: 1,
  direction: "normal",
  fill: "forwards",
};

/**
 * Provides imperative control over Web Animations API.
 *
 * Inspired by Framer Motion's useAnimate, this hook provides full control
 * over animations using the native Web Animations API.
 *
 * @returns Animation controls object
 *
 * @example
 * ```tsx
 * function AnimatedBox() {
 *   const controls = useAnimation();
 *   const boxRef = useRef<HTMLDivElement>(null);
 *
 *   const handleClick = () => {
 *     controls.start(boxRef.current, [
 *       { transform: 'scale(1)', opacity: 1 },
 *       { transform: 'scale(1.2)', opacity: 0.8 },
 *       { transform: 'scale(1)', opacity: 1 },
 *     ], { duration: 500 });
 *   };
 *
 *   return (
 *     <button ref={boxRef} onClick={handleClick}>
 *       Click to animate ({controls.state})
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Entrance animation
 * function FadeIn({ children }: { children: React.ReactNode }) {
 *   const controls = useAnimation();
 *   const ref = useRef<HTMLDivElement>(null);
 *
 *   useEffect(() => {
 *     controls.start(ref.current, [
 *       { opacity: 0, transform: 'translateY(20px)' },
 *       { opacity: 1, transform: 'translateY(0)' },
 *     ], { duration: 600, easing: 'ease-out' });
 *   }, []);
 *
 *   return <div ref={ref}>{children}</div>;
 * }
 * ```
 */
export function useAnimation(): AnimationControls {
  const [state, setState] = useState<AnimationState>("idle");
  const animationRef = useRef<Animation | null>(null);

  const start = useCallback(
    (
      element: Element | null,
      keyframes: Keyframe[] | PropertyIndexedKeyframes,
      options: AnimationOptions = {}
    ): Animation | null => {
      if (!element) return null;

      // Cancel any existing animation
      if (animationRef.current) {
        animationRef.current.cancel();
      }

      const { onComplete, onCancel, ...animationOptions } = options;
      const mergedOptions = { ...DEFAULT_OPTIONS, ...animationOptions };

      const animation = element.animate(keyframes, mergedOptions);
      animationRef.current = animation;
      setState("running");

      animation.onfinish = () => {
        setState("finished");
        onComplete?.();
      };

      animation.oncancel = () => {
        setState("idle");
        onCancel?.();
      };

      return animation;
    },
    []
  );

  const pause = useCallback(() => {
    if (animationRef.current && state === "running") {
      animationRef.current.pause();
      setState("paused");
    }
  }, [state]);

  const resume = useCallback(() => {
    if (animationRef.current && state === "paused") {
      animationRef.current.play();
      setState("running");
    }
  }, [state]);

  const cancel = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.cancel();
      animationRef.current = null;
      setState("idle");
    }
  }, []);

  const finish = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.finish();
    }
  }, []);

  const reverse = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.reverse();
    }
  }, []);

  return {
    state,
    start,
    pause,
    resume,
    cancel,
    finish,
    reverse,
    animation: animationRef.current,
  };
}
