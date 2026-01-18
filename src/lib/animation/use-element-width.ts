"use client";

import { type RefObject, useEffect, useState } from "react";

/**
 * Observes an element's width using ResizeObserver.
 * Returns the current width of the element, updating automatically when it changes.
 *
 * @param ref - RefObject pointing to the element to observe
 * @returns The element's offsetWidth, or undefined if the element is not mounted
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const width = useElementWidth(ref);
 *
 * return (
 *   <div
 *     style={{ width }} // Animate width changes with CSS transition
 *     className="transition-[width] duration-300"
 *   >
 *     <span ref={ref}>Dynamic content</span>
 *   </div>
 * );
 * ```
 */
export function useElementWidth(ref: RefObject<HTMLElement | null>): number | undefined {
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    setWidth(element.offsetWidth);

    const observer = new ResizeObserver(() => {
      setWidth(element.offsetWidth);
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return width;
}
