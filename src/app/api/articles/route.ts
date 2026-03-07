import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreateArticleSchema } from "@/lib/validations/article";
import { getArticles, createArticle } from "@/lib/db/articles-repository";

const ListArticlesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z
    .enum(["createdAt", "updatedAt", "title", "publishedAt"])
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

function formatZodError(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawQuery = {
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
      order: searchParams.get("order") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    };

    const parsed = ListArticlesQuerySchema.safeParse(rawQuery);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: formatZodError(parsed.error),
        },
        { status: 400 },
      );
    }

    const result = await getArticles(parsed.data);

    return NextResponse.json(
      { data: result.data, pagination: result.pagination },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch articles",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateArticleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: formatZodError(parsed.error),
        },
        { status: 400 },
      );
    }

    const article = await createArticle(parsed.data);

    return NextResponse.json({ data: article }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
