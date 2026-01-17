"use client";

import { useCallback, useEffect, useState } from "react";

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
 * Custom hook that tracks the window scroll position.
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
 */
export function useScrollPosition(options: UseScrollPositionOptions = {}): UseScrollPositionResult {
  const { threshold = 0 } = options;

  const [scrollY, setScrollY] = useState(() =>
    typeof window !== "undefined" ? window.scrollY : 0
  );

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    // Check initial scroll position
    handleScroll();

    // Add scroll listener with passive option for performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return {
    scrollY,
    isScrolled: scrollY > threshold,
  };
}
