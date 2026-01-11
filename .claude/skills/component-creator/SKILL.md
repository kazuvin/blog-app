---
name: component-creator
description: Create React components following project conventions. Use when asked to create, add, or build components, UI elements, or features. Handles both presentation components (src/components/) and container/feature components (src/features/ with Jotai). For container components, also use jotai-patterns skill for atom design. For styling, also use project-design skill for design tokens.
---

# Component Creator

Create React components following this project's architecture:

**Related skills** (invoke these skills when applicable):

- **jotai-patterns**: Invoke for atom design in container components
- **project-design**: Invoke for styling decisions (color tokens, component patterns)

- **Presentation components** → `src/components/` (stateless UI)
- **Container components** → `src/features/` (stateful, Jotai-powered)

## Decision Guide

| Request Type                 | Component Type | Location                  |
| ---------------------------- | -------------- | ------------------------- |
| Button, Input, Card, Modal   | Presentation   | `src/components/ui/`      |
| Header, Footer, Sidebar      | Presentation   | `src/components/layout/`  |
| Login form with auth logic   | Container      | `src/features/auth/`      |
| Dashboard with data fetching | Container      | `src/features/dashboard/` |
| User profile with state      | Container      | `src/features/user/`      |

**Rule of thumb**: If it needs Jotai atoms or API calls → Container. If it's pure UI → Presentation.

## 既存UIコンポーネント

新しいUIコンポーネントを作成する前に、既存コンポーネントのパターンを確認:

| Component | Variants                               | Sizes      | 複合パターン                                                              |
| --------- | -------------------------------------- | ---------- | ------------------------------------------------------------------------- |
| Button    | primary, secondary, ghost              | sm, md, lg | -                                                                         |
| Card      | default, outline                       | -          | CardHeader, CardContent, CardFooter                                       |
| Input     | default, error                         | sm, md, lg | -                                                                         |
| Badge     | default, success, warning, error, info | sm, md     | -                                                                         |
| Label     | -                                      | -          | -                                                                         |
| Dialog    | default, alert                         | sm, md, lg | DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogDescription |

詳細は [references/ui-components.md](references/ui-components.md) を参照。

## Quick Start

### Presentation Component

```tsx
// src/components/ui/button/button.tsx
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button className={cn("rounded-md px-4 py-2", variantStyles[variant], className)} {...props} />
  );
}

const variantStyles = {
  primary: "bg-primary text-white hover:opacity-90 transition-opacity",
  secondary: "bg-surface text-foreground border border-border hover:bg-border/50 transition-colors",
} as const;
```

### Container Component

> **Note**: Atom設計は **jotai-patterns** skill を併用すること。

```tsx
// src/features/auth/components/login-form.tsx
"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { isLoadingAtom, loginAtom } from "../stores/auth-atoms";

export function LoginForm() {
  const isLoading = useAtomValue(isLoadingAtom);
  const login = useSetAtom(loginAtom);
  // ... render with state
}
```

## Detailed Patterns

- **Presentation components**: See [references/presentation.md](references/presentation.md)
- **UI component catalog**: See [references/ui-components.md](references/ui-components.md) - 既存コンポーネント、スタイルパターン、Storybook/テストのテンプレート
- **Container components + Jotai**: See [references/container.md](references/container.md)

## Checklist

Before creating a component:

1. [ ] Determine type: Presentation or Container?
2. [ ] Check correct directory location
3. [ ] Follow naming conventions (kebab-case files, PascalCase components)
4. [ ] Create `index.ts` for exports
5. [ ] Add `"use client"` if using hooks (Container components)
6. [ ] Use design tokens from **project-design** skill for styling (colors, spacing)
