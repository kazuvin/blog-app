---
title: "TypeScriptの便利なテクニック"
date: "2024-01-25"
description: "TypeScriptを使いこなすための便利なテクニックを紹介します。"
---

# TypeScriptの便利なテクニック

TypeScriptの型システムを活用したテクニックを紹介します。

## 1. Utility Types

TypeScriptには便利なユーティリティ型が用意されています。

### Partial

すべてのプロパティをオプショナルにします。

```typescript
interface User {
  name: string;
  email: string;
  age: number;
}

type PartialUser = Partial<User>;
// { name?: string; email?: string; age?: number; }
```

### Pick

特定のプロパティだけを抽出します。

```typescript
type UserName = Pick<User, "name">;
// { name: string; }
```

### Omit

特定のプロパティを除外します。

```typescript
type UserWithoutAge = Omit<User, "age">;
// { name: string; email: string; }
```

## 2. Type Guards

ランタイムで型を絞り込むテクニックです。

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processValue(value: unknown) {
  if (isString(value)) {
    // ここではvalueはstring型
    console.log(value.toUpperCase());
  }
}
```

## 3. Const Assertions

リテラル型を保持するためのassertion。

```typescript
const colors = ["red", "green", "blue"] as const;
// readonly ["red", "green", "blue"]

type Color = (typeof colors)[number];
// "red" | "green" | "blue"
```

## まとめ

TypeScriptの型システムを活用することで、より安全で保守性の高いコードを書くことができます。
