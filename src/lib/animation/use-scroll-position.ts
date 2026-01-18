"use client";

import { useSyncExternalStore } from "react";

export interface UseScrollPositionOptions {
  /**
   * Threshold value for isScrolled calculation
   * @default 0
   */
  threshold?: number;
}

export interface UseScrollPositionResult {
  /**
   * Current vertical scroll position (window.scrollY)
   */
  scrollY: number;

  /**
   * Whether the page has been scrolled past the threshold
   */
  isScrolled: boolean;
}

/**
 * Shared scroll store for use with useSyncExternalStore.
 * This allows multiple components to share the same scroll state
 * without duplicating event listeners.
 */
const scrollStore = {
  subscribe: (callback: () => void) => {
    window.addEventListener("scroll", callback, { passive: true });
    return () => window.removeEventListener("scroll", callback);
  },
  getSnapshot: () => window.scrollY,
  getServerSnapshot: () => 0,
};

/**
 * Custom hook that tracks the window scroll position.
 * Uses useSyncExternalStore for optimal performance and
 * shared state across multiple components.
 *
 * @param options - Configuration options
 * @returns Object containing scrollY and isScrolled
 *
 * @example
 * ```tsx
 * function Header() {
 *   const { isScrolled, scrollY } = useScrollPosition();
 *
 *   return (
 *     <header className={isScrolled ? 'scrolled' : ''}>
 *       Scroll position: {scrollY}px
 *     </header>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom threshold
 * function Header() {
 *   const { isScrolled } = useScrollPosition({ threshold: 50 });
 *
 *   return (
 *     <header className={isScrolled ? 'compact' : 'expanded'}>
 *       ...
 *     </header>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Multiple components sharing the same scroll state
 * function Header() {
 *   const { scrollY } = useScrollPosition();
 *   return <header>Scroll: {scrollY}px</header>;
 * }
 *
 * function ProgressBar() {
 *   const { scrollY } = useScrollPosition();
 *   const progress = (scrollY / document.body.scrollHeight) * 100;
 *   return <div style={{ width: `${progress}%` }} />;
 * }
 * ```
 */
export function useScrollPosition(options: UseScrollPositionOptions = {}): UseScrollPositionResult {
  const { threshold = 0 } = options;

  const scrollY = useSyncExternalStore(
    scrollStore.subscribe,
    scrollStore.getSnapshot,
    scrollStore.getServerSnapshot
  );

  return {
    scrollY,
    isScrolled: scrollY > threshold,
  };
}
