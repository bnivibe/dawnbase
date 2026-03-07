# Dawnbase

Dawn's Knowledge Archive — 배운 것들과 스크랩한 것들을 정리하는 개인 지식 아카이빙 웹사이트.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL via Supabase |
| ORM | Drizzle ORM |
| Validation | Zod |
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
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
dawnbase/
  docs/
    plans/          # Plan history (what to build)
    decisions/      # ADR - Architecture Decision Records (why)
  specs/            # SDD specs (source of truth)
  src/
    app/            # Next.js App Router (pages, API routes)
    components/     # React components (ui, layout, articles)
    lib/            # Business logic (db, validations, utils)
    types/          # TypeScript type definitions
```

## Development Methodology

This project follows **SDD (Spec-Driven Development)**:

1. Write specs in `specs/` before implementation
2. Implement based on specs
3. Track decisions in `docs/decisions/` (ADR)
4. Track plans in `docs/plans/`

## Roadmap

| Phase | Name | Description | Status |
|-------|------|-------------|--------|
| 1 | Foundation | Project setup + Article CRUD | In Progress |
| 2 | Organization | Categories, Tags, Collections, Search | Planned |
| 3 | Intelligence | AI auto-tagging, summarization, semantic search | Planned |
| 4 | Social | Authentication, multi-user, sharing | Planned |

## License

Private project.
