"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Cmd+K/Ctrl+K で検索ダイアログを制御するフック
 */
export function useSearchCommand() {
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    }
  }, []);

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
