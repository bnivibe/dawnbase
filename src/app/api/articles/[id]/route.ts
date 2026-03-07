import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UpdateArticleSchema } from "@/lib/validations/article";
import {
  getArticleById,
  updateArticle,
  deleteArticle,
} from "@/lib/db/articles-repository";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function formatZodError(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        { error: "Invalid article ID", details: "ID must be a valid UUID" },
        { status: 400 },
      );
    }

    const article = await getArticleById(id);
    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: article }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        { error: "Invalid article ID", details: "ID must be a valid UUID" },
        { status: 400 },
      );
    }

    const existing = await getArticleById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = UpdateArticleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: formatZodError(parsed.error),
        },
        { status: 400 },
      );
    }

    const updated = await updateArticle(id, parsed.data);

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        { error: "Invalid article ID", details: "ID must be a valid UUID" },
        { status: 400 },
      );
    }

    const existing = await getArticleById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 },
      );
    }

    const deleted = await deleteArticle(id);

    return NextResponse.json({ data: deleted }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
