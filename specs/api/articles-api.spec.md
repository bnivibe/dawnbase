# API Spec: Articles API

> **Phase**: Phase 1
> **Status**: Implementing
> **Last Updated**: 2026-03-07
> **Base Path**: `/api/articles`

## Overview

Defines the CRUD API for the Article resource. Uses Next.js App Router Route Handlers with Zod-based input validation, appropriate HTTP status codes, and a consistent error response format. Deletion uses a soft delete approach (changing status to archived).

## Endpoint List

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/articles` | List articles (pagination, filtering) | None (Phase 1) |
| ~~POST~~ | ~~`/api/articles`~~ | ~~Create a new article~~ | **REMOVED** — Claude-managed only |
| GET | `/api/articles/[id]` | Get a single article | None (Phase 1) |
| ~~PUT~~ | ~~`/api/articles/[id]`~~ | ~~Update an article~~ | **REMOVED** — Claude-managed only |
| ~~DELETE~~ | ~~`/api/articles/[id]`~~ | ~~Soft delete an article (archived)~~ | **REMOVED** — Claude-managed only |

> **Phase 1.1 Note**: POST, PUT, and DELETE endpoints have been removed from the public web API. All write operations are performed directly by Claude via the repository layer (`createArticle`, `updateArticle`, `deleteArticle`). These repository functions remain in the codebase for Claude's direct use.

> **Phase 4 Note**: When authentication (Auth) is added, read endpoints may require authentication.

## File Structure

```
src/app/api/articles/
  route.ts              # GET (list), POST (create)
  [id]/
    route.ts            # GET (single), PUT (update), DELETE (delete)
```

---

## GET `/api/articles`

### Description
Retrieves the article list with pagination, sorting, and status filtering. By default, articles with `archived` status are excluded.

### Query Parameters

| Parameter | Type | Required | Default | Description | Validation |
|-----------|------|----------|---------|-------------|------------|
| `page` | number | No | `1` | Page number | >= 1, integer |
| `limit` | number | No | `10` | Items per page | 1-100, integer |
| `sort` | string | No | `createdAt` | Sort field | `createdAt` \| `updatedAt` \| `title` \| `publishedAt` |
| `order` | string | No | `desc` | Sort direction | `asc` \| `desc` |
| `status` | string | No | - | Status filter | `draft` \| `published` \| `archived` |

### Query Parameter Validation (Zod)

```typescript
const ListArticlesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.enum(['createdAt', 'updatedAt', 'title', 'publishedAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});
```

### Business Logic

1. If the `status` parameter is not provided, return only `draft` and `published` articles (exclude `archived`)
2. If the `status` parameter is provided, return only articles with that status
3. Sort by the specified field and direction
4. Apply pagination: `offset = (page - 1) * limit`

### Response

**200 OK**
```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "title": "Getting Started with Next.js App Router",
      "slug": "getting-started-with-nextjs-app-router",
      "content": "# Next.js App Router\n\n...",
      "excerpt": "The App Router introduced in Next.js 13...",
      "status": "published",
      "sourceUrl": "https://nextjs.org/docs/app",
      "sourceType": "blog",
      "createdAt": "2026-03-01T09:00:00.000Z",
      "updatedAt": "2026-03-05T14:30:00.000Z",
      "publishedAt": "2026-03-05T14:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

**400 Bad Request** (Invalid query parameters)
```json
{
  "error": "Invalid query parameters",
  "details": [
    {
      "field": "page",
      "message": "Number must be greater than or equal to 1"
    }
  ]
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to fetch articles",
  "details": "Database connection error"
}
```

---

## POST `/api/articles`

### Description
Creates a new article. Title and content are required; slug is auto-generated from the title, and excerpt is auto-generated from content if not provided.

### Request Body

```json
{
  "title": "New Article Title",
  "content": "# Markdown Content\n\nBody content here.",
  "excerpt": "Optional summary text",
  "status": "draft"
}
```

### Validation (Zod)

```typescript
const CreateArticleSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  content: z
    .string()
    .min(1, 'Content is required'),
  excerpt: z
    .string()
    .max(300, 'Excerpt must be 300 characters or less')
    .optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});
```

### Business Logic

1. Validate request body with Zod schema
2. Auto-generate `slug` from `title` (append numeric suffix on duplicates)
3. If `excerpt` is not provided, auto-generate from `content` (remove markdown, max 300 chars)
4. If `status` is `published`, set `publishedAt` to the current time
5. Auto-generate `id` with `crypto.randomUUID()`
6. Auto-set `createdAt` and `updatedAt` to the current time
7. Save to DB and return the full created article

### Response

**201 Created**
```json
{
  "data": {
    "id": "d4e5f6a7-b8c9-0123-defg-456789012345",
    "title": "New Article Title",
    "slug": "new-article-title",
    "content": "# Markdown Content\n\nBody content here.",
    "excerpt": "Markdown Content Body content here.",
    "status": "draft",
    "createdAt": "2026-03-07T12:00:00.000Z",
    "updatedAt": "2026-03-07T12:00:00.000Z",
    "publishedAt": null
  }
}
```

**400 Bad Request** (Validation Error)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "content",
      "message": "Content is required"
    }
  ]
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to create article",
  "details": "..."
}
```

---

## GET `/api/articles/[id]`

### Description
Retrieves a single article by ID. Articles with `archived` status can also be retrieved.

### Path Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `id` | string | Article UUID | UUID format |

### Business Logic

1. Validate UUID format of the `id` parameter
2. Look up the article with the given ID in the DB
3. Return 404 if not found

### Response

**200 OK**
```json
{
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Getting Started with Next.js App Router",
    "slug": "getting-started-with-nextjs-app-router",
    "content": "# Next.js App Router\n\n...",
    "excerpt": "The App Router introduced in Next.js 13...",
    "status": "published",
    "sourceUrl": "https://nextjs.org/docs/app",
    "sourceType": "blog",
    "createdAt": "2026-03-01T09:00:00.000Z",
    "updatedAt": "2026-03-05T14:30:00.000Z",
    "publishedAt": "2026-03-05T14:30:00.000Z"
  }
}
```

**400 Bad Request** (Invalid ID format)
```json
{
  "error": "Invalid article ID",
  "details": "ID must be a valid UUID"
}
```

**404 Not Found**
```json
{
  "error": "Article not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to fetch article",
  "details": "..."
}
```

---

## PUT `/api/articles/[id]`

### Description
Updates an existing article. Only the provided fields are updated (partial update). The `slug` is automatically regenerated if the `title` is changed.

### Path Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `id` | string | Article UUID | UUID format |

### Request Body

All fields optional (at least one required):

```json
{
  "title": "Updated Title",
  "content": "# Updated Content",
  "excerpt": "Updated summary",
  "status": "published"
}
```

### Validation (Zod)

```typescript
const UpdateArticleSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .optional(),
  content: z
    .string()
    .min(1, 'Content is required')
    .optional(),
  excerpt: z
    .string()
    .max(300, 'Excerpt must be 300 characters or less')
    .nullable()
    .optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' }
);
```

### Business Logic

1. Validate UUID format of the `id` parameter
2. Verify the article exists in the DB (return 404 if not found)
3. Validate request body with Zod schema
4. If `title` is changed, regenerate `slug` (including duplicate check)
5. If `status` changes to `published` and existing `publishedAt` is null, set to the current time
6. If `status` changes to `draft`, reset `publishedAt` to null
7. Refresh `updatedAt` to the current time
8. Update DB and return the full updated article

### Response

**200 OK**
```json
{
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Updated Title",
    "slug": "updated-title",
    "content": "# Updated Content",
    "excerpt": "Updated summary",
    "status": "published",
    "createdAt": "2026-03-01T09:00:00.000Z",
    "updatedAt": "2026-03-07T15:00:00.000Z",
    "publishedAt": "2026-03-07T15:00:00.000Z"
  }
}
```

**400 Bad Request** (Validation Error)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title must be 200 characters or less"
    }
  ]
}
```

**404 Not Found**
```json
{
  "error": "Article not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to update article",
  "details": "..."
}
```

---

## DELETE `/api/articles/[id]`

### Description
Soft deletes an article. Instead of actually deleting from the DB, the `status` is changed to `archived`.

### Path Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `id` | string | Article UUID | UUID format |

### Business Logic

1. Validate UUID format of the `id` parameter
2. Verify the article exists in the DB (return 404 if not found)
3. Return a success response even if already in `archived` status (idempotency)
4. Change `status` to `archived`
5. Refresh `updatedAt` to the current time
6. Return the modified article

### Response

**200 OK**
```json
{
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Deleted Article",
    "slug": "deleted-article",
    "content": "...",
    "excerpt": "...",
    "status": "archived",
    "createdAt": "2026-03-01T09:00:00.000Z",
    "updatedAt": "2026-03-07T16:00:00.000Z",
    "publishedAt": "2026-03-05T14:30:00.000Z"
  }
}
```

**400 Bad Request** (Invalid ID format)
```json
{
  "error": "Invalid article ID",
  "details": "ID must be a valid UUID"
}
```

**404 Not Found**
```json
{
  "error": "Article not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to delete article",
  "details": "..."
}
```

---

## Common Specifications

### Error Response Format

All error responses follow the same format:

```typescript
// General error
interface ApiError {
  error: string;
  details?: string;
}

// Validation error
interface ApiValidationError {
  error: string;
  details: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
}
```

### Zod Error Conversion Utility

```typescript
function formatZodError(error: z.ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}
```

### HTTP Status Code Summary

| Status | Use Case |
|--------|----------|
| `200 OK` | Successful read, update, delete |
| `201 Created` | Successful creation |
| `400 Bad Request` | Input validation failure, invalid parameters |
| `404 Not Found` | Resource not found |
| `500 Internal Server Error` | Server internal error (DB error, etc.) |

### Content-Type

- Request: `application/json`
- Response: `application/json`

### CORS

No separate CORS configuration needed in Phase 1 (Same-origin). Will be added in Phase 4 if needed.

## Implementation Notes

### Route Handler Pattern

```typescript
// src/app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // Parse and validate query parameters
    // Query DB
    // Return response
    return NextResponse.json({ data, pagination }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch articles', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Zod validation
    // Generate slug
    // Save to DB
    // Return response
    return NextResponse.json({ data: article }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodError(error) },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create article', details: error.message },
      { status: 500 }
    );
  }
}
```

```typescript
// src/app/api/articles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // UUID validation -> query -> response
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // UUID validation -> body validation -> update -> response
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // UUID validation -> existence check -> status change -> response
}
```

## Changelog

| Date | Change | Reason |
|------|--------|--------|
| 2026-03-07 | Initial creation | Phase 1 Article CRUD API spec |
| 2026-03-10 | Added sourceUrl, sourceType to GET response examples | Sync with Article data model spec |
