/**
 * Generate a URL-friendly slug from a title.
 *
 * - Supports Korean characters (한글)
 * - Replaces spaces/underscores with hyphens
 * - Removes special characters
 * - Falls back to `article-{timestamp}` if result is empty
 */
export function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s가-힣-]/g, "") // Remove special chars (keep Korean)
    .replace(/[\s_]+/g, "-") // Spaces/underscores -> hyphens
    .replace(/-+/g, "-") // Collapse consecutive hyphens
    .replace(/^-|-$/g, ""); // Trim leading/trailing hyphens

  if (!slug) {
    return `article-${Date.now()}`;
  }

  return slug;
}
