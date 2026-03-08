# ADR 011: Adopt GitLab Flow (Environment Branches)

- **Date:** 2026-03-08
- **Status:** Accepted
- **Replaces:** GitHub Flow (informal, undocumented)

## Context

The project initially used GitHub Flow: a single `main` branch that was always deployable, with feature branches merged directly into it and deployed immediately.

As the project matures, two issues became apparent:

1. **No staging gate.** Changes merged to `main` deploy directly to production (Vercel). There is no intermediate environment to validate behavior before end users are affected.
2. **No environment isolation.** It is impossible to separate "code ready for review" from "code tested in a production-like environment" from "code serving live traffic."

GitLab Flow with environment branches solves both issues by introducing explicit `staging` and `production` branches that map 1:1 to Vercel deployment environments.

## Decision

Adopt **GitLab Flow** with environment branches:

```
feature/... → main → staging → production
```

- `main` — integration branch; all feature branches merge here first
- `staging` — maps to Vercel Preview (staging environment); promoted from `main`
- `production` — maps to Vercel Production; promoted from `staging` only

### Rules

- All feature work merges into `main` via Pull Request
- `staging` is updated only by merging `main` → `staging` (no direct commits)
- `production` is updated only by merging `staging` → `production` (no direct commits)
- Hotfixes follow the same upstream-first path: fix in `main` → promote to `staging` → promote to `production`
- Environment branches (`staging`, `production`) are protected — never deleted

## Consequences

### Benefits
- Changes are validated in a staging environment before reaching production
- Clear audit trail of what is in each environment at any point
- Vercel's branch-based deploy previews map naturally to this structure
- Hotfix discipline enforced: no skipping staging

### Trade-offs
- Slightly longer promotion cycle (main → staging → production) compared to GitHub Flow's single merge
- Two additional long-lived branches to maintain

## Vercel Mapping

| Branch | Vercel Environment | URL |
|--------|--------------------|-----|
| `main` | Preview (development) | Auto-generated preview URL |
| `staging` | Preview (staging) | Dedicated preview URL |
| `production` | Production | Custom domain |

Configure in Vercel → Project Settings → Git → Production Branch: `production`.
