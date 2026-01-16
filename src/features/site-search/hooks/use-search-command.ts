"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import {
  searchOpenValueAtom,
  setSearchOpenAtom,
  toggleSearchAtom,
} from "../stores/site-search-atoms";

/**
 * Cmd+K/Ctrl+K で検索ダイアログを制御するフック
 *
 * Jotai atomを使用して状態を管理
 */
export function useSearchCommand() {
  const isOpen = useAtomValue(searchOpenValueAtom);
  const setIsOpen = useSetAtom(setSearchOpenAtom);
  const toggle = useSetAtom(toggleSearchAtom);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        toggle();
      }
    },
    [toggle]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    isOpen,
    setIsOpen,
  };
}
