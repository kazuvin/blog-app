# Task Command

Execute tasks using a commander pattern: analyze, delegate to specialized subagents, synthesize results.

**Options:** `--pr` - Create PR after completion (uses git worktree for isolation)

---

## Phase 0: Worktree Setup (--pr only)

```bash
REPO_ROOT=$(git rev-parse --show-toplevel)
mkdir -p "$REPO_ROOT/.worktrees"
git fetch origin
git worktree add -b <branch-name> "$REPO_ROOT/.worktrees/<branch-name>" origin/main
cd "$REPO_ROOT/.worktrees/<branch-name>"
```

Branch naming: `feature/<task-summary>` or `fix/<task-summary>`

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

1. Execute `/create-pr` in worktree
2. Return to `$REPO_ROOT`
3. Report: PR URL, worktree location, changes summary

---

## Quick Reference

```bash
# Standard execution
/task Add input validation

# With PR creation (isolated worktree)
/task --pr Add input validation
```

**Rules:**

- Track with `TodoWrite`
- Prefer parallel execution
- Commander coordinates, agents implement
- CI must pass
