import type { Article } from "@/lib/validations/article";

export const mockArticles: Article[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    title: "Getting Started with Dawnbase",
    slug: "getting-started-with-dawnbase",
    content:
      "# Welcome to Dawnbase\n\nThis is your personal knowledge archive for organizing everything you learn.\n\n## Features\n\n- Create and manage articles\n- Organize with categories\n- Full-text search\n\n## Getting Started\n\nCreate your first article by clicking the **New Article** button in the sidebar.",
    excerpt:
      "Welcome to Dawnbase. This is your personal knowledge archive for organizing everything you learn.",
    status: "published",
    createdAt: new Date("2026-03-01T09:00:00Z"),
    updatedAt: new Date("2026-03-01T09:00:00Z"),
    publishedAt: new Date("2026-03-01T09:00:00Z"),
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    title: "Getting Started with Next.js App Router",
    slug: "getting-started-with-nextjs-app-router",
    content:
      "# Next.js App Router\n\nThe App Router, introduced in Next.js 13, is a new routing system built on React Server Components.\n\n## Key Features\n\n- File-based routing\n- Server Components by default\n- Nested layouts\n- Streaming rendering",
    excerpt:
      "The App Router, introduced in Next.js 13, is a new routing system built on React Server Components.",
    status: "published",
    createdAt: new Date("2026-03-03T14:00:00Z"),
    updatedAt: new Date("2026-03-05T10:30:00Z"),
    publishedAt: new Date("2026-03-05T10:30:00Z"),
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    title: "Drizzle ORM with Supabase",
    slug: "drizzle-orm-with-supabase",
    content:
      "# Drizzle ORM\n\nDrizzle is a lightweight TypeScript ORM that works great with Supabase PostgreSQL.\n\n## Setup\n\n1. Install dependencies\n2. Configure database connection\n3. Define your schema\n4. Run migrations",
    excerpt:
      "Drizzle is a lightweight TypeScript ORM that works great with Supabase PostgreSQL.",
    status: "draft",
    createdAt: new Date("2026-03-06T08:00:00Z"),
    updatedAt: new Date("2026-03-06T08:00:00Z"),
    publishedAt: null,
  },
  {
    id: "d4e5f6a7-b8c9-0123-defg-456789012345",
    title: "Zod Validation Patterns",
    slug: "zod-validation-patterns",
    content:
      "# Zod Validation\n\nZod is a TypeScript-first schema validation library.\n\n## Common Patterns\n\n- Input validation for API routes\n- Form validation\n- Environment variable validation\n- Database query result parsing",
    excerpt:
      "Zod is a TypeScript-first schema validation library with common patterns for API routes, forms, and more.",
    status: "draft",
    createdAt: new Date("2026-03-07T06:00:00Z"),
    updatedAt: new Date("2026-03-07T06:00:00Z"),
    publishedAt: null,
  },
];
