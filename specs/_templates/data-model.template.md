# Data Model Spec: {ModelName}

> **Phase**: {Phase N}
> **Status**: Draft | Review | Approved | Implementing | Implemented | Verified
> **Last Updated**: YYYY-MM-DD

## 개요

{이 데이터 모델이 무엇인지, 왜 필요한지 1-2문장으로 설명}

## 필드 정의

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `id` | uuid | PK, auto-generated | `uuid()` | 고유 식별자 |
| `fieldName` | string | required, max N chars | - | 설명 |
| `createdAt` | timestamp | auto | `now()` | 생성 시각 |
| `updatedAt` | timestamp | auto | `now()` | 수정 시각 |

## Enum 정의

### {EnumName}

| Value | Description |
|-------|-------------|
| `value1` | 설명 |
| `value2` | 설명 |

## 관계 (Relationships)

| Relation | Target Model | Type | FK | Description |
|----------|-------------|------|-----|-------------|
| {relation} | {TargetModel} | 1:N / N:1 / N:M | `targetModelId` | 설명 |

## 인덱스 (Indexes)

| Name | Fields | Type | Purpose |
|------|--------|------|---------|
| `idx_{model}_{field}` | `fieldName` | UNIQUE / INDEX | 설명 |

## Zod 스키마

```typescript
import { z } from 'zod';

export const {ModelName}Schema = z.object({
  // 필드 정의
});

export type {ModelName} = z.infer<typeof {ModelName}Schema>;
```

## Drizzle ORM 스키마

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const {modelNames} = sqliteTable('{model_names}', {
  // 컬럼 정의
});
```

## 예시 데이터

```json
{
  "id": "uuid-example",
  "fieldName": "example value"
}
```

## 비즈니스 규칙

1. {규칙 1}
2. {규칙 2}

## 변경 이력

| Date | Change | Reason |
|------|--------|--------|
| YYYY-MM-DD | 최초 작성 | Phase N 스펙 |
