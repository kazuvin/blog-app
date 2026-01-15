import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSearchCommand } from "./use-search-command";

/**
 * useSearchCommand 仕様
 *
 * 目的: Cmd+K/Ctrl+K ショートカットで検索ダイアログを制御する
 * 用途: グローバルキーボードショートカットの登録・解除
 */
describe("useSearchCommand", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ===========================================
  // 初期状態 (Initial State)
  // ===========================================
  describe("初期状態 (Initial State)", () => {
    it("初期状態でisOpen=falseを返すこと", () => {
      const { result } = renderHook(() => useSearchCommand());

      expect(result.current.isOpen).toBe(false);
    });

    it("setIsOpen関数を返すこと", () => {
      const { result } = renderHook(() => useSearchCommand());

      expect(typeof result.current.setIsOpen).toBe("function");
    });
  });

  // ===========================================
  // キーボードショートカット (Keyboard Shortcut)
  // ===========================================
  describe("キーボードショートカット (Keyboard Shortcut)", () => {
    it("Cmd+Kでダイアログが開くこと（Mac）", () => {
      const { result } = renderHook(() => useSearchCommand());

      act(() => {
        // metaKey = Cmd on Mac
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "k",
            metaKey: true,
            bubbles: true,
          })
        );
      });

      expect(result.current.isOpen).toBe(true);
    });

    it("Ctrl+Kでダイアログが開くこと（Windows/Linux）", () => {
      const { result } = renderHook(() => useSearchCommand());

      act(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "k",
            ctrlKey: true,
            bubbles: true,
          })
        );
      });

      expect(result.current.isOpen).toBe(true);
    });

    it("Kキー単体では開かないこと", () => {
      const { result } = renderHook(() => useSearchCommand());

      act(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "k",
            bubbles: true,
          })
        );
      });

      expect(result.current.isOpen).toBe(false);
    });

    it("Cmd+他のキーでは開かないこと", () => {
      const { result } = renderHook(() => useSearchCommand());

      act(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "j",
            metaKey: true,
            bubbles: true,
          })
        );
      });

      expect(result.current.isOpen).toBe(false);
    });

    it("ショートカットでトグルすること", () => {
      const { result } = renderHook(() => useSearchCommand());

      // 1回目: 開く
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "k",
            metaKey: true,
            bubbles: true,
          })
        );
      });

      expect(result.current.isOpen).toBe(true);

      // 2回目: 閉じる
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "k",
            metaKey: true,
            bubbles: true,
          })
        );
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  // ===========================================
  // setIsOpen (Manual Control)
  // ===========================================
  describe("setIsOpen (Manual Control)", () => {
    it("setIsOpenで手動で開くことができること", () => {
      const { result } = renderHook(() => useSearchCommand());

      act(() => {
        result.current.setIsOpen(true);
      });

      expect(result.current.isOpen).toBe(true);
    });

    it("setIsOpenで手動で閉じることができること", () => {
      const { result } = renderHook(() => useSearchCommand());

      // まず開く
      act(() => {
        result.current.setIsOpen(true);
      });

      // 閉じる
      act(() => {
        result.current.setIsOpen(false);
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  // ===========================================
  // イベントリスナー管理 (Event Listener Management)
  // ===========================================
  describe("イベントリスナー管理 (Event Listener Management)", () => {
    it("アンマウント時にイベントリスナーが削除されること", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() => useSearchCommand());

      expect(addEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    });
  });

  // ===========================================
  // デフォルト動作防止 (Prevent Default)
  // ===========================================
  describe("デフォルト動作防止 (Prevent Default)", () => {
    it("Cmd+Kでブラウザのデフォルト動作が防止されること", () => {
      renderHook(() => useSearchCommand());

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");

      act(() => {
        window.dispatchEvent(event);
      });

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
});
