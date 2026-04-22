# Modern React Patterns

React 19 + Next.js 15 App Router — judgement calls **not** enforced by lint/tsc.

Already enforced automatically (do not re-state, do not work around):
- `biome.jsonc` — `any`, index as key, `useEffect` anti-patterns (`@jacobwolf/biome-unnecessary-effect`), Tailwind arbitrary values (`grit/tailwind-theme-only`), Hook rules, exhaustive deps, nested component definition, a11y, sorted classes, …
- `tsconfig.json` — `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `erasableSyntaxOnly`, …

When lint/tsc flags a violation, fix the code. Do not silence with a comment unless this file or `biome.jsonc` documents the exception.

## Server Component first

Default to Server Component. Add `"use client"` **only** when the file itself uses hooks, JSX event handlers, browser APIs, or a client-only library (Zustand, Radix primitives with state, framer-motion, …). Push the directive to the smallest interactive leaf — do not mark the whole page.

## No forwardRef

In React 19 `ref` is a regular prop inside `ComponentProps`:

```tsx
export function Button({ ref, ...props }: ComponentProps<"button">) {
  return <button ref={ref} {...props} />;
}
```

## How to fix an `@jacobwolf` Effect violation

The plugin catches most `useEffect` misuse. When it fires, the fix is one of:

- **Derived value** — compute during render instead of mirroring into `useState`.
- **User event** — handle in the event handler, not in an effect that watches a flag.
- **Data fetch** — fetch in a Server Component (`async` page / layout) or a server action, not in `useEffect`.

Legitimate `useEffect` — syncing with an external system (URL, history, WebSocket, third-party widget) — still gets flagged. Silence with a reason comment stating **which** external system and **why** the effect is correct. Existing examples: `src/features/blog/components/blog-list-container.tsx:35`, `src/lib/animation/use-scroll-to-top.ts:20`.

```tsx
// biome-ignore lint/plugin: URL (外部ストア) への debounce 反映のため useEffect が正当
useEffect(() => { ... }, [debouncedValue]);
```

## Mutations: prefer Actions

Form action + `useActionState` / `useFormStatus` over an `onClick` that calls `fetch` — gets pending state, progressive enhancement, and Suspense integration for free.

```tsx
"use client";
import { useActionState } from "react";

export function LoginForm({ loginAction }: { loginAction: (s: State, fd: FormData) => Promise<State> }) {
  const [state, action, pending] = useActionState(loginAction, { error: null });
  return (
    <form action={action}>
      <input name="email" />
      <button disabled={pending}>Sign in</button>
      {state.error ? <p className="text-error">{state.error}</p> : null}
    </form>
  );
}
```

Other React 19 primitives when they fit: `useTransition` (non-urgent updates), `useOptimistic` (revertible optimistic UI), `use(promise|context)` (conditional reads paired with Suspense).

## Memoization (React Compiler is NOT enabled)

`useMemo` / `useCallback` / `memo` have a cost. Default to **none**. Add only when you have profiled a re-render cost, or when referential identity matters for a `memo`ed child or a dependency array.

## Props shape

- **Variant union** over boolean flags: `variant: "primary" | "ghost"` beats `isPrimary + isGhost`.
- **Extend the native element**: `ComponentProps<"button">` / `ComponentProps<typeof RadixThing>`.
- **No `defaultProps`** on function components — use default parameters (React 19 removed them).

## className merge order

User `className` must come **last** in `cn()` so it wins:

```tsx
// ✅
<button className={cn("px-4 py-2", variantStyles[variant], className)} />

// ❌ user className is clobbered
<button className={cn(className, "px-4 py-2")} />
```

## Render-time rules

- Do not read `ref.current` during render (only in effects / handlers).
- Pure render: no mutation of props, state, or outer variables during render.

## Types

- `satisfies` over `as` when you want inference + validation.
- `ReactNode` for child slots (not `JSX.Element` / `ReactElement` unless you truly need a single element).

## Anti-pattern quick reference

Listed items are **not** lint-caught (or are easy to miss). Lint-caught ones are omitted on purpose.

| ❌ Don't                                     | ✅ Do                                           |
| -------------------------------------------- | ---------------------------------------------- |
| `"use client"` at top of a whole page        | push it to the smallest interactive leaf       |
| `forwardRef`                                 | `ref` inside `ComponentProps`                  |
| Fetch in `useEffect`                         | Server Component / server action               |
| `onClick` that calls `fetch`                 | form action + `useActionState`                 |
| `useMemo` / `useCallback` everywhere         | add only when profiled                         |
| Boolean flag explosion (`isPrimary`, …)      | `variant` union                                |
| `cn(className, "px-4")` (user loses)         | `cn("px-4", className)` (user wins)            |
| `ref.current` read during render             | read in effect / handler                       |
