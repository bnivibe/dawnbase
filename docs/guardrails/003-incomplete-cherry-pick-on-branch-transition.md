# Guardrail 003: Incomplete Cherry-pick When Transitioning from a Merged Branch

## Date
2026-03-08

## What Happened

After PR #11 (`docs/phase1-1-followup`) was merged, three new commits had accumulated on the stale branch:

1. `guardrails/` directory (README + 001 incident file)
2. ADR-013
3. README update — added `guardrails/` to project structure

When the git-push skill detected the merged branch, it created a new branch (`docs/guardrails-setup`) and cherry-picked commits. However, only the guardrails files and ADR-013 were moved over. The README update commit was missed.

As a result, the main README did not reflect the `guardrails/` directory until the user pointed it out and a separate fix was committed.

## Root Cause

When transitioning to a new branch, Claude selected commits to cherry-pick based on perceived relevance (guardrails content) rather than systematically identifying **all** commits that were ahead of `main` on the stale branch.

## Fix Applied

- Committed the missing README update separately to `docs/guardrails-setup`
- Updated the git-push skill: when creating a new branch from a merged branch, run `git log origin/main..<merged-branch> --oneline` first to list **all** commits ahead of main, then cherry-pick all of them without exception

## How to Prevent Recurrence

- When transitioning from a merged branch to a new one, always run `git log origin/main..HEAD --oneline` to get the full list of commits to bring over
- Cherry-pick **all** commits in that list — do not selectively pick based on assumed relevance
- After cherry-picking, verify with `git log origin/main..HEAD --oneline` on the new branch to confirm nothing was missed
