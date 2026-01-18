import { createStore } from "jotai";
import { beforeEach, describe, expect, it } from "vitest";
import type { ShowcaseItem } from "../types";
import {
  closeDialogAtom,
  displayItemAtom,
  isDialogOpenAtom,
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
    it("表示アイテムの初期値がnullであること", () => {
      const value = store.get(displayItemAtom);
      expect(value).toBeNull();
    });

    it("ダイアログが初期状態で閉じていること", () => {
      const isOpen = store.get(isDialogOpenAtom);
      expect(isOpen).toBe(false);
    });
  });

  describe("selectItemAtom アクション", () => {
    it("selectItemAtomを呼び出すとアイテムが設定されダイアログが開くこと", () => {
      store.set(selectItemAtom, mockItem);

      expect(store.get(displayItemAtom)).toEqual(mockItem);
      expect(store.get(isDialogOpenAtom)).toBe(true);
    });

    it("別のアイテムで呼び出すとアイテムが置換されること", () => {
      store.set(selectItemAtom, mockItem);
      store.set(selectItemAtom, mockItem2);

      expect(store.get(displayItemAtom)).toEqual(mockItem2);
      expect(store.get(isDialogOpenAtom)).toBe(true);
    });
  });

  describe("closeDialogAtom アクション", () => {
    it("closeDialogAtomを呼び出すとダイアログが閉じること", () => {
      // まずアイテムを選択してダイアログを開く
      store.set(selectItemAtom, mockItem);
      expect(store.get(isDialogOpenAtom)).toBe(true);

      // ダイアログを閉じる
      store.set(closeDialogAtom);

      expect(store.get(isDialogOpenAtom)).toBe(false);
    });

    it("ダイアログを閉じてもアイテムは保持されること（アニメーション用）", () => {
      // アイテムを選択
      store.set(selectItemAtom, mockItem);
      expect(store.get(displayItemAtom)).toEqual(mockItem);

      // ダイアログを閉じる
      store.set(closeDialogAtom);

      // アイテムは保持される（閉じるアニメーション中に表示するため）
      expect(store.get(displayItemAtom)).toEqual(mockItem);
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });

    it("何も選択されていない状態でcloseDialogAtomを呼んでもエラーにならないこと", () => {
      expect(() => store.set(closeDialogAtom)).not.toThrow();
      expect(store.get(displayItemAtom)).toBeNull();
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });
  });

  describe("displayItemAtom 派生アトム", () => {
    it("読み取り専用で現在のアイテムを反映すること", () => {
      expect(store.get(displayItemAtom)).toBeNull();

      store.set(selectItemAtom, mockItem);
      expect(store.get(displayItemAtom)).toEqual(mockItem);

      // closeDialogでもアイテムは保持される
      store.set(closeDialogAtom);
      expect(store.get(displayItemAtom)).toEqual(mockItem);
    });
  });

  describe("isDialogOpenAtom 派生アトム", () => {
    it("初期状態ではfalseを返すこと", () => {
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });

    it("アイテムを選択するとtrueを返すこと", () => {
      store.set(selectItemAtom, mockItem);
      expect(store.get(isDialogOpenAtom)).toBe(true);
    });

    it("ダイアログを閉じた後はfalseを返すこと", () => {
      store.set(selectItemAtom, mockItem);
      store.set(closeDialogAtom);
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });
  });

  describe("状態遷移シナリオ", () => {
    it("複数回の選択/閉じるサイクルを正しく処理すること", () => {
      // サイクル1: アイテム1を選択
      store.set(selectItemAtom, mockItem);
      expect(store.get(displayItemAtom)).toEqual(mockItem);
      expect(store.get(isDialogOpenAtom)).toBe(true);

      // サイクル1: ダイアログを閉じる（アイテムは保持）
      store.set(closeDialogAtom);
      expect(store.get(displayItemAtom)).toEqual(mockItem);
      expect(store.get(isDialogOpenAtom)).toBe(false);

      // サイクル2: アイテム2を選択（前のアイテムが置き換わる）
      store.set(selectItemAtom, mockItem2);
      expect(store.get(displayItemAtom)).toEqual(mockItem2);
      expect(store.get(isDialogOpenAtom)).toBe(true);

      // サイクル2: ダイアログを閉じる
      store.set(closeDialogAtom);
      expect(store.get(displayItemAtom)).toEqual(mockItem2);
      expect(store.get(isDialogOpenAtom)).toBe(false);
    });

    it("閉じずに直接アイテムを置換できること", () => {
      store.set(selectItemAtom, mockItem);
      store.set(selectItemAtom, mockItem2);

      expect(store.get(displayItemAtom)).toEqual(mockItem2);
      expect(store.get(isDialogOpenAtom)).toBe(true);
    });
  });
});
