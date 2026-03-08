import { eq, ne, and, asc, desc, count } from "drizzle-orm";
import { db } from "./index";
import { articles } from "./schema/articles";
import type { Article, ArticleStatus } from "@/lib/validations/article";
import { generateSlug } from "@/lib/utils/slug";
import { generateExcerpt } from "@/lib/utils/excerpt";

interface GetArticlesOptions {
  page?: number;
  limit?: number;
  status?: ArticleStatus;
  sort?: "createdAt" | "updatedAt" | "title" | "publishedAt";
  order?: "asc" | "desc";
}

interface GetArticlesResult {
  data: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CreateArticleInput {
  title: string;
  content: string;
  excerpt?: string;
  status?: ArticleStatus;
  sourceUrl?: string;
  sourceType?: "youtube" | "blog" | "manual";
}

interface UpdateArticleInput {
  title?: string;
  content?: string;
  excerpt?: string | null;
  status?: ArticleStatus;
  sourceUrl?: string | null;
  sourceType?: "youtube" | "blog" | "manual" | null;
}

export interface ArticleStats {
  total: number;
  draft: number;
  published: number;
}

async function ensureUniqueSlug(
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const condition = excludeId
      ? and(eq(articles.slug, slug), ne(articles.id, excludeId))
      : eq(articles.slug, slug);

    const existing = await db
      .select({ id: articles.id })
      .from(articles)
      .where(condition)
      .limit(1);

    if (existing.length === 0) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function getArticles(
  options: GetArticlesOptions = {},
): Promise<GetArticlesResult> {
  const {
    page = 1,
    limit = 10,
    status,
    sort = "createdAt",
    order = "desc",
  } = options;

  const whereClause = status
    ? eq(articles.status, status)
    : ne(articles.status, "archived");

  const sortColumn = {
    createdAt: articles.createdAt,
    updatedAt: articles.updatedAt,
    title: articles.title,
    publishedAt: articles.publishedAt,
  }[sort];

  const orderFn = order === "asc" ? asc : desc;

  const [{ total }] = await db
    .select({ total: count() })
    .from(articles)
    .where(whereClause);

  const offset = (page - 1) * limit;
  const data = await db
    .select()
    .from(articles)
    .where(whereClause)
    .orderBy(orderFn(sortColumn))
    .limit(limit)
    .offset(offset);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getArticleById(
  id: string,
): Promise<Article | undefined> {
  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);

  return article;
}

export async function getArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  return article;
}

export async function createArticle(
  input: CreateArticleInput,
): Promise<Article> {
  const baseSlug = generateSlug(input.title);
  const slug = await ensureUniqueSlug(baseSlug);
  const status = input.status ?? "draft";
  const now = new Date();

  const [article] = await db
    .insert(articles)
    .values({
      title: input.title,
      slug,
      content: input.content,
      excerpt: input.excerpt ?? generateExcerpt(input.content),
      status,
      createdAt: now,
      updatedAt: now,
      publishedAt: status === "published" ? now : null,
      sourceUrl: input.sourceUrl ?? null,
      sourceType: input.sourceType ?? null,
    })
    .returning();

  return article;
}

export async function updateArticle(
  id: string,
  input: UpdateArticleInput,
): Promise<Article | undefined> {
  const existing = await getArticleById(id);
  if (!existing) return undefined;

  const now = new Date();
  const updateValues: Partial<typeof articles.$inferInsert> = {
    updatedAt: now,
  };

  if (input.title !== undefined) updateValues.title = input.title;
  if (input.content !== undefined) updateValues.content = input.content;
  if (input.excerpt !== undefined) updateValues.excerpt = input.excerpt;
  if (input.status !== undefined) updateValues.status = input.status;
  if (input.sourceUrl !== undefined) updateValues.sourceUrl = input.sourceUrl;
  if (input.sourceType !== undefined) updateValues.sourceType = input.sourceType;

  // Regenerate slug if title changed
  if (input.title && input.title !== existing.title) {
    updateValues.slug = await ensureUniqueSlug(
      generateSlug(input.title),
      id,
    );
  }

  // Handle publishedAt logic
  if (input.status === "published" && existing.publishedAt === null) {
    updateValues.publishedAt = now;
  } else if (input.status === "draft") {
    updateValues.publishedAt = null;
  }

  const [updated] = await db
    .update(articles)
    .set(updateValues)
    .where(eq(articles.id, id))
    .returning();

  return updated;
}

export async function deleteArticle(
  id: string,
): Promise<Article | undefined> {
  const existing = await getArticleById(id);
  if (!existing) return undefined;

  const [deleted] = await db
    .update(articles)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(articles.id, id))
    .returning();

  return deleted;
}

export async function getArticleStats(): Promise<ArticleStats> {
  const rows = await db
    .select({ status: articles.status, total: count() })
    .from(articles)
    .where(ne(articles.status, "archived"))
    .groupBy(articles.status);

  const stats: ArticleStats = { total: 0, draft: 0, published: 0 };

  for (const row of rows) {
    stats.total += row.total;
    if (row.status === "draft") stats.draft = row.total;
    if (row.status === "published") stats.published = row.total;
  }

  return stats;
}
