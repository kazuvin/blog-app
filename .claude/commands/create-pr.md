# Create PR Command

Create PR following repo conventions (no AI attribution anywhere).

## Flow

### Phase 1: Pre-flight

```bash
git branch --show-current  # Must NOT be main/master
git status
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo "No upstream"
```

### Phase 2: CI Verification

Run `ci-check` skill（`pnpm lint` → `pnpm tsc --noEmit` → `pnpm test:run`）。すべて成功するまで次に進まない。

### Phase 3: Commit (if needed)

```bash
git add <files>
git commit -m "$(cat <<'EOF'
<type>: <description>

<optional body>
EOF
)"
```

Conventional Commits prefixes（`feat:` / `fix:` / `refactor:` / `docs:` / `chore:` など）を使用。

**No trailers**: `Co-Authored-By`, `Signed-off-by` 等の AI attribution トレイラーは付けない（リポジトリ方針）。

### Phase 4: Push & Create PR

```bash
git push -u origin <branch-name>
gh pr create --title "<type>: <description>" --body "$(cat <<'EOF'
## Summary
- <main change>

## Test plan
- [ ] `ci-check` passes locally
EOF
)"
```

PR body にも AI attribution（"Generated with …" など）は入れない。

### Phase 5: Report

```bash
gh pr view --json url,changedFiles,commits
```

## Error Handling

| Scenario             | Action                        |
| -------------------- | ----------------------------- |
| On main/master       | Abort                         |
| `ci-check` fails     | Fix and re-run                |
| No remote            | Use `-u` flag                 |
| PR exists            | Report existing PR URL        |
| gh not authenticated | Prompt `gh auth login`        |
