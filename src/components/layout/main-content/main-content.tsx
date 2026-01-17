"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useScrollToTop } from "@/lib/animation";

interface MainContentProps {
  children: ReactNode;
}

/**
 * Client component that handles scroll-to-top and fade-in animation on route changes.
 * Uses CSS animation triggered by key change for fade-in effect.
 */
export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();

  useScrollToTop();

  return (
    <div key={pathname} className="animate-fade-in">
      {children}
    </div>
  );
}
