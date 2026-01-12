# UI Component Catalog

このプロジェクトの `src/components/ui/` に実装されているコンポーネントのリファレンス。

## 既存コンポーネント一覧

| Component | Variants                               | Sizes      | 特徴                                                  |
| --------- | -------------------------------------- | ---------- | ----------------------------------------------------- |
| Button    | primary, secondary, ghost              | sm, md, lg | 基本ボタン                                            |
| Card      | default, outline                       | -          | 複合パターン (CardHeader, CardContent, CardFooter)    |
| Input     | default, error                         | sm, md, lg | `inputSize` prop使用 (HTML size属性との衝突回避)      |
| Badge     | default, success, warning, error, info | sm, md     | インラインバッジ                                      |
| Label     | -                                      | -          | `required` propで赤いアスタリスク                     |
| Dialog    | default, alert                         | sm, md, lg | 複合パターン、ESC/オーバーレイクリック対応            |
| Header    | -                                      | -          | 複合パターン (HeaderLogo, HeaderNav, HeaderNavItem等) |
| Container | -                                      | sm~full    | Tailwind .container 相当のユーティリティ              |

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

## 複合コンポーネントパターン (shadcn形式)

このプロジェクトでは **shadcn形式**（個別エクスポート）を採用。

**なぜshadcn形式を採用するか:**

- Tree-shaking が効きやすい
- 必要なものだけ明示的にインポート
- IDE 補完がより直接的

```tsx
// ✅ shadcn形式（採用）
import { Dialog, DialogTrigger, DialogContent } from "@/components";

// ❌ RadixUI形式（不採用）
import { Dialog } from "@/components";
<Dialog.Trigger />;
```

### 複合コンポーネントの実装例

```tsx
// header.tsx - 各コンポーネントを個別の関数として定義
export function Header({ className, children, ...props }: HeaderProps) {
  return (
    <header className={cn("...", className)} {...props}>
      {children}
    </header>
  );
}

export function HeaderLogo({ href = "/", className, children, ...props }: HeaderLogoProps) {
  return (
    <Link href={href} className={cn("...", className)} {...props}>
      {children}
    </Link>
  );
}

export function HeaderNav({ className, children, ...props }: HeaderNavProps) {
  return (
    <nav className={cn("...", className)} {...props}>
      {children}
    </nav>
  );
}
```

### 複合コンポーネントの使用例

```tsx
import {
  Header,
  HeaderLogo,
  HeaderNav,
  HeaderNavList,
  HeaderNavItem,
  HeaderGitHubLink,
} from "@/components";

<Header>
  <HeaderLogo>My Blog</HeaderLogo>
  <HeaderNav>
    <HeaderNavList>
      <HeaderNavItem href="/">Home</HeaderNavItem>
      <HeaderNavItem href="/blog">Blog</HeaderNavItem>
    </HeaderNavList>
    <HeaderGitHubLink url="https://github.com" />
  </HeaderNav>
</Header>;
```

## Radix UI ラッパーパターン

Radix UI プリミティブをラップする場合も通常の関数コンポーネントとして実装。
React 19 では `ref` は `ComponentProps` に含まれるため、`{...props}` で自動的に渡される。

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type ComponentProps } from "react";

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  size?: "sm" | "md" | "lg";
};

// forwardRef は不要。{...props} で ref も渡される
export function DialogContent({ className, size = "md", children, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Content className={cn(sizeStyles[size], className)} {...props}>
      {children}
    </DialogPrimitive.Content>
  );
}
```

## Storybookパターン

### 単純なコンポーネント

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
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
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: "default", children: "Content" },
};
```

### 複合コンポーネント

複合コンポーネントでは `render` 関数を使用：

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header, HeaderLogo, HeaderNav, HeaderNavList, HeaderNavItem } from "./header";

const meta = {
  title: "UI/Header",
  component: Header,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Header>
      <HeaderLogo>My Blog</HeaderLogo>
    </Header>
  ),
};

export const WithNavigation: Story = {
  render: () => (
    <Header>
      <HeaderLogo>My Blog</HeaderLogo>
      <HeaderNav>
        <HeaderNavList>
          <HeaderNavItem href="/">Home</HeaderNavItem>
          <HeaderNavItem href="/blog">Blog</HeaderNavItem>
        </HeaderNavList>
      </HeaderNav>
    </Header>
  ),
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
// src/components/ui/header/index.ts
export {
  Header,
  HeaderLogo,
  HeaderNav,
  HeaderNavList,
  HeaderNavItem,
  HeaderAction,
  HeaderGitHubLink,
} from "./header";

export type {
  HeaderProps,
  HeaderLogoProps,
  HeaderNavProps,
  HeaderNavListProps,
  HeaderNavItemProps,
  HeaderActionProps,
  HeaderGitHubLinkProps,
} from "./header";
```

```tsx
// src/components/ui/index.ts (ルートバレル)
export * from "./button";
export * from "./card";
export * from "./container";
export * from "./dialog";
export * from "./header";
export * from "./input";
export * from "./badge";
export * from "./label";
```
