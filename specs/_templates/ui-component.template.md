# UI Spec: {ComponentName}

> **Phase**: {Phase N}
> **Status**: Draft | Review | Approved | Implementing | Implemented | Verified
> **Last Updated**: YYYY-MM-DD
> **File Path**: `src/components/{component-name}.tsx`

## 개요

{이 UI 컴포넌트가 무엇인지, 어떤 역할을 하는지 설명}

## 와이어프레임

```
+--------------------------------------------------+
|                                                  |
|          ASCII 와이어프레임 또는 설명              |
|                                                  |
+--------------------------------------------------+
```

## 컴포넌트 구조

```
{ComponentName}/
  {ComponentName}.tsx       # 메인 컴포넌트
  {SubComponent}.tsx        # 하위 컴포넌트
```

## Props 정의

```typescript
interface {ComponentName}Props {
  /** 설명 */
  propName: type;
  /** 설명 (optional) */
  optionalProp?: type;
}
```

## 상태 관리

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `stateName` | type | value | 설명 |

## 동작 사양

### {동작 1}
- 트리거: {어떤 액션으로 발생하는지}
- 동작: {무엇이 일어나는지}
- 결과: {최종 상태}

### {동작 2}
- 트리거: {어떤 액션으로 발생하는지}
- 동작: {무엇이 일어나는지}
- 결과: {최종 상태}

## 스타일 사양

### 레이아웃
- 배치: {flex/grid/absolute 등}
- 크기: {width, height}
- 간격: {padding, margin, gap}

### 반응형 브레이크포인트

| Breakpoint | 동작 |
|------------|------|
| < 768px (Mobile) | {동작 설명} |
| 768px - 1024px (Tablet) | {동작 설명} |
| > 1024px (Desktop) | {동작 설명} |

### 테마

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| 배경 | `{color}` | `{color}` |
| 텍스트 | `{color}` | `{color}` |
| 보더 | `{color}` | `{color}` |

## 접근성 (A11y)

- 키보드 네비게이션: {지원 방식}
- ARIA 속성: {필요한 aria 속성}
- 스크린 리더: {고려 사항}

## 의존성

| Dependency | Purpose |
|------------|---------|
| `package` | 사용 목적 |

## 변경 이력

| Date | Change | Reason |
|------|--------|--------|
| YYYY-MM-DD | 최초 작성 | Phase N 스펙 |
