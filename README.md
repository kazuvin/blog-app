# Kazuvin Blog

Next.js 15 application with TypeScript, designed for Cloudflare Workers deployment using OpenNext adapter.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest + Testing Library
- **Deployment**: Cloudflare Workers via @opennextjs/cloudflare
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Development

Start the development server with Turbopack:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm preview` | Preview on local Cloudflare runtime |
| `pnpm deploy` | Deploy to Cloudflare Workers |

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── lib/           # Utility functions
└── test/          # Test configuration
```

## Cloudflare Configuration

- `wrangler.jsonc` - Cloudflare Workers configuration
- `open-next.config.ts` - OpenNext adapter settings
- `.dev.vars` - Development environment variables

## License

Private
