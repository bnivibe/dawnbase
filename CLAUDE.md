# Dawnbase - Project Instructions

## Project Overview
Dawn's Knowledge Archive - 배운 것들과 스크랩한 것들을 정리하는 지식 아카이빙 웹사이트.

## SDD (Spec-Driven Development) Rules
- **Spec First:** 새 기능 구현 전에 반드시 `specs/` 디렉토리의 관련 스펙을 먼저 확인하거나 작성
- **Spec is Truth:** 스펙 파일과 구현 코드가 불일치하면 스펙이 우선. 스펙을 업데이트하거나 코드를 스펙에 맞춰 수정
- **Phase-based:** 현재 Phase에 해당하는 스펙만 구현. Phase 범위를 벗어나는 기능은 구현하지 않음

## Tech Stack
- Next.js 15 (App Router, TypeScript, Turbopack)
- Tailwind CSS + shadcn/ui
- PostgreSQL via Supabase
- Drizzle ORM
- Zod (validation)
- Vercel (deployment)

## Directory Structure
- `specs/` — SDD 스펙 (소스 오브 트루스)
- `docs/plans/` — 플랜 히스토리
- `docs/decisions/` — ADR (Architecture Decision Records)
- `src/app/` — Next.js App Router 페이지/API
- `src/components/` — React 컴포넌트
- `src/lib/` — 비즈니스 로직, DB, 유틸리티
- `src/hooks/` — 커스텀 React 훅
- `src/types/` — TypeScript 타입
- `src/actions/` — Server Actions

## Conventions
- Component files: PascalCase for components, kebab-case for file names
- DB schema: snake_case for column names
- API routes: RESTful, return JSON with consistent error format
- Validation: Zod schemas in `src/lib/validations/`
- Environment variables: `.env.local` (git-ignored), `.env.example` (tracked)

## Git Workflow
- Never commit directly to `main`
- Branch prefix: `dev/claude/...`
- Commit format: `[prefix] type: description`
- All changes go through Pull Requests

## Current Phase
Phase 1: Foundation — 기본 프로젝트 구조 + 글(Article) CRUD
