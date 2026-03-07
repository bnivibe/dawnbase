# Data Model Spec: Article

> **Phase**: Phase 1
> **Status**: Implementing
> **Last Updated**: 2026-03-07

## Overview

Article is the core data model of Dawnbase. It represents knowledge items (articles) written by the user, managing markdown-formatted content, titles, slugs, publication status, and more. It is the foundational model for all knowledge management features.

## Field Definitions

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `id` | uuid (string) | PK, auto-generated | `crypto.randomUUID()` | Unique identifier |
| `title` | string | required, max 200 chars | - | Article title |
| `slug` | string | unique, auto-generated from title | - | URL-friendly identifier, auto-generated from the title |
| `content` | text | required, markdown format | - | Body content in markdown format |
| `excerpt` | string | optional, max 300 chars | auto-generated | Article summary. Auto-generated from the first 300 characters of content if not provided |
| `status` | enum (ArticleStatus) | required | `'draft'` | Article publication status |
| `createdAt` | timestamp (string) | auto, ISO 8601 | `now()` | Creation timestamp |
| `updatedAt` | timestamp (string) | auto, ISO 8601 | `now()` | Last modified timestamp |
| `publishedAt` | timestamp (string) | nullable, ISO 8601 | `null` | Publication timestamp. Automatically set when status changes to published |

## Enum Definitions

### ArticleStatus

| Value | Description |
|-------|-------------|
| `draft` | Draft. An article in progress. Visible in the list but displayed with a "draft" badge |
| `published` | Published. A completed article |
| `archived` | Archived. Soft-deleted state. Hidden from the default list |

## Relationships

| Relation | Target Model | Type | FK | Description |
|----------|-------------|------|-----|-------------|
| category | Category | N:1 | `categoryId` | To be added in Phase 2. The category the article belongs to |

> **Phase 2 Note**: A `categoryId` (uuid, nullable, FK -> categories.id) field will be added.

## Indexes

| Name | Fields | Type | Purpose |
|------|--------|------|---------|
| `idx_articles_slug` | `slug` | UNIQUE | Slug-based lookup (URL routing) |
| `idx_articles_status` | `status` | INDEX | Status-based filtering performance |
| `idx_articles_created_at` | `createdAt` | INDEX | Chronological sorting performance |
| `idx_articles_published_at` | `publishedAt` | INDEX | Publication date sorting performance |

## Zod Schema

```typescript
import { z } from 'zod';

// Enum
export const ArticleStatusEnum = z.enum(['draft', 'published', 'archived']);
export type ArticleStatus = z.infer<typeof ArticleStatusEnum>;

// Creation input schema
export const CreateArticleSchema = z.object({
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
  status: ArticleStatusEnum.default('draft'),
});

export type CreateArticleInput = z.infer<typeof CreateArticleSchema>;

// Update input schema (all fields optional)
export const UpdateArticleSchema = z.object({
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
  status: ArticleStatusEnum.optional(),
});

export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>;

// Full Article schema (after reading from DB)
export const ArticleSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string().nullable(),
  status: ArticleStatusEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime().nullable(),
});

export type Article = z.infer<typeof ArticleSchema>;
```

## Drizzle ORM Schema

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const articles = sqliteTable('articles', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  status: text('status', { enum: ['draft', 'published', 'archived'] })
    .notNull()
    .default('draft'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  publishedAt: text('published_at'),
});
```

## Slug Generation Rules

Slugs are automatically generated from the title:

```typescript
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\uAC00-\uD7A3-]/g, '')   // Remove special characters (Korean allowed)
    .replace(/[\s_]+/g, '-')          // Replace spaces/underscores with hyphens
    .replace(/-+/g, '-')              // Remove consecutive hyphens
    .replace(/^-|-$/g, '');           // Remove leading/trailing hyphens
}
```

- When a duplicate slug exists: append a numeric suffix (e.g., `my-article`, `my-article-1`, `my-article-2`)
- Korean title support: Korean characters are included as-is in the slug
- Empty slug prevention: if the result is an empty string, generate a slug in the format `article-{timestamp}`

## Excerpt Auto-Generation Rules

When an excerpt is not provided, it is auto-generated from the content:

```typescript
function generateExcerpt(content: string, maxLength: number = 300): string {
  // Remove markdown syntax
  const plainText = content
    .replace(/#{1,6}\s/g, '')         // Remove headings
    .replace(/\*\*|__/g, '')          // Remove bold
    .replace(/\*|_/g, '')             // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Links -> text only
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
    .replace(/\n+/g, ' ')            // Newlines -> spaces
    .trim();

  if (plainText.length <= maxLength) return plainText;

  // Truncate at word boundary
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}
```

## Example Data

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Getting Started with Next.js App Router",
    "slug": "getting-started-with-nextjs-app-router",
    "content": "# Next.js App Router\n\nThe App Router introduced in Next.js 13...\n\n## Key Features\n\n- **Server Components**: All components are server components by default\n- **Layouts**: Nested layout support\n- **Routing**: File-system based routing\n\n## Getting Started\n\n```bash\nnpx create-next-app@latest\n```",
    "excerpt": "The App Router introduced in Next.js 13 provides key features such as server components, nested layouts, and file-system based routing.",
    "status": "published",
    "createdAt": "2026-03-01T09:00:00.000Z",
    "updatedAt": "2026-03-05T14:30:00.000Z",
    "publishedAt": "2026-03-05T14:30:00.000Z"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "title": "TypeScript Utility Types Summary",
    "slug": "typescript-utility-types-summary",
    "content": "# TypeScript Utility Types\n\nA summary of frequently used utility types.\n\n## Partial<T>\n\nMakes all properties optional.\n\n```typescript\ninterface User {\n  name: string;\n  age: number;\n}\n\ntype PartialUser = Partial<User>;\n// { name?: string; age?: number; }\n```",
    "excerpt": "A summary of frequently used TypeScript utility types (Partial, Required, Pick, Omit, etc.).",
    "status": "draft",
    "createdAt": "2026-03-07T10:00:00.000Z",
    "updatedAt": "2026-03-07T10:00:00.000Z",
    "publishedAt": null
  },
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "title": "Deleted Old Article",
    "slug": "deleted-old-article",
    "content": "# This article has been archived.",
    "excerpt": "This is an archived article.",
    "status": "archived",
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-02-20T16:00:00.000Z",
    "publishedAt": "2026-01-16T10:00:00.000Z"
  }
]
```

## Business Rules

1. **Title required**: An article must have a title (empty string not allowed).
2. **Content required**: An article must have body content.
3. **Slug auto-generation**: Slugs are automatically generated from the title; users do not input them directly.
4. **Slug uniqueness**: When a duplicate slug exists, a numeric suffix is added to ensure uniqueness.
5. **Excerpt auto-generation**: If no excerpt is provided, it is auto-generated by removing markdown syntax from the first 300 characters of the content.
6. **Publication date auto-set**: When status changes to `published`, if `publishedAt` is null, it is automatically set to the current time.
7. **Soft delete**: Delete requests do not actually remove the record; instead, the status is changed to `archived`.
8. **updatedAt auto-refresh**: On every update, `updatedAt` is automatically refreshed to the current time.
9. **Default list filter**: Articles with `archived` status are not displayed in the default article list.

## Changelog

| Date | Change | Reason |
|------|--------|--------|
| 2026-03-07 | Initial creation | Phase 1 core data model spec |
