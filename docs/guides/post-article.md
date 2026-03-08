# How to Post an Article

Dawnbase does not have a web-based article editor. All content is managed through the **Claude Content Pipeline** — you provide source material, Claude structures and publishes it to the database.

## Overview

```
You provide one of:
  ├── YouTube URL        → Claude fetches title, description, summary
  ├── Blog / Article URL → Claude fetches and parses body content
  └── .md summary file   → Claude reads and structures your notes

Claude then:
  1. Analyzes and summarizes the source material
  2. Structures it into a Markdown article (개요 / 핵심 내용 / 정리)
  3. Inserts it into the database via the repository layer
  4. Reports the result (slug, URL, status)
```

Full rationale: [ADR-012 — Claude-managed content pipeline](../decisions/012-claude-managed-content-pipeline.md)

---

## Skill

The `/dawnbase-post-article` skill handles the full pipeline in one command.

### Usage

```
/dawnbase-post-article <source> [--publish]
```

| Argument | Description |
|----------|-------------|
| `<source>` | A URL or `.md` filename (required) |
| `--publish` | Publish immediately (default: saved as `draft`) |

### Source Types

| Type | Example | `source_type` |
|------|---------|---------------|
| YouTube URL | `https://youtube.com/watch?v=...` | `youtube` |
| Blog / Article URL | `https://some-blog.com/post/...` | `blog` |
| Local `.md` file | `my-notes.md` | `manual` |

### .md File Location

Summary files are stored in `~/Project/bnivibe/summaries/`, organized by topic:

```
summaries/
  diablo4/
    crackuna-sorcerer-build.md
  dev/
    some-tech-note.md
```

You can pass just the filename — Claude will search recursively:

```
/dawnbase-post-article crackuna-sorcerer-build.md
```

---

## Examples

### Post from a blog article (saved as draft)
```
/dawnbase-post-article https://some-blog.com/interesting-post
```

### Post from a YouTube video
```
/dawnbase-post-article https://youtube.com/watch?v=abc123
```

### Post from a local summary file
```
/dawnbase-post-article crackuna-sorcerer-build.md
```

### Post and publish immediately
```
/dawnbase-post-article crackuna-sorcerer-build.md --publish
```

---

## Article Structure

Claude always generates the article body in the following format:

```markdown
## 개요
(1–2 paragraph overview of the topic)

## 핵심 내용
(Key concepts, main points, subheadings and bullet points)

## 정리
(Takeaways — what to remember or apply)
```

---

## After Posting

- Articles are saved as **`draft`** by default and are not visible on the public list
- To publish, re-run with `--publish` or update the status in the DB directly
- The article URL follows the pattern: `/articles/<slug>`

---

## Under the Hood

The skill runs a lightweight CLI script:

```bash
DATABASE_URL=<url> npx tsx src/scripts/create-article.ts '<json>'
```

Source: [`src/scripts/create-article.ts`](../../src/scripts/create-article.ts)
