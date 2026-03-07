# ADR-008: Deployment - Vercel

## Status
Accepted

## Date
2026-03-07

## Context
Dawnbase is planned to be deployed to a production environment accessible to external users in Phase 4. The deployment platform must support all Next.js application features (SSR, SSG, ISR, Server Actions, Edge Functions, etc.) and also requires DevOps capabilities such as CI/CD pipelines, preview deployments, and monitoring.

The choice of deployment platform impacts performance, cost, operational complexity, and the development workflow.

## Options Considered

### 1. **Vercel**
- Pros: Official Next.js platform, automatic deployment (Git push), free Hobby tier, Edge Functions, Image Optimization, Analytics, PR preview deployments, automatic HTTPS
- Cons: Vendor lock-in, Hobby tier limitations (100GB bandwidth, 100 deployments/day), serverless function execution time limits

### 2. **AWS (Amplify / ECS / Lambda)**
- Pros: Most flexible infrastructure, unlimited scalability, integration with all services
- Cons: High operational complexity, time-consuming setup, additional work needed for full Next.js feature support, unpredictable costs

### 3. **Cloudflare Pages**
- Pros: Global CDN, very fast Edge performance, generous free tier
- Cons: Limited Next.js compatibility (some features unsupported), Node.js runtime limitations (Workers environment), smaller ecosystem than Vercel

### 4. **Netlify**
- Pros: Good DX, automatic deployment, free tier, built-in form handling
- Cons: Next.js support lags behind Vercel, lower SSR performance than Vercel, some Next.js features unsupported

### 5. **Self-hosted (Docker)**
- Pros: Full control, no vendor lock-in, predictable costs
- Cons: Server management burden, self-built CI/CD, manual SSL/domain/scaling, high operational cost (time)

## Decision
**Vercel** is selected as the deployment platform.

## Rationale

1. **Official Next.js platform**: Vercel is the platform from the company that created Next.js, natively supporting all Next.js features (SSR, SSG, ISR, Server Actions, Middleware, Edge Functions, Image Optimization). Other platforms may have limited features or require additional configuration.

2. **Automatic deployment**: Connecting a GitHub repository enables automatic deployment with just a Git push. No need to build a separate CI/CD pipeline.

3. **PR preview deployments**: Creating a PR automatically generates a preview URL, allowing reviewers to verify actual behavior during code review. This is very useful for spec verification in the SDD workflow.

4. **Free Hobby tier**: Provides a free tier sufficient for personal projects (100GB bandwidth, serverless function execution, automatic HTTPS, custom domains).

5. **Edge Functions**: Through Vercel's Edge Network, serverless functions can be executed at the location closest to the user, providing fast response times for global users.

6. **Analytics & Web Vitals**: Built-in Analytics and Web Vitals monitoring enable performance tracking and optimization.

7. **Migration possibility**: Even with Vercel lock-in, Next.js's `standalone` build option can generate Docker images for migration to other platforms.

## Consequences

### Positive
- All Next.js features available with optimal performance
- Git push-based automatic deployment minimizes DevOps overhead
- PR preview deployments improve code review and spec verification efficiency
- Free tier enables starting without initial costs
- Global Edge Network provides fast response times
- Built-in Analytics/Monitoring for performance tracking

### Negative
- Vendor lock-in to the Vercel platform (however, migration is possible via standalone build)
- Pro plan ($20/month) required when exceeding Hobby tier limits
- Serverless function execution time limits (Hobby: 10 seconds, Pro: 60 seconds)
- Vercel service outages affect deployments and previews
- Complex backend logic may be constrained by serverless architecture limitations
