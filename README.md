# Kazuvin Blog

Next.js 15 製の個人ブログ。`output: 'export'` で全ページを SSG ビルドし、`out/` を Cloudflare Pages に静的配信する。

## Stack

- Next.js 15 (App Router) / React 19 / TypeScript
- Tailwind CSS v4
- Biome (lint + format)
- Vitest + Testing Library
- Cloudflare Pages (Wrangler)
- Package manager: pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

[http://localhost:3000](http://localhost:3000) で開発サーバが立ち上がる。

## Build & Deploy

`out/` ディレクトリへ Next.js の static export を吐き、それを Cloudflare Pages にデプロイする。`.dev.vars` がローカル環境変数（gitignored）。

具体的な script は [`package.json`](./package.json) の `scripts`、Pages 設定は [`wrangler.jsonc`](./wrangler.jsonc) を参照。

## More

- 開発フロー・ディレクトリ構成・規約: [`CLAUDE.md`](./CLAUDE.md)
- UI primitive: `src/components/ui/`
- Feature 実装: `src/features/`

## License

Private
