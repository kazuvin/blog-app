# CLAUDE.md

Next.js 15 (App Router, `output: 'export'` で全ページ SSG) + React 19 + TypeScript + Tailwind v4 + Biome + Vitest。`out/` の静的アセットを Cloudflare Pages に配信。パッケージマネージャは pnpm。

## Harness layout

指示は意図的に分割されている。用途に応じて必要なものだけロードする方針。重複させないこと。

- `CLAUDE.md`（本ファイル） — プロジェクト横断のファクト。全 session でロード
- `.claude/rules/design.md` — `**/*.tsx` で自動ロード。Tailwind token / 禁則
- `.claude/skills/` — invoke で全文ロードされる手順書
  - `ci-check` — lint / tsc / test の完了チェック
  - `component-creator` — Presentation vs Container、実装テンプレ
  - `zustand-pattern` — feature store 設計、selector 粒度
  - `tdd-patterns` — Vitest 先行の Red-Green-Refactor
  - `design-grader` — UI を rubric 採点（reviewer）
- `.claude/agents/react-component-builder.md` — 上記 skills が frontmatter で preload 済の subagent
- `.claude/commands/` — `/task`（worktree で commander パターン）/ `/spec`（feature 着手前の仕様化）/ `/create-pr`
- `.claude/settings.json` — hooks + shared permissions
- `.claude/hooks/` — PostToolUse（biome auto-fix）/ Stop（ci-check reminder）
- `.mcp.json` — Playwright MCP（ブラウザ検証）/ Context7 MCP（live docs）

## Quality gate（hooks が enforcement）

コード変更は次の 2 つの hook で自動的に protect される:

- **PostToolUse** Edit/Write/MultiEdit → 編集ファイルに `biome check --write`（safe fix）を当てる + `.claude/.ci-check-passed` marker を削除
- **Stop** → `*.ts(x)` / `*.js(x)` / `*.css` に差分があって marker が無ければ exit 2 で reminder

完了前に **`ci-check` skill** を起動し、`pnpm lint` → `pnpm tsc --noEmit` → `pnpm test:run` が全て exit 0 になったら skill が marker を `touch` する。例外（docs のみ等）は skill の判定ルール参照。

## Commands

よく使うもの。完全一覧は `package.json` の `scripts` を参照。

```bash
pnpm dev              # Next.js dev server (Turbopack, :3000)
pnpm lint             # Biome check（= pnpm lint）/ pnpm lint:fix で safe fix
pnpm tsc --noEmit     # 型チェック
pnpm test:run         # Vitest 1 回実行 / pnpm test:coverage / pnpm test:ui
pnpm storybook        # Storybook dev (:6006)
pnpm build            # SSG ビルド（出力先は out/）
pnpm preview          # out/ をローカルで Cloudflare Pages 配信
pnpm deploy           # Cloudflare Pages へデプロイ
```

## Project structure（SSoT: 実ディレクトリ）

- `src/app/` — App Router（route / layout / globals.css）
- `src/components/ui/{name}/` — UI primitive。component + stories + test + barrel を colocate
- `src/components/layout/` — Header / Main / Sidebar 等
- `src/components/icons/` — アイコン
- `src/features/{feature}/` — feature colocation（components / stores / hooks / data / lib / types + `index.ts` public API）
- `src/lib/` — グローバル utility（`cn` 等）
- `src/hooks/` — 共有 hook
- `src/test/` — Vitest setup / test helper
- `src/types/` — グローバル型宣言（`css.d.ts` 等）
- `contents/*.md` — blog posts（gray-matter frontmatter）
- `scripts/generate-blog-data.ts` — build 前に実行される blog index 生成
- `docs/specs/` — `/spec` が生成する feature spec

UI primitive 一覧・feature ラインナップは enumerate しない（drift 防止）。`src/components/ui/` / `src/features/` を grep するのが真。

## Key patterns

- **Styling**: `src/app/globals.css` の `@theme` が全 token の SSoT。`.dark` セレクタで自動切替 — **`dark:` prefix は書かない**。arbitrary value（`bg-[#fff]`）は biome GritQL plugin で lint error。詳細は `.claude/rules/design.md`（`.tsx` で自動ロード）
- **cn()**: `@/lib/utils` の `cn()` で Tailwind classes をマージ（clsx + tailwind-merge）。user `className` は **last** に merge
- **Components**: Presentation (`src/components/`) vs Container (`src/features/`) の判断は `component-creator` skill の Decision Guide。Server Component 既定、`"use client"` は hooks / browser API / Zustand を使う時だけ
- **Feature stores**: Zustand + 細粒度 selector（1 slice per `useStore`）。ルールは `zustand-pattern` skill
- **Tests**: Vitest + Testing Library + jsdom。coverage 閾値の SSoT は `vitest.config.ts`。新機能は `tdd-patterns` skill に従い spec 先行
- **Blog**: `src/features/blog/lib/blog.ts` が `contents/*.md` を gray-matter + remark/rehype でパース。build 時に `scripts/generate-blog-data.ts` が index を生成
- **Path alias**: `@/*` → `./src/*`

## Config files

- `biome.jsonc` — linter/formatter（Tailwind class sort + arbitrary value 禁止 GritQL plugin + strict React/TS ルール）
- `vitest.config.ts` — jsdom + coverage 閾値（threshold SSoT）
- `tsconfig.json` — TS 設定（strict ルールは違反時に hint）
- `wrangler.jsonc` — Cloudflare Pages 配信設定（出力先 / compatibility date 等）
- `.dev.vars` — Wrangler dev env（gitignored）
