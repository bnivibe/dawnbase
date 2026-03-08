# Git Workflow

This project follows **GitHub Flow**.

## Core Principle

`main` is always deployable. All changes go through a short-lived branch and a Pull Request.

## Flow

```
main → branch → commits → push → PR → merge → deploy
```

1. **Create a branch** from `main` before any work
2. **Commit** small, focused changes
3. **Push** and immediately open a PR (Draft PR if still in progress)
4. **Merge** to `main` via PR after review — handled by the repository owner via browser
5. **Deploy** immediately after merge

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

Same flow as normal, but:
- Branch from latest `main`
- Fix, push, open PR with high-priority label
- Merge and deploy ASAP

## Security

This repository is **public**. Before every commit:
- Verify no secrets, API keys, or credentials are included
- If found, manage locally or encrypt — never commit
