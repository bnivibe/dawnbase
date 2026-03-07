# API Spec: Articles API

> **Phase**: Phase 1
> **Status**: Approved
> **Last Updated**: 2026-03-07
> **Base Path**: `/api/articles`

## 개요

Article 리소스에 대한 CRUD API를 정의합니다. Next.js App Router의 Route Handlers를 사용하며, Zod를 이용한 입력 검증, 적절한 HTTP 상태 코드 반환, 일관된 에러 응답 형식을 따릅니다. 삭제는 소프트 삭제(status를 archived로 변경) 방식으로 처리합니다.

## 엔드포인트 목록

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/articles` | 아티클 목록 조회 (페이지네이션, 필터링) | None (Phase 1) |
| POST | `/api/articles` | 새 아티클 생성 | None (Phase 1) |
| GET | `/api/articles/[id]` | 단건 아티클 조회 | None (Phase 1) |
| PUT | `/api/articles/[id]` | 아티클 수정 | None (Phase 1) |
| DELETE | `/api/articles/[id]` | 아티클 소프트 삭제 (archived) | None (Phase 1) |

> **Phase 4 참고**: 인증(Auth) 추가 시 모든 쓰기 엔드포인트(POST, PUT, DELETE)에 인증 필수로 변경 예정.

## 파일 구조

```
src/app/api/articles/
  route.ts              # GET (목록), POST (생성)
  [id]/
    route.ts            # GET (단건), PUT (수정), DELETE (삭제)
```

---

## GET `/api/articles`

### 설명
아티클 목록을 페이지네이션, 정렬, 상태 필터링과 함께 조회합니다. 기본적으로 `archived` 상태의 아티클은 제외합니다.

### Query Parameters

| Parameter | Type | Required | Default | Description | Validation |
|-----------|------|----------|---------|-------------|------------|
| `page` | number | No | `1` | 페이지 번호 | >= 1, 정수 |
| `limit` | number | No | `10` | 페이지당 항목 수 | 1-100, 정수 |
| `sort` | string | No | `createdAt` | 정렬 기준 필드 | `createdAt` \| `updatedAt` \| `title` \| `publishedAt` |
| `order` | string | No | `desc` | 정렬 방향 | `asc` \| `desc` |
| `status` | string | No | - | 상태 필터 | `draft` \| `published` \| `archived` |

### Query Parameter Validation (Zod)

```typescript
const ListArticlesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.enum(['createdAt', 'updatedAt', 'title', 'publishedAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});
```

### 비즈니스 로직

1. `status` 파라미터가 없으면 `draft`와 `published` 아티클만 반환 (`archived` 제외)
2. `status` 파라미터가 있으면 해당 상태의 아티클만 반환
3. 정렬 기준 필드와 방향에 따라 정렬
4. 페이지네이션 적용: `offset = (page - 1) * limit`

### Response

**200 OK**
```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "title": "Next.js App Router 시작하기",
      "slug": "nextjs-app-router-시작하기",
      "content": "# Next.js App Router\n\n...",
      "excerpt": "Next.js 13부터 도입된 App Router는...",
      "status": "published",
      "createdAt": "2026-03-01T09:00:00.000Z",
      "updatedAt": "2026-03-05T14:30:00.000Z",
      "publishedAt": "2026-03-05T14:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

**400 Bad Request** (잘못된 쿼리 파라미터)
```json
{
  "error": "Invalid query parameters",
  "details": [
    {
      "field": "page",
      "message": "Number must be greater than or equal to 1"
    }
  ]
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to fetch articles",
  "details": "Database connection error"
}
```

---

## POST `/api/articles`

### 설명
새 아티클을 생성합니다. 제목과 콘텐츠는 필수이며, slug는 제목에서 자동 생성, excerpt는 미입력 시 content에서 자동 생성됩니다.

### Request Body

```json
{
  "title": "새 아티클 제목",
  "content": "# 마크다운 콘텐츠\n\n본문 내용입니다.",
  "excerpt": "선택적 요약 텍스트",
  "status": "draft"
}
```

### Validation (Zod)

```typescript
const CreateArticleSchema = z.object({
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
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});
```

### 비즈니스 로직

1. Request body를 Zod 스키마로 검증
2. `title`에서 `slug` 자동 생성 (중복 시 숫자 접미사 추가)
3. `excerpt` 미제공 시 `content`에서 자동 생성 (마크다운 제거, 최대 300자)
4. `status`가 `published`이면 `publishedAt`을 현재 시각으로 설정
5. `id`는 `crypto.randomUUID()`로 자동 생성
6. `createdAt`, `updatedAt`은 현재 시각으로 자동 설정
7. DB에 저장 후 생성된 아티클 전체 반환

### Response

**201 Created**
```json
{
  "data": {
    "id": "d4e5f6a7-b8c9-0123-defg-456789012345",
    "title": "새 아티클 제목",
    "slug": "새-아티클-제목",
    "content": "# 마크다운 콘텐츠\n\n본문 내용입니다.",
    "excerpt": "마크다운 콘텐츠 본문 내용입니다.",
    "status": "draft",
    "createdAt": "2026-03-07T12:00:00.000Z",
    "updatedAt": "2026-03-07T12:00:00.000Z",
    "publishedAt": null
  }
}
```

**400 Bad Request** (Validation Error)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "content",
      "message": "Content is required"
    }
  ]
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to create article",
  "details": "..."
}
```

---

## GET `/api/articles/[id]`

### 설명
ID로 단일 아티클을 조회합니다. `archived` 상태의 아티클도 조회 가능합니다.

### Path Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `id` | string | 아티클 UUID | UUID 형식 |

### 비즈니스 로직

1. `id` 파라미터의 UUID 형식 검증
2. DB에서 해당 ID의 아티클 조회
3. 존재하지 않으면 404 반환

### Response

**200 OK**
```json
{
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Next.js App Router 시작하기",
    "slug": "nextjs-app-router-시작하기",
    "content": "# Next.js App Router\n\n...",
    "excerpt": "Next.js 13부터 도입된 App Router는...",
    "status": "published",
    "createdAt": "2026-03-01T09:00:00.000Z",
    "updatedAt": "2026-03-05T14:30:00.000Z",
    "publishedAt": "2026-03-05T14:30:00.000Z"
  }
}
```

**400 Bad Request** (잘못된 ID 형식)
```json
{
  "error": "Invalid article ID",
  "details": "ID must be a valid UUID"
}
```

**404 Not Found**
```json
{
  "error": "Article not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to fetch article",
  "details": "..."
}
```

---

## PUT `/api/articles/[id]`

### 설명
기존 아티클을 수정합니다. 전달된 필드만 업데이트됩니다 (partial update). `slug`는 `title`이 변경되면 자동으로 재생성됩니다.

### Path Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `id` | string | 아티클 UUID | UUID 형식 |

### Request Body

모든 필드 optional (최소 하나 이상 필요):

```json
{
  "title": "수정된 제목",
  "content": "# 수정된 내용",
  "excerpt": "수정된 요약",
  "status": "published"
}
```

### Validation (Zod)

```typescript
const UpdateArticleSchema = z.object({
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
  status: z.enum(['draft', 'published', 'archived']).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' }
);
```

### 비즈니스 로직

1. `id` 파라미터의 UUID 형식 검증
2. DB에서 해당 아티클 존재 확인 (없으면 404)
3. Request body를 Zod 스키마로 검증
4. `title`이 변경되면 `slug` 재생성 (중복 검사 포함)
5. `status`가 `published`로 변경되고 기존 `publishedAt`이 null이면 현재 시각으로 설정
6. `status`가 `draft`로 변경되면 `publishedAt`을 null로 초기화
7. `updatedAt`을 현재 시각으로 갱신
8. DB 업데이트 후 수정된 아티클 전체 반환

### Response

**200 OK**
```json
{
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "수정된 제목",
    "slug": "수정된-제목",
    "content": "# 수정된 내용",
    "excerpt": "수정된 요약",
    "status": "published",
    "createdAt": "2026-03-01T09:00:00.000Z",
    "updatedAt": "2026-03-07T15:00:00.000Z",
    "publishedAt": "2026-03-07T15:00:00.000Z"
  }
}
```

**400 Bad Request** (Validation Error)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title must be 200 characters or less"
    }
  ]
}
```

**404 Not Found**
```json
{
  "error": "Article not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to update article",
  "details": "..."
}
```

---

## DELETE `/api/articles/[id]`

### 설명
아티클을 소프트 삭제합니다. 실제로 DB에서 삭제하지 않고, `status`를 `archived`로 변경합니다.

### Path Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `id` | string | 아티클 UUID | UUID 형식 |

### 비즈니스 로직

1. `id` 파라미터의 UUID 형식 검증
2. DB에서 해당 아티클 존재 확인 (없으면 404)
3. 이미 `archived` 상태인 경우에도 성공 응답 반환 (멱등성)
4. `status`를 `archived`로 변경
5. `updatedAt`을 현재 시각으로 갱신
6. 변경된 아티클 반환

### Response

**200 OK**
```json
{
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "삭제된 아티클",
    "slug": "삭제된-아티클",
    "content": "...",
    "excerpt": "...",
    "status": "archived",
    "createdAt": "2026-03-01T09:00:00.000Z",
    "updatedAt": "2026-03-07T16:00:00.000Z",
    "publishedAt": "2026-03-05T14:30:00.000Z"
  }
}
```

**400 Bad Request** (잘못된 ID 형식)
```json
{
  "error": "Invalid article ID",
  "details": "ID must be a valid UUID"
}
```

**404 Not Found**
```json
{
  "error": "Article not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to delete article",
  "details": "..."
}
```

---

## 공통 사양

### 에러 응답 형식

모든 에러 응답은 동일한 형식을 따릅니다:

```typescript
// 일반 에러
interface ApiError {
  error: string;
  details?: string;
}

// 검증 에러
interface ApiValidationError {
  error: string;
  details: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
}
```

### Zod 에러 변환 유틸리티

```typescript
function formatZodError(error: z.ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}
```

### HTTP 상태 코드 요약

| Status | 사용 케이스 |
|--------|------------|
| `200 OK` | 조회, 수정, 삭제 성공 |
| `201 Created` | 생성 성공 |
| `400 Bad Request` | 입력값 검증 실패, 잘못된 파라미터 |
| `404 Not Found` | 리소스 없음 |
| `500 Internal Server Error` | 서버 내부 오류 (DB 오류 등) |

### Content-Type

- Request: `application/json`
- Response: `application/json`

### CORS

Phase 1에서는 별도 CORS 설정 불필요 (Same-origin). Phase 4에서 필요 시 추가.

## 구현 참고

### Route Handler 패턴

```typescript
// src/app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // 쿼리 파라미터 파싱 및 검증
    // DB 조회
    // 응답 반환
    return NextResponse.json({ data, pagination }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch articles', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Zod 검증
    // 슬러그 생성
    // DB 저장
    // 응답 반환
    return NextResponse.json({ data: article }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodError(error) },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create article', details: error.message },
      { status: 500 }
    );
  }
}
```

```typescript
// src/app/api/articles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // UUID 검증 -> 조회 -> 응답
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // UUID 검증 -> body 검증 -> 업데이트 -> 응답
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // UUID 검증 -> 존재 확인 -> status 변경 -> 응답
}
```

## 변경 이력

| Date | Change | Reason |
|------|--------|--------|
| 2026-03-07 | 최초 작성 | Phase 1 Article CRUD API 스펙 |
