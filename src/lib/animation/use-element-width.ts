"use client";

import type { RefObject } from "react";
import { useElementDimensions } from "./use-element-dimensions";

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
 *
 * @see useElementDimensions - For tracking both width and height
 */
export function useElementWidth(ref: RefObject<HTMLElement | null>): number | undefined {
  const { width } = useElementDimensions(ref, { type: "width" });
  return width;
}
