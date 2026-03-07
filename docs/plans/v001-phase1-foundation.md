# Phase 1: Foundation

## Status
In Progress

## Date
2026-03-07

## Goal
Project scaffolding + SDD structure + basic app shell + article CRUD

완전히 동작하는 기초 애플리케이션을 구축합니다. 프로젝트 스캐폴딩부터 SDD(Spec-Driven Development) 구조 수립, 기본 앱 셸 레이아웃, 그리고 Article CRUD 기능까지 포함합니다.

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js (App Router) | 15 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS | 4 |
| UI Components | shadcn/ui | latest |
| Database | PostgreSQL via Supabase | - |
| ORM | Drizzle ORM | latest |
| Validation | Zod | latest |
| Deployment | Vercel | - |

---

## Steps

### Step 1: Repository Creation
- [x] GitHub 저장소 생성 (`bnivibe/dawnbase`)
- [x] 초기 README.md 작성
- [x] `.gitignore` 설정

### Step 2: Project Scaffolding
- [x] `create-next-app` 으로 Next.js 프로젝트 생성
- [x] TypeScript, Tailwind CSS, App Router 설정
- [x] ESLint 설정
- [ ] shadcn/ui 초기화
- [ ] Drizzle ORM + Supabase 연결 설정
- [ ] Zod 설치 및 설정

### Step 3: SDD Structure
- [x] `specs/` 디렉토리 구조 생성
- [x] SDD 방법론 README 작성
- [x] 스펙 템플릿 파일 작성 (data-model, api-endpoint, ui-component, user-flow)
- [x] Phase 1 스펙 문서 작성
  - [x] `specs/data-models/article.spec.md`
  - [x] `specs/ui/layout.spec.md`
  - [x] `specs/api/articles-api.spec.md`
  - [x] `specs/flows/create-article.flow.md`

### Step 4: Database Schema
- [ ] Article 테이블 스키마 정의 (Drizzle)
- [ ] 마이그레이션 파일 생성 및 실행
- [ ] Seed 데이터 준비 (개발용)

### Step 5: App Shell
- [ ] 루트 레이아웃 구현 (`src/app/layout.tsx`)
- [ ] 헤더 컴포넌트 (로고, 네비게이션)
- [ ] 사이드바 컴포넌트 (카테고리 네비, Phase 2에서 확장)
- [ ] 메인 콘텐츠 영역
- [ ] 다크/라이트 테마 전환
- [ ] 반응형 레이아웃 (모바일/데스크탑)

### Step 6: Article CRUD
- [ ] **Create**: 새 아티클 작성 폼 + Server Action
- [ ] **Read**: 아티클 목록 페이지 + 상세 페이지
- [ ] **Update**: 아티클 수정 폼 + Server Action
- [ ] **Delete**: 아티클 삭제 확인 + Server Action
- [ ] Zod 스키마로 입력 검증
- [ ] 에러 핸들링 및 사용자 피드백

### Step 7: PR & Review
- [ ] 기능 브랜치에서 작업 완료
- [ ] 테스트 통과 확인
- [ ] PR 생성 및 리뷰

---

## Roadmap Overview

### Phase 1: Foundation (Current)
코어 데이터 모델, 기본 CRUD, 앱 셸 레이아웃

### Phase 2: Organization & Search
카테고리 시스템, 태그, 전문 검색(Full-text Search), 필터링

### Phase 3: Rich Content
마크다운 에디터 고도화 (코드 하이라이팅, 미디어 임베딩), 미디어 관리 (이미지 업로드/최적화)

### Phase 4: Auth & Deploy
사용자 인증 (Supabase Auth), 권한 관리, 프로덕션 배포 (Vercel), 모니터링

---

## Status Tracking

| Component | Status | Notes |
|-----------|--------|-------|
| Repository | Done | GitHub 저장소 생성 완료 |
| Scaffolding | In Progress | Next.js + Tailwind 기본 설정 완료 |
| SDD Structure | Done | 스펙 템플릿 및 Phase 1 스펙 작성 완료 |
| Database Schema | Not Started | - |
| App Shell | Not Started | - |
| Article CRUD | Not Started | - |
| PR & Review | Not Started | - |
