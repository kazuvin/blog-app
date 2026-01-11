---
title: "Next.js入門"
date: "2024-01-20"
description: "Next.jsの基本的な使い方と特徴について解説します。"
---

# Next.js入門

Next.jsは、Reactベースのフルスタックフレームワークです。

## Next.jsの特徴

### 1. App Router

Next.js 13以降で導入された新しいルーティングシステムです。

```
src/app/
├── page.tsx        # /
├── about/
│   └── page.tsx    # /about
└── blog/
    ├── page.tsx    # /blog
    └── [slug]/
        └── page.tsx # /blog/:slug
```

### 2. Server Components

デフォルトでサーバーコンポーネントとして動作し、パフォーマンスが向上します。

```tsx
// Server Component (default)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### 3. Image Optimization

`next/image`を使用することで、自動的に画像が最適化されます。

## まとめ

Next.jsを使うことで、高速でSEOに強いWebアプリケーションを構築できます。
