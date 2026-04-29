---
paths: "**/*.tsx"
---

# Animation system

`.tsx` で animation を書く前に、まず **4 layer のどれか** を決める。tool 選定は layer から自動的に決まる。混ぜると drift する。

Related:
- **`.claude/rules/design.md`** — token / `dark:` prefix 禁止 / arbitrary value 禁止 は animation の値にも適用
- **`.claude/skills/motion-svg`** — Layer 4（演出 / SVG）の実装パターン
- **`src/app/globals.css`** — Layer 1 / 3 の SSoT（`--animate-*` token, `@keyframes`, transition utility）

## 4 layer

| Layer | 目的 | 例 | tool | 置き場所 |
|---|---|---|---|---|
| **1. State transition** | variant / state の色・形・spacing 切替 | hover, focus ring, variant 色 | **CSS `transition-*`** | `globals.css` の utility / token |
| **2. Layout interpolation** | DOM 出入り・サイズ自動補間 | text 幅 morph, accordion, list reorder, modal mount/unmount, 共有 indicator | **Motion `layout` / `layoutId` / `<AnimatePresence>`** | コンポーネント内 inline |
| **3. Scripted entrance / micro** | mount または trigger 時の固定 keyframe | check-bounce, shake, fade-in-up, draw, pulse, spin | **CSS `@keyframes` + `--animate-*` token** | `globals.css` |
| **4. 演出 / brand motion** | decoration, hero, signature, scroll-linked, gesture | wordmark, mask reveal, scroll-linked path | **Motion (+ SVG)** | `src/components/graphics/` or feature 内 |

## 判別フロー

書く前に上から順に自問する。最初に Yes になった layer に倒す:

1. **`auto` ⇄ pixel / DOM の出入り を自動補間する必要があるか？**
   → Yes → **Layer 2 (motion)**
2. **scroll / drag / 連続値 と同期する必要があるか？ あるいは brand voice の独立した演出か？**
   → Yes → **Layer 4 (motion)**
3. **mount / trigger で再生する固定 keyframe か？**
   → Yes → **Layer 3 (CSS keyframe + token)**
4. それ以外（discrete な state 切替・hover・focus）
   → **Layer 1 (CSS transition)**

→ Motion を引っ張り出すのは **Layer 2 / 4 のみ**。それ以外はすべて CSS を default。逆に「motion で書きたい」を理由に Layer 1 / 3 を motion 化しないこと。

## SSoT 配置

| Layer | SSoT | アクセス |
|---|---|---|
| 1 | `globals.css` の `transition-*` utility & duration / easing token | `transition-{prop} duration-300 ease-default` |
| 3 | `globals.css` の `--animate-{name}` + `@keyframes {name}` | `animate-{name}` utility |
| 2, 4 | コンポーネントに inline（共有しない原則）。複数 callsite で再利用するなら `src/components/ui/` か `src/components/graphics/` に primitive 化 | `motion.*` / `<AnimatePresence>` |

**Layer 1 / 3 は globals.css に集中、Layer 2 / 4 は component に分散** が原則。混ざるのは drift の元。

## Layer 2 を書く時の判断

- **要素の出入り** → `<AnimatePresence>` で wrap、子に `key`、`initial` / `animate` / `exit` を定義
- **サイズが auto で変わる** → 親 or 当該要素に `layout` prop（width/height/padding を勝手に補間）
- **離れた要素間でモーション共有**（tab indicator, hero → detail の continuous element）→ 同じ `layoutId` を持つ要素を片方だけ render する
- `<AnimatePresence mode="wait">` は前の要素を完全に exit してから新しい要素を enter させたい時のみ。default の同時遷移で十分なケースが多い
- `useReducedMotion()` で reduced 時は `transition={{ duration: 0 }}` に落として layout jump を即座にする

## Layer 3 を書く時の判断

- まず `globals.css` の既存 `--animate-*` で表現できないか確認。できれば `animate-{name}` utility を当てるだけ
- 新規追加は `globals.css` に `@keyframes` + `--animate-{name}: name 0.4s ease ...` を足す。コンポーネント内に keyframe を書かない
- trigger は class toggle（`isActive ? "animate-pop" : ""`）or `data-[state=*]:animate-*`（Radix 系）

## Layer 1 を書く時の判断

- 単純な hover / focus / discrete state 切替なら `transition-colors duration-200` 程度で十分
- `transition-all` は安易に使わない（width / height など layout property も巻き込んで毎フレーム reflow）。**変更する property を限定**（`transition-colors` / `transition-opacity` / `transition-transform`）
- duration / easing は token を使う（`duration-300`, `ease-default`, `ease-spring`）

## Don'ts

- **Layer 2 を CSS で頑張る**（width 計測 + ResizeObserver + `style={{ width }}`）→ motion `layout` で済む
- **Layer 1 / 3 を motion で書く**（color 切替で `<motion.div animate={{ backgroundColor: ... }}>`）→ CSS `transition-colors` で十分。motion を main thread に乗せる理由がない
- **`transition-all` で layout property を巻き込む** → property を限定
- **`@keyframes` をコンポーネントの `<style>` や inline で書く** → globals.css に集約
- **`useReducedMotion()` を後付け** → Layer 2 / 4 は最初から分岐

## Checklist

- [ ] 4 layer のどれか identify したか
- [ ] Layer 2 / 4 でのみ motion を使い、Layer 1 / 3 は CSS に倒したか
- [ ] Layer 3 の keyframe は `globals.css` に集約したか（コンポーネント内に書いていないか）
- [ ] `transition-all` で不要な property を巻き込んでいないか
- [ ] Layer 2 / 4 で `useReducedMotion()` を最初から分岐したか
- [ ] motion を使う component に `"use client"` を付けたか
