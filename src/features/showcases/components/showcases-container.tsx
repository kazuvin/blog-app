"use client";

import { useShowcasesStore } from "../stores";
import type { ShowcaseItem } from "../types";
import { ShowcaseDialog } from "./showcase-dialog";
import { ShowcaseGrid } from "./showcase-grid";

export type ShowcasesContainerProps = {
  items: ShowcaseItem[];
};

export function ShowcasesContainer({ items }: ShowcasesContainerProps) {
  const displayItem = useShowcasesStore((s) => s.displayItem);
  const isDialogOpen = useShowcasesStore((s) => s.isDialogOpen);
  const selectItem = useShowcasesStore((s) => s.selectItem);
  const closeDialog = useShowcasesStore((s) => s.closeDialog);

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
