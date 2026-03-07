/**
 * Generate an excerpt from markdown content.
 *
 * - Strips markdown syntax (headings, bold, italic, links, code blocks)
 * - Collapses newlines into spaces
 * - Truncates at word boundary with "..." suffix
 */
export function generateExcerpt(
  content: string,
  maxLength: number = 300,
): string {
  const plainText = content
    .replace(/#{1,6}\s/g, "") // Remove headings
    .replace(/\*\*|__/g, "") // Remove bold
    .replace(/\*|_/g, "") // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links -> text only
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // Remove inline/block code
    .replace(/\n+/g, " ") // Newlines -> space
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Truncate at word boundary
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + "...";
}
