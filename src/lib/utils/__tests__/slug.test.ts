import { describe, it, expect } from "vitest";
import { generateSlug } from "../slug";

describe("generateSlug", () => {
  it("lowercases and trims the title", () => {
    expect(generateSlug("  Hello World  ")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(generateSlug("Next.js App Router")).toBe("nextjs-app-router");
  });

  it("collapses consecutive hyphens", () => {
    expect(generateSlug("foo  bar")).toBe("foo-bar");
  });

  it("removes special characters", () => {
    expect(generateSlug("Hello, World!")).toBe("hello-world");
  });

  it("preserves Korean characters", () => {
    const slug = generateSlug("안녕하세요 TypeScript");
    expect(slug).toContain("typescript");
    expect(slug).toContain("안녕하세요");
  });

  it("falls back to article-{timestamp} for empty result", () => {
    const slug = generateSlug("!!!");
    expect(slug).toMatch(/^article-\d+$/);
  });

  it("handles underscore as separator", () => {
    expect(generateSlug("foo_bar")).toBe("foo-bar");
  });
});
