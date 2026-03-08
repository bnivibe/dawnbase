# Admin Guide

Dawnbase has a lightweight admin mode for content management tasks that require authentication. This is a temporary password-based system until Phase 4 (Supabase Auth).

---

## Login

### 1. Open the login page

Click **Admin** at the bottom of the sidebar, or navigate directly to:

```
/admin/login
```

### 2. Enter the password

The admin password is set via the `ADMIN_PASSWORD` environment variable in `.env.local`. It is never stored in the codebase.

### 3. Session

On success, a session cookie is issued and you are redirected to the home page. The session lasts **7 days** and is automatically invalidated if `ADMIN_PASSWORD` changes.

### Logout

Click **Logout** at the bottom of the sidebar to end the session immediately.

---

## Features Requiring Login

### Publish / Unpublish an Article

**Where:** Article detail page (`/articles/<slug>`)

**How:**
1. Log in as admin
2. Open any article
3. A **Publish** or **Unpublish** button appears next to the status badge
4. Click to toggle the article status between `draft` and `published`

| Status | Button shown | Action |
|--------|-------------|--------|
| `draft` | **Publish** | Sets status to `published`, records `publishedAt` timestamp |
| `published` | **Unpublish** | Sets status back to `draft`, clears `publishedAt` |

> Articles with `archived` status cannot be toggled from the UI — use the content pipeline directly.

---

## Security Notes

- The admin password is stored only in `.env.local` (git-ignored, never committed)
- The session cookie is `httpOnly` and `sameSite=strict`; in production it is also `secure`
- All state changes are validated server-side — the cookie is re-checked on every publish/unpublish action
- This system is intentionally minimal and will be replaced by Supabase Auth in Phase 4

See [ADR-013 — Guardrails for Claude behavior](../decisions/013-guardrails-for-claude-behavior.md) for related security decisions.

---

## Planned Improvements (Phase 4)

| Current | Phase 4 |
|---------|---------|
| Password in `.env.local` | Supabase Auth (email + OAuth) |
| Single shared session | Per-user sessions with roles |
| No audit trail | Login history and action logs |
