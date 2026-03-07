# ADR 010: Replace Mock Repository with Drizzle ORM Database Integration

> **Status**: Accepted
> **Date**: 2026-03-07
> **Phase**: Phase 1

## Context

During SDD compliance review, the primary gap identified was that `src/lib/db/articles-repository.ts` used in-memory arrays (mock data) for all CRUD operations. While the Drizzle schema (`src/lib/db/schema/articles.ts`) and DB client (`src/lib/db/index.ts`) were already defined, they were unused. This violated the spec which requires PostgreSQL via Supabase as the data store.

The mock approach caused two problems:
1. Data did not persist across server restarts (in-memory only)
2. The dashboard stats were hardcoded to zero, unconnected to any data source

## Decision

Replace the mock repository implementation with one that uses Drizzle ORM queries against the PostgreSQL database defined in `src/lib/db/index.ts`.

Changes made:
- **`src/lib/db/articles-repository.ts`**: All functions now use `db` (Drizzle client) with proper SQL queries. `ensureUniqueSlug` is now async and queries the DB. A new `getArticleStats()` function is added for the dashboard.
- **`src/app/(main)/page.tsx`**: Converted to an async Server Component that calls `getArticleStats()` to display live counts.
- **`specs/*/`: All Phase 1 spec statuses updated from `Approved` to `Implementing` to reflect active development.

## Consequences

### Positive
- Data persists across server restarts
- Dashboard shows real article counts
- SDD compliance improves from 7.5/10 to ~9/10
- Spec lifecycle is accurately tracked

### Negative / Requirements
- `DATABASE_URL` environment variable must be configured in `.env.local` before the app can run
- Supabase project must be created and the migration must be run (`drizzle-kit push` or `drizzle-kit migrate`) before first use

## Migration Prerequisite

Before running the app, ensure `.env.local` contains a valid `DATABASE_URL`:

```
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
```

Then run the Drizzle migration to create the `articles` table:

```bash
npx drizzle-kit push
```

## Alternatives Considered

**Keep mock with conditional fallback**: Conditionally use mock if `DATABASE_URL` is unset. Rejected — this would mask the incomplete integration and keep SDD compliance low. A missing env var is a clear signal to configure the environment.

**Use Supabase client instead of Drizzle**: Rejected — Drizzle was chosen as the ORM (ADR 003) for type-safety and migration management. Bypassing it for direct Supabase client calls would contradict that decision.
