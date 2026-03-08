# Dawnbase — Feature Specification (Phase 1.1)

## Overview

Dawnbase is Dawn's personal knowledge archive. The web interface is **read-only** — visitors browse and read articles. All content creation and management is handled by Claude directly via the database.

**Phase:** 1.1
**Last Updated:** 2026-03-08

---

## Pages

### 1. Dashboard (`/`)

- [x] Total Articles 통계 카드 — 비아카이브 글 전체 수 표시
- [x] Drafts 통계 카드 — 초안 상태 글 수 표시
- [x] Published 통계 카드 — 발행 상태 글 수 표시
- [x] "New Article" 진입점 제거 — Dashboard의 "Create First Article" 버튼 제거

---

### 2. Article List (`/articles`)

- [x] 글 목록 — 비아카이브 글 목록 표시
- [x] 글 카드 — 제목, 상태 배지, 발췌문, 작성일 표시
- [x] 상태 배지 — Published(초록), Draft(아웃라인), Archived(흐림)
- [x] 발행일 표시 — 발행된 글에 한해 발행일 추가 표시
- [x] 클릭 → 상세 이동 — 카드 클릭 시 slug 기반 상세 페이지로 이동
- [x] Empty state — 글 없을 때 안내 메시지 표시
- [x] 페이지네이션 — `?page`, `?limit` 쿼리 파라미터 지원, 기본 10개

---

### 3. Article Detail (`/articles/[slug]`)

- [x] 제목 — 글 제목 헤딩 표시
- [x] 상태 배지 — 현재 상태 (Published / Draft / Archived)
- [x] 메타 정보 — 작성일, 수정일, 발행일 표시
- [x] 출처 링크 — source_url이 있을 때 source_type과 함께 외부 링크 표시
- [x] 본문 — 글 내용 표시 (plain text, whitespace-pre-wrap)
- [x] 뒤로 가기 버튼 — `/articles` 목록으로 이동
- [x] 404 처리 — slug가 존재하지 않을 때 not-found 페이지
- [ ] Markdown 렌더링 — 현재 plain text, Phase 3에서 구현 예정

---

## App Shell

### 4. Sidebar (Desktop, `md` 이상)

- [x] 로고 + 사이트명 — BookOpen 아이콘 + "Dawnbase" 텍스트
- [x] Dashboard 네비 — `/` 링크, 현재 경로 활성 표시
- [x] Articles 네비 — `/articles` 링크, 현재 경로 활성 표시
- [x] Categories 네비 — 비활성화, "(Phase 2)" 표시
- [x] Search 네비 — 비활성화, "(Phase 2)" 표시
- [x] 접기/펼치기 — 전체(256px) ↔ 아이콘 전용(64px) 토글
- [x] 접힌 상태 툴팁 — 아이콘 hover 시 레이블 툴팁 표시
- [x] 상태 유지 — 접힘 상태 `localStorage`에 저장
- [x] "New Article" 버튼 제거 — 사이드바 하단 버튼 제거 (데스크톱 + 모바일)

---

### 5. Header

- [x] 사이트 타이틀 — "Dawn's Knowledge Base"
- [x] 검색 입력창 — `sm` 이상 표시, disabled, "Search coming in Phase 2..."
- [x] 테마 토글 — 라이트 / 다크 모드 전환 버튼
- [x] 모바일 메뉴 버튼 — `md` 미만에서 표시, 클릭 시 모바일 사이드바 열기

---

### 6. Mobile Sidebar (`md` 미만)

- [x] 로고 + 사이트명 — 데스크톱 사이드바와 동일
- [x] 네비게이션 — Dashboard, Articles, Categories(비활성), Search(비활성)
- [x] 활성 상태 — 현재 경로 하이라이트
- [x] "New Article" 버튼 제거 — 하단 버튼 제거

---

### 7. Theme

- [x] 라이트 / 다크 모드 — 헤더 토글 버튼으로 전환
- [x] 시스템 기본값 — 최초 방문 시 시스템 설정 따름
- [x] 설정 유지 — `next-themes`로 선택값 유지

---

## API (Read Only)

- [x] `GET /api/articles` — 글 목록 조회 (페이지네이션, 필터)
- [x] `GET /api/articles/[id]` — 글 단건 조회

> 모든 쓰기 라우트 (`POST`, `PUT`, `DELETE`)는 제거됨. 콘텐츠 관리는 Claude가 repository layer를 통해 직접 수행.

---

## Out of Scope (Phase 2+)

| Feature | Planned Phase |
|---------|--------------|
| 검색 | Phase 2 |
| 카테고리 / 태그 필터 | Phase 2 |
| Markdown 렌더링 | Phase 3 |
| 이미지 / 미디어 표시 | Phase 3 |
| 사용자 인증 | Phase 4 |
