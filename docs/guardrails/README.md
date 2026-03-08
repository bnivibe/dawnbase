# Guardrails

A collection of incident records documenting unintended Claude behaviors that occurred during development, along with the fixes applied to prevent recurrence.

## Purpose

These documents exist to:
1. Record what went wrong and why
2. Track what was fixed (skill updates, rule changes)
3. Serve as a reference to ensure the same mistake does not happen again

Each file represents one incident. When a new unintended behavior is discovered, a new guardrail document is added here.

## Index

| # | Title | Date |
|---|-------|------|
| [001](./001-merged-branch-commit.md) | Committing to an Already-Merged Branch | 2026-03-08 |
| [002](./002-push-skipped-before-pr-reference.md) | Referencing a PR Without Actually Pushing | 2026-03-08 |
| [003](./003-incomplete-cherry-pick-on-branch-transition.md) | Incomplete Cherry-pick When Transitioning from a Merged Branch | 2026-03-08 |
