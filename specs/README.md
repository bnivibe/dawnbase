# Dawnbase - Spec-Driven Development (SDD)

## What is SDD

Spec-Driven Development (SDD) is a development methodology where **specs are written first, and implementation follows the specs**.

In traditional development processes, code is often written first and documentation is created later, or development proceeds without documentation at all. SDD reverses this order. All features, data models, APIs, UI components, and user flows are **defined in spec documents before implementation**.

## Core Principles

### 1. Spec First, Code Second
A spec must exist before writing code. Code without a spec is not allowed.

### 2. Spec as Single Source of Truth
The spec document is the single source of truth for the feature. If implementation and spec conflict, the spec is correct and the implementation must be fixed.

### 3. Incremental & Phased
The project progresses in Phase units. Implementation for a Phase begins only after the specs for that Phase are complete.

### 4. Living Documentation
Specs are living documents. When requirements change, the spec is updated first, then the code is changed.

## Directory Structure

```
specs/
  README.md                    # This file - SDD methodology guide
  _templates/                  # Spec writing templates
    data-model.template.md     # Data model spec template
    api-endpoint.template.md   # API endpoint spec template
    ui-component.template.md   # UI component spec template
    user-flow.template.md      # User flow spec template
  data-models/                 # Data model specs
    article.spec.md            # Phase 1: Article model
  ui/                          # UI component specs
    layout.spec.md             # Phase 1: App shell layout
  api/                         # API endpoint specs
    articles-api.spec.md       # Phase 1: Article CRUD API
  flows/                       # User flow specs
    create-article.flow.md     # Phase 1: Article creation flow
```

## Spec Document Conventions

### File Naming
- Data models: `{model-name}.spec.md`
- API endpoints: `{resource}-api.spec.md`
- UI components: `{component-name}.spec.md`
- User flows: `{action}.flow.md`

### Spec Status Indicators
Each spec document displays its status at the top:

| Status | Meaning |
|--------|---------|
| `Draft` | Initial draft, before review |
| `Review` | Awaiting review |
| `Approved` | Approved, ready for implementation |
| `Implementing` | Implementation in progress |
| `Implemented` | Implementation complete, awaiting verification |
| `Verified` | Implementation verified |

### Phase Classification
Each spec specifies its corresponding Phase:

| Phase | Scope |
|-------|-------|
| Phase 1 | Core data models, basic CRUD, app shell layout |
| Phase 2 | Categories, tags, search, filtering |
| Phase 3 | Advanced markdown editor, media management |
| Phase 4 | Authentication, authorization, deployment |

## Workflow

### When Adding a New Feature
```
1. Copy the appropriate template and write the spec
2. Set the spec status to "Draft"
3. Change to "Approved" after review
4. Change to "Implementing" when starting implementation
5. Change to "Implemented" when implementation is complete
6. Change to "Verified" after testing/verification
```

### When Modifying an Existing Feature
```
1. Update the corresponding spec document first
2. Record the changes in the Changelog section
3. Proceed with code changes after spec change approval
```

## Tech Stack Reference

Dawnbase project tech stack:
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI**: React 19, Tailwind CSS 4
- **Validation**: Zod
- **Database**: SQLite (via Drizzle ORM) - Phase 1
- **Theme**: next-themes (dark/light mode)
