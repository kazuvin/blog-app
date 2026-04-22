# Container Components (Features + Zustand)

Store shape, selector discipline, async actions: see **zustand-pattern** skill (not repeated here).

## Directory

```
src/features/{feature}/
├── components/     # Container + feature-local presentational
├── stores/         # Zustand stores
├── hooks/          # optional
├── data/           # optional static / seed
├── lib/            # optional feature helpers
├── types/
└── index.ts        # Public API
```

Real examples: `src/features/{blog,showcases,playgrounds}/`.

## Template

From `src/features/showcases/components/showcases-container.tsx`:

```tsx
"use client";
import { useShowcasesStore } from "../stores";
import type { ShowcaseItem } from "../types";
import { ShowcaseDialog } from "./showcase-dialog";
import { ShowcaseGrid } from "./showcase-grid";

export type ShowcasesContainerProps = { items: ShowcaseItem[] };

export function ShowcasesContainer({ items }: ShowcasesContainerProps) {
  const displayItem = useShowcasesStore((s) => s.displayItem);
  const isDialogOpen = useShowcasesStore((s) => s.isDialogOpen);
  const selectItem = useShowcasesStore((s) => s.selectItem);
  const closeDialog = useShowcasesStore((s) => s.closeDialog);

  return (
    <>
      <ShowcaseGrid items={items} onItemClick={selectItem} />
      <ShowcaseDialog
        item={displayItem}
        open={isDialogOpen}
        onOpenChange={(open) => { if (!open) closeDialog(); }}
      />
    </>
  );
}
```

One slice per `useStore` call — never destructure the whole store.

## Public API

```ts
// features/showcases/index.ts
export type { ShowcasesContainerProps } from "./components";
export { ShowcasesContainer } from "./components";
export { useShowcasesStore } from "./stores";
export type { ShowcaseItem } from "./types";
```

Export only what consumers need: container + Props type, store hook (if shared), domain types.

## Key Principles

1. Colocation: components / stores / hooks / types / data inside the feature folder
2. Container subscribes to store + dispatches actions; presentational children take plain props
3. `"use client"` required — `useStore` is a React hook
4. No `<Provider>` by default (Zustand is module-scoped global). Add one only for scoped multi-instance stores.
