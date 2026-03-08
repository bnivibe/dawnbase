# Dawnbase - Project Instructions

## Project Overview
Dawn's Knowledge Archive — A personal knowledge archiving website for organizing things learned and scrapped.

## Owner
- Name: Dawn
- Email exposure: OK (public repository, email in git history is acceptable)

## SDD (Spec-Driven Development) Rules
- **Spec First:** Always check or write the relevant spec in `specs/` before implementing a new feature
- **Spec is Truth:** If spec and implementation disagree, the spec takes priority. Update the spec or fix the code to match
- **Phase-based:** Only implement specs for the current Phase. Do not implement features outside the current Phase scope

## Tech Stack
- Next.js 15 (App Router, TypeScript, Turbopack)
- Tailwind CSS + shadcn/ui
- PostgreSQL via Supabase
- Drizzle ORM
- Zod (validation)
- Vercel (deployment)

## Directory Structure
- `specs/` — SDD specs (source of truth)
- `docs/plans/` — Plan history (what to build)
- `docs/decisions/` — ADR - Architecture Decision Records (why)
- `src/app/` — Next.js App Router (pages, API routes)
- `src/components/` — React components
- `src/lib/` — Business logic, DB, utilities
- `src/hooks/` — Custom React hooks
- `src/types/` — TypeScript type definitions
- `src/actions/` — Server Actions

## Language Rules
- All text in the project (code comments, documentation, specs, ADRs, plans, README, etc.) must be written in English
- No Korean or other non-English text in any project files

## Conventions
- Component files: PascalCase for components, kebab-case for file names
- DB schema: snake_case for column names
- API routes: RESTful, return JSON with consistent error format
- Validation: Zod schemas in `src/lib/validations/`
- Environment variables: `.env.local` (git-ignored), `.env.example` (tracked)

## Git Workflow

Follows **GitLab Flow** with environment branches. See `docs/git-workflow.md` for full details.

- Never commit directly to `main`, `staging`, or `production`
- `staging` and `production` are protected environment branches — never delete them
- Feature flow: `feature/...` → `main` → `staging` → `production` (upstream-first, no skipping)
- Branch naming: `[type]/[short-description]` (e.g., `feature/add-login`, `fix/auth-bug`)
- Commit format: `[prefix] type: description` — `[bnivibe]` for user-requested, `[claude]` for auto
- `[claude]` commits must include: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
- All changes go through Pull Requests
- Claude must NEVER merge PRs — the user handles merging via browser
- Commits should be as granular and detailed as possible (one concern per commit)

## Security Rules
- Repository is PUBLIC (for portfolio purposes — design process and code are open to everyone)
- Always perform a security check before committing: verify no sensitive data, secrets, or credentials are exposed
- If sensitive content is found, either encrypt it or manage it locally on the user's machine
- Never expose API keys, database passwords, or secret tokens in code or config files
- Record security-related changes in `docs/decisions/` (ADR) with reasons and actions taken

## Change Documentation
- Always propose changes to the user first before proceeding
- Record the reason and details of significant changes in `docs/decisions/` (ADR) or `docs/plans/`
- Keep plan and decision history up to date

## Current Phase
Phase 1: Foundation — Project setup + Article CRUD
