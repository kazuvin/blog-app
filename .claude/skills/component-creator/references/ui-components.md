# UI Component Catalog

このプロジェクトの `src/components/ui/` に実装されているコンポーネントのリファレンス。

## 既存コンポーネント一覧

| Component | Variants                               | Sizes      | 特徴                                               |
| --------- | -------------------------------------- | ---------- | -------------------------------------------------- |
| Button    | primary, secondary, ghost              | sm, md, lg | 基本ボタン                                         |
| Card      | default, outline                       | -          | 複合パターン (CardHeader, CardContent, CardFooter) |
| Input     | default, error                         | sm, md, lg | `inputSize` prop使用 (HTML size属性との衝突回避)   |
| Badge     | default, success, warning, error, info | sm, md     | インラインバッジ                                   |
| Label     | -                                      | -          | `required` propで赤いアスタリスク                  |
| Dialog    | default, alert                         | sm, md, lg | 複合パターン、ESC/オーバーレイクリック対応         |

## ファイル構造

```
src/components/ui/{component-name}/
├── {component-name}.tsx          # メイン実装
├── {component-name}.stories.tsx  # Storybook
├── {component-name}.test.tsx     # テスト
└── index.ts                      # バレルエクスポート
```

## スタイルパターン

### 基本スタイル（全コンポーネント共通）

```tsx
const baseStyles =
  "rounded-md transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none";
const disabledStyles = "disabled:cursor-not-allowed disabled:opacity-50";
```

### Variant/Sizeの定義パターン

```tsx
const variantStyles = {
  primary: "bg-foreground text-background hover:opacity-90 focus:ring-foreground",
  secondary:
    "bg-transparent text-foreground border border-foreground/20 hover:bg-foreground/5 focus:ring-foreground",
  ghost: "bg-transparent text-foreground hover:bg-foreground/10 focus:ring-foreground",
} as const;

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
} as const;
```

### CSS変数の使い方

```css
/* グローバルで定義済み */
--background: #ffffff; /* ダークモード: #0a0a0a */
--foreground: #171717; /* ダークモード: #ededed */
```

```tsx
// Tailwindでの使用
"bg-background"; // 背景色
"text-foreground"; // テキスト色
"border-foreground/20"; // 20%透明度のボーダー
"bg-foreground/10"; // 10%透明度の背景
```

## 複合コンポーネントパターン (Card, Dialog)

```tsx
// 親コンポーネント
export function Dialog({
  open,
  onOpenChange,
  variant = "default",
  size = "md",
  children,
}: DialogProps) {
  // ...
}

// サブコンポーネント
export function DialogHeader({ className, children, ...props }: DialogHeaderProps) {
  return (
    <div className={cn("border-foreground/10 border-b px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function DialogContent({ className, children, ...props }: DialogContentProps) {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function DialogFooter({ className, children, ...props }: DialogFooterProps) {
  return (
    <div className={cn("flex justify-end gap-2 px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}
```

## Storybookパターン

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ComponentName } from "./component-name";

const meta = {
  title: "UI/ComponentName",
  component: ComponentName,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["option1", "option2"],
      description: "スタイルバリエーション",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "サイズ",
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基本ストーリー
export const Default: Story = {
  args: { variant: "default", children: "Content" },
};

// 全バリアント表示
export const AllVariants: Story = {
  render: () => <div className="flex flex-col gap-4">{/* 各バリアントを表示 */}</div>,
};
```

## テストパターン

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ComponentName } from "./component-name";

describe("ComponentName", () => {
  it("renders correctly", () => {
    render(<ComponentName>Test</ComponentName>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<ComponentName variant="primary">Test</ComponentName>);
    expect(screen.getByText("Test")).toHaveClass("bg-foreground");
  });

  it("applies custom className", () => {
    render(<ComponentName className="custom-class">Test</ComponentName>);
    expect(screen.getByText("Test")).toHaveClass("custom-class");
  });

  it("handles events", () => {
    const onClick = vi.fn();
    render(<ComponentName onClick={onClick}>Test</ComponentName>);
    fireEvent.click(screen.getByText("Test"));
    expect(onClick).toHaveBeenCalled();
  });
});
```

## index.ts エクスポートパターン

```tsx
// src/components/ui/dialog/index.ts
export {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";
export type {
  DialogProps,
  DialogHeaderProps,
  DialogContentProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
} from "./dialog";
```

```tsx
// src/components/ui/index.ts (ルートバレル)
export * from "./button";
export * from "./card";
export * from "./input";
export * from "./badge";
export * from "./label";
export * from "./dialog";
```
