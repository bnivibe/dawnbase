import { z } from "zod";

// Enum
export const ArticleStatusEnum = z.enum(["draft", "published", "archived"]);
export type ArticleStatus = z.infer<typeof ArticleStatusEnum>;

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
});

export type Article = z.infer<typeof ArticleSchema>;
