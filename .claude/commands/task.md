---
description: Execute tasks as a commander, delegating work to specialized subagents
argument-hint: [--pr] <task description>
---

# Task Command

Commander pattern: analyze → specify (TDD) → delegate → synthesize.

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
3. Track steps via the current task-tracker tools（`TaskCreate` / `TaskUpdate` / `TaskList`）

---

## Phase 1.5: TDD Specification (new features/components)

Follow `tdd-patterns` skill. Write tests BEFORE implementation — tests are the specification. Do not duplicate the skill's content here.

---

## Phase 2: Agent Selection

**Priority**: Project agents > built-in agents.

- Project agents: `.claude/agents/*.md`（現行は `react-component-builder` 等、実ディレクトリを参照）
- Built-in agents: Claude Code 実行時の一覧から選択（ここでハードコードしない — drift 源になるため）

---

## Phase 3: Parallel Execution

Launch independent work via a single message with multiple `Agent` tool calls.

- **Parallelize**: 独立タスク、共有ファイル無し
- **Serialize**: 出力依存、同一ファイル編集

---

## Phase 4: Result Synthesis

Collect outputs, resolve conflicts, update task tracker.

---

## Phase 5: CI Verification (MANDATORY)

Run `ci-check` skill. すべて成功するまで完了扱いにしない。

TDD 由来のテスト（Phase 1.5 で書いたもの）が Green であることを確認。

---

## Phase 6: PR Creation (--pr only)

Execute `/create-pr` in worktree.

---

## Phase 7: Cleanup & Report

```bash
cd "$ORIGINAL_DIR"
```

Report: PR URL (if `--pr`), worktree location, changes summary.

Cleanup:

- `--pr`: Keep worktree until merged
- No `--pr`: Remove automatically

```bash
git worktree remove "$REPO_ROOT/.worktrees/$BRANCH_NAME"
```

---

## Rules

- Worktree isolation mandatory
- Track work with task-tracker tools（`TaskCreate` / `TaskUpdate`）
- Prefer parallel `Agent` calls
- `ci-check` must pass before completion
- `--pr` → `/create-pr` after completion
- TDD 規約は `tdd-patterns` skill が SSoT（ここで再掲しない）
