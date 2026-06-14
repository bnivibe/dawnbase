import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const articleStatusEnum = pgEnum("article_status", [
  "draft",
  "published",
  "archived",
]);

export const sourceTypeEnum = pgEnum("source_type", [
  "youtube",
  "blog",
  "manual",
]);

// Knowledge-metadata: trust/freshness state of an article's factual claims.
// See ADR-017. `verified` powers the trust badge and (later) RAG ranking weight.
export const verifiedStateEnum = pgEnum("verified_state", [
  "verified",
  "partial",
  "unverified",
  "stale",
]);

// A single cited source. `sources` supersedes the legacy single `sourceUrl`/`sourceType`
// (kept for backward compatibility; see resolveSources() adapter in validations/article.ts).
export type ArticleSource = {
  url: string;
  title: string;
  type: "youtube" | "blog" | "manual";
};

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 300 }).notNull().unique(),
    content: text("content").notNull(),
    excerpt: varchar("excerpt", { length: 300 }),
    status: articleStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    // Legacy single-source fields (retained for backward compatibility).
    sourceUrl: text("source_url"),
    sourceType: sourceTypeEnum("source_type"),
    // Knowledge-metadata layer (ADR-017).
    verified: verifiedStateEnum("verified").notNull().default("unverified"),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    sources: jsonb("sources").$type<ArticleSource[]>(),
    relatedSlugs: text("related_slugs").array(),
    reviewDueAt: timestamp("review_due_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_articles_status").on(table.status),
    index("idx_articles_created_at").on(table.createdAt),
    index("idx_articles_published_at").on(table.publishedAt),
    // Supports the "stale sweep" — find articles whose verification is due.
    index("idx_articles_verified").on(table.verified),
    index("idx_articles_review_due_at").on(table.reviewDueAt),
  ],
);
