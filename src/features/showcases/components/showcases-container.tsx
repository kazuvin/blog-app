"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { Container } from "@/components/ui/container";
import {
  selectedItemValueAtom,
  isDialogOpenAtom,
  selectItemAtom,
  clearSelectionAtom,
} from "../stores";
import { type ShowcaseItem } from "../types";
import { ShowcaseDialog } from "./showcase-dialog";
import { ShowcaseGrid } from "./showcase-grid";

export type ShowcasesContainerProps = {
  items: ShowcaseItem[];
};

export function ShowcasesContainer({ items }: ShowcasesContainerProps) {
  const selectedItem = useAtomValue(selectedItemValueAtom);
  const isDialogOpen = useAtomValue(isDialogOpenAtom);
  const selectItem = useSetAtom(selectItemAtom);
  const clearSelection = useSetAtom(clearSelectionAtom);

  return (
    <Container>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-bold">Component Showcases</h1>
          <p className="text-foreground/70">
            A collection of presentation components for verification and testing purposes.
          </p>
        </div>

        <ShowcaseGrid items={items} onItemClick={selectItem} />

        <ShowcaseDialog
          item={selectedItem}
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) clearSelection();
          }}
        />
      </div>
    </Container>
  );
}
