---
name: motion-svg
description: Motion (framer-motion 後継) で SVG の path drawing / mask reveal / clipPath morph / scroll-linked など凝った演出を実装するときに使用。配置判断・reduced-motion 対応・パフォーマンスの落とし穴を含む。
---

# Motion + SVG patterns

Related:
- **`.claude/rules/design.md`** — token / `dark:` prefix / arbitrary value の禁則は SVG にも適用
- **component-creator** skill — どこに置くかの Decision Guide
- API surface の真は [motion.dev/docs](https://motion.dev/docs)。本 skill では列挙しない（drift 防止）

import は `motion/react`。Server Component では動かないので `"use client"` を付ける。

## まず動かすか判定する

演出は portfolio 価値を上げる手段であって、目的ではない。次の判定を先にする:

| 目的                                          | 動かす? | 代替                          |
| --------------------------------------------- | ------- | ----------------------------- |
| 状態遷移を視覚化（open/close, sort）           | ✅      | —                             |
| Hero / brand voice の第一印象                 | ✅      | static SVG + hover のみ       |
| ユーザーを待たせる間（loading）                | ✅      | spinner で足りるなら抑える     |
| 「なんかカッコいいから」（pure decoration）   | ❌      | static + cursor 反応のみ       |

**1 viewport に 1-2 演出が上限**。重ねると個々のインパクトが落ちる（portfolio として逆効果）。

## A11y は最初に決める

`useReducedMotion()` で必ず分岐。reduced 時は **最終状態を即描画** or **opacity fade のみ** に倒す。後付けではなく書き始めから。

## パターン選定

| 演出意図                                      | パターン               | 主軸                              |
| --------------------------------------------- | ---------------------- | --------------------------------- |
| 線を「描く」「icon が現れる」「署名」          | path drawing            | `motion.path` の `pathLength`     |
| Text / image が「拭われて」現れる              | mask reveal             | SVG `<mask>` を animate           |
| 矩形 / 円が「広がって」中身を見せる             | clipPath reveal         | CSS `clip-path` を animate        |
| 形がもう一つの形へ「変形」する                 | path morph              | `d` 補間（flubber 等の外部 lib）   |
| Scroll に同期した進行表現                     | scroll-linked           | `useScroll` + `useTransform`      |
| Hover で形が反応する                           | gesture                 | `whileHover` + spring transition  |

## ファイル配置

- 1 feature 専用 → feature 内に inline で書く。3 callsite 超えたら component 化（component-creator skill 参照）
- 再利用する SVG primitive（DrawnDivider / RevealText / AnimatedLogo 等）→ `src/components/ui/{name}/`
- どちらも `"use client"` 必須

## パターン実装

### Path drawing

`pathLength` は 0→1 を取る Motion 専用 prop。内部で `strokeDasharray` を計算する。

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export function DrawnArrow() {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 100 20" className="w-24 stroke-foreground">
      <motion.path
        d="M2 10 H90 M82 4 L96 10 L82 16"
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}
```

判断:
- 複数 path を順に描くなら `variants` + `staggerChildren`（個別に `delay` を計算しない）
- `strokeWidth` の同時 animate は GPU 化されないので避ける
- `viewBox` は固定、scale は親で。`preserveAspectRatio` を触ると比率が歪む

### Mask reveal

Mask はモノクロ — 白 = 表示、黒 = 隠す。

```tsx
"use client";
import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

export function WipeRevealText({ children }: { children: string }) {
  const id = useId();
  const reduce = useReducedMotion();
  if (reduce) return <span>{children}</span>;
  return (
    <svg viewBox="0 0 400 60" className="w-full">
      <defs>
        <mask id={id}>
          <motion.rect
            height={60}
            fill="white"
            initial={{ width: 0 }}
            animate={{ width: 400 }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
          />
        </mask>
      </defs>
      <text x={0} y={44} fontSize={48} mask={`url(#${id})`} className="fill-foreground">
        {children}
      </text>
    </svg>
  );
}
```

判断:
- mask id は **`useId()` で生成**。hardcode は複数インスタンスで衝突する（後勝ちで全部消える等のバグ源）
- 文字 1 行を一方向にワイプするだけなら CSS `clip-path: inset(...)` の方が軽い
- 画像を不規則な形でくり抜く時こそ SVG mask の出番

### clipPath reveal

CSS `clip-path` は GPU で動く。重い演出はまずこれで実装できないか検討。

```tsx
"use client";
import { motion } from "motion/react";
import { type ReactNode } from "react";

export function CornerReveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

判断:
- `inset` 同士、`circle` 同士など **同じ形状関数間** で animate。跨ぐと jump する
- SVG の `<clipPath>` 要素は raster image を不規則形でくり抜くときのみ。矩形 / 円なら CSS で十分

### Scroll-linked

scroll 進行度 0→1 を MotionValue で取る。値を style に渡せば re-render しない。

```tsx
"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function ScrollDrawnLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div ref={ref} className="h-screen">
      <svg viewBox="0 0 100 100" className="sticky top-0 h-screen w-full stroke-foreground">
        <motion.path d="M0 50 Q50 0 100 50" fill="none" strokeWidth={2} style={{ pathLength }} />
      </svg>
    </div>
  );
}
```

判断:
- `animate` ではなく `style={{ ... }}` に MotionValue を渡す。値変更で React 再 render しないので軽い
- `offset` は trigger range の指定。viewport を完全に通過させるなら `["start end", "end start"]`

## Don'ts

- Tailwind arbitrary value で animation 値を埋め込む（design rule 違反）→ token か数値 prop で渡す
- `dark:` prefix を `stroke-` / `fill-` に書く → semantic token (`stroke-foreground` 等) で auto 切替
- mask id を hardcode で複数箇所に同じ値 → `useId()` で生成
- 重い props（`d` / `strokeWidth` / `filter`）を毎フレーム animate → MotionValue + `style` で迂回するか pattern を変える
- 1 viewport に 3+ 演出を載せる → 個々が薄まる。1-2 に絞る

## Checklist

- [ ] 動かす意図が decoration ではなく機能・表現として正当化できるか
- [ ] `useReducedMotion()` で reduced 状態を最初から分岐したか
- [ ] 複数インスタンス想定なら mask id を `useId()` で生成したか
- [ ] `"use client"` を付けたか
- [ ] stroke / fill は semantic token を使ったか（`dark:` を書いていないか）
- [ ] heavy props を avoid、または scroll-linked で MotionValue 経由にしたか
- [ ] 同 viewport の演出数が 1-2 に収まっているか
