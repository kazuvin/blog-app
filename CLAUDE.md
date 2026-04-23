# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ タスク完了前の必須チェック

コードまたは設定を変更するタスクを完了したと報告する前に、**必ず `ci-check` skill を起動し、その手順に従ってローカル CI を完走させてください**。

- 起動方法: Skill ツールで `ci-check` を呼び出す（`/ci-check` でも可）
- 内容: `pnpm lint` → `pnpm tsc --noEmit` → `pnpm test:run`
- 1 つでも失敗している間はタスクは「完了」ではありません
- 例外（ドキュメントのみ変更など）はスキップ可ですが、その旨をユーザーに明示してください

## Project Overview

Next.js 15 blog application with TypeScript, designed for Cloudflare Workers deployment using OpenNext adapter. Uses pnpm as package manager.

## Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack (http://localhost:3000)
pnpm lint             # Run Biome linting and formatting check
pnpm lint:fix         # Run Biome with auto-fix
pnpm format           # Format code with Biome
pnpm format:check     # Check formatting without writing

# Testing
pnpm test             # Run Vitest in watch mode
pnpm test:run         # Run tests once
pnpm test:coverage    # Run tests with coverage report
pnpm test:ui          # Run tests with Vitest UI

# Storybook
pnpm storybook        # Start Storybook dev server (http://localhost:6006)
pnpm build-storybook  # Build static Storybook

# Building & Deployment
pnpm build            # Production build
pnpm preview          # Preview on local Cloudflare runtime
pnpm deploy           # Deploy to Cloudflare Workers

# Cloudflare
pnpm cf-typegen       # Generate Cloudflare bindings types
```

## Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Linting/Formatting**: Biome (with Tailwind CSS class sorting)
- **Testing**: Vitest + Testing Library（coverage 閾値は `vitest.config.ts` が SSoT）
- **Component Dev**: Storybook
- **Deployment**: Cloudflare Workers via @opennextjs/cloudflare
- **Path Alias**: `@/*` maps to `./src/*`

### Project Structure（SSoT: 実ディレクトリ）

- `src/app/` — Next.js App Router（route / layout）
- `src/components/ui/` — 共通 UI primitive（各 `{name}/` に component + stories + barrel を colocate）
- `src/components/layout/` — レイアウトパーツ
- `src/features/{feature}/` — Feature colocation（components / stores / hooks / data / lib / types + `index.ts` public API）
- `src/lib/` — グローバル共通ユーティリティ（`cn`, debounce 等）
- `contents/` — Markdown blog posts（gray-matter frontmatter）

UI primitive 一覧・feature ラインナップは実ディレクトリを grep する（drift 防止のため本ドキュメントでは列挙しない）。

### Key Patterns

- **UI primitive**: `src/components/ui/{name}/` に colocate（component + stories + test + barrel）。規約は `component-creator` skill
- **Feature store**: Zustand、`src/features/{feature}/stores/` に配置。規約は `zustand-pattern` skill
- **Blog**: `contents/*.md` を gray-matter + remark/rehype でパース（実装: `src/features/blog/lib/blog.ts`）
- **Styling**: `cn()`（`@/lib/utils`）で Tailwind classes をマージ（clsx + tailwind-merge）。token は `src/app/globals.css` の `@theme`、ルールは `.claude/rules/design.md`

### Key Configuration Files

- `biome.jsonc` - Biome linter/formatter configuration (JSONC, Tailwind class sorting, strict React/TS rules)
- `wrangler.jsonc` - Cloudflare Workers configuration
- `open-next.config.ts` - OpenNext adapter settings
- `.dev.vars` - Development environment variables for Wrangler
- `vitest.config.ts` - Test configuration with jsdom environment
