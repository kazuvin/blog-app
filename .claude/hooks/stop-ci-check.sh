#!/usr/bin/env bash
# Stop hook: コード変更があるのに ci-check marker が無ければ reminder（exit 2）
# ci-check skill の最終ステップで `touch .claude/.ci-check-passed` されると silent pass
set -u

INPUT=$(cat)
ACTIVE=$(printf '%s' "$INPUT" | jq -r '.stop_hook_active // false')
[ "$ACTIVE" = "true" ] && exit 0

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR" 2>/dev/null || exit 0

# git repo でなければ何もしない
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

# tracked の *.ts(x) / *.js(x) / *.css に差分があるか
CHANGED=$(git diff --name-only -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs' '*.css' 2>/dev/null)
CACHED=$(git diff --cached --name-only -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs' '*.css' 2>/dev/null)
UNTRACKED=$(git ls-files --others --exclude-standard -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs' '*.css' 2>/dev/null)

if [ -z "$CHANGED" ] && [ -z "$CACHED" ] && [ -z "$UNTRACKED" ]; then
  exit 0
fi

MARKER="$PROJECT_DIR/.claude/.ci-check-passed"
if [ -f "$MARKER" ]; then
  exit 0
fi

cat >&2 <<'EOF'
[ci-check reminder] コード変更があります。完了宣言の前に以下を順に実行してください:

  pnpm lint
  pnpm tsc --noEmit
  pnpm test:run

全て exit 0 で通ったら:
  touch .claude/.ci-check-passed

（設定のみ・docs のみ等の例外は ci-check skill の判定ルール参照）
EOF
exit 2
