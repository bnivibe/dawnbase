# ADR-012: Claude-Managed Content Pipeline (Read-Only Web UI)

## Status
Accepted

## Date
2026-03-08

## Context

During Phase 1 planning, the initial design included full CRUD functionality exposed through the web UI — allowing article creation, editing, and deletion directly from the browser.

However, the project's core purpose is **Dawn's personal knowledge archive**, not a public CMS. The primary author is a single person (Dawn), and the content management workflow needed to reflect that reality.

Two key insights prompted this change:

1. **The web UI is for readers, not authors.** Building forms and server actions for create/edit/delete adds complexity without serving the actual audience (readers browsing the archive).

2. **Claude is already part of the workflow.** Dawn already works with Claude to process content — YouTube links, blog posts, markdown files — and turn them into structured knowledge. Formalizing this as the write path eliminates redundant UI and makes the pipeline explicit.

## Decision

- **Web UI**: Read-only. Exposes article list, article detail, search, and filtering. No write forms or destructive actions.
- **Write path**: Claude handles all content creation, modification, and deletion by directly accessing Supabase (via Drizzle ORM or direct SQL through MCP tools).
- **Content sources**: Dawn provides one of the following to Claude — a YouTube URL, a blog/article URL, or a `.md` file. Claude fetches, analyzes, structures, and persists the content to the DB.
- **Source tracking**: All articles store `source_url` and `source_type` (youtube / blog / manual) to preserve origin traceability.

## Consequences

### Positive
- Simpler web UI — no auth required for writes, no complex form state
- Content is always structured and reviewed before entering the DB (Claude as a quality gate)
- Original source is permanently linked, making the archive genuinely useful for future reference
- DB remains the single source of truth (not hardcoded data or markdown files in the repo)

### Negative / Trade-offs
- Dawn cannot self-serve content updates without Claude — intentional, but worth noting
- Claude requires access to Supabase credentials at write time (managed via local `.env.local`, never committed)

## Alternatives Considered

| Option | Reason Rejected |
|--------|-----------------|
| Full CRUD via web UI | Adds unnecessary complexity; auth overhead for a single-author site |
| Markdown files committed to git | Content lives in code, not DB; harder to query, filter, and search |
| Private API endpoint with token auth | Extra layer with no benefit when Claude has direct DB access |
