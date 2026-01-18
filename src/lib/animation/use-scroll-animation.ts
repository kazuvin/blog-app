"use client";

import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";

/**
 * Animation variant types
 */
export type AnimationVariant = "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scale";

/**
 * Animation state types
 */
export type AnimationState = "idle" | "animating" | "complete";

/**
 * Direction of element movement relative to viewport
 */
export type AnimationDirection = "enter" | "leave" | null;

export interface UseScrollAnimationOptions {
  /**
   * Animation variant to apply
   * @default "slideUp" with subtle fade
   */
  variant?: AnimationVariant;

  /**
   * Visibility percentage to trigger (0-1)
   * @default 0
   */
  threshold?: number;

  /**
   * Margin around root to adjust detection timing
   * Use negative values to trigger before element enters viewport
   * @default "0px"
   */
  rootMargin?: string;

  /**
   * If true, only trigger animation once and stop observing
   * @default false
   */
  triggerOnce?: boolean;

  /**
   * The element used as viewport for checking visibility
   * Null uses the browser viewport
   * @default null
   */
  root?: Element | null;

  /**
   * Custom offset for translation animations (in pixels)
   * @default 40 for slide variants, 20 for default
   */
  offset?: number;
}

export interface UseScrollAnimationResult {
  /**
   * Ref callback to attach to the target element
   */
  ref: (node: Element | null) => void;

  /**
   * Whether the element is currently visible in the viewport
   */
  isVisible: boolean;

  /**
   * Animation progress from 0 to 1 based on intersection ratio
   */
  progress: number;

  /**
   * Current animation state
   */
  animationState: AnimationState;

  /**
   * Direction of element movement (enter/leave)
   */
  direction: AnimationDirection;

  /**
   * CSS styles computed from animation progress
   */
  style: CSSProperties;
}

/**
 * Get initial styles for animation variant
 */
function getInitialStyles(variant: AnimationVariant, offset: number): CSSProperties {
  switch (variant) {
    case "fadeIn":
      return { opacity: 0, transform: "translateY(0px)" };
    case "slideUp":
      return { opacity: 0, transform: `translateY(${offset}px)` };
    case "slideLeft":
      return { opacity: 0, transform: `translateX(-${offset}px)` };
    case "slideRight":
      return { opacity: 0, transform: `translateX(${offset}px)` };
    case "scale":
      return { opacity: 0, transform: "scale(0.8)" };
    default:
      return { opacity: 0, transform: `translateY(${offset}px)` };
  }
}

/**
 * Get final styles for animation variant
 */
function getFinalStyles(variant: AnimationVariant): CSSProperties {
  switch (variant) {
    case "fadeIn":
      return { opacity: 1, transform: "translateY(0px)" };
    case "slideUp":
      return { opacity: 1, transform: "translateY(0px)" };
    case "slideLeft":
      return { opacity: 1, transform: "translateX(0px)" };
    case "slideRight":
      return { opacity: 1, transform: "translateX(0px)" };
    case "scale":
      return { opacity: 1, transform: "scale(1)" };
    default:
      return { opacity: 1, transform: "translateY(0px)" };
  }
}

/**
 * Interpolate between initial and final styles based on progress
 */
function interpolateStyles(
  variant: AnimationVariant,
  progress: number,
  offset: number
): CSSProperties {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  switch (variant) {
    case "fadeIn":
      return {
        opacity: clampedProgress,
        transform: "translateY(0px)",
      };
    case "slideUp": {
      const y = offset * (1 - clampedProgress);
      return {
        opacity: clampedProgress,
        transform: `translateY(${y}px)`,
      };
    }
    case "slideLeft": {
      const x = -offset * (1 - clampedProgress);
      return {
        opacity: clampedProgress,
        transform: `translateX(${x}px)`,
      };
    }
    case "slideRight": {
      const x = offset * (1 - clampedProgress);
      return {
        opacity: clampedProgress,
        transform: `translateX(${x}px)`,
      };
    }
    case "scale": {
      const scale = 0.8 + 0.2 * clampedProgress;
      return {
        opacity: clampedProgress,
        transform: `scale(${scale})`,
      };
    }
    default: {
      const defaultY = offset * (1 - clampedProgress);
      return {
        opacity: clampedProgress,
        transform: `translateY(${defaultY}px)`,
      };
    }
  }
}

/**
 * Custom hook that manages scroll-based animations declaratively using Intersection Observer API.
 *
 * @param options - Configuration options
 * @returns Object containing ref, visibility state, progress, animation state, direction, and computed styles
 *
 * @example
 * ```tsx
 * function AnimatedSection() {
 *   const { ref, style, isVisible } = useScrollAnimation();
 *
 *   return (
 *     <div
 *       ref={ref}
 *       style={{ ...style, transition: 'all 0.6s ease-out' }}
 *     >
 *       Content animates when scrolled into view
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With triggerOnce and custom variant
 * function Card() {
 *   const { ref, style } = useScrollAnimation({
 *     variant: 'slideLeft',
 *     triggerOnce: true,
 *     threshold: 0.2,
 *   });
 *
 *   return (
 *     <div ref={ref} style={{ ...style, transition: 'all 0.5s ease-out' }}>
 *       Card slides in from left once
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using progress for custom animations
 * function ProgressiveElement() {
 *   const { ref, progress } = useScrollAnimation();
 *
 *   return (
 *     <div ref={ref}>
 *       <div style={{ width: `${progress * 100}%` }} className="h-1 bg-blue-500" />
 *     </div>
 *   );
 * }
 * ```
 */
export function useScrollAnimation(
  options: UseScrollAnimationOptions = {}
): UseScrollAnimationResult {
  const {
    variant,
    threshold = 0,
    rootMargin = "0px",
    triggerOnce = false,
    root = null,
    offset,
  } = options;

  // Determine effective variant and offset
  const effectiveVariant = variant ?? "slideUp";
  const effectiveOffset = offset ?? (variant ? 40 : 20);

  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animationState, setAnimationState] = useState<AnimationState>("idle");
  const [direction, setDirection] = useState<AnimationDirection>(null);
  const [style, setStyle] = useState<CSSProperties>(() =>
    getInitialStyles(effectiveVariant, effectiveOffset)
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRef = useRef<Element | null>(null);
  const hasTriggeredRef = useRef(false);
  const prevIsIntersectingRef = useRef(false);

  // Cleanup observer
  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // Ref callback to attach to target element
  const ref = useCallback(
    (node: Element | null) => {
      // Skip if SSR or IntersectionObserver is not available
      if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
        return;
      }

      // Cleanup previous observer
      cleanup();

      // Store the node reference
      nodeRef.current = node;

      // Skip if triggerOnce already triggered
      if (triggerOnce && hasTriggeredRef.current) {
        return;
      }

      // Skip if no node to observe
      if (!node) {
        return;
      }

      // Create new observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (!entry) return;

          const isIntersecting = entry.isIntersecting;
          const ratio = Math.min(Math.max(entry.intersectionRatio, 0), 1);

          // Determine direction
          if (isIntersecting && !prevIsIntersectingRef.current) {
            setDirection("enter");
          } else if (!isIntersecting && prevIsIntersectingRef.current) {
            setDirection("leave");
          }
          prevIsIntersectingRef.current = isIntersecting;

          setIsVisible(isIntersecting);
          setProgress(ratio);

          // Update animation state
          if (isIntersecting) {
            if (triggerOnce && ratio > 0) {
              setAnimationState("complete");
              setProgress(1);
              setStyle(getFinalStyles(effectiveVariant));
              hasTriggeredRef.current = true;
              cleanup();
            } else {
              setAnimationState("animating");
              setStyle(interpolateStyles(effectiveVariant, ratio, effectiveOffset));
            }
          } else {
            if (!triggerOnce) {
              setAnimationState("idle");
              setStyle(getInitialStyles(effectiveVariant, effectiveOffset));
            }
          }
        },
        {
          threshold,
          rootMargin,
          root,
        }
      );

      observerRef.current.observe(node);
    },
    [threshold, rootMargin, root, triggerOnce, cleanup, effectiveVariant, effectiveOffset]
  );

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    ref,
    isVisible,
    progress,
    animationState,
    direction,
    style,
  };
}
