---
description: Execute tasks as a commander, delegating work to specialized subagents
argument-hint: [--pr] <task description>
---

# Task Command

Execute tasks using a commander pattern: analyze, delegate to specialized subagents, synthesize results.

## Task Input

$ARGUMENTS

---

## Phase 0: Worktree Setup (MANDATORY)

**CRITICAL: ALL task executions MUST use git worktree for isolation.**

This ensures parallel task executions never conflict with each other or the main working directory.

### Worktree Creation Steps:

1. **Check for `--pr` flag** in arguments above
   - If present: Extract task description (everything after `--pr`), remember to create PR at the end
   - If not present: Use full arguments as task description, skip PR creation at the end

2. **Create worktree for isolation** (ALWAYS):

```bash
# Get repository root and save original directory
REPO_ROOT=$(git rev-parse --show-toplevel)
ORIGINAL_DIR=$(pwd)

# Create worktree directory
mkdir -p "$REPO_ROOT/.worktrees"

# Generate unique branch name:
# - Use task summary + timestamp for uniqueness
# - Format: task/<summary>-<timestamp> or feature/<summary>-<timestamp>
# - Example: "Add login form" at 14:30:45 → "task/add-login-form-143045"
TIMESTAMP=$(date +%H%M%S)
BRANCH_NAME="task/<task-summary>-$TIMESTAMP"

# Create worktree from latest main
git fetch origin
git worktree add -b "$BRANCH_NAME" "$REPO_ROOT/.worktrees/$BRANCH_NAME" origin/main

# CRITICAL: Change to worktree directory for ALL subsequent work
cd "$REPO_ROOT/.worktrees/$BRANCH_NAME"
```

3. **Verify worktree is active** before proceeding:

```bash
pwd  # Should show .worktrees/<branch-name>
git branch --show-current  # Should show the new branch
```

4. **All subsequent phases execute within the worktree directory**

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

Must pass before completion.

---

## Phase 6: PR Creation (--pr only)

**Skip this phase if `--pr` was NOT in the original arguments.**

If `--pr` IS present:

1. **Execute `/create-pr`** in the worktree directory (you should already be in the worktree)

---

## Phase 7: Cleanup & Report

### Return to original directory:

```bash
cd "$ORIGINAL_DIR"
```

### Report completion:

- **If `--pr`**: PR URL (most important!)
- Worktree location used: `$REPO_ROOT/.worktrees/<branch-name>`
- Summary of changes
- Files modified

### Worktree cleanup options:

```bash
# Option 1: Remove immediately (if no PR or PR is merged)
git worktree remove "$REPO_ROOT/.worktrees/$BRANCH_NAME"

# Option 2: Keep for review (if PR is pending)
# User can remove later with:
# git worktree list
# git worktree remove <path>
```

**Recommendation:**

- If `--pr`: Keep worktree until PR is merged, then user removes manually
- If no `--pr`: Remove worktree automatically after successful completion

---

## Quick Reference

```bash
# Standard execution (uses worktree for isolation, no PR)
/task Add input validation

# With PR creation (uses worktree + creates PR)
/task --pr Add input validation
```

**Rules:**

- **Worktree isolation is MANDATORY for ALL executions** (prevents conflicts)
- Track with `TodoWrite`
- Prefer parallel execution
- Commander coordinates, agents implement
- CI must pass
- `--pr` flag → additionally create PR after completion
