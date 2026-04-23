---
paths: "**/*.tsx"
---

# Design system

**SSoT**: `src/app/globals.css` の `@theme` ブロックが全 token（色・typography・radius・shadow・animation）の唯一の真。使える token を知りたい時は常にそこを grep する。`.dark` セレクタで dark 値が自動切替される。

このドキュメントでは drift しない命名・使用ルールのみ扱う（値や token 名の列挙は置かない）。

## 命名・使用ルール

- **light/dark 切替は自動**: `.dark` セレクタで再定義されるので **`dark:` prefix は書かない**
- **淡色は opacity modifier**: `bg-primary/10`, `text-foreground/60`（新規トークン追加より先に検討）
- **Interaction state suffix**: 単色トークンは `-hover` / `-active` サフィックス（例: `bg-primary-active`）。surface 系は hover 用に `surface-hover` / `surface-pressed` を使う
- **Status の soft chip**: `{name}-soft`（背景）+ `{name}-soft-fg`（前景）のペアで使う
- **Typography**: サイズ・ウェイトは Tailwind 標準 utility (`text-sm`, `font-semibold` 等) を使う。カスタム font-family は globals.css の `--font-*` を参照

## Interaction states

- Hover: `hover:bg-surface-hover` / `hover:opacity-90`
- Focus: `focus:ring-primary` / `outline-primary/30`
- Active: 単色トークンは `{token}-active`（例: `bg-primary-active`）
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`

## Components

既存 UI: `src/components/ui/*`。新規コンポーネント作成前に既存 variant で表現できないか必ず確認し、作る場合は `.claude/skills/component-creator/SKILL.md` の Decision Guide に従う。

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
