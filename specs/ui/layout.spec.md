# UI Spec: App Shell Layout

> **Phase**: Phase 1
> **Status**: Approved
> **Last Updated**: 2026-03-07
> **File Path**: `src/components/layout/`

## 개요

Dawnbase 애플리케이션의 전체 레이아웃을 정의합니다. 접이식 사이드바, 헤더, 메인 콘텐츠 영역으로 구성된 앱 셸(App Shell) 패턴을 사용합니다. 다크/라이트 모드를 지원하며, 모바일에서는 사이드바가 햄버거 메뉴로 전환됩니다.

## 와이어프레임

### Desktop (>= 768px)

```
+-------+--------------------------------------------------+
| SIDE  | HEADER                                           |
| BAR   |  [Search(Phase2)]    [Theme Toggle] "Dawn's KB"  |
|       +--------------------------------------------------+
| Logo  |                                                  |
| Dawn  |                                                  |
| base  |                MAIN CONTENT AREA                 |
|       |                                                  |
| Nav:  |              (center, responsive)                |
| - Dash|                                                  |
| - Arti|                                                  |
| - Cate|                                                  |
|  (Ph2)|                                                  |
| - Sear|                                                  |
|  (Ph2)|                                                  |
|       |                                                  |
| Recent|                                                  |
| - art1|                                                  |
| - art2|                                                  |
| - art3|                                                  |
|       |                                                  |
| [<<]  |                                                  |
+-------+--------------------------------------------------+
```

### Sidebar Collapsed (Desktop)

```
+----+-----------------------------------------------------+
| IC | HEADER                                              |
| ON |  [Search(Phase2)]    [Theme Toggle] "Dawn's KB"     |
| S  +-----------------------------------------------------+
|    |                                                     |
| D  |                                                     |
| A  |                 MAIN CONTENT AREA                   |
| C  |                                                     |
| S  |                                                     |
|    |                                                     |
|[>>]|                                                     |
+----+-----------------------------------------------------+
```

### Mobile (< 768px)

```
+--------------------------------------------------+
| HEADER                                           |
|  [Hamburger]  "Dawn's KB"    [Theme Toggle]      |
+--------------------------------------------------+
|                                                  |
|                                                  |
|              MAIN CONTENT AREA                   |
|              (full width)                        |
|                                                  |
|                                                  |
+--------------------------------------------------+

--- Hamburger 클릭 시 (Overlay) ---

+--------------------------------------------------+
| SIDEBAR OVERLAY              [X Close]           |
| Logo: Dawnbase                                   |
|                                                  |
| Navigation:                                      |
|   Dashboard                                      |
|   Articles                                       |
|   Categories (Phase 2)                           |
|   Search (Phase 2)                               |
|                                                  |
| Recent Articles:                                 |
|   - Article Title 1                              |
|   - Article Title 2                              |
|   - Article Title 3                              |
+--------------------------------------------------+
```

## 컴포넌트 구조

```
src/components/layout/
  AppShell.tsx              # 전체 레이아웃 래퍼
  Sidebar.tsx               # 사이드바 (네비게이션 + 최근 아티클)
  Header.tsx                # 상단 헤더 바
  MainContent.tsx           # 메인 콘텐츠 래퍼
  ThemeToggle.tsx           # 다크/라이트 모드 토글 버튼
  SidebarNavItem.tsx        # 사이드바 네비게이션 항목
  RecentArticlesList.tsx    # 최근 아티클 퀵 링크 목록
```

## 컴포넌트 상세

### AppShell

최상위 레이아웃 컴포넌트. `src/app/layout.tsx`에서 사용됩니다.

```typescript
interface AppShellProps {
  children: React.ReactNode;
}
```

### Sidebar

```typescript
interface SidebarProps {
  // 내부 상태로 관리 (collapsed/expanded)
}
```

**상태 관리**:

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `isCollapsed` | boolean | `false` | 사이드바 접힘 상태 (desktop) |
| `isMobileOpen` | boolean | `false` | 모바일 오버레이 표시 상태 |

**네비게이션 항목**:

| Label | Icon | Path | Phase | Description |
|-------|------|------|-------|-------------|
| Dashboard | `LayoutDashboard` | `/` | 1 | 대시보드 (홈) |
| Articles | `FileText` | `/articles` | 1 | 아티클 목록 |
| Categories | `FolderTree` | `/categories` | 2 | 카테고리 관리 (비활성 표시) |
| Search | `Search` | `/search` | 2 | 검색 (비활성 표시) |

- Phase 2 항목은 Phase 1에서 네비게이션에 표시하되 `opacity-50 pointer-events-none` 스타일로 비활성 처리
- 현재 경로에 해당하는 항목은 `bg-accent` 배경 + 볼드 텍스트로 하이라이트

**최근 아티클 퀵 링크**:
- 최근 생성/수정된 아티클 최대 5개 표시
- 각 항목은 제목(최대 30자, 초과 시 truncate)과 status 뱃지 표시
- 클릭 시 해당 아티클 상세 페이지로 이동
- `isCollapsed` 상태에서는 숨김

### Header

```typescript
interface HeaderProps {
  // props 없음 - 내부적으로 처리
}
```

**구성 요소**:
- **왼쪽**: 모바일 햄버거 버튼 (< 768px에서만 표시)
- **중앙/왼쪽**: 검색바 placeholder (Phase 2에서 활성화, Phase 1에서는 비활성 input 표시)
- **오른쪽**: 테마 토글 버튼 + "Dawn's Knowledge Base" 텍스트

### ThemeToggle

다크/라이트 모드 전환 버튼.

```typescript
// next-themes 사용
interface ThemeToggleProps {
  // props 없음 - next-themes의 useTheme 훅 사용
}
```

- 라이트 모드: Sun 아이콘 표시 (클릭하면 다크로 전환)
- 다크 모드: Moon 아이콘 표시 (클릭하면 라이트로 전환)
- 시스템 테마를 기본값으로 사용 (`defaultTheme="system"`)
- 전환 시 부드러운 트랜지션 (`transition-colors duration-200`)

## 동작 사양

### 사이드바 접기/펼치기 (Desktop)

- **트리거**: 사이드바 하단의 접기 버튼 클릭 (`<<` / `>>`)
- **동작**:
  - 접힘: 사이드바 너비 240px -> 64px, 텍스트 레이블 숨김, 아이콘만 표시
  - 펼침: 사이드바 너비 64px -> 240px, 텍스트 레이블 표시
  - 최근 아티클 섹션: 접힘 시 숨김, 펼침 시 표시
- **결과**: `isCollapsed` 상태 토글, `localStorage`에 저장하여 새로고침 후에도 유지
- **애니메이션**: `transition-all duration-300 ease-in-out`

### 모바일 사이드바 열기/닫기

- **트리거 (열기)**: 헤더의 햄버거 아이콘 클릭
- **트리거 (닫기)**: 오버레이 배경 클릭, X 버튼 클릭, 또는 네비게이션 항목 클릭
- **동작**: 왼쪽에서 슬라이드인/아웃 오버레이 + 반투명 배경
- **결과**: `isMobileOpen` 상태 토글
- **애니메이션**: `transform translateX` + `transition duration-300`
- **접근성**: 오버레이 열림 시 `body` 스크롤 잠금, `ESC` 키로 닫기

### 테마 전환

- **트리거**: ThemeToggle 버튼 클릭
- **동작**: `next-themes`의 `setTheme` 호출
- **결과**: 전체 앱의 컬러 스키마 전환
- **저장**: `localStorage`에 자동 저장 (next-themes 내장)

## 스타일 사양

### 레이아웃

```
AppShell: flex flex-row h-screen w-screen overflow-hidden
  Sidebar: flex flex-col h-full (w-60 | w-16) border-r
  RightArea: flex flex-col flex-1 overflow-hidden
    Header: flex items-center h-14 border-b px-4
    MainContent: flex-1 overflow-y-auto p-6
```

### 반응형 브레이크포인트

| Breakpoint | 동작 |
|------------|------|
| < 768px (Mobile) | 사이드바 숨김, 햄버거 메뉴로 전환, 오버레이 방식. 메인 콘텐츠 full width. |
| 768px - 1024px (Tablet) | 사이드바 기본 접힘(아이콘만), 펼치기 가능. 메인 콘텐츠 적응형. |
| > 1024px (Desktop) | 사이드바 기본 펼침(240px), 접기 가능. 메인 콘텐츠 넉넉한 여백. |

### 테마 색상

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| 앱 배경 | `white` | `zinc-950` |
| 사이드바 배경 | `gray-50` | `zinc-900` |
| 사이드바 보더 | `gray-200` | `zinc-800` |
| 헤더 배경 | `white` | `zinc-950` |
| 헤더 보더 | `gray-200` | `zinc-800` |
| 네비게이션 텍스트 | `gray-700` | `zinc-300` |
| 네비게이션 활성 배경 | `gray-100` | `zinc-800` |
| 네비게이션 활성 텍스트 | `gray-900` | `zinc-100` |
| 네비게이션 호버 배경 | `gray-100` | `zinc-800/50` |
| 로고 텍스트 | `gray-900` | `zinc-100` |
| 메인 콘텐츠 배경 | `white` | `zinc-950` |
| 일반 텍스트 | `gray-900` | `zinc-100` |
| 비활성 항목 | `gray-400` | `zinc-600` |

### 사이드바 치수

| Property | Expanded | Collapsed |
|----------|----------|-----------|
| Width | 240px (`w-60`) | 64px (`w-16`) |
| Padding | `p-4` | `p-2` |
| Logo 영역 높이 | 56px (`h-14`) | 56px (`h-14`) |
| Nav Item 높이 | 40px (`h-10`) | 40px (`h-10`) |
| Nav Item 간격 | 4px (`gap-1`) | 4px (`gap-1`) |

### 헤더 치수

| Property | Value |
|----------|-------|
| Height | 56px (`h-14`) |
| Padding | `px-4` |
| Search Bar Width | `max-w-md` (Phase 2) |

## 접근성 (A11y)

- **키보드 네비게이션**: Tab 키로 사이드바 -> 헤더 -> 메인 콘텐츠 순서로 이동
- **ARIA 속성**:
  - 사이드바: `role="navigation"`, `aria-label="Main navigation"`
  - 사이드바 토글 버튼: `aria-expanded={!isCollapsed}`, `aria-label="Toggle sidebar"`
  - 모바일 오버레이: `role="dialog"`, `aria-modal="true"`
  - 테마 토글: `aria-label="Toggle dark mode"`
  - 현재 페이지 네비게이션: `aria-current="page"`
- **스크린 리더**: 네비게이션 항목에 Phase 2 비활성 항목은 `aria-disabled="true"` 추가
- **모션 감소**: `prefers-reduced-motion` 미디어 쿼리 존중, 애니메이션 비활성화

## 의존성

| Dependency | Purpose |
|------------|---------|
| `next-themes` | 다크/라이트 모드 전환 관리 |
| `lucide-react` | 아이콘 (LayoutDashboard, FileText, FolderTree, Search, Sun, Moon, Menu, X, ChevronsLeft, ChevronsRight) |

## 구현 참고

### 파일 구조

```
src/
  app/
    layout.tsx          # ThemeProvider + AppShell 래핑
    page.tsx            # Dashboard 페이지
  components/
    layout/
      AppShell.tsx
      Sidebar.tsx
      Header.tsx
      MainContent.tsx
      ThemeToggle.tsx
      SidebarNavItem.tsx
      RecentArticlesList.tsx
  lib/
    constants.ts        # 네비게이션 항목 정의
```

### layout.tsx 구조

```tsx
// src/app/layout.tsx
import { ThemeProvider } from 'next-themes';
import { AppShell } from '@/components/layout/AppShell';

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### localStorage 키

| Key | Value | Description |
|-----|-------|-------------|
| `dawnbase-sidebar-collapsed` | `"true"` / `"false"` | 사이드바 접힘 상태 |
| `theme` | `"light"` / `"dark"` / `"system"` | 테마 설정 (next-themes 관리) |

## 변경 이력

| Date | Change | Reason |
|------|--------|--------|
| 2026-03-07 | 최초 작성 | Phase 1 앱 셸 레이아웃 스펙 |
