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

| Request Type                                   | Type                          | Location                       |
| ---------------------------------------------- | ----------------------------- | ------------------------------ |
| Button, Input, Card, Dialog                    | Presentation (shared)         | `src/components/ui/`           |
| Header, Main, Sidebar, Footer                  | Presentation (shared)         | `src/components/layout/`       |
| Feature-specific card / row / cell             | Presentation (feature-scope)  | `src/features/{f}/components/` |
| Blog list with URL params                      | Container                     | `src/features/blog/`           |
| Showcases with Zustand store                   | Container                     | `src/features/showcases/`      |

**Rules**:
1. Zustand store / data fetch / URL params / client-only hooks → **Container**
2. State-free + 2+ feature で使う → **Presentation (shared)** in `src/components/`
3. State-free + 1 feature 内のみ → **Presentation (feature-scope)** in `src/features/{f}/components/`

「将来使うかも」で feature 専用の presentation を `src/components/ui/` に置かない（primitive が feature 知識で汚染される元）。

## When to extract

最初から component を切り出さない。**callsite が増えてから決める**:

- **1 callsite** — JSX を inline で書く。component 化しない
- **2 callsites** — 同 feature 内なら inline 維持で良い（早期抽象化のリスクの方が大きい）
- **3 callsites** — extract する。場所は **実際の使われ方** で決める:
  - 1 feature 内のみ → `src/features/{f}/components/`
  - 2+ feature にまたがる → `src/components/ui/` に昇格

例外: domain を含まない完全に generic な primitive（Button / Input / Dialog）は 1 callsite 目から `ui/` で良い。判断基準は「**プロジェクト固有の知識を何も持たないか**」。

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

- [ ] Type (Container / Presentation) と Location (shared / feature-scope) を Decision Guide で確定
- [ ] 3 callsite 未満なら inline 維持を検討（When to extract）
- [ ] Correct directory, `{Name}Props` type, `index.ts` barrel export
- [ ] Server Component by default; `"use client"` only when needed
- [ ] User `className` merged **last** in `cn(...)`
- [ ] Props が 5+ なら composition (`children` / slot) を検討（react-patterns.md）
- [ ] Styles use semantic tokens per `.claude/rules/design.md`
- [ ] Zustand: selector per slice (see `zustand-pattern`)
