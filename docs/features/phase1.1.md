# Dawnbase — Feature Specification (Phase 1.1)

## Overview

Dawnbase is Dawn's personal knowledge archive. The web interface is **read-only** — visitors browse and read articles. All content creation and management is handled by Claude directly via the database.

**Phase:** 1.1
**Last Updated:** 2026-03-08

---

## Pages

### 1. Dashboard (`/`)

- [x] Total Articles stat card — displays total count of non-archived articles
- [x] Drafts stat card — displays count of draft articles
- [x] Published stat card — displays count of published articles
- [x] Remove "New Article" entry point — remove "Create First Article" button from Dashboard

---

### 2. Article List (`/articles`)

- [x] Article list — displays list of non-archived articles
- [x] Article card — displays title, status badge, excerpt, and created date
- [x] Status badge — Published (green), Draft (outline), Archived (muted)
- [x] Published date — shows published date only for published articles
- [x] Click → navigate to detail — clicking card navigates to slug-based detail page
- [x] Empty state — displays guidance message when no articles exist
- [x] Pagination — supports `?page`, `?limit` query params, defaults to 10 per page

---

### 3. Article Detail (`/articles/[slug]`)

- [x] Title — displays article title as heading
- [x] Status badge — current status (Published / Draft / Archived)
- [x] Meta info — displays created date, updated date, and published date
- [x] Source link — displays external link with source_type when source_url exists
- [x] Body — displays article content (plain text, whitespace-pre-wrap)
- [x] Back button — navigates to `/articles` list
- [x] 404 handling — shows not-found page when slug does not exist
- [ ] Markdown rendering — currently plain text, planned for Phase 3

---

## App Shell

### 4. Sidebar (Desktop, `md` and above)

- [x] Logo + site name — BookOpen icon + "Dawnbase" text
- [x] Dashboard nav — `/` link, highlights active current path
- [x] Articles nav — `/articles` link, highlights active current path
- [x] Categories nav — disabled, shows "(Phase 2)"
- [x] Search nav — disabled, shows "(Phase 2)"
- [x] Collapse/expand — toggles between full (256px) ↔ icon-only (64px)
- [x] Collapsed tooltip — shows label tooltip on icon hover
- [x] State persistence — saves collapsed state to `localStorage`
- [x] Remove "New Article" button — remove sidebar bottom button (desktop + mobile)

---

### 5. Header

- [x] Site title — "Dawn's Knowledge Base"
- [x] Search input — visible on `sm`+ screens, disabled, "Search coming in Phase 2..."
- [x] Theme toggle — button to switch between light / dark mode
- [x] Mobile menu button — visible below `md`, opens mobile sidebar on click

---

### 6. Mobile Sidebar (below `md`)

- [x] Logo + site name — same as desktop sidebar
- [x] Navigation — Dashboard, Articles, Categories (disabled), Search (disabled)
- [x] Active state — highlights current path
- [x] Remove "New Article" button — remove bottom button

---

### 7. Theme

- [x] Light / dark mode — toggle via header button
- [x] System default — follows system preference on first visit
- [x] Preference persistence — selection saved via `next-themes`

---

## API (Read Only)

- [x] `GET /api/articles` — fetch article list (pagination, filter)
- [x] `GET /api/articles/[id]` — fetch single article

> All write routes (`POST`, `PUT`, `DELETE`) are removed. Content management is handled directly by Claude via the repository layer.

---

## Out of Scope (Phase 2+)

| Feature | Planned Phase |
|---------|--------------|
| Search | Phase 2 |
| Category / Tag Filter | Phase 2 |
| Markdown Rendering | Phase 3 |
| Image / Media Display | Phase 3 |
| User Authentication | Phase 4 |
