# ADR-013: Introduce Guardrails Documentation for Claude Behavior

## Status
Accepted

## Date
2026-03-08

## Context

This project uses Claude as an active development participant — committing code, managing branches, opening PRs, and writing content directly to the database. This level of autonomy creates a risk of unintended actions that are hard to reverse.

On 2026-03-08, an incident occurred where Claude continued committing new work to a branch (`feature/phase1-1-content-pipeline`) that had already been merged into `main` via PR #10. Claude did not check the PR merge status before proceeding, resulting in 4 commits accumulating on a stale branch. The work had to be recovered by cherry-picking onto a new branch and opening a new PR.

This incident revealed that:
1. Claude's tools (skills) lacked sufficient safeguards
2. There was no structured way to record, learn from, and prevent recurring unintended behaviors

## Decision

Introduce a `docs/guardrails/` directory to serve as a dedicated incident log for unintended Claude behaviors.

Each file in `docs/guardrails/` documents:
- What happened
- Root cause
- Fix applied (skill update, rule change, etc.)
- How to prevent recurrence

Additionally, the `git-push` skill (`~/.claude/commands/git-push.md`) was updated to check whether the current branch has already been merged into `main` before proceeding with any commits or pushes.

## Consequences

### Positive
- Unintended behaviors are formally recorded and reviewed
- Fixes are traceable — each guardrail links to the skill or rule that was changed
- The log grows over time, building a clearer picture of Claude's failure modes in this workflow
- Future incidents can reference past guardrails to avoid repeat patterns

### Negative / Trade-offs
- Requires discipline to add a guardrail entry whenever a new unintended behavior is discovered
- Does not prevent all unintended actions — only those that have already been encountered

## References

- [docs/guardrails/001-merged-branch-commit.md](../guardrails/001-merged-branch-commit.md)
- [docs/guardrails/README.md](../guardrails/README.md)
