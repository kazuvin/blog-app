"use client";

import { useScrollPosition } from "@/lib/animation";

export interface UseScrollHeaderResult {
  /**
   * Whether the page has been scrolled (scrollY > 0)
   */
  isScrolled: boolean;
}

/**
 * Custom hook for creating header effects based on scroll position.
 *
 * Uses CSS transitions for smooth animations when the user scrolls.
 * The header styling (padding, border, etc.) should be controlled via
 * CSS classes based on the isScrolled state.
 *
 * @returns Object containing isScrolled state
 *
 * @example
 * ```tsx
 * function Header() {
 *   const { isScrolled } = useScrollHeader();
 *
 *   return (
 *     <header
 *       className={cn(
 *         "transition-all duration-200",
 *         isScrolled ? "py-0 border-b" : "pt-4 border-transparent"
 *       )}
 *     >
 *       <nav>...</nav>
 *     </header>
 *   );
 * }
 * ```
 */
export function useScrollHeader(): UseScrollHeaderResult {
  const { isScrolled } = useScrollPosition();

  return {
    isScrolled,
  };
}
