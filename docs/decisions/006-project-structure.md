# ADR-006: Project Structure - Hybrid Layer-Based with SDD Overlay

## 상태 (Status)
Accepted

## 날짜 (Date)
2026-03-07

## 맥락 (Context)
Dawnbase는 Next.js 기반 풀스택 애플리케이션과 SDD 방법론을 결합한 프로젝트입니다. 디렉토리 구조는 코드의 탐색성, 유지보수성, 확장성에 직접적인 영향을 미칩니다. 특히 SDD의 스펙 문서와 실제 구현 코드를 체계적으로 관리할 수 있는 구조가 필요합니다.

## 고려한 옵션 (Options Considered)

### 1. **Flat Structure**
- 장점: 단순, 소규모 프로젝트에 적합
- 단점: 파일 수 증가 시 탐색 어려움, 관심사 분리 부재, 스펙 관리 어려움

### 2. **Feature-Based**
- 장점: 기능 단위 응집도 높음 (같은 기능의 모든 파일이 한 폴더에)
- 단점: 공유 컴포넌트/유틸리티 배치 모호, 기능 간 의존성 관리 복잡, Next.js App Router와 충돌

### 3. **Layer-Based**
- 장점: 관심사 분리 명확 (UI, 로직, 데이터), Next.js 컨벤션에 부합
- 단점: 기능 응집도가 낮음, 한 기능 수정 시 여러 레이어 탐색 필요

### 4. **Hybrid Layer-Based with SDD Overlay**
- 장점: Layer-based의 관심사 분리 + SDD 스펙 디렉토리 분리, Next.js App Router 구조와 자연스러운 통합, 스펙→코드 매핑 명확
- 단점: 초기 디렉토리 구조가 복잡해 보일 수 있음

## 결정 (Decision)
**Hybrid Layer-Based with SDD Overlay** 구조를 선택합니다.

## 이유 (Rationale)

1. **관심사 분리**: `specs/`(진실의 원천), `docs/`(이력), `src/`(구현)로 크게 세 영역이 분리됩니다. 각 영역의 역할이 명확합니다.

2. **SDD 스펙과 코드의 분리**: 스펙 문서는 `specs/`에, 구현 코드는 `src/`에 위치합니다. 스펙이 구현에 종속되지 않고 독립적으로 관리됩니다.

3. **Next.js App Router 호환**: `src/app/` 디렉토리는 Next.js App Router의 파일 기반 라우팅을 그대로 따릅니다.

4. **확장성**: Phase가 추가될 때마다 기존 구조를 변경하지 않고 새 스펙과 구현을 추가할 수 있습니다.

### 디렉토리 구조

```
dawnbase/
  specs/                         # SDD - Source of Truth
    _templates/                  # 스펙 작성 템플릿
    data-models/                 # 데이터 모델 스펙
    api/                         # API 엔드포인트 스펙
    ui/                          # UI 컴포넌트 스펙
    flows/                       # 사용자 플로우 스펙
  docs/                          # 프로젝트 이력 및 결정 기록
    plans/                       # 플랜 히스토리 (Phase별)
    decisions/                   # ADR (Architecture Decision Records)
  src/                           # 구현 코드
    app/                         # Next.js App Router (라우트)
      layout.tsx                 # 루트 레이아웃
      page.tsx                   # 홈페이지
      articles/                  # Article 관련 라우트
        page.tsx                 # 목록 페이지
        [id]/page.tsx            # 상세 페이지
        new/page.tsx             # 생성 페이지
        [id]/edit/page.tsx       # 수정 페이지
    components/                  # UI 컴포넌트
      ui/                        # shadcn/ui 컴포넌트
      layout/                    # 레이아웃 컴포넌트 (Header, Sidebar 등)
    lib/                         # 비즈니스 로직 및 유틸리티
      db/                        # 데이터베이스 (Drizzle 스키마, 쿼리)
      validations/               # Zod 스키마
      actions/                   # Server Actions
    styles/                      # 글로벌 스타일
  public/                        # 정적 에셋
```

## 결과 (Consequences)

### 긍정적 (Positive)
- 스펙(specs/), 문서(docs/), 코드(src/) 세 영역의 명확한 분리
- Next.js App Router 컨벤션과 자연스러운 통합
- SDD 워크플로우에서 스펙→코드 매핑이 직관적
- Phase별 확장 시 기존 구조 변경 불필요
- 새 개발자가 프로젝트 구조를 빠르게 파악 가능

### 부정적 (Negative)
- 초기에 디렉토리가 많아 보일 수 있음 (하지만 역할이 명확하여 혼란은 적음)
- 한 기능 수정 시 specs/와 src/ 양쪽을 모두 업데이트해야 함
- 스펙과 코드 간 매핑을 수동으로 추적해야 함 (naming convention으로 완화)
