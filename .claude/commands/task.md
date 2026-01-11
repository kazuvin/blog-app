---
description: Execute tasks as a commander, delegating work to specialized subagents
argument-hint: [--pr] <task description>
---

# Task Command

Execute tasks using a commander pattern: analyze, delegate to specialized subagents, synthesize results.

## Task Input

$ARGUMENTS

---

## Phase 0: Flag Detection & Worktree Setup

**CRITICAL: Check if `--pr` flag is present in the arguments above.**

### If `--pr` IS present:

1. **Extract task description** (everything after `--pr`)
2. **Create worktree for isolation**:

```bash
# Get repository root and save original directory
REPO_ROOT=$(git rev-parse --show-toplevel)
ORIGINAL_DIR=$(pwd)

# Create worktree directory
mkdir -p "$REPO_ROOT/.worktrees"

# Generate branch name from task (e.g., "Add login form" → "feature/add-login-form")
# Branch naming: feature/<task-summary> or fix/<task-summary>
git fetch origin
git worktree add -b <branch-name> "$REPO_ROOT/.worktrees/<branch-name>" origin/main

# IMPORTANT: Change to worktree directory for all subsequent work
cd "$REPO_ROOT/.worktrees/<branch-name>"
```

3. **All subsequent phases execute within the worktree directory**

### If `--pr` is NOT present:

- Skip worktree setup
- Work directly in current directory
- Skip PR creation phases

---

## Phase 1: Context Gathering

**Before any implementation, actively gather project context:**

1. **Read Skills** - Check `.claude/skills/` for project-specific patterns:
   - `component-creator`: Component architecture (presentation vs container)
   - `jotai-patterns`: State management patterns (opaque atom pattern)
   - `project-design`: Design tokens, Tailwind patterns

2. **Read Agents** - Check `.claude/agents/` for project-specific agents

3. **Analyze Task** - Break down requirements, identify dependencies

Use `TodoWrite` to create a structured task list.

---

## Phase 2: Agent Selection

**Priority Order:**

1. **Project agents** (`.claude/agents/`) - Always prefer when applicable
2. **Built-in agents** - Fallback for general tasks

### Project Agents

| Agent                     | Use Case                                                                          |
| ------------------------- | --------------------------------------------------------------------------------- |
| `react-component-builder` | React components following project skills/patterns (invokes skills automatically) |

### Built-in Agents

| Agent                    | Use Case                                        |
| ------------------------ | ----------------------------------------------- |
| `Explore`                | Codebase exploration, finding files             |
| `Plan`                   | Implementation planning, architecture decisions |
| `nextjs-developer`       | Next.js App Router, server actions, metadata    |
| `typescript-pro`         | TypeScript, type definitions, generics          |
| `debugger`               | Issue diagnosis, root cause analysis            |
| `code-reviewer`          | Code quality, PR review                         |
| `refactoring-specialist` | Code transformation, pattern improvements       |
| `general-purpose`        | Complex multi-step tasks                        |

---

## Phase 3: Parallel Execution

Launch independent agents simultaneously via single message with multiple `Task` tool calls.

- **Parallelize**: Independent features, exploration, no shared files
- **Serialize**: Dependent outputs, same file modifications

---

## Phase 4: Result Synthesis

- Collect agent outputs
- Resolve conflicts
- Update `TodoWrite` with completions

---

## Phase 5: CI Verification (Mandatory)

```bash
pnpm lint && pnpm build
```

Must pass before completion (or PR creation if `--pr`).

---

## Phase 6-7: PR Creation & Cleanup (--pr only)

**Skip this phase entirely if `--pr` was NOT in the original arguments.**

### If `--pr` IS present:

1. **Execute `/create-pr`** in the worktree directory (you should already be in the worktree)
2. **Return to original directory**:
   ```bash
   cd "$ORIGINAL_DIR"
   ```
3. **Report completion**:
   - PR URL (most important!)
   - Worktree location used
   - Summary of changes
   - Files modified

4. **(Optional) Cleanup worktree** after PR is merged:
   ```bash
   git worktree remove "$REPO_ROOT/.worktrees/<branch-name>"
   ```

---

## Quick Reference

```bash
# Standard execution (no worktree, no PR)
/task Add input validation

# With PR creation (uses git worktree for isolation)
/task --pr Add input validation
```

**Rules:**

- Track with `TodoWrite`
- Prefer parallel execution
- Commander coordinates, agents implement
- CI must pass
- **`--pr` flag → worktree isolation is MANDATORY**
