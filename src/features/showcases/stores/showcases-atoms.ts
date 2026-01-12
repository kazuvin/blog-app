import { atom } from "jotai";
import { type ShowcaseItem } from "../types";

// ============================================
// Private Atoms (NEVER export)
// ============================================
const selectedItemAtom = atom<ShowcaseItem | null>(null);

// ============================================
// Read-Only Exports
// ============================================
export const selectedItemValueAtom = atom((get) => get(selectedItemAtom));
export const isDialogOpenAtom = atom((get) => get(selectedItemAtom) !== null);

// ============================================
// Action Exports
// ============================================
export const selectItemAtom = atom(null, (_get, set, item: ShowcaseItem) => {
  set(selectedItemAtom, item);
});

export const clearSelectionAtom = atom(null, (_get, set) => {
  set(selectedItemAtom, null);
});
