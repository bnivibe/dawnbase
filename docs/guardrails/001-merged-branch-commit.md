# Guardrail 001: Committing to an Already-Merged Branch

## Date
2026-03-08

## What Happened

After PR #10 (`feature/phase1-1-content-pipeline`) was merged into `main` by the user, Claude continued committing new work to the same branch without detecting that it had already been merged.

As a result:
- 4 commits (feature spec, UI cleanup, README update, ideas.md) accumulated on the merged branch
- When `git-push` was finally invoked, Claude pushed to the stale branch and referenced PR #10 as if it were still active
- The commits had to be cherry-picked onto a new branch (`docs/phase1-1-followup`) and a new PR (#11) was opened to recover the work

## Root Cause

The `git-push` skill only checked whether the current branch was `main`. It had no logic to detect whether the current branch had already been merged into `main`.

Additionally, Claude did not proactively check PR status before continuing work on an existing branch.

## Fix Applied

Updated `~/.claude/commands/git-push.md` to add a merged branch check as Step 1:

- Before proceeding, run `gh pr list --state merged --head <current-branch>` to detect if the branch was already merged
- If merged → STOP, notify the user, and ask for a new branch name before doing anything

## How to Prevent Recurrence

- **git-push skill**: Now checks for merged status before committing or pushing (fixed)
- **Claude behavior**: When resuming work across sessions or after a user has been away, always check current branch status and open PR state before committing new work
- **Rule of thumb**: If a PR was recently created on the current branch, verify its status (`gh pr list`) before adding more commits
