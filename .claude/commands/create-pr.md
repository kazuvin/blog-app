# Create PR Command

Create PR with quality verification and attribution.

## Flow

### Phase 1: Pre-flight

```bash
git branch --show-current  # Must NOT be main/master
git status
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo "No upstream"
```

### Phase 2: Quality Check

```bash
pnpm lint && pnpm build
```

Fix issues if failed, re-run until pass.

### Phase 3: Commit (if needed)

```bash
git add -A
git commit -m "$(cat <<'EOF'
<type>: <description>

<optional body>

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

Types: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`

### Phase 4: Push & Create PR

```bash
git push -u origin <branch-name>
gh pr create --title "<type>: <description>" --body "$(cat <<'EOF'
## Summary
- <main change>

## Test plan
- [ ] Lint passes
- [ ] Build succeeds

---
Generated with [Claude Code](https://claude.ai/code)
EOF
)"
```

### Phase 5: Report

```bash
gh pr view --json url,changedFiles,commits
```

## Error Handling

| Scenario              | Action                        |
| --------------------- | ----------------------------- |
| On main/master        | Abort                         |
| Lint/Build fails      | Fix and re-run                |
| No remote             | Use `-u` flag                 |
| PR exists             | Report existing PR URL        |
| gh not authenticated  | Prompt `gh auth login`        |
