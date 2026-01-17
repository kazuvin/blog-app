"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";
import { SpringPresets, useSpringValue } from "@/lib/animation";

interface MainContentProps {
  children: ReactNode;
}

/**
 * Client component that handles scroll-to-top and fade-in animation on route changes.
 * Placed in src/app/ as it's specific to the root layout.
 */
export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  const opacitySpring = useSpringValue(1, SpringPresets.stiff);
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    if (previousPathRef.current !== pathname) {
      previousPathRef.current = pathname;
      // Scroll to top
      window.scrollTo(0, 0);
      // Fade in
      opacitySpring.jump(0);
      opacitySpring.set(1);
    }
  }, [pathname, opacitySpring]);

  return <div style={{ opacity: opacitySpring.value }}>{children}</div>;
}
