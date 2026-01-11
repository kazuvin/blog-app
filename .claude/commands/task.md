# Task Command

Execute tasks using a commander pattern where the main thread orchestrates and delegates work to specialized subagents.

## Execution Flow

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

## Usage

When executing a task with this command:

1. Break down the request into discrete, actionable items
2. Identify which items can run in parallel
3. Spawn agents with the `Task` tool for each work item
4. Monitor progress and collect results
5. Synthesize outputs and verify consistency
6. Run `pnpm lint && pnpm build` to validate changes
7. Report completion status with summary of changes

## Important Notes

- Always track tasks using `TodoWrite` for visibility
- Prefer parallel execution to minimize total execution time
- Each subagent should have a focused, well-defined scope
- The commander (main thread) is responsible for coordination, not implementation
- CI verification is mandatory and must pass before task completion
