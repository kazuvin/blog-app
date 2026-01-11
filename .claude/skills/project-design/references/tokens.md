# Design Tokens

## Table of Contents

1. [globals.css Setup](#globalscss-setup)
2. [Token Reference](#token-reference)

---

## globals.css Setup

Tailwind v4 + oklch:

```css
@import "tailwindcss";

/* Dark mode: class-based toggle */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Colors - Primary (blue hue: 264) */
  --color-primary: oklch(0.55 0.22 264);
  --color-primary-hover: oklch(0.50 0.23 264);
  --color-primary-active: oklch(0.45 0.24 264);

  /* Colors - Neutral (achromatic: chroma 0) */
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.20 0 0);
  --color-surface: oklch(0.97 0 0);
  --color-surface-elevated: oklch(0.99 0 0);
  --color-border: oklch(0.92 0 0);
  --color-muted: oklch(0.55 0 0);

  /* Colors - Semantic */
  --color-success: oklch(0.72 0.19 145);
  --color-warning: oklch(0.75 0.18 75);
  --color-error: oklch(0.63 0.24 27);

  /* Typography */
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 0.1);

  /* Animation */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}

/* Dark mode overrides */
.dark {
  --color-primary: oklch(0.62 0.21 264);
  --color-primary-hover: oklch(0.67 0.20 264);
  --color-primary-active: oklch(0.55 0.22 264);

  --color-background: oklch(0.15 0 0);
  --color-foreground: oklch(0.95 0 0);
  --color-surface: oklch(0.22 0 0);
  --color-surface-elevated: oklch(0.27 0 0);
  --color-border: oklch(0.27 0 0);
  --color-muted: oklch(0.70 0 0);

  --color-success: oklch(0.80 0.18 145);
  --color-warning: oklch(0.82 0.17 80);
  --color-error: oklch(0.70 0.19 25);
}

body {
  background: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
}
```

---

## Token Reference

### oklch について

`oklch(L C H)` - Lightness, Chroma, Hue
- **L** (明度): 0 = 黒, 1 = 白
- **C** (彩度): 0 = 無彩色, 0.4+ = 高彩度
- **H** (色相): 0-360° (赤:30, 黄:90, 緑:145, 青:264, 紫:300)

### Colors

| Token | Light | Dark |
|-------|-------|------|
| `primary` | oklch(0.55 0.22 264) | oklch(0.62 0.21 264) |
| `background` | oklch(1 0 0) | oklch(0.15 0 0) |
| `foreground` | oklch(0.20 0 0) | oklch(0.95 0 0) |
| `surface` | oklch(0.97 0 0) | oklch(0.22 0 0) |
| `border` | oklch(0.92 0 0) | oklch(0.27 0 0) |
| `muted` | oklch(0.55 0 0) | oklch(0.70 0 0) |

### Semantic Colors

| Token | Light | Dark | Hue |
|-------|-------|------|-----|
| `success` | oklch(0.72 0.19 145) | oklch(0.80 0.18 145) | 緑 |
| `warning` | oklch(0.75 0.18 75) | oklch(0.82 0.17 80) | 黄 |
| `error` | oklch(0.63 0.24 27) | oklch(0.70 0.19 25) | 赤 |

### Dark Mode Toggle

```tsx
// Toggle dark mode
document.documentElement.classList.toggle("dark");

// Check current mode
const isDark = document.documentElement.classList.contains("dark");
```
