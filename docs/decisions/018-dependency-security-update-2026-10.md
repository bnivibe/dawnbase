# ADR-018: Dependency Security Update (Dependabot, October 2026)

## Status
Accepted

## Date
2026-10-20

## Context
Dependabot alerts were enabled for this public repository on 2026-10-20. The first scan reported 143 open alerts against `package-lock.json`: 4 critical, 54 high, 75 medium and 10 low. The last code change before the scan was on 2026-10-10.

| Source | Critical | High | Medium | Low |
|--------|----------|------|--------|-----|
| `next` 16.1.6 (direct) | 2 | 13 | 16 | 4 |
| Transitive and dev dependencies | 2 | 41 | 59 | 6 |

The critical alerts were two unauthenticated remote code execution issues in `next` (fixed in 16.3.3), the Vitest UI server (dev only, fixed in vitest 4.1.0) and IP spoofing in `proxy-addr` (reached through the MCP server bundled with the `shadcn` CLI).

## Decision

### 1. Upgrade `next` to 16.4.2, not 16.3.8
The Dependabot advisories are all fixed by 16.3.8. However, three further advisories published by Vercel on 2026-10-14 had not yet reached the Dependabot database at the time of this change, and they affect every release up to and including 16.4.0:

| Advisory | Severity | Fixed in |
|----------|----------|----------|
| GHSA-673q-mjm6-r5xr: RCE in `use cache` functions returning typed arrays | Critical | 16.4.1 |
| GHSA-2464-fhr4-w9xw: RCE in the Image Optimization API with SVG files | Critical | 16.4.1 |
| GHSA-p3m5-59mp-jv5r: Denial of Service in App Router Server Actions | High | 16.4.1 |

There is no 16.3.x backport, so 16.4.2 (the latest 16.x release) is the lowest version that closes everything known. The upgrade stays within major version 16. The release notes for 16.2, 16.3 and 16.4 list no breaking change for the features this app uses (App Router pages, route handlers, Server Actions, `headers()` in `next.config.ts`). `eslint-config-next` is kept on the same version as `next`.

### 2. Fix transitive dependencies with `npm audit fix`, without `--force`
All bumps stay inside the ranges already declared in `package.json`. Notable direct packages that moved: `drizzle-orm` 0.45.1 to 0.45.4, `vitest` 4.0.18 to 4.1.12, `shadcn` 4.0.0 to 4.22.1, `drizzle-kit` 0.31.9 to 0.31.11 and `@tailwindcss/typography` 0.5.19 to 0.5.20.

`npm audit fix` left the tree invalid: it hoisted `esbuild` 0.18.20 (only needed by drizzle-kit's `@esbuild-kit` loader) to the top level, which conflicts with the optional `esbuild` peer of vite 8. That copy was nested back under `@esbuild-kit/core-utils`, as it was before the update. A clean `npm ci` gives a valid tree (`npm ls --all` passes) and `npm install` leaves the lockfile unchanged.

### 3. One scoped override
`@tailwindcss/typography` 0.5.20, its latest release, pins `postcss-selector-parser` to exactly 6.0.10, which is affected by GHSA-rj75-hqrm-r3gf (fixed in 7.1.6). Because no release lifts the pin, a direct upgrade is impossible, so `package.json` overrides that single dependency:

```json
"overrides": {
  "@tailwindcss/typography": {
    "postcss-selector-parser": "^7.1.6"
  }
}
```

The only breaking change in `postcss-selector-parser` 7.0.0 concerns insertions during iteration, which the plugin does not do. A clean `next build` with and without the override produced a byte-identical stylesheet. Remove the override once a typography release depends on 7.1.6 or later.

## Remaining Alerts
Matching each of the 143 alerts against the final lockfile, 141 are closed (all 4 critical, 53 of 54 high, 74 of 75 medium, all 10 low). Two remain, and neither is reachable from the deployed application.

| Alert | Severity | Path | Why it stays |
|-------|----------|------|--------------|
| `braces` <= 3.0.3: stack exhaustion on deeply nested input | High | `shadcn` CLI -> `fast-glob` -> `micromatch` -> `braces` (also reached by the lint tooling) | No patched version exists. `braces` runs only inside the shadcn CLI and lint tooling, on glob patterns written by the developer; none of `braces`, `micromatch` or `fast-glob` appears in the `.next` build output. |
| `esbuild` <= 0.24.2: dev server accepts cross-origin requests | Medium | `drizzle-kit` -> `@esbuild-kit/esm-loader` -> `@esbuild-kit/core-utils` -> `esbuild` 0.18.20 | Development dependency only. The issue lives in esbuild's `serve()` dev server, which `@esbuild-kit` never calls (it only uses the transform API). Overriding it to 0.25 would change the loader drizzle-kit uses to read `drizzle.config.ts`, with no test coverage for those commands. |

`shadcn` is listed under `dependencies` only because `globals.css` imports `shadcn/tailwind.css`; the CLI code is never bundled.

## Verification
All checks were run on a clean `npm ci` of the final lockfile.

| Check | main (16.1.6) | This change (16.4.2) |
|-------|---------------|----------------------|
| `npm run lint` | Pass | Pass |
| `npm run build` | Pass, 7 routes | Pass, same 7 routes |
| Vitest unit tests (`src/`) | 24 passed | 24 passed |
| Playwright E2E (`_e2e/`, local dev DB) | 17 passed | 17 passed |
| `npm audit` | 42 (3 critical, 25 high) | 13 (0 critical, 9 high; all from the two causes above) |

The built stylesheet was compared rule by rule against `main`, ignoring whitespace. Every existing rule is identical in content and order. The only additions come from `shadcn/tailwind.css` 4.22 (new `scroll-fade` and `shimmer` utilities): a few `@property` declarations and fallback custom properties that no class in this app uses.

## Notes
- `next dev` (16.3 and later) writes an `AGENTS.md` block that points coding agents at the bundled Next.js docs. It is not part of this change.
- Next.js 16.2 and later forward browser console messages to the dev terminal. This makes a pre-existing Base UI warning visible there (a `Button` rendered without a native `<button>` in the sidebar). The same warning appears in the browser console on `main`, and `@base-ui/react` is unchanged at 1.2.0.
- `npm test` also collects the Playwright specs in `_e2e/` and reports them as three failed files, on `main` and on this change alike, because the Vitest config does not exclude them. The unit tests were run with `npx vitest run src`.
