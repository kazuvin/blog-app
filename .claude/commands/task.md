# Task Command

Execute tasks using a commander pattern where the main thread orchestrates and delegates work to specialized subagents.

## Command Options

| Option | Description                                                                                                           |
| ------ | --------------------------------------------------------------------------------------------------------------------- |
| `--pr` | Create a PR after task completion. Uses git worktree for isolated execution to prevent conflicts with parallel tasks. |

## Execution Flow

### Phase 0: Worktree Setup (--pr only)

When `--pr` flag is provided, create an isolated working environment:

1. **Get repository root**

   ```bash
   REPO_ROOT=$(git rev-parse --show-toplevel)
   ```

2. **Generate branch name** based on task description
   - Format: `feature/<task-summary>` or `fix/<task-summary>`
   - Example: `feature/add-user-auth`, `fix/login-bug`

3. **Create worktree with new branch**

   ```bash
   mkdir -p "$REPO_ROOT/.worktrees"
   git fetch origin
   git worktree add -b <branch-name> "$REPO_ROOT/.worktrees/<branch-name>" origin/main
   ```

4. **Change to worktree directory**
   - All subsequent work happens in the worktree
   - This ensures isolation from other tasks

**Why worktree?**

- Multiple `/task --pr` commands can run in parallel without conflicts
- Each task works in its own isolated directory
- Main branch and other tasks remain unaffected

### Phase 1: Task Analysis

Analyze the user request to understand:

- What needs to be accomplished
- Required technical skills and expertise
- Dependencies between subtasks
- Opportunities for parallel execution

Use `TodoWrite` to create a structured task list with clear dependencies marked.

### Phase 2: Agent Selection

Select appropriate subagent types based on task requirements. Reference the agent capabilities table below.

| Agent Type               | Use Case                 | Best For                                                                    |
| ------------------------ | ------------------------ | --------------------------------------------------------------------------- |
| `Explore`                | Codebase exploration     | Understanding project structure, finding relevant files, tracing code paths |
| `Plan`                   | Implementation planning  | Creating detailed implementation plans, architecture decisions              |
| `frontend-developer`     | React/UI implementation  | Building UI components, styling, accessibility                              |
| `typescript-pro`         | TypeScript development   | Type definitions, generics, type safety improvements                        |
| `react-specialist`       | React 18+ patterns       | Hooks, Suspense, Server Components, concurrent features                     |
| `nextjs-developer`       | Next.js App Router       | Route handlers, layouts, metadata, server actions                           |
| `debugger`               | Issue diagnosis          | Finding root causes, analyzing errors, debugging                            |
| `code-reviewer`          | Code quality review      | Reviewing PRs, suggesting improvements, enforcing standards                 |
| `refactoring-specialist` | Code transformation      | Restructuring code, improving patterns, reducing complexity                 |
| `general-purpose`        | Complex multi-step tasks | Tasks requiring multiple skills or extended reasoning                       |

### Phase 3: Parallel Execution

Launch multiple agents simultaneously when their tasks are independent.

Guidelines for parallelization:

- **Parallelize**: Tasks with no shared file dependencies, independent features, exploration tasks
- **Serialize**: Tasks where one depends on another's output, modifications to the same files
- Use the `Task` tool to spawn subagents with clear, focused instructions
- Each agent should receive specific context and expected deliverables

Example parallel execution:

```
Agent 1: Explore -> Find all components using deprecated pattern
Agent 2: Explore -> Analyze current test coverage
Agent 3: Plan -> Design migration strategy
```

### Phase 4: Result Synthesis

Collect and integrate outputs from all agents:

- Review each agent's deliverables
- Resolve any conflicts between agent outputs
- Ensure consistency across all changes
- Update `TodoWrite` to mark completed tasks

### Phase 5: CI Verification (Mandatory)

After all implementation work is complete, run CI checks:

```bash
pnpm lint && pnpm build
```

- If CI fails, diagnose and fix issues before completing the task
- All code changes must pass linting and build successfully
- Report CI results to the user
- **Important**: CI verification must pass before PR creation (if `--pr` flag is used)

### Phase 6: PR Creation (--pr only)

This phase is only executed when the `--pr` flag is provided.

**Prerequisites:**

- All tasks must be completed successfully
- CI verification (Phase 5) must pass
- Working in the worktree created in Phase 0

**Execution:**

- Execute the `/create-pr` command workflow within the worktree
- The PR will be created with all changes from the completed task

### Phase 7: Cleanup (--pr only)

After PR creation:

1. **Return to original directory**

   ```bash
   cd "$REPO_ROOT"
   ```

2. **Report completion** with:
   - PR URL
   - Worktree location used
   - Files modified
   - Summary of changes

3. **Worktree cleanup** (optional)
   - Worktrees can be kept for reference or removed after PR is merged
   - To remove: `git worktree remove "$REPO_ROOT/.worktrees/<branch-name>"`

## Usage

### Without `--pr` flag (default)

Task completion ends after CI verification (Phase 5). Changes are made in the current directory.

```
/task Add input validation to the login form
```

### With `--pr` flag

Task runs in an isolated worktree and creates a PR upon completion.

```
/task --pr Add input validation to the login form
```

This will:

1. Create worktree at `.worktrees/feature-add-input-validation`
2. Execute the task in isolation
3. Run CI checks
4. Create PR via `/create-pr`
5. Report PR URL

### Parallel Execution Example

Multiple tasks can run simultaneously without conflicts:

```
Terminal 1: /task --pr Add user authentication
  → Creates .worktrees/feature-add-user-auth

Terminal 2: /task --pr Add dark mode
  → Creates .worktrees/feature-add-dark-mode

Terminal 3: /task --pr Fix login bug
  → Creates .worktrees/fix-login-bug
```

## Important Notes

- Always track tasks using `TodoWrite` for visibility
- Prefer parallel execution to minimize total execution time
- Each subagent should have a focused, well-defined scope
- The commander (main thread) is responsible for coordination, not implementation
- CI verification is mandatory and must pass before task completion
- With `--pr`, ensure `.worktrees/` is in `.gitignore`
