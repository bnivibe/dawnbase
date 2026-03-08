# ADR-015: Browser Admin Publish Before Phase 4 Auth

**Date**: 2026-03-08
**Status**: Accepted
**Phase**: 1.1 (post-content-pipeline)

---

## Context

Phase 1.1 established a Claude-managed content pipeline where all article writes are handled by Claude directly via the repository layer (see [ADR-012](./012-claude-managed-content-pipeline.md)). Articles are inserted as `draft` by default.

This raised a practical problem: to publish an article, Dawn had to either:
1. Ask Claude to run an `updateArticle()` call via the content pipeline, or
2. Connect to the database directly

Both options are high-friction for a simple status toggle. Phase 4 (Supabase Auth) was planned to handle authentication properly, but it was several phases away.

---

## Decision

Add a minimal browser-based admin mode with the following constraints:

- **Password-only authentication** — no user accounts, no OAuth
- **Server-side session cookie** — httpOnly, sameSite=strict, sha256 token
- **Scoped to publish/unpublish only** — no article editing, no deletion UI
- **Clearly marked as temporary** — will be replaced in Phase 4

The admin password is stored in `ADMIN_PASSWORD` (`.env.local`, never committed). The session token is a sha256 hash of the password, so it auto-invalidates when the password changes.

---

## Why Not Wait for Phase 4

| Option | Problem |
|--------|---------|
| Wait for Phase 4 Auth | Too far away; blocks the ability to publish any article |
| Ask Claude each time | High friction; requires a full conversation just to publish |
| Direct DB access | Requires psql/Supabase dashboard; not sustainable |
| Hardcode password in source | Public repo — immediately exposed |

A minimal password gate is low-effort to build and covers the immediate need without blocking Phase 2 or 3 work.

---

## Consequences

### Positive
- Dawn can publish and unpublish articles directly from the browser
- No credentials exposed in the codebase
- Session cookie is secure and auto-invalidates on password change
- Clean upgrade path: Phase 4 replaces this with Supabase Auth

### Negative
- Single shared password — no per-user sessions or audit trail
- If the password is leaked (e.g., through `.env.local` backup), anyone can publish
- Not suitable for multi-user scenarios

---

## Upgrade Path (Phase 4)

This implementation will be replaced by Supabase Auth:

| Current | Phase 4 |
|---------|---------|
| `ADMIN_PASSWORD` env var | Supabase email + OAuth login |
| `dawnbase_admin` session cookie | Supabase JWT session |
| Single shared session | Per-user sessions with roles |
| `src/lib/admin-auth.ts` | Supabase Auth middleware |

---

## Related

- [ADR-012 — Claude-Managed Content Pipeline](./012-claude-managed-content-pipeline.md)
- [specs/flows/admin-login.flow.md](../../specs/flows/admin-login.flow.md)
- [docs/guides/admin.md](../guides/admin.md)
