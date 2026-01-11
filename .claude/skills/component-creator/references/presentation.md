# Presentation Component Patterns

## Directory Structure

```
src/components/
├── ui/                    # Primitive UI components (Button, Input, Card, etc.)
│   ├── button/
│   │   ├── button.tsx
│   │   ├── button.test.tsx
│   │   └── index.ts
│   └── input/
│       ├── input.tsx
│       └── index.ts
├── layout/                # Layout components (Header, Footer, Sidebar, etc.)
│   └── header/
│       ├── header.tsx
│       └── index.ts
└── shared/                # Shared composite components
    └── user-avatar/
        ├── user-avatar.tsx
        └── index.ts
```

## Naming Conventions

- **Directory**: kebab-case (`user-avatar/`)
- **Component file**: kebab-case (`user-avatar.tsx`)
- **Component name**: PascalCase (`UserAvatar`)
- **Props type**: `{ComponentName}Props` (`UserAvatarProps`)

## Component Template

```tsx
import { type ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-md font-medium transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

const variantStyles = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  ghost: "bg-transparent hover:bg-gray-100",
} as const;

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
} as const;
```

## Index Export Pattern

```tsx
// components/ui/button/index.ts
export { Button } from "./button";
export type { ButtonProps } from "./button";
```

## Key Principles

1. **No internal state for data**: Props in, render out
2. **Extend native HTML attributes**: Use `ComponentProps<"element">` for full HTML attribute support
3. **Composable styling**: Accept `className` prop, merge with internal styles using `cn()`
4. **Explicit variants**: Define variants as typed props, not magic strings
5. **Default values**: Provide sensible defaults for optional props
6. **No business logic**: No API calls, no data transformations
7. **No global state access**: No Jotai, no Context consumption

## Utility: cn() function

Create at `src/lib/utils.ts`:

```tsx
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Compound Components (Advanced)

For complex UI with related parts:

```tsx
import { createContext, useContext, type ReactNode } from "react";

type CardContextValue = {
  variant: "default" | "outlined";
};

const CardContext = createContext<CardContextValue | null>(null);

function useCardContext() {
  const context = useContext(CardContext);
  if (!context) throw new Error("Card.* must be used within Card");
  return context;
}

type CardProps = {
  variant?: "default" | "outlined";
  children: ReactNode;
};

export function Card({ variant = "default", children }: CardProps) {
  return (
    <CardContext.Provider value={{ variant }}>
      <div className={cn("rounded-lg", variantStyles[variant])}>{children}</div>
    </CardContext.Provider>
  );
}

Card.Header = function CardHeader({ children }: { children: ReactNode }) {
  return <div className="border-b p-4">{children}</div>;
};

Card.Body = function CardBody({ children }: { children: ReactNode }) {
  return <div className="p-4">{children}</div>;
};

Card.Footer = function CardFooter({ children }: { children: ReactNode }) {
  return <div className="border-t p-4">{children}</div>;
};
```
