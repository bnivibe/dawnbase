# API Spec: {Resource} API

> **Phase**: {Phase N}
> **Status**: Draft | Review | Approved | Implementing | Implemented | Verified
> **Last Updated**: YYYY-MM-DD
> **Base Path**: `/api/{resource}`

## Overview

{Explain what this API does and what resource it handles}

## Endpoint List

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/{resource}` | List retrieval | {Required/None} |
| POST | `/api/{resource}` | Creation | {Required/None} |
| GET | `/api/{resource}/[id]` | Single item retrieval | {Required/None} |
| PUT | `/api/{resource}/[id]` | Update | {Required/None} |
| DELETE | `/api/{resource}/[id]` | Deletion | {Required/None} |

---

## GET `/api/{resource}`

### Description
{Endpoint description}

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | `1` | Page number |
| `limit` | number | No | `10` | Items per page |
| `sort` | string | No | `createdAt` | Sort field |
| `order` | string | No | `desc` | Sort direction (asc/desc) |

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

### Description
{Endpoint description}

### Request Body

```json
{
  "fieldName": "value"
}
```

### Validation (Zod)

```typescript
const Create{Resource}Schema = z.object({
  // Field definitions
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

### Description
{Endpoint description}

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (uuid) | Resource ID |

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

### Description
{Endpoint description}

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (uuid) | Resource ID |

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

### Description
{Endpoint description}

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (uuid) | Resource ID |

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

## Common Error Format

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

## Implementation Notes

- Uses Next.js App Router Route Handlers
- File location: `src/app/api/{resource}/route.ts`, `src/app/api/{resource}/[id]/route.ts`
- Request body validation using Zod
- Returns appropriate HTTP status codes

## Changelog

| Date | Change | Reason |
|------|--------|--------|
| YYYY-MM-DD | Initial creation | Phase N spec |
