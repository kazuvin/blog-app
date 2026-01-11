# Create PR Command

Create a pull request from current changes with quality verification and proper attribution.

## Purpose

This command automates the PR creation workflow, ensuring code quality and consistent PR formatting. It can be used standalone or called from other commands like `/task --pr`.

## Execution Flow

### Phase 1: Pre-flight Checks

Before proceeding, verify the repository state:

1. **Branch Check**
   - Ensure current branch is NOT `main` or `master`
   - If on main/master, abort with error message

2. **Uncommitted Changes Check**
   - Run `git status` to identify staged and unstaged changes
   - Track whether changes exist that need to be committed

3. **Remote Tracking Check**
   - Verify if the branch has a remote tracking branch set
   - Note whether `-u` flag will be needed when pushing

```bash
git branch --show-current
git status
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo "No upstream"
```

### Phase 2: Quality Verification

Run quality checks to ensure code is ready for review:

1. **Lint Check**

   ```bash
   pnpm lint
   ```

2. **Build Check**
   ```bash
   pnpm build
   ```

If either check fails:

- Analyze the error output
- Fix the issues automatically if possible
- Re-run the failing check
- Only proceed when both checks pass

### Phase 3: Commit Changes (if needed)

If uncommitted changes exist after quality verification:

1. **Stage All Changes**

   ```bash
   git add -A
   ```

2. **Create Commit with HEREDOC**

   ```bash
   git commit -m "$(cat <<'EOF'
   <type>: <concise description of changes>

   <optional body explaining the why and context>

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
   EOF
   )"
   ```

Commit message guidelines:

- Use conventional commit format: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, etc.
- First line should be under 72 characters
- Body should explain the "why" not the "what"
- Always include the Co-Authored-By footer

### Phase 4: Push and Create PR

1. **Push to Remote**

   ```bash
   git push -u origin <branch-name>
   ```

2. **Create Pull Request**

   ```bash
   gh pr create --title "<clear title summarizing changes>" --body "$(cat <<'EOF'
   ## Summary
   - <bullet point describing main change>
   - <additional changes if applicable>

   ## Test plan
   - [ ] Lint passes (`pnpm lint`)
   - [ ] Build succeeds (`pnpm build`)
   - [ ] <additional manual testing steps if needed>

   ---
   Generated with [Claude Code](https://claude.ai/code)
   EOF
   )"
   ```

PR title guidelines:

- Use format: `<type>: <description>` (e.g., `feat: add user authentication`)
- Keep under 72 characters
- Be specific about what the PR accomplishes

PR body guidelines:

- Summary section: 1-3 bullet points explaining what changed and why
- Test plan section: Checklist of verification steps
- Include Claude Code attribution footer

### Phase 5: Summary

After PR creation, report:

1. **PR URL** - The link to the created pull request
2. **Files Changed** - List of files modified in the PR
3. **Commits Included** - Number of commits in the PR

```bash
gh pr view --json url,changedFiles,commits
```

## Example Usage

### Standalone Usage

```
/create-pr
```

### Called from /task

```
/task --pr Implement feature X with tests
```

### Example Output

```
PR created successfully!

URL: https://github.com/owner/repo/pull/42

Files changed (5):
- src/components/Button.tsx
- src/components/Button.test.tsx
- src/styles/button.css
- src/index.ts
- package.json

Commits: 2
```

## Error Handling

| Scenario                 | Action                                            |
| ------------------------ | ------------------------------------------------- |
| On main/master branch    | Abort with message to create a feature branch     |
| Lint fails               | Fix issues, re-run lint, continue when passing    |
| Build fails              | Fix issues, re-run build, continue when passing   |
| No remote configured     | Use `git push -u origin <branch>` to set upstream |
| PR already exists        | Report existing PR URL instead of creating new    |
| gh CLI not authenticated | Prompt user to run `gh auth login`                |

## Important Notes

- Always use HEREDOC syntax for multi-line commit messages and PR bodies
- The command is idempotent - running it again will update existing PR if one exists
- Quality checks (lint + build) are mandatory and cannot be skipped
- All commits include `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>` footer
- The command works both standalone and when invoked from other commands
