---
name: component-creator
description: React コンポーネント（UI プリミティブ / レイアウト / feature container）を新規作成・追加・リファクタリングするときに使用。Presentation は `src/components/`、Container（feature + Zustand store）は `src/features/` に配置。Container の store 設計は `zustand-pattern` skill と併用する。
---

# Component Creator

Related:
- **zustand-pattern** skill — container stores
- **`.claude/rules/design.md`** — design tokens (auto-loaded for `.tsx`)
- **`biome.jsonc`** / **`tsconfig.json`** — hard rules enforced by lint/tsc. Do NOT duplicate them in these docs; when lint reports a violation, fix the code.

## Decision Guide

| Request Type                  | Type         | Location                  |
| ----------------------------- | ------------ | ------------------------- |
| Button, Input, Card, Dialog   | Presentation | `src/components/ui/`      |
| Header, Main, Sidebar, Footer | Presentation | `src/components/layout/`  |
| Blog list with URL params     | Container    | `src/features/blog/`      |
| Showcases with Zustand store  | Container    | `src/features/showcases/` |

**Rule**: Zustand store / data fetch / URL params / client-only hooks → Container. Pure UI → Presentation.

## Existing UI Primitives

**SSoT**: `src/components/ui/` 配下のディレクトリ名が primitive の一覧、variant / size は各 `.tsx` の Props 型定義が真。新規作成前に必ず `src/components/ui/` を確認し既存で表現できないかチェック。skill 側には一覧を書かない（drift 防止）。

Compound コンポーネント（Card / Dialog / DropdownMenu / TabNav など）は **個別 named export** のみ — `<DialogTrigger />`、NOT `<Dialog.Trigger />`。

## Quick Start

### Presentation

```tsx
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn("rounded-md px-4 py-2", variantStyles[variant], className)}
      {...props}
    />
  );
}

const variantStyles = {
  primary: "bg-primary text-background hover:bg-primary-hover",
  secondary: "bg-surface-elevated text-foreground hover:bg-surface-hover",
} as const;
```

### Container (Zustand)

```tsx
"use client";
import { useShowcasesStore } from "../stores";

export function ShowcasesContainer() {
  const isDialogOpen = useShowcasesStore((s) => s.isDialogOpen);
  const closeDialog = useShowcasesStore((s) => s.closeDialog);
  // ...
}
```

Fine-grained selectors — one slice per `useStore` call. See **zustand-pattern**.

## References

- [presentation.md](references/presentation.md) — Presentation 規約 + Radix / Storybook / Vitest テンプレート
- [container.md](references/container.md) — Container + feature folder 構成
- [react-patterns.md](references/react-patterns.md) — lint で拾えない React 19 の判断基準

## Checklist

- [ ] Presentation or Container? (Decision Guide)
- [ ] Correct directory, `{Name}Props` type, `index.ts` barrel export
- [ ] Server Component by default; `"use client"` only when needed
- [ ] User `className` merged **last** in `cn(...)`
- [ ] Styles use semantic tokens per `.claude/rules/design.md`
- [ ] Zustand: selector per slice (see `zustand-pattern`)
