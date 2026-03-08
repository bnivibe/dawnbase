# ADR-014: E2E Testing with Playwright

## Status
Accepted

## Date
2026-03-08

## Context

Dawnbase reached Phase 1.1 completion with a significant architectural shift: the web UI became fully read-only, and write operations were removed entirely. Verifying that this read-only constraint holds — and that all pages and API endpoints continue to work correctly — required a testing approach that could:

1. Test actual browser behavior (not just unit logic)
2. Be rerun automatically on every future change
3. Catch regressions introduced by UI or API modifications

The existing test setup (Vitest) covers unit logic (slug generation, excerpt truncation), but cannot test page rendering, navigation, or HTTP endpoints end-to-end.

## Options Considered

### 1. Vitest + jsdom (extend existing setup)
- Pros: No new tooling, shares config with existing unit tests
- Cons: jsdom simulates a browser but does not run a real one. Navigation, CSS rendering, and actual HTTP responses are not testable. Would require extensive mocking that defeats the purpose of integration testing.

### 2. Cypress
- Pros: Large community, visual test runner, good documentation
- Cons: Heavier setup, slower cold start, requires separate process management, less ergonomic for API-level request testing, older architecture compared to Playwright

### 3. Playwright
- Pros: Modern architecture, supports Chromium/Firefox/WebKit, built-in API request testing (`request` fixture), fast parallel execution, integrates cleanly with Next.js via `webServer` config, first-class TypeScript support
- Cons: Separate browser binary (~90MB Chromium download)

## Decision

**Playwright** is adopted as the E2E testing framework.

## Rationale

1. **Real browser execution**: Playwright drives an actual Chromium instance. Page rendering, navigation, and JavaScript execution are tested exactly as a user would experience them.

2. **API testing built-in**: The `request` fixture allows HTTP-level tests without a browser, making it easy to verify that removed API routes (POST, PUT, DELETE) are no longer accessible.

3. **Next.js `webServer` integration**: Playwright's `webServer` config automatically starts and stops the Next.js dev server during test runs, so no manual server management is needed.

4. **Parallel execution**: Tests run across multiple workers by default, keeping the suite fast even as it grows.

5. **TypeScript-first**: Full type inference for test helpers and page objects with no additional setup.

6. **`test:e2e:ui` mode**: `playwright test --ui` opens an interactive browser UI showing test execution in real time — useful for debugging failures visually.

## What This Enables

| Capability | Example |
|-----------|---------|
| Page rendering verification | Dashboard shows stat cards, no write buttons |
| Navigation testing | Clicking Articles nav → `/articles` |
| Read-only constraint enforcement | POST `/api/articles` returns 405/404 |
| 404 handling | `/articles/nonexistent-slug` shows 404 |
| API contract testing | `GET /api/articles` returns `{ data, pagination }` |
| Regression detection | Re-run on every change to catch breakage early |

## Test Structure

```
e2e/
  dashboard.spec.ts   — Dashboard stat cards, no write entry points
  articles.spec.ts    — Article list, empty state, 404 handling
  layout.spec.ts      — Sidebar nav, header, read-only API checks
```

## Commands

```bash
npm run test:e2e        # Run all E2E tests (headless)
npm run test:e2e:ui     # Run with interactive Playwright UI
```

## Consequences

### Positive
- Automated verification that the read-only architecture is intact
- Regression safety net for all future Phase 1.1+ changes
- API contract is tested at the HTTP level, not just in code

### Negative
- Requires a running PostgreSQL instance (`dawnbase_dev`) for test execution
- ~90MB Chromium binary added to local environment (not committed to repo)
- Test suite duration (~25–30s) is longer than unit tests (<1s)
