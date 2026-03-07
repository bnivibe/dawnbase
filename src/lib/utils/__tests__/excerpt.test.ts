import { describe, it, expect } from "vitest";
import { generateExcerpt } from "../excerpt";

describe("generateExcerpt", () => {
  it("returns plain text as-is when under maxLength", () => {
    expect(generateExcerpt("Hello world")).toBe("Hello world");
  });

  it("strips markdown headings", () => {
    expect(generateExcerpt("# Title\n\nContent")).toBe("Title Content");
  });

  it("strips bold markers", () => {
    expect(generateExcerpt("**bold** text")).toBe("bold text");
  });

  it("strips italic markers", () => {
    expect(generateExcerpt("*italic* text")).toBe("italic text");
  });

  it("strips link syntax and keeps link text", () => {
    expect(generateExcerpt("[click here](https://example.com)")).toBe("click here");
  });

  it("strips inline code", () => {
    expect(generateExcerpt("use `npm install` to install")).toBe(
      "use  to install",
    );
  });

  it("collapses newlines to spaces", () => {
    expect(generateExcerpt("line1\n\nline2")).toBe("line1 line2");
  });

  it("truncates at word boundary with ellipsis when over maxLength", () => {
    const content = "word ".repeat(100).trim();
    const result = generateExcerpt(content, 20);
    expect(result.endsWith("...")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(23); // 20 chars + "..."
  });

  it("uses custom maxLength", () => {
    const content = "Hello world this is a long text";
    const result = generateExcerpt(content, 10);
    expect(result).toBe("Hello...");
  });
});
