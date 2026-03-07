# ADR-005: Methodology - Spec-Driven Development (SDD)

## Status
Accepted

## Date
2026-03-07

## Context
Dawnbase is a project that incrementally expands across multiple Phases, making it critical to clearly define requirements for each Phase and maintain consistency between implementation and documentation. Especially in an environment where development is done in collaboration with AI agents (such as Claude), explicit specs that agents can accurately follow are essential.

The choice of development methodology directly impacts code quality, development speed, documentation maintenance, and AI collaboration efficiency.

## Options Considered

### 1. **TDD (Test-Driven Development)**
- Pros: Tests serve as specs, high code coverage, safe refactoring
- Cons: Writing tests is complex for UI-centric projects, high initial setup cost, specs are buried in code (tests) making them difficult for non-developers to read

### 2. **BDD (Behavior-Driven Development)**
- Pros: Specs written in business language (Given-When-Then), easy stakeholder communication
- Cons: Requires learning Gherkin syntax, indirect mapping between specs and code, inefficient for AI agents to convert Gherkin to code

### 3. **SDD (Spec-Driven Development)**
- Pros: Specs serve as both documentation and contracts, AI agents can follow specs precisely, prevents scope creep, clear acceptance criteria, natural Phase-by-Phase extension
- Cons: Requires upfront time investment in spec writing, requires effort to keep specs and implementation in sync

### 4. **Ad-hoc (Unstructured)**
- Pros: Fast initial speed, high flexibility
- Cons: Accumulation of technical debt, lack of documentation, ambiguous instructions for AI agents, inconsistency between Phases

## Decision
**SDD (Spec-Driven Development)** is selected as the development methodology.

## Rationale

1. **Specs serve as both documentation and contracts**: Spec documents exist for each data model, API endpoint, UI component, and user flow. These specs serve as the basis for implementation, and when there is a conflict between spec and implementation, the spec takes priority (Single Source of Truth).

2. **Optimized for AI agent collaboration**: AI agents produce the most accurate results when following clear, structured instructions. SDD's structured spec documents provide AI agents with precise implementation criteria.

3. **Prevents scope creep**: Since the scope of implementation for each Phase is clearly defined in the specs, it prevents scope expansion such as "it would be nice to add this too."

4. **Clear acceptance criteria**: The behaviors, inputs/outputs, and error handling defined in specs serve as acceptance criteria, enabling objective assessment of implementation completion.

5. **Natural Phase-by-Phase extension**: SDD allows specs for each Phase to be written independently, making incremental extension natural — write and implement Phase 1 specs, then write Phase 2 specs.

6. **Living documentation**: Specs are living documents that evolve with the project. When requirements change, the spec is updated first, then the code is changed, maintaining a consistent workflow.

## Consequences

### Positive
- Clear spec documents exist for all features (data models, APIs, UI, flows)
- AI agents can work with precise implementation criteria
- Phase-by-Phase scope is clearly defined, making scope management easy
- Specs serve as project documentation (no need for separate documentation)
- New developers or contributors can quickly understand the project
- Objective assessment of implementation completion is possible

### Negative
- Requires time investment in spec writing before implementation (but offset by reduced implementation time and fewer bugs)
- Requires ongoing management to keep specs and actual implementation in sync
- Spec writing can become a bottleneck when rapid prototyping is needed
- Judgment is needed to set the appropriate level of spec detail (too detailed reduces flexibility, too brief introduces ambiguity)
