# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15 application with TypeScript, designed for Cloudflare Workers deployment using OpenNext adapter. Uses pnpm as package manager.

## Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack (http://localhost:3000)
pnpm lint             # Run ESLint

# Building & Deployment
pnpm build            # Production build
pnpm preview          # Preview on local Cloudflare runtime
pnpm deploy           # Deploy to Cloudflare Workers

# Cloudflare
pnpm cf-typegen       # Generate Cloudflare bindings types
```

## Architecture

- **Framework**: Next.js 15 with App Router (`src/app/`)
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Deployment**: Cloudflare Workers via @opennextjs/cloudflare
- **Path Alias**: `@/*` maps to `./src/*`

### Key Configuration Files

- `wrangler.jsonc` - Cloudflare Workers configuration (bindings, assets)
- `open-next.config.ts` - OpenNext adapter settings
- `.dev.vars` - Development environment variables for Wrangler

### Cloudflare Bindings

The app has bindings configured for:

- `ASSETS` - Static assets
- `IMAGES` - Image optimization
- Worker self-reference for caching
