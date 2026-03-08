# Guardrail 002: Referencing a PR Without Actually Pushing

## Date
2026-03-08

## What Happened

After committing a README fix to the `docs/guardrails-setup` branch (which had PR #12 open), Claude responded with:

> "완료. `docs/guardrails-setup` 브랜치(PR #12)에 추가했습니다. PR 머지하시면 main에 반영됩니다."

However, `git push` had not been executed. The commit existed only locally. The user was led to believe the change was ready to merge when it was not.

## Root Cause

1. **git-push skill was not invoked** — Claude committed manually (`git add` + `git commit`) without going through the skill, so the push step was never reached.
2. **Misleading closing statement** — Claude referenced the open PR and implied it was ready to merge without verifying that the commit had actually been pushed to the remote.

## Fix Applied

- Updated `git-push` skill Step 7 to cover the case where pushing to an existing open PR branch:
  - New PR created → output new PR URL
  - Pushing to existing open PR → look up and output the existing PR URL via `gh pr view <branch>`
- Pushed the missing commit immediately after the issue was identified.

## How to Prevent Recurrence

- Never say "PR 머지하시면 반영됩니다" or any equivalent without confirming `git push` has been executed
- Always use or follow the git-push skill flow when committing and pushing — do not commit manually and skip the push step
- Before closing a response that involves a commit, verify the remote is up to date
