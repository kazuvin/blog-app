# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- **Testing**: Vitest + Testing Library (90% coverage threshold)
- **Component Dev**: Storybook
- **Deployment**: Cloudflare Workers via @opennextjs/cloudflare
- **Path Alias**: `@/*` maps to `./src/*`

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog feature routes
│   │   ├── page.tsx       # Blog listing
│   │   └── [slug]/page.tsx # Individual blog post
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Reusable UI components (Button, Card, Badge, Input, Label)
│   └── index.ts           # Barrel export
└── lib/
    ├── blog.ts            # Blog content utilities (markdown parsing)
    └── utils.ts           # Shared utilities (cn, debounce, etc.)
contents/                   # Markdown blog posts with frontmatter
```

### Key Patterns

**UI Components**: Located in `src/components/ui/`, each component has its own directory with:

- `component.tsx` - Component implementation with variant/size props
- `component.stories.tsx` - Storybook stories
- `index.ts` - Barrel export

**Blog System**: Markdown files in `contents/` directory with gray-matter frontmatter (title, date, description). Rendered via remark/remark-html.

**Styling**: Uses `cn()` utility from `@/lib/utils` for merging Tailwind classes with proper precedence (clsx + tailwind-merge).

### Key Configuration Files

- `biome.json` - Biome linter/formatter configuration (includes Tailwind class sorting)
- `wrangler.jsonc` - Cloudflare Workers configuration
- `open-next.config.ts` - OpenNext adapter settings
- `.dev.vars` - Development environment variables for Wrangler
- `vitest.config.ts` - Test configuration with jsdom environment
