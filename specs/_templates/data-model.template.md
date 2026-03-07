# Data Model Spec: {ModelName}

> **Phase**: {Phase N}
> **Status**: Draft | Review | Approved | Implementing | Implemented | Verified
> **Last Updated**: YYYY-MM-DD

## Overview

{Explain in 1-2 sentences what this data model is and why it is needed}

## Field Definitions

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `id` | uuid | PK, auto-generated | `uuid()` | Unique identifier |
| `fieldName` | string | required, max N chars | - | Description |
| `createdAt` | timestamp | auto | `now()` | Creation timestamp |
| `updatedAt` | timestamp | auto | `now()` | Modification timestamp |

## Enum Definitions

### {EnumName}

| Value | Description |
|-------|-------------|
| `value1` | Description |
| `value2` | Description |

## Relationships

| Relation | Target Model | Type | FK | Description |
|----------|-------------|------|-----|-------------|
| {relation} | {TargetModel} | 1:N / N:1 / N:M | `targetModelId` | Description |

## Indexes

| Name | Fields | Type | Purpose |
|------|--------|------|---------|
| `idx_{model}_{field}` | `fieldName` | UNIQUE / INDEX | Description |

## Zod Schema

```typescript
import { z } from 'zod';

export const {ModelName}Schema = z.object({
  // Field definitions
});

export type {ModelName} = z.infer<typeof {ModelName}Schema>;
```

## Drizzle ORM Schema

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const {modelNames} = sqliteTable('{model_names}', {
  // Column definitions
});
```

## Example Data

```json
{
  "id": "uuid-example",
  "fieldName": "example value"
}
```

## Business Rules

1. {Rule 1}
2. {Rule 2}

## Changelog

| Date | Change | Reason |
|------|--------|--------|
| YYYY-MM-DD | Initial creation | Phase N spec |
