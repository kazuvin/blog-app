---
name: jotai-patterns
description: Jotai state management patterns with encapsulation and Suspense integration. Use when designing atoms, reviewing Jotai code, implementing async data fetching, or asked about state management architecture. Enforces opaque atom pattern where primitive atoms are private and only derived atoms are exported.
---

# Jotai Patterns

Jotaiは**派生atomを多用する文化**。派生atomを駆使してカプセル化を実現する。

## Core Rule

**プリミティブatomはexportしない。派生atomのみをexportする。**

```tsx
// ❌ BAD
export const userAtom = atom<User | null>(null);

// ✅ GOOD
const userAtom = atom<User | null>(null);  // private
export const userValueAtom = atom((get) => get(userAtom));  // read-only
export const loginAtom = atom(null, async (get, set, creds) => { ... });  // action
```

## Pattern Decision Guide

| やりたいこと | パターン | 参照 |
|-------------|----------|------|
| 状態を読み取りたい | Read-only derived atom | [basics.md](references/basics.md) |
| 状態を更新したい | Write-only action atom | [basics.md](references/basics.md) |
| 非同期データ取得 | Async derived atom + Suspense | [suspense.md](references/suspense.md) |
| パラメータ付きfetch（単一） | Parameter via atom | [suspense.md](references/suspense.md) |
| パラメータ付きfetch（複数キャッシュ） | atomFamily | [suspense.md](references/suspense.md) |

## Quick Reference

### Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Private primitive | `xxxAtom` (not exported) | `userAtom` |
| Read-only | `xxxValueAtom` or `isXxxAtom` | `userValueAtom`, `isAuthenticatedAtom` |
| Action | `xxxAtom` (verb) | `loginAtom`, `incrementAtom` |

### File Structure

```tsx
// src/features/xxx/stores/xxx-atoms.ts

// ============================================
// Private Atoms (NEVER export)
// ============================================
const userAtom = atom<User | null>(null);

// ============================================
// Read-Only Exports
// ============================================
export const userValueAtom = atom((get) => get(userAtom));
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);

// ============================================
// Action Exports
// ============================================
export const loginAtom = atom(null, async (get, set, creds) => { ... });
```

## Detailed Patterns

- **Encapsulation & Basics**: [references/basics.md](references/basics.md)
- **Async & Suspense**: [references/suspense.md](references/suspense.md)

## Reference

- https://zenn.dev/uhyo/books/learn-react-with-jotai
