---
description: Execute tasks as a commander, delegating work to specialized subagents
argument-hint: [--pr] <task description>
---

# Task Command

Commander pattern: analyze → delegate → synthesize.

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
pnpm lint && pnpm build
```

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
- CI must pass
- `--pr` → create PR after completion
