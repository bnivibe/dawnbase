# Dawnbase

Dawn's Knowledge Archive — A personal knowledge archiving website for organizing things learned and scrapped.

> **Status:** Phase 1 in progress — Article CRUD with database integration complete

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router, TypeScript, Turbopack) |
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
    plans/          # Plan history (what to build)
    decisions/      # ADR - Architecture Decision Records (why)
    git-workflow.md # Git workflow guide
  specs/            # SDD specs (source of truth)
  src/
    app/            # Next.js App Router (pages, API routes)
    components/     # React components (ui, layout, articles)
    lib/            # Business logic (db, validations, utils)
    types/          # TypeScript type definitions
    actions/        # Server Actions
```

## Development Methodology

This project follows **SDD (Spec-Driven Development)**:

1. Write specs in `specs/` before implementation
2. Implement based on specs
3. Track decisions in `docs/decisions/` (ADR)
4. Track plans in `docs/plans/`

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
| 1 | Foundation | Project setup + Article CRUD | In Progress |
| 2 | Organization | Categories, Tags, Collections, Search | Planned |
| 3 | Intelligence | AI auto-tagging, summarization, semantic search | Planned |
| 4 | Social | Authentication, multi-user, sharing | Planned |

## License

Private project.
