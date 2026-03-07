import type { Article, ArticleStatus } from "@/lib/validations/article";
import { mockArticles } from "./mock-data";
import { generateSlug } from "@/lib/utils/slug";
import { generateExcerpt } from "@/lib/utils/excerpt";

// In-memory store (clone mock data so mutations don't affect the original)
let articles: Article[] = mockArticles.map((a) => ({ ...a }));

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
}

interface UpdateArticleInput {
  title?: string;
  content?: string;
  excerpt?: string | null;
  status?: ArticleStatus;
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

  // Filter
  let filtered = articles.filter((a) => {
    if (status) return a.status === status;
    // Default: exclude archived
    return a.status !== "archived";
  });

  // Sort
  filtered.sort((a, b) => {
    let aVal: string | number | Date | null;
    let bVal: string | number | Date | null;

    if (sort === "title") {
      aVal = a.title.toLowerCase();
      bVal = b.title.toLowerCase();
    } else {
      aVal = a[sort]?.getTime() ?? 0;
      bVal = b[sort]?.getTime() ?? 0;
    }

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const data = filtered.slice(offset, offset + limit);

  return {
    data,
    pagination: { page, limit, total, totalPages },
  };
}

export async function getArticleById(
  id: string,
): Promise<Article | undefined> {
  return articles.find((a) => a.id === id);
}

export async function getArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  return articles.find((a) => a.slug === slug);
}

function ensureUniqueSlug(baseSlug: string, excludeId?: string): string {
  let slug = baseSlug;
  let counter = 1;
  while (
    articles.some((a) => a.slug === slug && a.id !== excludeId)
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

export async function createArticle(
  input: CreateArticleInput,
): Promise<Article> {
  const now = new Date();
  const slug = ensureUniqueSlug(generateSlug(input.title));
  const status = input.status ?? "draft";

  const article: Article = {
    id: crypto.randomUUID(),
    title: input.title,
    slug,
    content: input.content,
    excerpt: input.excerpt ?? generateExcerpt(input.content),
    status,
    createdAt: now,
    updatedAt: now,
    publishedAt: status === "published" ? now : null,
  };

  articles.unshift(article);
  return article;
}

export async function updateArticle(
  id: string,
  input: UpdateArticleInput,
): Promise<Article | undefined> {
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return undefined;

  const existing = articles[index];
  const now = new Date();

  const updated: Article = {
    ...existing,
    ...input,
    updatedAt: now,
  };

  // Regenerate slug if title changed
  if (input.title && input.title !== existing.title) {
    updated.slug = ensureUniqueSlug(generateSlug(input.title), id);
  }

  // Handle publishedAt logic
  if (input.status === "published" && existing.publishedAt === null) {
    updated.publishedAt = now;
  } else if (input.status === "draft") {
    updated.publishedAt = null;
  }

  articles[index] = updated;
  return updated;
}

export async function deleteArticle(
  id: string,
): Promise<Article | undefined> {
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return undefined;

  const now = new Date();
  articles[index] = {
    ...articles[index],
    status: "archived",
    updatedAt: now,
  };

  return articles[index];
}
