import { atom } from "jotai";
import type { ShowcaseItem } from "../types";

// ============================================
// Private Atoms (NEVER export)
// ============================================
const dialogOpenAtom = atom(false);
const selectedItemAtom = atom<ShowcaseItem | null>(null);

// ============================================
// Read-Only Exports
// ============================================
export const isDialogOpenAtom = atom((get) => get(dialogOpenAtom));
export const displayItemAtom = atom((get) => get(selectedItemAtom));

// ============================================
// Action Exports
// ============================================
export const selectItemAtom = atom(null, (_get, set, item: ShowcaseItem) => {
  set(selectedItemAtom, item);
  set(dialogOpenAtom, true);
});

export const closeDialogAtom = atom(null, (_get, set) => {
  set(dialogOpenAtom, false);
  // Keep selectedItem for close animation - will be replaced on next select
});
