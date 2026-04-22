---
paths: "**/*.tsx"
---

# Design system

Single source of truth: `src/app/globals.css` の `@theme` ブロック。トークンの具体値・dark 対応値はこの CSS を直接参照する（本文書では値を重複記載しない）。

## Colors

Semantic token families — light/dark は `.dark` セレクタで自動切替:

- **Surface**: `surface` / `-elevated` / `-hover` / `-pressed`
- **Content**: `foreground` / `muted`
- **Border**: `border`
- **Primary**: `primary` / `-hover` / `-active`
- **Status**: `success` / `warning` / `error` / `info`（soft chip は `{name}-soft` + `{name}-soft-fg`）
- **Accent**: `accent` / `accent-soft` / `accent-soft-fg`
- **Brand gradient**: `brand-{from,via,to}`（淡色版 `-soft`）

明度/透過バリエーションは opacity modifier で作る（例: `bg-primary/10`, `text-foreground/60`）。

## Typography

`--font-sans`（Geist Sans）と `--font-mono`（Geist Mono）。サイズ/ウェイトは Tailwind デフォルト utility (`text-sm`, `font-semibold` 等) をそのまま使う。

## Radius / Shadow / Animation

`--radius-{sm,md,lg}` / `--shadow-{sm,md}` / `--animate-*`（fade-in, pop, shake, draw 等）。詳細は `globals.css`。

## Components

既存 UI: `src/components/ui/*`。新規コンポーネント作成前に既存 variant で表現できないか必ず確認し、作る場合は `.claude/skills/component-creator/SKILL.md` の Decision Guide に従う。

## Interaction states

- Hover: `hover:bg-surface-hover` / `hover:opacity-90`
- Focus: `focus:ring-primary` / `outline-primary/30`
- Active: 単色トークンなら `{token}-active`（例: `bg-primary-active`）
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`

## Dark mode

`.dark` セレクタで `--color-*` が自動切替される。**`dark:` prefix は書かない**。

## Don'ts

- **Tailwind arbitrary value** (`bg-[#fff]`, `p-[13px]`, `min-h-[100px]`)
  → GritQL plugin が Biome lint error。`@theme` にトークン追加するか `@utility foo {...}` で utility 化する。
- **Tailwind 標準パレット** (`bg-red-500`, `from-indigo-400`)
  → `@theme { --color-*: initial; }` で utility 自体が生成されない。`bg-error` 等 semantic token を使う。
- **Inline `style={{...}}`**
  → className + token で表現。動的計算値（JS で測った幅など）のみ例外。

## Adding a new token

1. 既存トークン × opacity modifier で表現できないか再検討
2. できなければ `src/app/globals.css` の `@theme` に追加し `.dark` にも対応値を定義
3. utility として使用

## Examples

```tsx
// ❌ arbitrary value
<div className="min-h-[100px] bg-[#fff]" />
// ✅
<div className="min-h-100 bg-surface-elevated" />

// ❌ 標準パレット
<span className="text-red-500" />
// ✅
<span className="text-error" />

// ❌ dark: prefix
<div className="bg-white dark:bg-black" />
// ✅
<div className="bg-background text-foreground" />

// ❌ static inline style
<div style={{ color: "red", padding: "10px" }} />
// ✅
<div className="p-3 text-error" />

// ✅ 動的値のみ inline 許容
<div style={{ width: calculatedWidth }} />
```
