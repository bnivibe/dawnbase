# Data Model Spec: Article

> **Phase**: Phase 1
> **Status**: Approved
> **Last Updated**: 2026-03-07

## 개요

Article은 Dawnbase의 핵심 데이터 모델입니다. 사용자가 작성하는 지식 항목(아티클)을 나타내며, 마크다운 형식의 콘텐츠, 제목, 슬러그, 발행 상태 등을 관리합니다. 모든 지식 관리 기능의 기반이 되는 모델입니다.

## 필드 정의

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `id` | uuid (string) | PK, auto-generated | `crypto.randomUUID()` | 고유 식별자 |
| `title` | string | required, max 200 chars | - | 아티클 제목 |
| `slug` | string | unique, auto-generated from title | - | URL 친화적 식별자, 제목에서 자동 생성 |
| `content` | text | required, markdown format | - | 마크다운 형식의 본문 내용 |
| `excerpt` | string | optional, max 300 chars | auto-generated | 아티클 요약. 미입력 시 content 첫 300자에서 자동 생성 |
| `status` | enum (ArticleStatus) | required | `'draft'` | 아티클 발행 상태 |
| `createdAt` | timestamp (string) | auto, ISO 8601 | `now()` | 생성 시각 |
| `updatedAt` | timestamp (string) | auto, ISO 8601 | `now()` | 최종 수정 시각 |
| `publishedAt` | timestamp (string) | nullable, ISO 8601 | `null` | 발행 시각. status가 published로 변경될 때 자동 설정 |

## Enum 정의

### ArticleStatus

| Value | Description |
|-------|-------------|
| `draft` | 초안. 작성 중인 아티클. 목록에서는 보이지만 "draft" 뱃지 표시 |
| `published` | 발행됨. 완성된 아티클 |
| `archived` | 보관됨. 소프트 삭제 상태. 기본 목록에서 숨김 |

## 관계 (Relationships)

| Relation | Target Model | Type | FK | Description |
|----------|-------------|------|-----|-------------|
| category | Category | N:1 | `categoryId` | Phase 2에서 추가 예정. 아티클이 속한 카테고리 |

> **Phase 2 참고**: `categoryId` (uuid, nullable, FK -> categories.id) 필드가 추가됩니다.

## 인덱스 (Indexes)

| Name | Fields | Type | Purpose |
|------|--------|------|---------|
| `idx_articles_slug` | `slug` | UNIQUE | 슬러그 기반 조회 (URL routing) |
| `idx_articles_status` | `status` | INDEX | 상태별 필터링 성능 |
| `idx_articles_created_at` | `createdAt` | INDEX | 최신순 정렬 성능 |
| `idx_articles_published_at` | `publishedAt` | INDEX | 발행일 기준 정렬 성능 |

## Zod 스키마

```typescript
import { z } from 'zod';

// Enum
export const ArticleStatusEnum = z.enum(['draft', 'published', 'archived']);
export type ArticleStatus = z.infer<typeof ArticleStatusEnum>;

// 생성 시 입력 스키마
export const CreateArticleSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  content: z
    .string()
    .min(1, 'Content is required'),
  excerpt: z
    .string()
    .max(300, 'Excerpt must be 300 characters or less')
    .optional(),
  status: ArticleStatusEnum.default('draft'),
});

export type CreateArticleInput = z.infer<typeof CreateArticleSchema>;

// 수정 시 입력 스키마 (모든 필드 optional)
export const UpdateArticleSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .optional(),
  content: z
    .string()
    .min(1, 'Content is required')
    .optional(),
  excerpt: z
    .string()
    .max(300, 'Excerpt must be 300 characters or less')
    .nullable()
    .optional(),
  status: ArticleStatusEnum.optional(),
});

export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>;

// 전체 Article 스키마 (DB에서 읽어온 후)
export const ArticleSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string().nullable(),
  status: ArticleStatusEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime().nullable(),
});

export type Article = z.infer<typeof ArticleSchema>;
```

## Drizzle ORM 스키마

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const articles = sqliteTable('articles', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  status: text('status', { enum: ['draft', 'published', 'archived'] })
    .notNull()
    .default('draft'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  publishedAt: text('published_at'),
});
```

## 슬러그 생성 규칙

슬러그는 제목에서 자동 생성됩니다:

```typescript
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s가-힣-]/g, '')   // 특수문자 제거 (한글 허용)
    .replace(/[\s_]+/g, '-')          // 공백/밑줄을 하이픈으로
    .replace(/-+/g, '-')              // 연속 하이픈 제거
    .replace(/^-|-$/g, '');           // 앞뒤 하이픈 제거
}
```

- 동일 슬러그 존재 시: 숫자 접미사 추가 (예: `my-article`, `my-article-1`, `my-article-2`)
- 한글 제목 지원: 한글 문자는 슬러그에 그대로 포함
- 빈 슬러그 방지: 결과가 빈 문자열이면 `article-{timestamp}` 형태로 생성

## Excerpt 자동 생성 규칙

excerpt가 제공되지 않은 경우 content에서 자동 생성:

```typescript
function generateExcerpt(content: string, maxLength: number = 300): string {
  // 마크다운 문법 제거
  const plainText = content
    .replace(/#{1,6}\s/g, '')         // 헤딩 제거
    .replace(/\*\*|__/g, '')          // 볼드 제거
    .replace(/\*|_/g, '')             // 이탤릭 제거
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // 링크 -> 텍스트만
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // 코드 블록 제거
    .replace(/\n+/g, ' ')            // 줄바꿈 -> 공백
    .trim();

  if (plainText.length <= maxLength) return plainText;

  // 단어 단위로 자르기
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}
```

## 예시 데이터

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Next.js App Router 시작하기",
    "slug": "nextjs-app-router-시작하기",
    "content": "# Next.js App Router\n\nNext.js 13부터 도입된 App Router는...\n\n## 주요 특징\n\n- **서버 컴포넌트**: 기본적으로 모든 컴포넌트가 서버 컴포넌트\n- **레이아웃**: 중첩 레이아웃 지원\n- **라우팅**: 파일 시스템 기반 라우팅\n\n## 시작하기\n\n```bash\nnpx create-next-app@latest\n```",
    "excerpt": "Next.js 13부터 도입된 App Router는 서버 컴포넌트, 중첩 레이아웃, 파일 시스템 기반 라우팅 등의 주요 특징을 제공합니다.",
    "status": "published",
    "createdAt": "2026-03-01T09:00:00.000Z",
    "updatedAt": "2026-03-05T14:30:00.000Z",
    "publishedAt": "2026-03-05T14:30:00.000Z"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "title": "TypeScript 유틸리티 타입 정리",
    "slug": "typescript-유틸리티-타입-정리",
    "content": "# TypeScript 유틸리티 타입\n\n자주 사용하는 유틸리티 타입을 정리합니다.\n\n## Partial<T>\n\n모든 프로퍼티를 optional로 만듭니다.\n\n```typescript\ninterface User {\n  name: string;\n  age: number;\n}\n\ntype PartialUser = Partial<User>;\n// { name?: string; age?: number; }\n```",
    "excerpt": "TypeScript에서 자주 사용하는 유틸리티 타입(Partial, Required, Pick, Omit 등)을 정리합니다.",
    "status": "draft",
    "createdAt": "2026-03-07T10:00:00.000Z",
    "updatedAt": "2026-03-07T10:00:00.000Z",
    "publishedAt": null
  },
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "title": "삭제된 오래된 아티클",
    "slug": "삭제된-오래된-아티클",
    "content": "# 이 아티클은 보관 처리되었습니다.",
    "excerpt": "보관 처리된 아티클입니다.",
    "status": "archived",
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-02-20T16:00:00.000Z",
    "publishedAt": "2026-01-16T10:00:00.000Z"
  }
]
```

## 비즈니스 규칙

1. **제목 필수**: 아티클은 반드시 제목이 있어야 합니다 (빈 문자열 불가).
2. **콘텐츠 필수**: 아티클은 반드시 본문 내용이 있어야 합니다.
3. **슬러그 자동 생성**: 슬러그는 제목에서 자동 생성되며, 사용자가 직접 입력하지 않습니다.
4. **슬러그 고유성**: 동일 슬러그 존재 시 숫자 접미사를 추가하여 고유성을 보장합니다.
5. **Excerpt 자동 생성**: excerpt를 제공하지 않으면 content의 첫 300자에서 마크다운 문법을 제거하여 자동 생성합니다.
6. **발행일 자동 설정**: status를 `published`로 변경할 때 `publishedAt`이 null이면 현재 시각으로 자동 설정합니다.
7. **소프트 삭제**: 삭제 요청 시 실제로 레코드를 삭제하지 않고 status를 `archived`로 변경합니다.
8. **updatedAt 자동 갱신**: 모든 수정 시 `updatedAt`을 현재 시각으로 자동 갱신합니다.
9. **기본 목록 필터**: 기본 아티클 목록에서 `archived` 상태의 아티클은 표시하지 않습니다.

## 변경 이력

| Date | Change | Reason |
|------|--------|--------|
| 2026-03-07 | 최초 작성 | Phase 1 코어 데이터 모델 스펙 |
