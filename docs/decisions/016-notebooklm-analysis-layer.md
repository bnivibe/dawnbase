# ADR-016: Use NotebookLM as the Analysis Layer for URL Content

**Date**: 2026-03-08
**Status**: Planned
**Phase**: 1.2

---

## Context

Phase 1.1 established a content pipeline where Claude directly fetches URLs (YouTube, blogs) via WebFetch, analyzes the content, and persists it to the DB. This works for simple cases but has two limitations:

1. **Quality ceiling** — Claude's WebFetch-based analysis is limited to page metadata and visible text. YouTube transcripts, long-form articles, and multi-section documents are not fully processed.
2. **Token cost** — Asking Claude to read and summarize full source content consumes significant tokens on each request, especially for long videos or articles.

---

## Decision

Introduce Google NotebookLM (via MCP) as a dedicated analysis layer between URL input and article creation:

```
URL → NotebookLM MCP (deep analysis) → .md file (local save) → Claude (format + persist) → DB
```

Claude's role is reduced to orchestration and DB persistence. NotebookLM handles the heavy analysis work.

---

## Reasons

### 1. Token Efficiency

Having Claude analyze full source content per request is expensive. By delegating analysis to NotebookLM, Claude only handles:
- Calling the MCP tool with the URL
- Formatting the returned analysis into a structured .md file
- Persisting the article via `createArticle()`

This keeps token usage minimal per article creation.

### 2. Analysis Quality

NotebookLM is purpose-built for deep document and video understanding:
- Processes full YouTube transcripts (not just titles/descriptions)
- Handles long-form content without truncation
- Produces structured, high-quality summaries and key insights

The output quality is expected to be significantly better than Claude's direct WebFetch-based summarization.

---

## Consequences

### Positive
- Lower token cost per article creation
- Higher quality analysis for YouTube and long-form content
- .md files saved locally serve as a personal archive before DB insert

### Negative
- Requires NotebookLM MCP to be configured and authenticated
- Adds a dependency on an external service (Google NotebookLM)
- Pipeline breaks if MCP is unavailable (no offline fallback yet)

---

## Related

- [v001.2 Plan — NotebookLM-Powered Content Pipeline](../plans/v001.2-notebooklm-pipeline.md)
- [ADR-012 — Claude-Managed Content Pipeline](./012-claude-managed-content-pipeline.md)
