# Admin Login Flow

> **Phase**: Phase 1.1
> **Status**: Implemented
> **Last Updated**: 2026-03-08

## Overview

Dawnbase has a minimal admin mode for content management. Authentication uses a server-side password check and an httpOnly session cookie. This is a temporary solution until Phase 4 (Supabase Auth).

---

## Login Flow

### Trigger
User clicks **Admin** in the sidebar bottom section (unauthenticated state).

### Steps

```
1. Navigate to /admin/login
2. Enter password in the form
3. Submit (Server Action: loginAction)
   ├── Password incorrect → show inline error "Incorrect password"
   └── Password correct
         ├── Issue session cookie (httpOnly, sameSite=strict, 7-day TTL)
         └── Redirect to /
4. Sidebar now shows "Logout" instead of "Admin"
5. Article detail pages now show Publish / Unpublish button
```

### Session Details

| Property | Value |
|----------|-------|
| Cookie name | `dawnbase_admin` |
| Value | `sha256(ADMIN_PASSWORD)` — auto-invalidates on password change |
| `httpOnly` | true |
| `secure` | true (production only) |
| `sameSite` | strict |
| Expiry | 7 days |

---

## Logout Flow

### Trigger
User clicks **Logout** in the sidebar bottom section (authenticated state).

### Steps

```
1. Submit logout form (Server Action: logoutAction)
2. Session cookie is deleted
3. Redirect to /
4. Sidebar reverts to showing "Admin" link
5. Publish / Unpublish buttons are no longer visible
```

---

## Publish / Unpublish Flow

### Trigger
Admin views an article detail page (`/articles/[slug]`).

### Steps

```
Article status: draft
  → "Publish" button shown
  → Click → publishArticleAction(id)
       ├── Cookie re-validated server-side
       ├── status updated to "published"
       ├── publishedAt set to now
       └── Page refreshes with updated status badge

Article status: published
  → "Unpublish" button shown
  → Click → unpublishArticleAction(id)
       ├── Cookie re-validated server-side
       ├── status updated to "draft"
       ├── publishedAt cleared to null
       └── Page refreshes with updated status badge
```

> Articles with `archived` status cannot be toggled from the UI. Use the content pipeline directly.

---

## Related

- [ADR-015 — Browser Admin Publish Before Phase 4 Auth](../decisions/015-browser-admin-publish.md)
- [docs/guides/admin.md](../guides/admin.md)
- `src/lib/admin-auth.ts`
- `src/actions/admin.ts`
