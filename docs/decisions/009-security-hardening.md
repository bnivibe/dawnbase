# ADR-009: Security Hardening for Public Repository

## Status
Accepted

## Date
2026-03-07

## Context
We decided to transition the Dawnbase repository from private to public. The purpose is to make the design process and code publicly available for portfolio use. Prior to the transition, a security review was conducted to verify that no sensitive information is exposed, there are no security vulnerabilities, and best practices for public repositories are followed.

## Security Review Findings

### Issues Found

| Severity | Issue | Action | Status |
|----------|-------|--------|--------|
| HIGH | API authentication not implemented (CRUD possible without authentication) | Supabase Auth to be introduced in Phase 4 | Deferred |
| HIGH | Personal email exposed in Git history | Owner confirmed exposure is acceptable | Accepted |
| MEDIUM | Internal error details exposed in API error responses (`error.message`) | Replaced with generic error messages + moved to server logs | **Fixed** |
| MEDIUM | Rate limiting not applied | To be implemented as middleware after Phase 2 | Deferred |
| LOW | Security response headers not configured | Added security headers to `next.config.ts` | **Fixed** |
| LOW | `password` placeholder used in `.env.example` | Replaced with safe placeholder (`YOUR_DB_PASSWORD`) | **Fixed** |

### Rationale for Items Not Immediately Addressed

- **API authentication**: Phase 1 is currently in the development stage using mock data, and authentication will be implemented before actual DB connection and production deployment (Phase 4). Risk is limited at the current stage
- **Rate limiting**: To be implemented as middleware before production deployment. Currently only used in the local development environment
- **Personal email**: Repository owner (Dawn) explicitly permitted the exposure

## Actions Taken

### 1. Removed Internal Information from API Error Messages
**Files:** `src/app/api/articles/route.ts`, `src/app/api/articles/[id]/route.ts`

**Before:**
```typescript
} catch (error) {
  return NextResponse.json(
    { error: "Failed to fetch articles", details: error instanceof Error ? error.message : "Unknown error" },
    { status: 500 },
  );
}
```

**After:**
```typescript
} catch (error) {
  console.error("[GET /api/articles]", error);
  return NextResponse.json(
    { error: "Failed to fetch articles" },
    { status: 500 },
  );
}
```

**Rationale:** In a production environment, `error.message` may contain information useful to attackers, such as stack traces, DB connection strings, and internal file paths. Only generic error messages are returned to the client, while detailed errors are recorded in server logs (`console.error`) for debugging purposes.

### 2. Improved Credential Placeholders
**Files:** `.env.example`, `README.md`

**Before:**
```
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

**After:**
```
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
```

**Rationale:** Placeholders like `password` that could be mistaken for actual passwords risk being used as-is in production by mistake. Changing to a format like `YOUR_DB_PASSWORD` that clearly requires replacement prevents such mistakes.

### 3. Added Security Response Headers
**File:** `next.config.ts`

Added headers:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-DNS-Prefetch-Control` | `on` | Performance improvement through DNS prefetching |
| `X-Frame-Options` | `SAMEORIGIN` | Prevent clickjacking attacks |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer information leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Block unnecessary browser API access |

**Rationale:** These headers are HTTP security headers recommended by OWASP that prevent common web vulnerabilities (clickjacking, MIME sniffing, information leakage). They are fundamental security measures for public web applications.

## Decision
The above security measures are applied immediately, and remaining issues (authentication, rate limiting) will be addressed in their respective Phases. Security reviews will be repeated with each major change.

## Consequences

### Positive
- Reduced risk of information leakage in the public repository
- Basic defense established through OWASP-recommended security headers
- Internal information is no longer exposed to clients when errors occur
- Security review process is documented and repeatable for future reviews

### Negative
- API authentication is not yet implemented, maintaining an unauthenticated state until Phase 4
- Detailed error information is no longer sent to the client, requiring server log checks for frontend debugging
