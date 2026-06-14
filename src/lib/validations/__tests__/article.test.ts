import { describe, it, expect } from "vitest";
import {
  resolveSources,
  CreateArticleSchema,
  ArticleSourceSchema,
  VerifiedStateEnum,
  type Article,
} from "@/lib/validations/article";

// Minimal Article factory for adapter tests (only the fields resolveSources reads).
function articleWith(
  partial: Pick<Article, "sources" | "sourceUrl" | "sourceType">,
): Pick<Article, "sources" | "sourceUrl" | "sourceType"> {
  return partial;
}

describe("resolveSources (ADR-017 backward-compat adapter)", () => {
  it("prefers the new sources[] array when present", () => {
    const article = articleWith({
      sources: [
        { url: "https://youtu.be/abc", title: "A talk", type: "youtube" },
      ],
      sourceUrl: "https://legacy.example.com",
      sourceType: "blog",
    });
    expect(resolveSources(article)).toEqual([
      { url: "https://youtu.be/abc", title: "A talk", type: "youtube" },
    ]);
  });

  it("falls back to legacy sourceUrl/sourceType when sources is null", () => {
    const article = articleWith({
      sources: null,
      sourceUrl: "https://blog.example.com/post",
      sourceType: "blog",
    });
    expect(resolveSources(article)).toEqual([
      {
        url: "https://blog.example.com/post",
        title: "https://blog.example.com/post",
        type: "blog",
      },
    ]);
  });

  it("defaults legacy type to 'manual' when sourceType is null", () => {
    const article = articleWith({
      sources: null,
      sourceUrl: "https://example.com/x",
      sourceType: null,
    });
    expect(resolveSources(article)[0].type).toBe("manual");
  });

  it("returns an empty list when there is no source at all", () => {
    const article = articleWith({
      sources: null,
      sourceUrl: null,
      sourceType: null,
    });
    expect(resolveSources(article)).toEqual([]);
  });

  it("treats an empty sources[] as 'no new sources' and falls back", () => {
    const article = articleWith({
      sources: [],
      sourceUrl: "https://example.com/y",
      sourceType: "manual",
    });
    expect(resolveSources(article)).toHaveLength(1);
  });
});

describe("knowledge-metadata schema (ADR-017)", () => {
  it("defaults verified to 'unverified' on create", () => {
    const parsed = CreateArticleSchema.parse({
      title: "Test",
      content: "Body",
    });
    expect(parsed.verified).toBe("unverified");
  });

  it("accepts the full verified-state enum", () => {
    expect(VerifiedStateEnum.options).toEqual([
      "verified",
      "partial",
      "unverified",
      "stale",
    ]);
  });

  it("rejects a source with an invalid url", () => {
    const result = ArticleSourceSchema.safeParse({
      url: "not-a-url",
      title: "x",
      type: "blog",
    });
    expect(result.success).toBe(false);
  });
});
