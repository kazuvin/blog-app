"use client";

import { useEffect, useRef, useState } from "react";

export interface UseInViewOptions {
  /**
   * The root element for intersection.
   * Defaults to the browser viewport.
   */
  root?: Element | null;

  /**
   * Margin around the root element.
   * Can be a single value or up to 4 values (top, right, bottom, left).
   * @example "10px" or "10px 20px" or "10px 20px 30px 40px"
   */
  rootMargin?: string;

  /**
   * A number between 0 and 1 indicating the percentage of the target
   * that must be visible for the callback to be invoked.
   * Can also be an array of thresholds.
   * @default 0
   */
  threshold?: number | number[];

  /**
   * If true, the hook will only trigger once when the element enters the viewport.
   * After that, it will remain `true` even if the element leaves.
   * @default false
   */
  once?: boolean;

  /**
   * How much of the target element should be visible.
   * - "some": Any part of the element is visible (threshold: 0)
   * - "all": The entire element is visible (threshold: 1)
   * - number: Specific percentage (0 to 1)
   * @default "some"
   */
  amount?: "some" | "all" | number;
}

export interface UseInViewResult<T extends Element> {
  /**
   * Ref to attach to the target element
   */
  ref: React.RefObject<T | null>;

  /**
   * Whether the element is currently in view
   */
  inView: boolean;

  /**
   * The IntersectionObserverEntry for the last intersection event.
   * Useful for accessing detailed intersection information.
   */
  entry: IntersectionObserverEntry | undefined;
}

/**
 * Detects when an element enters or leaves the viewport using Intersection Observer.
 *
 * Inspired by Framer Motion's useInView hook, this provides a lightweight
 * way to trigger animations or lazy-load content when elements become visible.
 *
 * @param options - Configuration options for the intersection observer
 * @returns An object containing the ref, inView state, and entry
 *
 * @example
 * ```tsx
 * function FadeInSection() {
 *   const { ref, inView } = useInView({ once: true });
 *
 *   return (
 *     <div
 *       ref={ref}
 *       style={{
 *         opacity: inView ? 1 : 0,
 *         transition: 'opacity 0.6s ease-out',
 *       }}
 *     >
 *       This content fades in when scrolled into view
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Lazy loading images
 * function LazyImage({ src, alt }: { src: string; alt: string }) {
 *   const { ref, inView } = useInView({
 *     rootMargin: '200px', // Start loading 200px before entering viewport
 *     once: true,
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       {inView ? <img src={src} alt={alt} /> : <div className="placeholder" />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useInView<T extends Element = Element>(
  options: UseInViewOptions = {}
): UseInViewResult<T> {
  const { root, rootMargin, threshold, once = false, amount = "some" } = options;

  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>(undefined);

  // Convert amount to threshold if not explicitly set
  const resolvedThreshold = threshold ?? (amount === "some" ? 0 : amount === "all" ? 1 : amount);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If once is true and already in view, don't observe
    if (once && inView) return;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        const isIntersecting = observerEntry.isIntersecting;

        setEntry(observerEntry);
        setInView(isIntersecting);

        // If once is true and element is in view, disconnect observer
        if (once && isIntersecting) {
          observer.disconnect();
        }
      },
      {
        root,
        rootMargin,
        threshold: resolvedThreshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, resolvedThreshold, once, inView]);

  return { ref, inView, entry };
}
