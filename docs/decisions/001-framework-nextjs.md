# ADR-001: Framework - Next.js 15

## 상태 (Status)
Accepted

## 날짜 (Date)
2026-03-07

## 맥락 (Context)
Dawnbase는 지식 아카이빙 웹 애플리케이션으로, 사용자가 지식 아티클을 생성, 관리, 검색할 수 있는 플랫폼입니다. 이를 위해 서버 사이드 렌더링, 정적 생성, API 라우팅, 그리고 확장 가능한 프론트엔드 프레임워크가 필요합니다.

프레임워크 선택은 프로젝트의 개발 속도, 성능, 확장성, 그리고 장기적인 유지보수에 직접적인 영향을 미치는 핵심 결정입니다.

## 고려한 옵션 (Options Considered)

### 1. **Next.js 15 (App Router)**
- 장점: SSR/SSG/ISR 지원, React Server Components, Server Actions, 파일 기반 라우팅, Vercel 최적화 배포, 가장 큰 React 에코시스템, AI SDK(Vercel AI SDK) 통합 용이
- 단점: React 에코시스템에 종속, App Router의 학습 곡선, Vercel 외 배포 시 일부 기능 제한

### 2. **React + Vite**
- 장점: 빠른 개발 서버, 유연한 구성, 번들 크기 최적화
- 단점: SSR/SSG 직접 구현 필요, 라우팅/데이터 페칭 별도 설정, 풀스택 기능 부재

### 3. **Nuxt.js (Vue)**
- 장점: Vue의 낮은 진입 장벽, 자동 라우팅, 좋은 DX
- 단점: Vue 에코시스템은 React보다 작음, AI/ML 관련 라이브러리 부족, shadcn/ui 미지원

### 4. **SvelteKit**
- 장점: 뛰어난 성능, 적은 보일러플레이트, 직관적 반응성
- 단점: 작은 에코시스템, 컴포넌트 라이브러리 부족, 채용/협업 시 인력 풀 제한

## 결정 (Decision)
**Next.js 15 with App Router**를 프레임워크로 선택합니다.

## 이유 (Rationale)

1. **SSR/SSG 통합 지원**: 지식 아카이빙 앱은 SEO가 중요하며, SSR과 SSG를 통해 검색 엔진 최적화와 빠른 초기 로딩을 동시에 달성할 수 있습니다.

2. **Vercel 배포 최적화**: Phase 4에서 Vercel 배포를 계획하고 있으며, Next.js는 Vercel의 공식 프레임워크로 최상의 배포 경험을 제공합니다. Edge Functions, ISR, Image Optimization 등 Vercel 인프라를 최대한 활용할 수 있습니다.

3. **React 에코시스템**: 가장 큰 프론트엔드 에코시스템으로, shadcn/ui, Radix UI 등 고품질 컴포넌트 라이브러리와 Zod, React Hook Form 등 유틸리티 라이브러리가 풍부합니다.

4. **AI SDK 통합**: Phase 3 이후 AI 기능 확장 시 Vercel AI SDK와의 자연스러운 통합이 가능합니다.

5. **Server Components & Actions**: React Server Components를 통해 서버에서만 실행되는 컴포넌트로 번들 크기를 줄이고, Server Actions로 별도 API 라우트 없이 서버 로직을 실행할 수 있습니다.

6. **커뮤니티 & 문서**: 가장 활발한 커뮤니티와 풍부한 문서, 튜토리얼이 존재하여 문제 해결이 용이합니다.

## 결과 (Consequences)

### 긍정적 (Positive)
- 풍부한 React 에코시스템의 라이브러리와 도구 활용 가능
- SSR/SSG/ISR로 최적의 성능과 SEO 달성
- Server Components로 클라이언트 번들 크기 최소화
- Server Actions로 풀스택 개발 생산성 향상
- Vercel 배포 시 최상의 인프라 활용
- 대규모 커뮤니티의 지원과 빠른 문제 해결

### 부정적 (Negative)
- React 에코시스템에 대한 기술적 종속 (Vue, Svelte 등으로의 전환 어려움)
- App Router의 상대적으로 높은 학습 곡선 (Pages Router 대비)
- Vercel 외 플랫폼 배포 시 일부 기능 제약 가능 (단, standalone 빌드로 Docker 배포는 가능)
- Next.js 버전 업그레이드 시 breaking changes 대응 필요
