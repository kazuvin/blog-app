"use client";

import { useCallback, useEffect, useState } from "react";

import { SpringPresets, useSpringValue } from "@/lib/animation";

export interface UseScrollHeaderResult {
  /**
   * Whether the page has been scrolled (scrollY > 0)
   */
  isScrolled: boolean;

  /**
   * Animated padding top value (16 when not scrolled, 0 when scrolled)
   */
  paddingTop: number;

  /**
   * Animated border opacity value (0 when not scrolled, 1 when scrolled)
   */
  borderOpacity: number;
}

/**
 * Custom hook for creating animated header effects based on scroll position.
 *
 * Uses spring physics for smooth, natural-feeling transitions when the user
 * scrolls the page. The header can animate its padding and border opacity
 * based on whether the page has been scrolled.
 *
 * @returns Object containing isScrolled state and animated paddingTop/borderOpacity values
 *
 * @example
 * ```tsx
 * function Header() {
 *   const { isScrolled, paddingTop, borderOpacity } = useScrollHeader();
 *
 *   return (
 *     <header
 *       style={{
 *         paddingTop: `${paddingTop}px`,
 *         borderBottom: `1px solid rgba(0, 0, 0, ${borderOpacity})`,
 *       }}
 *     >
 *       <nav>...</nav>
 *     </header>
 *   );
 * }
 * ```
 */
export function useScrollHeader(): UseScrollHeaderResult {
  const [isScrolled, setIsScrolled] = useState(false);

  // Use spring values with stiff preset for snappy animation
  const paddingTopSpring = useSpringValue(16, SpringPresets.stiff);
  const borderOpacitySpring = useSpringValue(0, SpringPresets.stiff);

  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 0;
    setIsScrolled(scrolled);

    if (scrolled) {
      paddingTopSpring.set(0);
      borderOpacitySpring.set(1);
    } else {
      paddingTopSpring.set(16);
      borderOpacitySpring.set(0);
    }
  }, [paddingTopSpring, borderOpacitySpring]);

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
    isScrolled,
    paddingTop: paddingTopSpring.value,
    borderOpacity: borderOpacitySpring.value,
  };
}
