---
name: tdd-patterns
description: Test-Driven Development patterns where tests serve as specification documents. Use when writing tests first, creating new components/features, or reviewing test quality. Enforces Red-Green-Refactor cycle and bilingual test documentation.
---

# TDD Patterns

Test-Driven Development: **Tests = Specification**

## Core Workflow

```
Red → Green → Refactor
 ↓       ↓        ↓
Write   Make    Clean
failing  it      up
tests   pass    code
```

## Test Structure (Specification Format)

```typescript
describe("機能名 (FeatureName)", () => {
  // 1. Setup & Initial State
  describe("初期状態 (Initial State)", () => {
    it("should render without errors", () => {});
    it("should have default values", () => {});
  });

  // 2. Core Functionality
  describe("主要機能 (Core Functionality)", () => {
    it("should [action] when [condition]", () => {});
  });

  // 3. User Interactions
  describe("ユーザー操作 (User Interactions)", () => {
    it("should respond to click events", () => {});
    it("should handle keyboard navigation", () => {});
  });

  // 4. Edge Cases & Error Handling
  describe("エッジケース (Edge Cases)", () => {
    it("should handle null/undefined gracefully", () => {});
    it("should display error message when API fails", () => {});
  });
});
```

## Specification Checklist

Before writing implementation, tests MUST cover:

| Category | Questions to Answer |
|----------|---------------------|
| **Props/Input** | What does it accept? What are defaults? |
| **Output/Render** | What does it display? |
| **Interactions** | How does user interact with it? |
| **State** | How does state change over time? |
| **Errors** | What happens when things fail? |
| **Accessibility** | Is it keyboard/screen-reader friendly? |

## References

- [component-tests.md](references/component-tests.md) - React component testing patterns
- [function-tests.md](references/function-tests.md) - Pure function testing patterns
- [async-tests.md](references/async-tests.md) - Async/API testing patterns
