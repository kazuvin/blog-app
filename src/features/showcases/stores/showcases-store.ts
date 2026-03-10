import { create } from "zustand";
import type { ShowcaseItem } from "../types";

type ShowcasesState = {
  // State
  isDialogOpen: boolean;
  displayItem: ShowcaseItem | null;
  // Actions
  selectItem: (item: ShowcaseItem) => void;
  closeDialog: () => void;
};

export const useShowcasesStore = create<ShowcasesState>((set) => ({
  // State
  isDialogOpen: false,
  displayItem: null,
  // Actions
  selectItem: (item) => set({ displayItem: item, isDialogOpen: true }),
  closeDialog: () => set({ isDialogOpen: false }),
  // Keep displayItem for close animation - will be replaced on next select
}));
