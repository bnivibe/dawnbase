# API Spec: {Resource} API

> **Phase**: {Phase N}
> **Status**: Draft | Review | Approved | Implementing | Implemented | Verified
> **Last Updated**: YYYY-MM-DD
> **Base Path**: `/api/{resource}`

## 개요

{이 API가 무엇을 하는지, 어떤 리소스를 다루는지 설명}

## 엔드포인트 목록

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/{resource}` | 목록 조회 | {Required/None} |
| POST | `/api/{resource}` | 생성 | {Required/None} |
| GET | `/api/{resource}/[id]` | 단건 조회 | {Required/None} |
| PUT | `/api/{resource}/[id]` | 수정 | {Required/None} |
| DELETE | `/api/{resource}/[id]` | 삭제 | {Required/None} |

---

## GET `/api/{resource}`

### 설명
{엔드포인트 설명}

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | `1` | 페이지 번호 |
| `limit` | number | No | `10` | 페이지당 항목 수 |
| `sort` | string | No | `createdAt` | 정렬 기준 필드 |
| `order` | string | No | `desc` | 정렬 방향 (asc/desc) |

### Response

**200 OK**
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to fetch {resource}",
  "details": "..."
}
```

---

## POST `/api/{resource}`

### 설명
{엔드포인트 설명}

### Request Body

```json
{
  "fieldName": "value"
}
```

### Validation (Zod)

```typescript
const Create{Resource}Schema = z.object({
  // 필드 정의
});
```

### Response

**201 Created**
```json
{
  "data": { }
}
```

**400 Bad Request** (Validation Error)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "fieldName",
      "message": "error message"
    }
  ]
}
```

---

## GET `/api/{resource}/[id]`

### 설명
{엔드포인트 설명}

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (uuid) | 리소스 ID |

### Response

**200 OK**
```json
{
  "data": { }
}
```

**404 Not Found**
```json
{
  "error": "{Resource} not found"
}
```

---

## PUT `/api/{resource}/[id]`

### 설명
{엔드포인트 설명}

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (uuid) | 리소스 ID |

### Request Body

```json
{
  "fieldName": "updated value"
}
```

### Response

**200 OK**
```json
{
  "data": { }
}
```

**400 Bad Request** / **404 Not Found**

---

## DELETE `/api/{resource}/[id]`

### 설명
{엔드포인트 설명}

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (uuid) | 리소스 ID |

### Response

**200 OK**
```json
{
  "data": { "id": "...", "status": "archived" }
}
```

**404 Not Found**
```json
{
  "error": "{Resource} not found"
}
```

---

## 공통 에러 형식

```typescript
interface ApiError {
  error: string;
  details?: string | ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
}
```

## 구현 참고

- Next.js App Router Route Handlers 사용
- 파일 위치: `src/app/api/{resource}/route.ts`, `src/app/api/{resource}/[id]/route.ts`
- Zod를 이용한 request body validation
- 적절한 HTTP status code 반환

## 변경 이력

| Date | Change | Reason |
|------|--------|--------|
| YYYY-MM-DD | 최초 작성 | Phase N 스펙 |
