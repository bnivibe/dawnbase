import { NextRequest, NextResponse } from "next/server";
import { getArticleById } from "@/lib/db/articles-repository";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
    console.error("[GET /api/articles/:id]", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 },
    );
  }
}

