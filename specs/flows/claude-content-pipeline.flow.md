# Claude Content Pipeline Flow

## Overview
Dawn provides source material to Claude. Claude processes, structures, and persists the content to the DB.

## Trigger
Dawn sends Claude one of:
- A YouTube URL
- A blog/article URL
- A `.md` file

## Steps

1. **Fetch** — Claude retrieves the content (WebFetch for URLs, Read for .md files)
2. **Analyze** — Claude extracts title, key points, and generates a structured Markdown body
3. **Classify** — Claude assigns category and tags, sets source_type (youtube | blog | manual)
4. **Persist** — Claude calls createArticle() via the repository with:
   - title, content, excerpt, status
   - sourceUrl (original URL), sourceType
5. **Confirm** — Claude reports the created article slug and DB record ID to Dawn

## Source Types

| source_type | Description |
|-------------|-------------|
| youtube | YouTube video URL |
| blog | Blog post or article URL |
| manual | Manually written .md file |
