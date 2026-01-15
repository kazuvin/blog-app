import { createStore } from "jotai";
import { beforeEach, describe, expect, it } from "vitest";
import type { ShowcaseItem } from "../types";
import {
  clearSelectionAtom,
  isDialogOpenAtom,
  selectedItemValueAtom,
  selectItemAtom,
} from "./showcases-atoms";

// テスト用のモックデータ
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
    // 各テスト前に新しいストアを作成
    store = createStore();
  });

  describe("初期状態", () => {
    it("選択アイテムの初期値がnullであること", () => {
      const value = store.get(selectedItemValueAtom);
      expect(value).toBeNull();
    });

    it("ダイアログが初期状態で閉じていること", () => {
      const isOpen = store.get(isDialogOpenAtom);
      expect(isOpen).toBe(false);
    });
  });

  describe("selectItemAtom アクション", () => {
    it("selectItemAtomを呼び出すと選択アイテムが設定されること", () => {
      store.set(selectItemAtom, mockItem);

      const value = store.get(selectedItemValueAtom);
      expect(value).toEqual(mockItem);
    });

    it("別のアイテムで呼び出すと選択アイテムが置換されること", () => {
      store.set(selectItemAtom, mockItem);
      store.set(selectItemAtom, mockItem2);

      const value = store.get(selectedItemValueAtom);
      expect(value).toEqual(mockItem2);
    });

    it("アイテムを選択するとダイアログが開くこと", () => {
      store.set(selectItemAtom, mockItem);

      const isOpen = store.get(isDialogOpenAtom);
      expect(isOpen).toBe(true);
    });
  });

  describe("clearSelectionAtom アクション", () => {
    it("clearSelectionAtomを呼び出すと選択がクリアされること", () => {
      // まずアイテムを選択
      store.set(selectItemAtom, mockItem);
      expect(store.get(selectedItemValueAtom)).toEqual(mockItem);

      // 選択をクリア
      store.set(clearSelectionAtom);

      const value = store.get(selectedItemValueAtom);
      expect(value).toBeNull();
    });

    it("選択をクリアするとダイアログが閉じること", () => {
      // まずアイテムを選択してダイアログを開く
      store.set(selectItemAtom, mockItem);
      expect(store.get(isDialogOpenAtom)).toBe(true);

      // 選択をクリア
      store.set(clearSelectionAtom);

      const isOpen = store.get(isDialogOpenAtom);
      expect(isOpen).toBe(false);
    });

    it("何も選択されていない状態でclearSelectionAtomを呼んでもエラーにならないこと", () => {
      // 何も選択されていない状態でクリアを呼び出しても問題ないことを確認
      expect(() => store.set(clearSelectionAtom)).not.toThrow();
      expect(store.get(selectedItemValueAtom)).toBeNull();
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });
  });

  describe("selectedItemValueAtom 派生アトム", () => {
    it("読み取り専用で現在の選択を反映すること", () => {
      expect(store.get(selectedItemValueAtom)).toBeNull();

      store.set(selectItemAtom, mockItem);
      expect(store.get(selectedItemValueAtom)).toEqual(mockItem);

      store.set(clearSelectionAtom);
      expect(store.get(selectedItemValueAtom)).toBeNull();
    });
  });

  describe("isDialogOpenAtom 派生アトム", () => {
    it("アイテムが選択されていない時はfalseを返すこと", () => {
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });

    it("アイテムが選択されている時はtrueを返すこと", () => {
      store.set(selectItemAtom, mockItem);
      expect(store.get(isDialogOpenAtom)).toBe(true);
    });

    it("選択がクリアされた後はfalseを返すこと", () => {
      store.set(selectItemAtom, mockItem);
      store.set(clearSelectionAtom);
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });
  });

  describe("状態遷移シナリオ", () => {
    it("複数回の選択/クリアサイクルを正しく処理すること", () => {
      // サイクル1: アイテム1を選択
      store.set(selectItemAtom, mockItem);
      expect(store.get(selectedItemValueAtom)).toEqual(mockItem);
      expect(store.get(isDialogOpenAtom)).toBe(true);

      // サイクル1: クリア
      store.set(clearSelectionAtom);
      expect(store.get(selectedItemValueAtom)).toBeNull();
      expect(store.get(isDialogOpenAtom)).toBe(false);

      // サイクル2: アイテム2を選択
      store.set(selectItemAtom, mockItem2);
      expect(store.get(selectedItemValueAtom)).toEqual(mockItem2);
      expect(store.get(isDialogOpenAtom)).toBe(true);

      // サイクル2: クリア
      store.set(clearSelectionAtom);
      expect(store.get(selectedItemValueAtom)).toBeNull();
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });

    it("クリアせずに直接アイテムを置換できること", () => {
      store.set(selectItemAtom, mockItem);
      store.set(selectItemAtom, mockItem2);

      expect(store.get(selectedItemValueAtom)).toEqual(mockItem2);
      expect(store.get(isDialogOpenAtom)).toBe(true);
    });
  });
});
