/**
 * CLI script for the Claude content pipeline.
 * Called by the /dawnbase-post-article skill to insert an article into the DB.
 *
 * Usage:
 *   DATABASE_URL=<url> npx tsx src/scripts/create-article.ts '<json>'
 *
 * Input JSON shape:
 *   {
 *     title: string,
 *     content: string,
 *     excerpt?: string,
 *     status?: "draft" | "published",
 *     sourceUrl?: string,
 *     sourceType?: "youtube" | "blog" | "manual"
 *   }
 */

import { createArticle } from "@/lib/db/articles-repository";

const raw = process.argv[2];

if (!raw) {
  console.error("Error: JSON input required as first argument.");
  console.error(
    "Usage: DATABASE_URL=<url> npx tsx src/scripts/create-article.ts '<json>'"
  );
  process.exit(1);
}

let input: unknown;
try {
  input = JSON.parse(raw);
} catch {
  console.error("Error: Invalid JSON input.");
  process.exit(1);
}

if (
  typeof input !== "object" ||
  input === null ||
  !("title" in input) ||
  !("content" in input)
) {
  console.error("Error: Input must include 'title' and 'content' fields.");
  process.exit(1);
}

void (async () => {
  const article = await createArticle(
    input as Parameters<typeof createArticle>[0]
  );
  console.log(JSON.stringify(article, null, 2));
  process.exit(0);
})();
