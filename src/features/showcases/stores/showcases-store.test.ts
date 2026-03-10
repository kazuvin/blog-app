import { beforeEach, describe, expect, it } from "vitest";
import type { ShowcaseItem } from "../types";
import { useShowcasesStore } from "./showcases-store";

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

describe("showcases-store", () => {
  beforeEach(() => {
    useShowcasesStore.setState({
      isDialogOpen: false,
      displayItem: null,
    });
  });

  describe("初期状態", () => {
    it("表示アイテムの初期値がnullであること", () => {
      expect(useShowcasesStore.getState().displayItem).toBeNull();
    });

    it("ダイアログが初期状態で閉じていること", () => {
      expect(useShowcasesStore.getState().isDialogOpen).toBe(false);
    });
  });

  describe("selectItem アクション", () => {
    it("selectItemを呼び出すとアイテムが設定されダイアログが開くこと", () => {
      useShowcasesStore.getState().selectItem(mockItem);

      expect(useShowcasesStore.getState().displayItem).toEqual(mockItem);
      expect(useShowcasesStore.getState().isDialogOpen).toBe(true);
    });

    it("別のアイテムで呼び出すとアイテムが置換されること", () => {
      useShowcasesStore.getState().selectItem(mockItem);
      useShowcasesStore.getState().selectItem(mockItem2);

      expect(useShowcasesStore.getState().displayItem).toEqual(mockItem2);
      expect(useShowcasesStore.getState().isDialogOpen).toBe(true);
    });
  });

  describe("closeDialog アクション", () => {
    it("closeDialogを呼び出すとダイアログが閉じること", () => {
      useShowcasesStore.getState().selectItem(mockItem);
      expect(useShowcasesStore.getState().isDialogOpen).toBe(true);

      useShowcasesStore.getState().closeDialog();

      expect(useShowcasesStore.getState().isDialogOpen).toBe(false);
    });

    it("ダイアログを閉じてもアイテムは保持されること（アニメーション用）", () => {
      useShowcasesStore.getState().selectItem(mockItem);
      expect(useShowcasesStore.getState().displayItem).toEqual(mockItem);

      useShowcasesStore.getState().closeDialog();

      // アイテムは保持される（閉じるアニメーション中に表示するため）
      expect(useShowcasesStore.getState().displayItem).toEqual(mockItem);
      expect(useShowcasesStore.getState().isDialogOpen).toBe(false);
    });

    it("何も選択されていない状態でcloseDialogを呼んでもエラーにならないこと", () => {
      expect(() => useShowcasesStore.getState().closeDialog()).not.toThrow();
      expect(useShowcasesStore.getState().displayItem).toBeNull();
      expect(useShowcasesStore.getState().isDialogOpen).toBe(false);
    });
  });

  describe("displayItem 状態", () => {
    it("現在のアイテムを正しく反映すること", () => {
      expect(useShowcasesStore.getState().displayItem).toBeNull();

      useShowcasesStore.getState().selectItem(mockItem);
      expect(useShowcasesStore.getState().displayItem).toEqual(mockItem);

      // closeDialogでもアイテムは保持される
      useShowcasesStore.getState().closeDialog();
      expect(useShowcasesStore.getState().displayItem).toEqual(mockItem);
    });
  });

  describe("isDialogOpen 状態", () => {
    it("初期状態ではfalseを返すこと", () => {
      expect(useShowcasesStore.getState().isDialogOpen).toBe(false);
    });

    it("アイテムを選択するとtrueを返すこと", () => {
      useShowcasesStore.getState().selectItem(mockItem);
      expect(useShowcasesStore.getState().isDialogOpen).toBe(true);
    });

    it("ダイアログを閉じた後はfalseを返すこと", () => {
      useShowcasesStore.getState().selectItem(mockItem);
      useShowcasesStore.getState().closeDialog();
      expect(useShowcasesStore.getState().isDialogOpen).toBe(false);
    });
  });

  describe("状態遷移シナリオ", () => {
    it("複数回の選択/閉じるサイクルを正しく処理すること", () => {
      // サイクル1: アイテム1を選択
      useShowcasesStore.getState().selectItem(mockItem);
      expect(useShowcasesStore.getState().displayItem).toEqual(mockItem);
      expect(useShowcasesStore.getState().isDialogOpen).toBe(true);

      // サイクル1: ダイアログを閉じる（アイテムは保持）
      useShowcasesStore.getState().closeDialog();
      expect(useShowcasesStore.getState().displayItem).toEqual(mockItem);
      expect(useShowcasesStore.getState().isDialogOpen).toBe(false);

      // サイクル2: アイテム2を選択（前のアイテムが置き換わる）
      useShowcasesStore.getState().selectItem(mockItem2);
      expect(useShowcasesStore.getState().displayItem).toEqual(mockItem2);
      expect(useShowcasesStore.getState().isDialogOpen).toBe(true);

      // サイクル2: ダイアログを閉じる
      useShowcasesStore.getState().closeDialog();
      expect(useShowcasesStore.getState().displayItem).toEqual(mockItem2);
      expect(useShowcasesStore.getState().isDialogOpen).toBe(false);
    });

    it("閉じずに直接アイテムを置換できること", () => {
      useShowcasesStore.getState().selectItem(mockItem);
      useShowcasesStore.getState().selectItem(mockItem2);

      expect(useShowcasesStore.getState().displayItem).toEqual(mockItem2);
      expect(useShowcasesStore.getState().isDialogOpen).toBe(true);
    });
  });
});
