# Dawnbase - Spec-Driven Development (SDD)

## SDD란 무엇인가

Spec-Driven Development(SDD)는 **스펙을 먼저 작성하고, 구현은 스펙을 따르는** 개발 방법론입니다.

기존 개발 프로세스에서는 코드를 먼저 작성한 뒤 문서를 나중에 작성하거나, 문서 없이 진행하는 경우가 많습니다. SDD는 이 순서를 뒤집습니다. 모든 기능, 데이터 모델, API, UI 컴포넌트, 사용자 플로우는 **구현 전에 스펙 문서로 정의**됩니다.

## 핵심 원칙

### 1. Spec First, Code Second
코드를 작성하기 전에 반드시 스펙이 존재해야 합니다. 스펙 없는 코드는 허용되지 않습니다.

### 2. Spec as Single Source of Truth
스펙 문서가 해당 기능의 유일한 진실의 원천입니다. 구현과 스펙이 충돌하면, 스펙이 맞고 구현을 수정합니다.

### 3. Incremental & Phased
프로젝트는 Phase 단위로 진행됩니다. 각 Phase의 스펙이 완성된 후에야 해당 Phase의 구현을 시작합니다.

### 4. Living Documentation
스펙은 살아있는 문서입니다. 요구사항이 변경되면 스펙을 먼저 업데이트하고, 그 다음 코드를 변경합니다.

## 디렉토리 구조

```
specs/
  README.md                    # 이 파일 - SDD 방법론 가이드
  _templates/                  # 스펙 작성 템플릿
    data-model.template.md     # 데이터 모델 스펙 템플릿
    api-endpoint.template.md   # API 엔드포인트 스펙 템플릿
    ui-component.template.md   # UI 컴포넌트 스펙 템플릿
    user-flow.template.md      # 사용자 플로우 스펙 템플릿
  data-models/                 # 데이터 모델 스펙
    article.spec.md            # Phase 1: Article 모델
  ui/                          # UI 컴포넌트 스펙
    layout.spec.md             # Phase 1: 앱 셸 레이아웃
  api/                         # API 엔드포인트 스펙
    articles-api.spec.md       # Phase 1: Article CRUD API
  flows/                       # 사용자 플로우 스펙
    create-article.flow.md     # Phase 1: 아티클 생성 플로우
```

## 스펙 문서 컨벤션

### 파일 네이밍
- 데이터 모델: `{model-name}.spec.md`
- API 엔드포인트: `{resource}-api.spec.md`
- UI 컴포넌트: `{component-name}.spec.md`
- 사용자 플로우: `{action}.flow.md`

### 스펙 상태 표시
각 스펙 문서 상단에 상태를 표시합니다:

| Status | 의미 |
|--------|------|
| `Draft` | 초안 작성 중, 리뷰 전 |
| `Review` | 리뷰 대기 중 |
| `Approved` | 승인됨, 구현 가능 |
| `Implementing` | 구현 진행 중 |
| `Implemented` | 구현 완료, 검증 대기 |
| `Verified` | 구현 검증 완료 |

### Phase 구분
각 스펙에는 해당 Phase를 명시합니다:

| Phase | 범위 |
|-------|------|
| Phase 1 | 코어 데이터 모델, 기본 CRUD, 앱 셸 레이아웃 |
| Phase 2 | 카테고리, 태그, 검색, 필터링 |
| Phase 3 | 마크다운 에디터 고도화, 미디어 관리 |
| Phase 4 | 인증, 권한, 배포 |

## 워크플로우

### 새 기능 추가 시
```
1. 해당하는 템플릿을 복사하여 스펙 작성
2. 스펙 상태를 "Draft"로 설정
3. 리뷰 후 "Approved"로 변경
4. 구현 시작 시 "Implementing"으로 변경
5. 구현 완료 시 "Implemented"로 변경
6. 테스트/검증 후 "Verified"로 변경
```

### 기존 기능 변경 시
```
1. 해당 스펙 문서를 먼저 업데이트
2. 변경 이력(Changelog) 섹션에 변경 내용 기록
3. 스펙 변경 승인 후 코드 변경 진행
```

## 기술 스택 참조

Dawnbase 프로젝트의 기술 스택:
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI**: React 19, Tailwind CSS 4
- **Validation**: Zod
- **Database**: SQLite (via Drizzle ORM) - Phase 1
- **Theme**: next-themes (dark/light mode)
