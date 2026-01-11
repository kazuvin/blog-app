---
name: project-design
description: Design system reference for kazuvin project. Provides CSS variables, color tokens, typography, and component style patterns. Use when querying design tokens, checking color palette, or when explicitly referenced by component-creator skill for styling decisions.
---

# Project Design System

Design tokens and style patterns for this project. Referenced by component-creator for styling.

## Tailwind v4 Setup

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Colors - Primary */
  --color-primary: oklch(0.55 0.22 264);
  --color-primary-hover: oklch(0.50 0.23 264);

  /* Colors - Neutral */
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.20 0 0);
  --color-surface: oklch(0.97 0 0);
  --color-border: oklch(0.92 0 0);
  --color-muted: oklch(0.55 0 0);

  /* Colors - Semantic */
  --color-success: oklch(0.72 0.19 145);
  --color-warning: oklch(0.75 0.18 75);
  --color-error: oklch(0.63 0.24 27);

  /* Typography */
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

.dark {
  --color-primary: oklch(0.62 0.21 264);
  --color-background: oklch(0.15 0 0);
  --color-foreground: oklch(0.95 0 0);
  --color-surface: oklch(0.22 0 0);
  --color-border: oklch(0.27 0 0);
  --color-muted: oklch(0.70 0 0);
  --color-success: oklch(0.80 0.18 145);
  --color-warning: oklch(0.82 0.17 80);
  --color-error: oklch(0.70 0.19 25);
}
```

## Color Tokens

| Token | Light | Dark | Class |
|-------|-------|------|-------|
| `primary` | oklch(0.55 0.22 264) | oklch(0.62 0.21 264) | `bg-primary` |
| `background` | oklch(1 0 0) | oklch(0.15 0 0) | `bg-background` |
| `foreground` | oklch(0.20 0 0) | oklch(0.95 0 0) | `text-foreground` |
| `surface` | oklch(0.97 0 0) | oklch(0.22 0 0) | `bg-surface` |
| `border` | oklch(0.92 0 0) | oklch(0.27 0 0) | `border-border` |
| `muted` | oklch(0.55 0 0) | oklch(0.70 0 0) | `text-muted` |

## Component Patterns

```tsx
// Button - Primary
className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90"

// Button - Secondary
className="bg-surface text-foreground px-4 py-2 rounded-md border border-border"

// Card
className="bg-surface border border-border rounded-lg p-6"

// Input
className="w-full bg-background border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/50"
```

## References

- **[tokens.md](references/tokens.md)**: Full CSS setup, all token values
- **[components.md](references/components.md)**: Detailed component patterns
