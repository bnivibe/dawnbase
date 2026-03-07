# ADR-006: Project Structure - Hybrid Layer-Based with SDD Overlay

## Status
Accepted

## Date
2026-03-07

## Context
Dawnbase is a project that combines a Next.js-based full-stack application with the SDD methodology. The directory structure directly impacts code navigability, maintainability, and extensibility. In particular, a structure that can systematically manage SDD spec documents alongside actual implementation code is needed.

## Options Considered

### 1. **Flat Structure**
- Pros: Simple, suitable for small projects
- Cons: Difficult to navigate as file count grows, no separation of concerns, difficult spec management

### 2. **Feature-Based**
- Pros: High cohesion per feature (all files for a feature in one folder)
- Cons: Ambiguous placement of shared components/utilities, complex inter-feature dependency management, conflicts with Next.js App Router

### 3. **Layer-Based**
- Pros: Clear separation of concerns (UI, logic, data), aligns with Next.js conventions
- Cons: Low feature cohesion, requires navigating multiple layers when modifying a single feature

### 4. **Hybrid Layer-Based with SDD Overlay**
- Pros: Layer-based separation of concerns + separate SDD spec directory, natural integration with Next.js App Router structure, clear spec-to-code mapping
- Cons: Initial directory structure may appear complex

## Decision
**Hybrid Layer-Based with SDD Overlay** structure is selected.

## Rationale

1. **Separation of concerns**: Three major areas are separated — `specs/` (source of truth), `docs/` (history), and `src/` (implementation). The role of each area is clear.

2. **Separation of SDD specs and code**: Spec documents reside in `specs/`, implementation code in `src/`. Specs are managed independently without being coupled to implementation.

3. **Next.js App Router compatibility**: The `src/app/` directory follows Next.js App Router's file-based routing as-is.

4. **Extensibility**: New specs and implementations can be added without modifying the existing structure as new Phases are introduced.

### Directory Structure

```
dawnbase/
  specs/                         # SDD - Source of Truth
    _templates/                  # Spec writing templates
    data-models/                 # Data model specs
    api/                         # API endpoint specs
    ui/                          # UI component specs
    flows/                       # User flow specs
  docs/                          # Project history and decision records
    plans/                       # Plan history (per Phase)
    decisions/                   # ADR (Architecture Decision Records)
  src/                           # Implementation code
    app/                         # Next.js App Router (routes)
      layout.tsx                 # Root layout
      page.tsx                   # Home page
      articles/                  # Article-related routes
        page.tsx                 # List page
        [id]/page.tsx            # Detail page
        new/page.tsx             # Creation page
        [id]/edit/page.tsx       # Edit page
    components/                  # UI components
      ui/                        # shadcn/ui components
      layout/                    # Layout components (Header, Sidebar, etc.)
    lib/                         # Business logic and utilities
      db/                        # Database (Drizzle schema, queries)
      validations/               # Zod schemas
      actions/                   # Server Actions
    styles/                      # Global styles
  public/                        # Static assets
```

## Consequences

### Positive
- Clear separation of specs (specs/), documentation (docs/), and code (src/)
- Natural integration with Next.js App Router conventions
- Intuitive spec-to-code mapping in the SDD workflow
- No structural changes needed when extending by Phase
- New developers can quickly understand the project structure

### Negative
- May appear to have many directories initially (but roles are clear, minimizing confusion)
- Modifying a single feature requires updating both specs/ and src/
- Spec-to-code mapping must be tracked manually (mitigated by naming conventions)
