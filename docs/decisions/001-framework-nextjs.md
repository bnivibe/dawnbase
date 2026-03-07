# ADR-001: Framework - Next.js 15

## Status
Accepted

## Date
2026-03-07

## Context
Dawnbase is a knowledge archiving web application, a platform where users can create, manage, and search knowledge articles. This requires server-side rendering, static generation, API routing, and a scalable frontend framework.

The framework choice is a core decision that directly impacts the project's development speed, performance, scalability, and long-term maintainability.

## Options Considered

### 1. **Next.js 15 (App Router)**
- Pros: SSR/SSG/ISR support, React Server Components, Server Actions, file-based routing, Vercel-optimized deployment, largest React ecosystem, easy integration with AI SDK (Vercel AI SDK)
- Cons: Locked into the React ecosystem, App Router learning curve, some feature limitations when deploying outside Vercel

### 2. **React + Vite**
- Pros: Fast dev server, flexible configuration, bundle size optimization
- Cons: Requires manual SSR/SSG implementation, separate routing/data fetching setup needed, no full-stack capabilities

### 3. **Nuxt.js (Vue)**
- Pros: Vue's low barrier to entry, automatic routing, good DX
- Cons: Vue ecosystem is smaller than React, lack of AI/ML-related libraries, no shadcn/ui support

### 4. **SvelteKit**
- Pros: Excellent performance, minimal boilerplate, intuitive reactivity
- Cons: Small ecosystem, lack of component libraries, limited talent pool for hiring/collaboration

## Decision
**Next.js 15 with App Router** is selected as the framework.

## Rationale

1. **Integrated SSR/SSG support**: A knowledge archiving app requires strong SEO, and SSR and SSG enable both search engine optimization and fast initial loading simultaneously.

2. **Vercel deployment optimization**: Vercel deployment is planned for Phase 4, and Next.js is Vercel's official framework providing the best deployment experience. It maximizes the use of Vercel infrastructure including Edge Functions, ISR, and Image Optimization.

3. **React ecosystem**: As the largest frontend ecosystem, it offers rich high-quality component libraries like shadcn/ui and Radix UI, along with abundant utility libraries such as Zod and React Hook Form.

4. **AI SDK integration**: When expanding AI features from Phase 3 onward, seamless integration with Vercel AI SDK is possible.

5. **Server Components & Actions**: React Server Components reduce bundle size by running components only on the server, and Server Actions allow executing server logic without separate API routes.

6. **Community & documentation**: The most active community with rich documentation and tutorials makes problem-solving easy.

## Consequences

### Positive
- Access to the rich React ecosystem of libraries and tools
- Optimal performance and SEO through SSR/SSG/ISR
- Minimized client bundle size with Server Components
- Improved full-stack development productivity with Server Actions
- Best infrastructure utilization when deploying on Vercel
- Support from a large community and fast problem resolution

### Negative
- Technical lock-in to the React ecosystem (difficult to switch to Vue, Svelte, etc.)
- Relatively steep learning curve for App Router (compared to Pages Router)
- Some feature limitations when deploying on platforms other than Vercel (though standalone builds allow Docker deployment)
- Need to address breaking changes during Next.js version upgrades
