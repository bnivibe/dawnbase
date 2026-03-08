# Dawnbase

Dawn's Knowledge Archive — A personal knowledge archiving website for organizing things learned and collected.

> **Status:** Phase 1.1 complete — Read-only web UI with Claude-managed content pipeline

## Overview

Dawnbase is a **read-only knowledge archive**. Articles are created and managed by Claude directly via the database — not through the web UI. Dawn provides source material (YouTube links, blog posts, or `.md` files) and Claude processes, structures, and persists the content.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router, TypeScript, Turbopack) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL via Supabase |
| ORM | Drizzle ORM |
| Validation | Zod |
| Testing | Vitest |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+
- Supabase account (for database)

### Installation

```bash
git clone https://github.com/bnivibe/dawnbase.git
cd dawnbase
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
```

### Database Setup

```bash
npx drizzle-kit push
```

### Development

```bash
npm run dev        # start dev server (Turbopack)
npm test           # run unit tests
npm run test:watch # run tests in watch mode
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
dawnbase/
  docs/
    guides/         # How-to guides (content pipeline, workflows)
    plans/          # Plan history (what to build)
    decisions/      # ADR - Architecture Decision Records (why)
    guardrails/     # Incident records for unintended Claude behaviors
    ideas.md        # Feature ideas and design thoughts
    git-workflow.md # Git workflow guide
  specs/
    features/       # Phase-versioned feature checklists
    data-models/    # Data model specs
    api/            # API endpoint specs
    ui/             # UI component specs
    flows/          # User flow specs
  src/
    app/            # Next.js App Router (pages, API routes)
    components/     # React components (ui, layout)
    lib/            # Business logic (db, validations, utils)
    types/          # TypeScript type definitions
```

## Content Pipeline

Articles are not written through the web UI — they are created by Claude via the **content pipeline**:

```
You provide one of:
  ├── YouTube URL        → Claude fetches and summarizes the video
  ├── Blog / Article URL → Claude fetches and parses the content
  └── .md summary file   → Claude reads and structures your notes

Claude then structures, stores, and confirms the result.
```

| Document | Description |
|----------|-------------|
| [docs/guides/post-article.md](./docs/guides/post-article.md) | How to post an article (usage guide) |
| [specs/flows/claude-content-pipeline.flow.md](./specs/flows/claude-content-pipeline.flow.md) | Pipeline flow spec |
| [docs/decisions/012-claude-managed-content-pipeline.md](./docs/decisions/012-claude-managed-content-pipeline.md) | Why this approach was chosen (ADR-012) |

---

## Development Methodology

This project follows **SDD (Spec-Driven Development)**:

1. Write specs in `specs/` before implementation
2. Implement based on specs
3. Track decisions in `docs/decisions/` (ADR)
4. Track plans in `docs/plans/`

See [specs/README.md](./specs/README.md) for full SDD guide.

## Git Workflow

This project follows **GitLab Flow** with environment branches:

```
feature/... → main → staging → production
```

| Branch | Role |
|--------|------|
| `main` | Integration — all features land here |
| `staging` | Staging gate |
| `production` | Live traffic |

See [docs/git-workflow.md](./docs/git-workflow.md) for details.

## Roadmap

| Phase | Name | Description | Status |
|-------|------|-------------|--------|
| 1.1 | Foundation | Read-only web UI + Claude content pipeline + Markdown rendering | ✅ Completed |
| 2 | Organization & Search | Categories, tags, full-text search, filtering | Planned |
| 3 | Rich Content | Image/media support, rich embeds | Planned |
| 4 | Auth & Deploy | Supabase Auth, permissions, production deployment | Planned |

## License

Private project.
