import { atom } from "jotai";

/**
 * サイト検索の状態管理
 *
 * Jotaiパターン: プリミティブatomはprivate、派生atomのみexport
 */

// ===========================================
// Private Atoms (NEVER export)
// ===========================================

/** 検索ダイアログの開閉状態 */
const searchOpenAtom = atom(false);

// ===========================================
// Read-Only Exports
// ===========================================

/** 検索ダイアログの開閉状態（読み取り専用） */
export const searchOpenValueAtom = atom((get) => get(searchOpenAtom));

// ===========================================
// Action Exports
// ===========================================

/** 検索ダイアログを開く */
export const openSearchAtom = atom(null, (_get, set) => {
  set(searchOpenAtom, true);
});

/** 検索ダイアログを閉じる */
export const closeSearchAtom = atom(null, (_get, set) => {
  set(searchOpenAtom, false);
});

/** 検索ダイアログの開閉をトグル */
export const toggleSearchAtom = atom(null, (get, set) => {
  set(searchOpenAtom, !get(searchOpenAtom));
});

/** 検索ダイアログの開閉状態を設定 */
export const setSearchOpenAtom = atom(null, (_get, set, open: boolean) => {
  set(searchOpenAtom, open);
});
