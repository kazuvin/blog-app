# Presentation Components

UI specifics: see [ui-components.md](ui-components.md). Hard rules (naming case, `any`, unused, hook rules, a11y, …) are enforced by `biome.jsonc` / `tsconfig.json`.

## Directory

```
src/components/
├── ui/        # Primitives (Button, Input, Card, Dialog, ...)
└── layout/    # Layout parts (Header, Main, ...)
```

## Naming

- Directory / file: kebab-case
- Component: PascalCase
- Props type: `{Name}Props` — export alongside the component

## Template

Styles use semantic tokens (see `.claude/rules/design.md`).

```tsx
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-md font-medium transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

const variantStyles = {
  primary: "bg-primary text-background hover:bg-primary-hover active:bg-primary-active",
  secondary: "bg-surface-elevated text-foreground border border-border hover:bg-surface-hover",
  ghost: "bg-transparent text-foreground hover:bg-surface-hover",
} as const;

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
} as const;
```

## Exports

```tsx
// components/ui/button/index.ts
export { Button } from "./button";
export type { ButtonProps } from "./button";
```

## Key Principles

1. Props in, render out — no internal data state, no API calls, no global store
2. Extend native HTML: `ComponentProps<"element">`
3. Accept `className`, merge with `cn()` — user `className` **last** so it wins
4. Typed variant union over boolean flags (`variant: "primary" | "ghost"`, not `isPrimary`)
5. `createContext` is OK for coordinating a compound component's sub-parts; not for app-wide data
6. No `forwardRef` (React 19: `ref` is in `ComponentProps`)

## Compound Components

Individual named exports — never `Card.Header` / `Dialog.Trigger`. See `Card` / `Dialog` 実装 in `src/components/ui/`.

## Templates

### Radix UI Wrapper

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  size?: "sm" | "md" | "lg" | "xl" | "full";
};

export function DialogContent({ className, size = "md", children, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Content className={cn(sizeStyles[size], className)} {...props}>
      {children}
    </DialogPrimitive.Content>
  );
}
```

### Storybook (`{name}.stories.tsx`)

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ComponentName } from "./component-name";

const meta = {
  title: "UI/ComponentName",
  component: ComponentName,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: "default" } };
```

### Vitest (`{name}.test.tsx`)

非自明なロジック（state / a11y / イベント）がある UI のみ追加。

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComponentName } from "./component-name";

describe("ComponentName", () => {
  it("renders children", () => {
    render(<ComponentName>Test</ComponentName>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
```
