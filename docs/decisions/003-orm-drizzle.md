# ADR-003: ORM - Drizzle ORM

## Status
Accepted

## Date
2026-03-07

## Context
Dawnbase is a TypeScript-based Next.js application that requires an ORM or query builder for interacting with the PostgreSQL (Supabase) database. The ORM choice affects type safety, developer experience, bundle size, and compatibility with runtime environments (Edge Runtime, Server Components).

## Options Considered

### 1. **Prisma**
- Pros: Largest community, rich documentation, intuitive schema definition (schema.prisma), automatic migrations, Prisma Studio GUI
- Cons: Heavy bundle size (Engine Binary ~15MB), requires code generation step (`prisma generate`), limited Edge Runtime support, difficult query optimization control

### 2. **Drizzle ORM**
- Pros: Lightweight bundle size, SQL-level query control, no code generation required, full Edge Runtime compatibility, TypeScript-first design, natural integration with Server Components
- Cons: Smaller community compared to Prisma, more manual migration management, relatively fewer learning resources

### 3. **Kysely**
- Pros: Type-safe query builder, very lightweight, API close to SQL
- Cons: Lacks ORM features (no relation mapping), no migration tools included, small ecosystem

### 4. **Raw SQL (pg library)**
- Pros: Complete SQL control, minimal additional dependencies
- Cons: Manual type safety management, repetitive boilerplate code, increased SQL injection risk

## Decision
**Drizzle ORM** is selected as the TypeScript ORM.

## Rationale

1. **Lightweight bundle size**: Unlike Prisma's Engine Binary (~15MB), Drizzle operates as pure TypeScript without additional binaries. This significantly reduces cold start times in serverless/Edge environments.

2. **No code generation required**: Prisma requires running `prisma generate` after every schema change, but Drizzle's TypeScript schema definitions are the types themselves, eliminating a separate code generation step. This reduces friction for schema changes in the SDD workflow.

3. **SQL-level control**: Drizzle's query API maps 1:1 to SQL, making it easy to predict and optimize the generated SQL. Complex queries (JOINs, subqueries, CTEs) can be written naturally.

4. **Edge Runtime compatibility**: Fully operational with Next.js Edge Runtime and React Server Components. Can be used without restrictions in Vercel Edge Functions as well.

5. **TypeScript-first**: Provides complete type inference from schema definitions to query results, catching runtime errors at compile time.

6. **Server Components integration**: Database queries can be executed directly in React Server Components, enabling data fetching without a separate API layer.

## Consequences

### Positive
- Fast cold start in serverless/Edge environments (small bundle size)
- TypeScript schema doubles as type definitions (no code generation required)
- Easy performance optimization with SQL-level query control
- Direct DB queries possible in Server Components
- Minimized friction for schema changes in the SDD workflow

### Negative
- Smaller community and fewer learning resources compared to Prisma
- More manual migration management (`drizzle-kit` is used but less automated than Prisma Migrate)
- No GUI tool like Prisma Studio (Drizzle Studio requires separate execution)
- Complex relation mapping requires more explicit code than Prisma's declarative approach
