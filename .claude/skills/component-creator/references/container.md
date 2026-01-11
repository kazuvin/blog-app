# Container Component Patterns (Features + Jotai)

## Jotai Atom Design

**Important**: Atom設計は **jotai-patterns** skill を参照すること。

- プリミティブatomはexportしない
- 派生atom（read-only/write-only）のみexport
- 詳細なパターンと例はjotai-patternsに記載

## Directory Structure

```
src/features/
├── auth/
│   ├── components/        # Feature-specific UI components
│   │   ├── login-form.tsx
│   │   └── index.ts
│   ├── stores/            # Jotai atoms (see jotai-patterns skill)
│   │   ├── auth-atoms.ts
│   │   └── index.ts
│   ├── hooks/             # Custom hooks (optional)
│   │   ├── use-auth.ts
│   │   └── index.ts
│   ├── types/             # Feature-specific types
│   │   └── index.ts
│   └── index.ts           # Public API exports
└── [other-features]/
```

## Naming Conventions

- **Feature directory**: kebab-case (`user-profile/`)
- **Atom file**: `{domain}-atoms.ts` (`auth-atoms.ts`)
- **Hook file**: `use-{name}.ts` (`use-auth.ts`)
- **Atom naming**: See jotai-patterns skill

## Container Component Template

```tsx
"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { LoginFormPresentation } from "@/components/auth/login-form";
import { isLoadingAtom, errorValueAtom, loginAtom } from "../stores/auth-atoms";

export function LoginFormContainer() {
  // Use derived atoms only (see jotai-patterns)
  const isLoading = useAtomValue(isLoadingAtom);
  const error = useAtomValue(errorValueAtom);
  const login = useSetAtom(loginAtom);

  return (
    <LoginFormPresentation
      isLoading={isLoading}
      error={error}
      onSubmit={(email, password) => login({ email, password })}
    />
  );
}
```

## Feature Public API

```tsx
// features/auth/index.ts
export { LoginFormContainer } from "./components/login-form";
export { useAuth } from "./hooks/use-auth";

// Export read-only derived atoms only (never primitive atoms)
export { isAuthenticatedAtom, userValueAtom } from "./stores/auth-atoms";

export type { User, LoginCredentials } from "./types";
```

## Key Principles

1. **Colocation**: Feature folder contains components, stores, hooks, types
2. **Container/Presentation split**: Container = state, Presentation = UI
3. **Public API**: Export only what other features need from `index.ts`
4. **"use client"**: Required for components using Jotai hooks
5. **Atom encapsulation**: Follow **jotai-patterns** skill

## Jotai Provider Setup

`src/app/providers.tsx`:

```tsx
"use client";

import { Provider } from "jotai";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
```

`src/app/layout.tsx`:

```tsx
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```
