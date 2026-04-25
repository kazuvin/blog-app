---
name: design-grader
description: "UI コンポーネント / 画面の視覚設計を rubric で採点する reviewer skill。component-creator が作った成果物、または既存 UI を評価する時に使う。Anthropic の generator/evaluator 分離に基づき、生成側のバイアスを避けるため別セッションでの起動を推奨。"
argument-hint: "[file or dir]"
paths: "**/*.tsx"
---

# Design Grader

`.claude/rules/design.md`（禁則）と `component-creator`（How）に対置する **採点側** の skill。「良い UI か」を rubric 化して、主観を避けて評価する。

**使い方:**
- 主会話で: `/design-grader src/components/ui/button/button.tsx`
- 単体レビュー: 成果物の path を渡す
- 広域レビュー: `src/components/ui/` のような dir を渡す

対象 `$ARGUMENTS` を Read/Grep で精読し、下記 rubric で採点する。

## 前提コンテキスト（必ず確認）

1. `src/app/globals.css` の `@theme` ブロック — 使える token の SSoT
2. `.claude/rules/design.md` — 禁則（arbitrary value / 標準パレット / `dark:` prefix / inline style / semantic token の命名規約）
3. `biome.jsonc` の GritQL plugin — arbitrary value は既に lint error

## Rubric（各 0–3、合計 33 点満点）

| # | 項目 | 0 (Fail) | 1 (Weak) | 2 (OK) | 3 (Strong) |
|---|------|----------|----------|--------|------------|
| 1 | **Token consistency** | arbitrary value / 標準パレット混在 | 一部 ad-hoc utility | semantic token のみ、淡色は opacity modifier | さらに意味が伝わる命名（`surface-elevated` 等）を正しく選択 |
| 2 | **Hierarchy** | 強弱なし、全て同じ重み | 強弱はあるが優先順位が曖昧 | 主 CTA / 補助 / 無地が視覚で区別できる | アイコン・size・color を組合せて無意識に従う導線 |
| 3 | **Spacing rhythm** | ad-hoc padding/margin | 4/8 base scale からズレ | Tailwind spacing scale に沿う（`p-4`, `gap-3` 等） | 階層ごとに 8→16→24 の比例関係 |
| 4 | **Typography** | inline font / 任意 size | `text-*` utility だが choice がバラバラ | 3-4 レベル以内に収まる（title/body/caption） | line-height / tracking も用途に応じて調整 |
| 5 | **Interaction state** | hover 無し | hover のみ | hover + focus-visible + active + disabled | さらに motion（`transition-*`）で状態変化が滑らか |
| 6 | **Accessibility** | `alt` / `aria-*` 欠落 | 最低限の属性のみ | WCAG AA コントラスト / focus ring / semantic HTML | aria-live / role / keyboard trap 管理まで |
| 7 | **Dark mode** | `dark:` prefix 使用 / 色直書き | 一部 semantic 化 | 全て semantic token（`.dark` で自動切替） | dark でも contrast / elevation が再調整されている |
| 8 | **Responsive** | fixed width / overflow | 1 breakpoint のみ | sm/md/lg で major layout 変化 | content-aware（`max-w-prose` 等）+ intrinsic sizing |
| 9 | **Motion** | 0 transition | `transition-all`（曖昧） | 個別 property / duration 指定、`reduce-motion` 尊重 | 状態遷移ごとに意味ある easing curve |
| 10 | **Distinctiveness** | generic AI 見た目（Inter + 紫 gradient 等） | 既存 UI kit 模写 | プロジェクト独自の個性（token 体系の活用） | 明確な aesthetic direction（editorial / playful 等） |
| 11 | **Story coverage** | story 無し | default story のみ | 主要 variant / size を story 化 | state matrix（empty / loading / error / populated）+ interaction を全カバー |

## 出力フォーマット

```md
## Design Grade: {component name}

**Score: {total}/30** ({band})

### Findings
- {criterion} [{score}/3] — {what's right / what's missing}, refs `{file}:{line}`
- ...

### Top 3 fixes (priority order)
1. {actionable change}, diff sketch if trivial
2. ...
3. ...

### Passes
- {criterion} — short praise of what's working
```

**Band 基準:**
- 28–33: ship as-is
- 22–27: minor polish
- 14–21: needs work（Top 3 fixes を実装）
- ≤ 13: rebuild 推奨

## 判定ルール

- `arbitrary value` / 標準パレット検出 → 項目 1 を即 0 点
- `dark:` prefix 1 箇所以上 → 項目 7 を即 0 点
- focus-visible の ring / outline が無い → 項目 5 を 1 点以下
- interaction state が単色 token で `-hover`/`-active` suffix 未使用 → 項目 1 の減点対象（`.claude/rules/design.md` 規約違反）

## やらないこと

- コード修正は提案まで（実装は component-creator 側）
- 主観的「かっこいい/ダサい」評価 — 常に rubric 項目にマップする
- 禁則違反を再掲しない（`design.md` を参照すれば十分、drift 源）

## 関連

- `.claude/rules/design.md` — 禁則の SSoT
- `component-creator` — 実装側
- `@theme` @ `src/app/globals.css` — 使える token の SSoT
