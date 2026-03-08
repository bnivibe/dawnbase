# Git Workflow

This project follows **GitLab Flow** with environment branches.

## Core Principle

Changes flow **upstream-first**: feature branches merge into `main`, then `main` promotes to `staging`, then `staging` promotes to `production`. No branch may skip a step.

## Branch Structure

| Branch | Role | Deploy Target |
|--------|------|---------------|
| `main` | Integration — all features land here | Vercel Preview (dev) |
| `staging` | Staging gate — validated before production | Vercel Preview (staging) |
| `production` | Live traffic | Vercel Production |

`staging` and `production` are **protected** — no direct commits, no deletion.

## Flow

```
feature/... → main → staging → production
     PR          PR       PR
```

1. **Create a branch** from `main` before any work
2. **Commit** small, focused changes
3. **Push** and open a PR targeting `main` (Draft PR if still in progress)
4. **Merge** to `main` via PR — handled by repository owner via browser
5. **Promote to staging**: open a PR from `main` → `staging`, merge after verification
6. **Promote to production**: open a PR from `staging` → `production`, merge when ready to release

## Branch Naming

```
[type]/[short-description]
```

| Type | When to use |
|------|-------------|
| `feature` | New functionality |
| `fix` | Bug fix |
| `hotfix` | Urgent production fix |
| `docs` | Documentation only |
| `chore` | Maintenance, config, tooling |
| `refactor` | Code restructuring without behavior change |

**Examples:**
- `feature/add-login-page`
- `fix/auth-bug`
- `docs/update-readme`

## Commit Messages

Follows [Conventional Commits](https://www.conventionalcommits.org/):

```
[prefix] type(optional-scope): description
```

- `[bnivibe]` — user-requested commit
- `[claude]` — Claude auto commit

**Examples:**
```
[bnivibe] feat: add article search
[claude] fix: resolve null pointer in auth middleware
[claude] docs(specs): update Phase 1 spec status
```

## Hotfix

Same upstream-first rule applies — no skipping staging:

1. Branch from latest `main`
2. Fix, push, open PR with high-priority label → merge to `main`
3. Promote `main` → `staging` → verify
4. Promote `staging` → `production` → deploy ASAP

## Environment Promotion PRs

Promotion PRs (`main` → `staging`, `staging` → `production`) should:
- Have a clear title: e.g., `chore: promote main to staging (2026-03-08)`
- Reference the feature PRs included in the promotion

## Security

This repository is **public**. Before every commit:
- Verify no secrets, API keys, or credentials are included
- If found, manage locally or encrypt — never commit
- Record security-related changes in `docs/decisions/`
