import { z } from "zod";

// Enums
export const ArticleStatusEnum = z.enum(["draft", "published", "archived"]);
export type ArticleStatus = z.infer<typeof ArticleStatusEnum>;

export const SourceTypeEnum = z.enum(["youtube", "blog", "manual"]);
export type SourceType = z.infer<typeof SourceTypeEnum>;

// Knowledge-metadata (ADR-017): trust/freshness state of an article's claims.
// `stale` = previously verified but now due for re-check; `unverified` = never checked.
export const VerifiedStateEnum = z.enum([
  "verified",
  "partial",
  "unverified",
  "stale",
]);
export type VerifiedState = z.infer<typeof VerifiedStateEnum>;

// A single cited source. The `sources` array supersedes the legacy single
// `sourceUrl`/`sourceType` pair (which is retained for backward compatibility).
export const ArticleSourceSchema = z.object({
  url: z.url(),
  title: z.string(),
  type: SourceTypeEnum,
});
export type ArticleSource = z.infer<typeof ArticleSourceSchema>;

// Create input schema
export const CreateArticleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  content: z.string().min(1, "Content is required"),
  excerpt: z
    .string()
    .max(300, "Excerpt must be 300 characters or less")
    .optional(),
  status: ArticleStatusEnum.default("draft"),
  sourceUrl: z.url().optional(),
  sourceType: SourceTypeEnum.optional(),
  // Knowledge-metadata (all optional; defaults applied at the DB/repository layer).
  verified: VerifiedStateEnum.default("unverified"),
  verifiedAt: z.coerce.date().nullable().optional(),
  sources: z.array(ArticleSourceSchema).optional(),
  relatedSlugs: z.array(z.string()).optional(),
  reviewDueAt: z.coerce.date().nullable().optional(),
});

export type CreateArticleInput = z.infer<typeof CreateArticleSchema>;

// Update input schema (all fields optional, at least one required)
export const UpdateArticleSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be 200 characters or less")
      .optional(),
    content: z.string().min(1, "Content is required").optional(),
    excerpt: z
      .string()
      .max(300, "Excerpt must be 300 characters or less")
      .nullable()
      .optional(),
    status: ArticleStatusEnum.optional(),
    sourceUrl: z.url().nullable().optional(),
    sourceType: SourceTypeEnum.nullable().optional(),
    // Knowledge-metadata
    verified: VerifiedStateEnum.optional(),
    verifiedAt: z.coerce.date().nullable().optional(),
    sources: z.array(ArticleSourceSchema).nullable().optional(),
    relatedSlugs: z.array(z.string()).nullable().optional(),
    reviewDueAt: z.coerce.date().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>;

// Full article schema (as read from DB)
export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string().nullable(),
  status: ArticleStatusEnum,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  publishedAt: z.coerce.date().nullable(),
  sourceUrl: z.string().nullable(),
  sourceType: SourceTypeEnum.nullable(),
  // Knowledge-metadata (ADR-017)
  verified: VerifiedStateEnum,
  verifiedAt: z.coerce.date().nullable(),
  sources: z.array(ArticleSourceSchema).nullable(),
  relatedSlugs: z.array(z.string()).nullable(),
  reviewDueAt: z.coerce.date().nullable(),
});

export type Article = z.infer<typeof ArticleSchema>;

/**
 * Backward-compatibility adapter (ADR-017).
 *
 * Returns the canonical list of sources for an article. Prefers the new
 * `sources[]` field; falls back to constructing a single-element list from the
 * legacy `sourceUrl`/`sourceType` pair so existing articles keep working.
 */
export function resolveSources(
  article: Pick<Article, "sources" | "sourceUrl" | "sourceType">,
): ArticleSource[] {
  if (article.sources && article.sources.length > 0) {
    return article.sources;
  }
  if (article.sourceUrl) {
    return [
      {
        url: article.sourceUrl,
        title: article.sourceUrl,
        type: article.sourceType ?? "manual",
      },
    ];
  }
  return [];
}
