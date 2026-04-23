#!/usr/bin/env bash
# PostToolUse: Edit|Write|MultiEdit 後に biome の safe-fix を当てる
# 失敗は silent（lint error は本来の pnpm lint で検出）
set -u

INPUT=$(cat)
FILE=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -z "$FILE" ] && exit 0

case "$FILE" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.json|*.jsonc|*.css|*.md|*.mdx) ;;
  *) exit 0 ;;
esac

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR" 2>/dev/null || exit 0

# biome check --write は safe fix（整形・import 整列）を適用。unsafe fix は対象外
pnpm exec biome check --write --no-errors-on-unmatched "$FILE" >/dev/null 2>&1 || true

# 変更があったので ci-check marker は invalid。次の ci-check 実行まで消す
rm -f "$PROJECT_DIR/.claude/.ci-check-passed" 2>/dev/null || true

exit 0
