---
description: Execute tasks as a commander, delegating work to specialized subagents
argument-hint: [--pr] <task description>
---

# Task Command

Commander pattern: analyze → **specify (TDD)** → delegate → synthesize.

## Task Input

$ARGUMENTS

---

## Phase 0: Worktree Setup (MANDATORY)

```bash
REPO_ROOT=$(git rev-parse --show-toplevel)
ORIGINAL_DIR=$(pwd)
mkdir -p "$REPO_ROOT/.worktrees"
TIMESTAMP=$(date +%H%M%S)
BRANCH_NAME="task/<task-summary>-$TIMESTAMP"

git fetch origin
git worktree add -b "$BRANCH_NAME" "$REPO_ROOT/.worktrees/$BRANCH_NAME" origin/main
cd "$REPO_ROOT/.worktrees/$BRANCH_NAME"
```

Check `--pr` flag: if present, create PR at end.

---

## Phase 1: Context Gathering

1. Read `.claude/skills/` for project patterns
2. Read `.claude/agents/` for project agents
3. Use `TodoWrite` to plan tasks

---

## Phase 1.5: TDD Specification (MANDATORY for new features/components)

**Test-Driven Development**: Tests are the specification. Write tests BEFORE implementation.

### Workflow: Red → Green → Refactor

1. **Red**: Write failing tests that describe expected behavior
2. **Green**: Implement minimum code to pass tests
3. **Refactor**: Clean up while keeping tests green

### Test File as Specification

Tests should read like documentation. Use descriptive `describe` and `it` blocks:

```typescript
describe("ComponentName", () => {
  describe("初期状態 (Initial State)", () => {
    it("should render with default props", () => {});
    it("should display placeholder text when empty", () => {});
  });

  describe("ユーザー操作 (User Interactions)", () => {
    it("should call onClick when button is clicked", () => {});
    it("should update value on input change", () => {});
  });

  describe("バリデーション (Validation)", () => {
    it("should show error when input is invalid", () => {});
    it("should disable submit when form is incomplete", () => {});
  });

  describe("エッジケース (Edge Cases)", () => {
    it("should handle empty array gracefully", () => {});
    it("should truncate text longer than 100 characters", () => {});
  });
});
```

### Specification Checklist

Before implementation, the test file MUST define:

- [ ] **Expected Props/Input**: What parameters does it accept?
- [ ] **Default Behavior**: What happens with no/minimal input?
- [ ] **User Interactions**: How does it respond to user actions?
- [ ] **State Changes**: How does internal state evolve?
- [ ] **Error Handling**: What happens when things go wrong?
- [ ] **Edge Cases**: Boundary conditions and unusual inputs
- [ ] **Accessibility**: Keyboard nav, ARIA, screen readers

### TDD Steps for This Task

1. Identify components/functions to be created or modified
2. Write test file(s) as specification
3. Run tests to confirm they fail (Red)
4. Proceed to implementation (Phase 2+)
5. Verify tests pass (Green)
6. Refactor if needed

---

## Phase 2: Agent Selection

**Priority**: Project agents > Built-in agents

### Project Agents

| Agent                     | Use Case                   |
| ------------------------- | -------------------------- |
| `react-component-builder` | React components w/ skills |

### Built-in Agents

| Agent                    | Use Case                 |
| ------------------------ | ------------------------ |
| `Explore`                | Codebase exploration     |
| `Plan`                   | Architecture decisions   |
| `nextjs-developer`       | Next.js App Router       |
| `typescript-pro`         | TypeScript, generics     |
| `debugger`               | Issue diagnosis          |
| `code-reviewer`          | Code quality, PR review  |
| `refactoring-specialist` | Code transformation      |
| `general-purpose`        | Complex multi-step tasks |

---

## Phase 3: Parallel Execution

Launch independent agents via single message with multiple `Task` calls.

- **Parallelize**: Independent tasks, no shared files
- **Serialize**: Dependent outputs, same file mods

---

## Phase 4: Result Synthesis

Collect outputs, resolve conflicts, update `TodoWrite`.

---

## Phase 5: CI Verification (Mandatory)

```bash
pnpm test:run && pnpm lint && pnpm build
```

**TDD Verification**: All tests written in Phase 1.5 must pass (Green state).

---

## Phase 6: PR Creation (--pr only)

Execute `/create-pr` in worktree.

---

## Phase 7: Cleanup & Report

```bash
cd "$ORIGINAL_DIR"
```

Report: PR URL (if --pr), worktree location, changes summary.

Cleanup:

- `--pr`: Keep worktree until merged
- No `--pr`: Remove automatically

```bash
git worktree remove "$REPO_ROOT/.worktrees/$BRANCH_NAME"
```

---

## Rules

- Worktree isolation mandatory
- Track with `TodoWrite`
- Prefer parallel execution
- CI must pass (tests, lint, build)
- `--pr` → create PR after completion

### TDD Rules

- **Tests First**: Write tests before implementation for new features/components
- **Specification**: Test file = living documentation
- **Red-Green-Refactor**: Follow the cycle strictly
- **Coverage**: Maintain 90%+ coverage threshold
- **Descriptive Tests**: Use bilingual describe blocks (日本語 + English) for clarity
