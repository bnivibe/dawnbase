# Phase 1: Foundation

## Status
In Progress

## Date
2026-03-07

## Goal
Project scaffolding + SDD structure + basic app shell + article CRUD

Build a fully functional foundational application. This includes project scaffolding, establishing the SDD (Spec-Driven Development) structure, basic app shell layout, and Article CRUD functionality.

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js (App Router) | 15 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS | 4 |
| UI Components | shadcn/ui | latest |
| Database | PostgreSQL via Supabase | - |
| ORM | Drizzle ORM | latest |
| Validation | Zod | latest |
| Deployment | Vercel | - |

---

## Steps

### Step 1: Repository Creation
- [x] Create GitHub repository (`bnivibe/dawnbase`)
- [x] Write initial README.md
- [x] Configure `.gitignore`

### Step 2: Project Scaffolding
- [x] Create Next.js project with `create-next-app`
- [x] Configure TypeScript, Tailwind CSS, App Router
- [x] Configure ESLint
- [ ] Initialize shadcn/ui
- [ ] Set up Drizzle ORM + Supabase connection
- [ ] Install and configure Zod

### Step 3: SDD Structure
- [x] Create `specs/` directory structure
- [x] Write SDD methodology README
- [x] Write spec template files (data-model, api-endpoint, ui-component, user-flow)
- [x] Write Phase 1 spec documents
  - [x] `specs/data-models/article.spec.md`
  - [x] `specs/ui/layout.spec.md`
  - [x] `specs/api/articles-api.spec.md`
  - [x] `specs/flows/create-article.flow.md`

### Step 4: Database Schema
- [ ] Define Article table schema (Drizzle)
- [ ] Generate and run migration files
- [ ] Prepare seed data (for development)

### Step 5: App Shell
- [ ] Implement root layout (`src/app/layout.tsx`)
- [ ] Header component (logo, navigation)
- [ ] Sidebar component (category navigation, to be expanded in Phase 2)
- [ ] Main content area
- [ ] Dark/light theme toggle
- [ ] Responsive layout (mobile/desktop)

### Step 6: Article CRUD
- [ ] **Create**: New article form + Server Action
- [ ] **Read**: Article list page + detail page
- [ ] **Update**: Article edit form + Server Action
- [ ] **Delete**: Article deletion confirmation + Server Action
- [ ] Input validation with Zod schemas
- [ ] Error handling and user feedback

### Step 7: PR & Review
- [ ] Complete work on feature branch
- [ ] Verify tests pass
- [ ] Create PR and review

---

## Roadmap Overview

### Phase 1: Foundation (Current)
Core data model, basic CRUD, app shell layout

### Phase 2: Organization & Search
Category system, tags, full-text search, filtering

### Phase 3: Rich Content
Advanced markdown editor (code highlighting, media embedding), media management (image upload/optimization)

### Phase 4: Auth & Deploy
User authentication (Supabase Auth), permission management, production deployment (Vercel), monitoring

---

## Status Tracking

| Component | Status | Notes |
|-----------|--------|-------|
| Repository | Done | GitHub repository created |
| Scaffolding | In Progress | Next.js + Tailwind basic setup complete |
| SDD Structure | Done | Spec templates and Phase 1 specs written |
| Database Schema | Not Started | - |
| App Shell | Not Started | - |
| Article CRUD | Not Started | - |
| PR & Review | Not Started | - |
