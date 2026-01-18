"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { closeDialogAtom, displayItemAtom, isDialogOpenAtom, selectItemAtom } from "../stores";
import type { ShowcaseItem } from "../types";
import { ShowcaseDialog } from "./showcase-dialog";
import { ShowcaseGrid } from "./showcase-grid";

export type ShowcasesContainerProps = {
  items: ShowcaseItem[];
};

export function ShowcasesContainer({ items }: ShowcasesContainerProps) {
  const displayItem = useAtomValue(displayItemAtom);
  const isDialogOpen = useAtomValue(isDialogOpenAtom);
  const selectItem = useSetAtom(selectItemAtom);
  const closeDialog = useSetAtom(closeDialogAtom);

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl text-foreground">Component Showcases</h1>
        <p className="text-foreground/70">
          A collection of presentation components for verification and testing purposes.
        </p>
      </div>

      <ShowcaseGrid items={items} onItemClick={selectItem} />

      <ShowcaseDialog
        item={displayItem}
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      />
    </>
  );
}
