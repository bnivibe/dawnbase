# ADR-004: Styling - Tailwind CSS + shadcn/ui

## 상태 (Status)
Accepted

## 날짜 (Date)
2026-03-07

## 맥락 (Context)
Dawnbase는 지식 위키 형태의 UI를 필요로 하며, 깔끔한 레이아웃, 읽기 좋은 타이포그래피, 다크/라이트 테마 지원, 그리고 접근성(a11y)이 중요합니다. 스타일링 솔루션은 개발 속도, 디자인 일관성, 커스터마이징 용이성, 그리고 유지보수성에 영향을 미칩니다.

## 고려한 옵션 (Options Considered)

### 1. **CSS Modules**
- 장점: CSS 표준에 가까움, 스코프 격리 자동, 별도 런타임 없음
- 단점: 디자인 시스템 구축에 많은 수동 작업, 컴포넌트 라이브러리 부재, 테마 전환 복잡

### 2. **Tailwind CSS + shadcn/ui**
- 장점: 유틸리티-퍼스트로 빠른 스타일링, shadcn/ui의 접근성 높은 컴포넌트(Radix UI 기반), 복사-붙여넣기 방식(의존성이 아님)으로 완전한 커스터마이징, CSS 변수 기반 다크 모드, VS Code IntelliSense 우수
- 단점: HTML이 길어질 수 있음(클래스 나열), Tailwind 유틸리티 클래스 학습 필요

### 3. **Styled-components (CSS-in-JS)**
- 장점: 동적 스타일링 강력, 컴포넌트 단위 스코프, 테마 프로바이더
- 단점: 런타임 오버헤드, Server Components 비호환, 번들 크기 증가, React 18+ 스트리밍 SSR과 충돌 가능

### 4. **MUI (Material UI)**
- 장점: 완성도 높은 컴포넌트 라이브러리, Material Design 가이드라인, 풍부한 기능
- 단점: 매우 큰 번들 크기, Material Design 고정 디자인, 커스터마이징 어려움, CSS-in-JS 런타임 문제

## 결정 (Decision)
**Tailwind CSS + shadcn/ui**를 스타일링 솔루션으로 선택합니다.

## 이유 (Rationale)

1. **유틸리티-퍼스트 빠른 개발**: Tailwind CSS의 유틸리티 클래스를 사용하면 별도 CSS 파일 작성 없이 JSX 내에서 바로 스타일링할 수 있어 개발 속도가 빠릅니다.

2. **shadcn/ui의 접근성**: shadcn/ui는 Radix UI Primitives 위에 구축되어 있어, 키보드 네비게이션, 스크린 리더 지원, ARIA 속성 등 접근성이 기본 내장되어 있습니다.

3. **복사-붙여넣기 방식**: shadcn/ui는 npm 패키지가 아닌 복사-붙여넣기 방식으로 컴포넌트를 추가합니다. 이는 소스 코드를 직접 소유하므로 완전한 커스터마이징이 가능하고, 외부 라이브러리의 breaking changes에 영향받지 않습니다.

4. **다크 모드 기본 지원**: Tailwind CSS의 `dark:` 변형자와 CSS 변수 기반 테마 시스템으로, 다크/라이트 모드 전환을 쉽게 구현할 수 있습니다.

5. **Server Components 호환**: Tailwind CSS는 런타임 JavaScript가 없는 순수 CSS로 컴파일되므로, React Server Components와 완벽하게 호환됩니다.

6. **VS Code DX**: Tailwind CSS IntelliSense 확장으로 자동 완성, 클래스 미리보기, 린팅이 가능하여 개발자 경험이 우수합니다.

## 결과 (Consequences)

### 긍정적 (Positive)
- 빠른 UI 개발 속도 (유틸리티 클래스로 즉시 스타일링)
- 접근성 높은 컴포넌트 (Radix UI 기반 shadcn/ui)
- 완전한 커스터마이징 가능 (소스 코드 소유)
- 다크/라이트 모드 쉬운 구현
- 런타임 오버헤드 없음 (빌드 타임 CSS 생성)
- Server Components와 완벽 호환

### 부정적 (Negative)
- HTML에 클래스 이름이 길게 나열되어 가독성이 떨어질 수 있음 (컴포넌트 추상화로 완화)
- Tailwind 유틸리티 클래스 체계의 초기 학습 비용
- shadcn/ui 컴포넌트를 수동으로 추가/관리해야 함 (CLI 도구로 완화)
- 디자인 시스템의 일관성을 개발자가 직접 유지해야 함 (tailwind.config 활용)
