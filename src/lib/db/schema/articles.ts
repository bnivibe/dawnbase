import {
  index,
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
    sourceUrl: text("source_url"),
    sourceType: sourceTypeEnum("source_type"),
  },
  (table) => [
    index("idx_articles_status").on(table.status),
    index("idx_articles_created_at").on(table.createdAt),
    index("idx_articles_published_at").on(table.publishedAt),
  ],
);
