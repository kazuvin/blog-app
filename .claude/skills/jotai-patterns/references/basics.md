# Jotai Basics: Encapsulation Pattern

Reference: https://zenn.dev/uhyo/books/learn-react-with-jotai

Jotaiは**派生atomを多用する文化**。派生atomを駆使してカプセル化を実現する。

## Core Principle

プリミティブatomはexportせず、派生atomのみをexportする。

```tsx
// counter.ts

// プリミティブatomはexportしない（モジュール内に隠す）
const countAtom = atom(0);

// 文字列形式でしか取得できない（フォーマットを強制）
export const countDisplayAtom = atom((get) => get(countAtom).toLocaleString());

// 増やすことはできても減らすことはできない（操作を制限）
export const incrementAtom = atom(null, (get, set, step = 1) => {
  if (step < 0) throw new Error("負の数を足すことはできませんよ！！");
  set(countAtom, get(countAtom) + step);
});
```

## Why Encapsulation?

派生atomのみを提供することで、どんな操作が可能なのかを制御できる。

1. **ユーザーはcountAtomの値を"1,234"のような文字列形式でしか取得できない**（フォーマットし忘れやフォーマットの仕様揺れを防げる）
2. **ユーザーはcountAtomの値を増やすことはできても減らすことはできない**（操作を制限）
3. **内部構造を変更しても外部に影響しない**（リファクタリングが安全）

## Atom Types

### 1. Private Primitive Atoms (Never export)

```tsx
// Internal state - not exported
const countAtom = atom(0);
const userAtom = atom<User | null>(null);
const itemsAtom = atom<Item[]>([]);
```

### 2. Read-Only Derived Atoms

```tsx
// Expose read access
export const countValueAtom = atom((get) => get(countAtom));

// Computed values
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);
export const itemCountAtom = atom((get) => get(itemsAtom).length);
export const sortedItemsAtom = atom((get) =>
  [...get(itemsAtom)].sort((a, b) => a.name.localeCompare(b.name))
);
```

### 3. Write-Only Action Atoms

```tsx
// Simple setter
export const setCountAtom = atom(null, (get, set, value: number) => set(countAtom, value));

// Action with logic
export const incrementAtom = atom(null, (get, set) => set(countAtom, get(countAtom) + 1));

// Action with validation
export const incrementAtom = atom(null, (get, set, step = 1) => {
  if (step < 0) {
    throw new Error("負の数を足すことはできません");
  }
  set(countAtom, get(countAtom) + step);
});
```

### 4. Read-Write Derived Atoms (When needed)

```tsx
// Bi-directional derived state
export const userNameAtom = atom(
  (get) => get(userAtom)?.name ?? "",
  (get, set, name: string) => {
    const user = get(userAtom);
    if (user) set(userAtom, { ...user, name });
  }
);
```

## Naming Conventions

| Type              | Suffix               | Example                                    |
| ----------------- | -------------------- | ------------------------------------------ |
| Private primitive | `Atom`               | `userAtom` (not exported)                  |
| Read-only value   | `ValueAtom`          | `userValueAtom`                            |
| Computed boolean  | `is...Atom`          | `isAuthenticatedAtom`                      |
| Write-only action | Action name + `Atom` | `loginAtom`, `logoutAtom`, `incrementAtom` |
| List getter       | Plural + `ValueAtom` | `itemsValueAtom`                           |

## Complete Example: Counter Module

uhyoさんの例に基づくカプセル化パターン。

```tsx
// src/features/counter/stores/counter-atoms.ts
import { atom } from "jotai";

// ============================================
// Private Atoms (NEVER export)
// ============================================
const countAtom = atom(0);

// ============================================
// Read-Only Exports
// ============================================
// 生の値ではなく、フォーマット済みの値のみを公開
export const countDisplayAtom = atom((get) => get(countAtom).toLocaleString());

// ============================================
// Action Exports
// ============================================
// 増やすことはできても減らすことはできない
export const incrementAtom = atom(null, (get, set, step = 1) => {
  if (step < 0) throw new Error("負の数を足すことはできませんよ！！");
  set(countAtom, get(countAtom) + step);
});
```

**設計上の選択**: 生の値へのアクセスが必要な場合は`countValueAtom`を追加できるが、それはカプセル化を緩めることを意味する。要件に応じて判断する。

## Complete Example: Auth Module

```tsx
// src/features/auth/stores/auth-atoms.ts
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// ============================================
// Private Atoms (NEVER export)
// ============================================
const userAtom = atom<User | null>(null);
const tokenAtom = atomWithStorage<string | null>("auth-token", null);
const loadingAtom = atom(false);
const errorAtom = atom<string | null>(null);

// ============================================
// Read-Only Exports
// ============================================
export const userValueAtom = atom((get) => get(userAtom));
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);
export const isLoadingAtom = atom((get) => get(loadingAtom));
export const errorValueAtom = atom((get) => get(errorAtom));

// ============================================
// Action Exports
// ============================================
export const loginAtom = atom(
  null,
  async (get, set, credentials: { email: string; password: string }) => {
    set(loadingAtom, true);
    set(errorAtom, null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) throw new Error("Login failed");

      const { user, token } = await res.json();
      set(userAtom, user);
      set(tokenAtom, token);
    } catch (e) {
      set(errorAtom, e instanceof Error ? e.message : "Unknown error");
    } finally {
      set(loadingAtom, false);
    }
  }
);

export const logoutAtom = atom(null, (get, set) => {
  set(userAtom, null);
  set(tokenAtom, null);
});
```

## Usage in Components

```tsx
"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { userValueAtom, isLoadingAtom, loginAtom } from "@/features/auth/stores/auth-atoms";

export function LoginButton() {
  const user = useAtomValue(userValueAtom);
  const isLoading = useAtomValue(isLoadingAtom);
  const login = useSetAtom(loginAtom);

  // Cannot directly set userAtom - encapsulation enforced!
  return (
    <button onClick={() => login({ email, password })} disabled={isLoading}>
      {isLoading ? "Loading..." : "Login"}
    </button>
  );
}
```

## Utility Functions

Jotaiには「atomを作るユーティリティ関数」の文化がある。

```tsx
// atomWithReset: リセット可能なatom
import { atomWithReset, RESET } from "jotai/utils";

const countAtom = atomWithReset(0);

// 使用
setCount(5); // 5になる
setCount(RESET); // 0に戻る
```

自作も可能:

```tsx
const RESET = Symbol();

function atomWithReset<T>(initialValue: T) {
  const primitiveAtom = atom(initialValue);
  return atom(
    (get) => get(primitiveAtom),
    (get, set, value: T | typeof RESET) => {
      set(primitiveAtom, value === RESET ? initialValue : value);
    }
  );
}
```
