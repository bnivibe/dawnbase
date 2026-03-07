# ADR-002: Database - PostgreSQL via Supabase

## Status
Accepted

## Date
2026-03-07

## Context
Dawnbase needs a data persistence layer for storing, querying, and searching knowledge articles. It starts as a single-user application, but targets authentication and multi-user support in Phase 4. Additionally, full-text search functionality is required in Phase 2.

The database choice affects schema design, query performance, scalability, and support for additional features (authentication, real-time, storage).

## Options Considered

### 1. **SQLite**
- Pros: Serverless, no setup required, single-file DB, fast read performance, embeddable
- Cons: Limited concurrent writes, no built-in authentication/real-time features, limited full-text search, requires separate configuration for cloud deployment

### 2. **PostgreSQL via Supabase**
- Pros: Full PostgreSQL capabilities, built-in authentication (Auth), real-time subscriptions, storage, automatic REST/GraphQL API generation, powerful full-text search (tsvector), free tier available to start
- Cons: External service dependency, network latency, free tier limitations (500MB DB, 1GB storage)

### 3. **MongoDB**
- Pros: Flexible schema, JSON native, easy horizontal scaling
- Cons: Not suitable for relational data (inter-article relationships, category-tag associations, etc.), limited transaction support, no Drizzle ORM support

### 4. **Firebase (Firestore)**
- Pros: Real-time sync, Google ecosystem, built-in authentication
- Cons: NoSQL constraints, complex query limitations, unpredictable costs, very strong vendor lock-in

## Decision
**PostgreSQL via Supabase** is selected as the database.

## Rationale

1. **Future scalability**: Starting with a single user but targeting multi-user support, Supabase's built-in authentication (Auth) system allows scaling in Phase 4 without building a separate authentication service.

2. **Full-text search support**: Full-text search, a core feature of Phase 2, can be implemented natively using PostgreSQL's `tsvector`/`tsquery`. There is no need to introduce a separate search engine (such as Elasticsearch).

3. **Real-time capabilities**: Supabase Realtime enables easy addition of collaborative editing or real-time notification features in the future.

4. **Integrated platform**: Auth, Database, Storage, and Edge Functions are all provided on a single platform, reducing the complexity of combining multiple services.

5. **Free tier**: 500MB database, 1GB storage, and 50,000 MAU authentication are available for free, which is sufficient for initial development and prototyping.

6. **PostgreSQL standard**: Supabase is built on top of standard PostgreSQL, making migration to other PostgreSQL hosting services (AWS RDS, Neon, etc.) relatively straightforward if needed.

## Consequences

### Positive
- Reduced development cost and complexity by leveraging Auth, Realtime, and Storage for free
- Simplified Phase 2 implementation with PostgreSQL's powerful full-text search
- Natural ORM (Drizzle) integration based on standard SQL
- Data access control possible with Row Level Security (RLS)
- Easy data management and debugging through the dashboard UI

### Negative
- Network latency due to external service dependency
- Direct application impact during Supabase service outages
- Need to upgrade to a paid plan when free tier limits are exceeded ($25/month Pro plan)
- Requires Supabase CLI or local PostgreSQL setup for local development environment
