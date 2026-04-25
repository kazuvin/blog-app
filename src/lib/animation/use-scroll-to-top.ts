"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type UseScrollToTopOptions = {
  onRouteChange?: () => void;
};

/**
 * Custom hook that scrolls to top on route changes.
 * Disables browser's automatic scroll restoration to ensure
 * consistent behavior on back/forward navigation.
 */
export function useScrollToTop(options: UseScrollToTopOptions = {}) {
  const { onRouteChange } = options;
  const pathname = usePathname();
  const previousPathRef = useRef(pathname);

  // biome-ignore lint/plugin: 外部システム(ブラウザ history API)への設定はuseEffectが正しい用途。
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // biome-ignore lint/plugin: ルート変更(外部イベント)への副作用(window.scrollTo)のためuseEffectが正当。
  useEffect(() => {
    if (previousPathRef.current !== pathname) {
      previousPathRef.current = pathname;
      window.scrollTo(0, 0);
      onRouteChange?.();
    }
  }, [pathname, onRouteChange]);
}
