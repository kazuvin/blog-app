import { createStore } from "jotai";
import { beforeEach, describe, expect, it } from "vitest";
import type { ShowcaseItem } from "../types";
import {
  clearSelectionAtom,
  isDialogOpenAtom,
  selectedItemValueAtom,
  selectItemAtom,
} from "./showcases-atoms";

// テスト用のモックデータ (Mock data for testing)
const mockItem: ShowcaseItem = {
  id: "test-1",
  name: "Test Item",
  description: "Test description",
  preview: null,
  fullDemo: null,
};

const mockItem2: ShowcaseItem = {
  id: "test-2",
  name: "Test Item 2",
  description: "Another test description",
  preview: null,
  fullDemo: null,
};

describe("showcases-atoms", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    // 各テスト前に新しいストアを作成 (Create a new store before each test)
    store = createStore();
  });

  describe("初期状態 (Initial State)", () => {
    it("should have null as initial selected item", () => {
      const value = store.get(selectedItemValueAtom);
      expect(value).toBeNull();
    });

    it("should have dialog closed initially", () => {
      const isOpen = store.get(isDialogOpenAtom);
      expect(isOpen).toBe(false);
    });
  });

  describe("selectItemAtom アクション (selectItemAtom Action)", () => {
    it("should set the selected item when selectItemAtom is called", () => {
      store.set(selectItemAtom, mockItem);

      const value = store.get(selectedItemValueAtom);
      expect(value).toEqual(mockItem);
    });

    it("should replace the selected item when called with a different item", () => {
      store.set(selectItemAtom, mockItem);
      store.set(selectItemAtom, mockItem2);

      const value = store.get(selectedItemValueAtom);
      expect(value).toEqual(mockItem2);
    });

    it("should open the dialog when an item is selected", () => {
      store.set(selectItemAtom, mockItem);

      const isOpen = store.get(isDialogOpenAtom);
      expect(isOpen).toBe(true);
    });
  });

  describe("clearSelectionAtom アクション (clearSelectionAtom Action)", () => {
    it("should clear the selected item when clearSelectionAtom is called", () => {
      // まずアイテムを選択 (First select an item)
      store.set(selectItemAtom, mockItem);
      expect(store.get(selectedItemValueAtom)).toEqual(mockItem);

      // 選択をクリア (Clear the selection)
      store.set(clearSelectionAtom);

      const value = store.get(selectedItemValueAtom);
      expect(value).toBeNull();
    });

    it("should close the dialog when selection is cleared", () => {
      // まずアイテムを選択してダイアログを開く (First select an item to open dialog)
      store.set(selectItemAtom, mockItem);
      expect(store.get(isDialogOpenAtom)).toBe(true);

      // 選択をクリア (Clear the selection)
      store.set(clearSelectionAtom);

      const isOpen = store.get(isDialogOpenAtom);
      expect(isOpen).toBe(false);
    });

    it("should be safe to call clearSelectionAtom when nothing is selected", () => {
      // 何も選択されていない状態でクリアを呼び出しても問題ないことを確認
      // (Ensure calling clear when nothing is selected is safe)
      expect(() => store.set(clearSelectionAtom)).not.toThrow();
      expect(store.get(selectedItemValueAtom)).toBeNull();
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });
  });

  describe("selectedItemValueAtom 派生アトム (selectedItemValueAtom Derived Atom)", () => {
    it("should be read-only and reflect the current selection", () => {
      expect(store.get(selectedItemValueAtom)).toBeNull();

      store.set(selectItemAtom, mockItem);
      expect(store.get(selectedItemValueAtom)).toEqual(mockItem);

      store.set(clearSelectionAtom);
      expect(store.get(selectedItemValueAtom)).toBeNull();
    });
  });

  describe("isDialogOpenAtom 派生アトム (isDialogOpenAtom Derived Atom)", () => {
    it("should return false when no item is selected", () => {
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });

    it("should return true when an item is selected", () => {
      store.set(selectItemAtom, mockItem);
      expect(store.get(isDialogOpenAtom)).toBe(true);
    });

    it("should return false after selection is cleared", () => {
      store.set(selectItemAtom, mockItem);
      store.set(clearSelectionAtom);
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });
  });

  describe("状態遷移シナリオ (State Transition Scenarios)", () => {
    it("should handle multiple select/clear cycles correctly", () => {
      // 複数回の選択/クリアサイクルを正しく処理することを確認
      // (Verify correct handling of multiple select/clear cycles)

      // Cycle 1: Select item 1
      store.set(selectItemAtom, mockItem);
      expect(store.get(selectedItemValueAtom)).toEqual(mockItem);
      expect(store.get(isDialogOpenAtom)).toBe(true);

      // Cycle 1: Clear
      store.set(clearSelectionAtom);
      expect(store.get(selectedItemValueAtom)).toBeNull();
      expect(store.get(isDialogOpenAtom)).toBe(false);

      // Cycle 2: Select item 2
      store.set(selectItemAtom, mockItem2);
      expect(store.get(selectedItemValueAtom)).toEqual(mockItem2);
      expect(store.get(isDialogOpenAtom)).toBe(true);

      // Cycle 2: Clear
      store.set(clearSelectionAtom);
      expect(store.get(selectedItemValueAtom)).toBeNull();
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });

    it("should handle direct item replacement without clearing", () => {
      // クリアせずに直接アイテムを置換することを正しく処理
      // (Handle direct item replacement without clearing)
      store.set(selectItemAtom, mockItem);
      store.set(selectItemAtom, mockItem2);

      expect(store.get(selectedItemValueAtom)).toEqual(mockItem2);
      expect(store.get(isDialogOpenAtom)).toBe(true);
    });
  });
});
