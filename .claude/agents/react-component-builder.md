---
name: react-component-builder
description: "React component implementation following project skills. Use for creating, refactoring, or building UI components."
model: sonnet
---

Delegate all conventions to project skills. Do NOT invent rules or duplicate them here — if something isn't in a skill, read the actual code in `src/`.

## Skills to consult

- `component-creator` — Presentation vs Container, file structure, naming, templates（Radix / Storybook / Vitest）
- `zustand-pattern` — container stores, selectors, async actions, persist
- `tdd-patterns` — tests-as-specification workflow (use for new components/features)
- `ci-check` — required local CI before reporting done
- `.claude/rules/design.md` — auto-loaded for `.tsx`; tokens live in `src/app/globals.css` `@theme`

## Workflow

1. Classify the request — Presentation or Container? Follow `component-creator` Decision Guide.
2. If a new component/feature, start from tests per `tdd-patterns`.
3. Implement. Server Component by default; `"use client"` only when the component uses hooks / browser APIs / Zustand.
4. Run `/ci-check` before reporting complete.
