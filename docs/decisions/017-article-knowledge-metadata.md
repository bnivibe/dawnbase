# ADR-017: Article Knowledge-Metadata Layer (verification, multi-source, relations)

**Date**: 2026-06-14
**Status**: Accepted
**Phase**: Phase 1

---

## Context

Dawnbase is a **knowledge archive**. Its articles increasingly cite external sources (YouTube, blogs)
and assert facts that can go out of date. Today an article carries only a single `sourceUrl` /
`sourceType` pair and has **no notion of trust or freshness** — there is no way to express "this article's
claims were verified on date X", "this is due for a re-check", or "these are the multiple sources behind it".

This is the same gap addressed by a separate, real-world knowledge system (NHN FashionGo's Claude
`knowledge` workflow): its `verify` mode (Dooray #29) tracks per-claim verification state against a source
of truth, and its RAG plan (Dooray #46) uses that verification state as a search-ranking weight. The
analysis of that system is archived under `~/Documents/dooray-insights/`.

dawnbase is also mid-decision on a **DB → file-based** migration. Any metadata we add must work
identically whether articles live in PostgreSQL columns or in markdown frontmatter, so the migration
stays loss-free.

## Decision

Add an optional, backward-compatible **knowledge-metadata layer** to the Article model:

| Field | Type | Purpose |
|-------|------|---------|
| `verified` | enum `verified \| partial \| unverified \| stale` | trust/freshness state of the article's claims |
| `verifiedAt` | timestamp, nullable | when last verified |
| `sources` | jsonb `ArticleSource[]`, nullable | multiple cited sources (supersedes single `sourceUrl`/`sourceType`) |
| `relatedSlugs` | text[], nullable | soft links to related articles (no FK) |
| `reviewDueAt` | timestamp, nullable | when the article is due for a freshness re-check |

The canonical field **shape is identical** for the DB-retained and file-based directions; only the
storage mechanism differs (Drizzle columns now; the same fields as gray-matter frontmatter later).

## Reasons

### 1. A knowledge archive needs trust signals
`unverified` vs `stale` vs `verified` is the core distinction the archive currently can't express. A
boolean would collapse "never checked" and "checked but now outdated" into one — exactly the failure mode
the source-of-truth `verify` system (Dooray #29) was built to avoid.

### 2. Backward compatible by construction (Dooray #25 "통합 ≠ 병합")
All new fields are nullable or defaulted. `verified` defaults to `unverified`, so the migration is purely
additive and existing rows are valid without backfill. The legacy `sourceUrl`/`sourceType` pair is
retained; a `resolveSources()` adapter maps it into the new `sources[]` shape on read. `relatedSlugs` is a
soft link (no foreign key) so articles stay loosely coupled.

### 3. Migration-safe
One shared shape across DB and files removes a blocker from the DB→file plan (ADR-016 / Phase 1.2 line).

### 4. Foundation for later features
`verified` becomes the badge signal in the UI and the ranking weight for a future "ask my archive" RAG
feature (Dooray #46). `reviewDueAt` powers a "stale sweep" that flags articles due for re-check
(mirrors the `daily-check` idea in Dooray #29).

## Scope

This ADR covers **only the metadata shape + migration + Zod schema + backward-compat adapter + spec**.
Explicitly out of scope (separate future specs): the trust badge UI, the stale-sweep script, and the RAG
search feature.

## Consequences

### Positive
- Articles can now carry trust/freshness state and multiple sources.
- Migration is additive and loss-free; existing articles untouched.
- DB→file move is unblocked (shared shape).

### Negative
- One new enum type and five new columns to maintain.
- The migration (`0001_elite_deathbird.sql`) must be applied (`drizzle-kit migrate`) before the new fields
  are usable. **Not auto-applied** by this change — left to the maintainer to run against dev/prod DBs.

### Neutral
- `sourceUrl`/`sourceType` remain but are now considered legacy; new writes should prefer `sources[]`.

## Implementation

- `src/lib/db/schema/articles.ts` — `verifiedStateEnum`, 5 columns, 2 indexes, `ArticleSource` type.
- `src/lib/validations/article.ts` — `VerifiedStateEnum`, `ArticleSourceSchema`, extended Create/Update/Article
  schemas, `resolveSources()` adapter.
- `src/lib/db/articles-repository.ts` — pass-through of new fields in create/update.
- `src/lib/db/migrations/0001_elite_deathbird.sql` — generated additive migration.
- `src/lib/validations/__tests__/article.test.ts` — unit tests for the adapter and schema defaults.
- `specs/data-models/article.spec.md` — spec updated (also fixed a stale SQLite schema block → PostgreSQL).

## References
- ADR-016 — NotebookLM analysis layer (related Phase 1.2 direction)
- Dooray #29 — Knowledge verify mode (source-of-truth verification)
- Dooray #46 — Knowledge RAG (verification state as ranking weight)
- Dooray #25 — project-analyze ↔ knowledge (loose cross-reference principle)
- Analysis archive: `~/Documents/dooray-insights/`
