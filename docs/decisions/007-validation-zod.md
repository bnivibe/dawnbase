# ADR-007: Validation - Zod

## 상태 (Status)
Accepted

## 날짜 (Date)
2026-03-07

## 맥락 (Context)
Dawnbase는 SDD 방법론을 따르며, 스펙에 정의된 데이터 모델의 제약 조건(필드 타입, 필수/선택, 길이 제한 등)을 런타임에서 검증해야 합니다. TypeScript의 정적 타입 시스템은 컴파일 타임에만 동작하므로, API 요청, 폼 입력, 외부 데이터 등의 런타임 데이터 검증을 위한 별도 라이브러리가 필요합니다.

검증 라이브러리는 타입 안전성, SDD 스펙과의 정합성, 프레임워크 통합성에 영향을 미칩니다.

## 고려한 옵션 (Options Considered)

### 1. **Zod**
- 장점: TypeScript-first 설계로 뛰어난 타입 추론, React Hook Form / Server Actions 통합, 스키마에서 타입 자동 추출(`z.infer<>`), 간결한 API, 에러 메시지 커스터마이징
- 단점: 추가 의존성, 런타임 오버헤드 (미미함)

### 2. **Yup**
- 장점: 오래된 라이브러리로 안정적, Formik과의 좋은 통합
- 단점: TypeScript 타입 추론이 Zod보다 약함, API가 더 장황함, Formik 의존적인 생태계

### 3. **Joi**
- 장점: 매우 풍부한 검증 규칙, 서버 사이드 검증에 강점
- 단점: 브라우저 번들 크기가 큼, TypeScript 타입 추론 미지원, Node.js 환경 중심

### 4. **io-ts**
- 장점: fp-ts 기반으로 함수형 프로그래밍과 잘 맞음, 강력한 타입 시스템
- 단점: 가파른 학습 곡선, fp-ts 의존, 커뮤니티가 작음

### 5. **AJV (JSON Schema)**
- 장점: JSON Schema 표준 기반, 매우 빠른 검증 성능
- 단점: JSON Schema 문법이 장황함, TypeScript 타입 추론 제한적, DX가 좋지 않음

## 결정 (Decision)
**Zod**를 런타임 검증 라이브러리로 선택합니다.

## 이유 (Rationale)

1. **TypeScript-first 타입 추론**: Zod 스키마에서 `z.infer<typeof schema>`로 TypeScript 타입을 자동으로 추출할 수 있습니다. 스키마를 한 번 정의하면 타입 정의를 별도로 작성할 필요가 없어, DRY 원칙을 유지합니다.

2. **SDD 스펙과의 자연스러운 연결**: SDD 스펙에서 정의한 데이터 모델의 제약 조건을 Zod 스키마로 1:1 매핑할 수 있습니다. 스펙이 Zod 스키마를 정의하면, 이 스키마가 스펙과 런타임 사이의 다리 역할을 합니다.

   ```
   Spec (문서) → Zod Schema (코드) → TypeScript Type (타입) → Runtime Validation (검증)
   ```

3. **Server Actions 통합**: Next.js Server Actions에서 Zod를 사용하여 서버 사이드 입력 검증을 간결하게 구현할 수 있습니다.

4. **React Hook Form 통합**: `@hookform/resolvers/zod`를 통해 클라이언트 사이드 폼 검증과 Zod 스키마를 연결할 수 있습니다. 서버와 클라이언트에서 동일한 스키마를 재사용합니다.

5. **에러 메시지 커스터마이징**: 한국어 에러 메시지를 포함한 커스텀 에러 메시지를 쉽게 정의할 수 있습니다.

6. **간결한 API**: 선언적이고 체이닝 가능한 API로 복잡한 검증 규칙도 읽기 쉽게 작성할 수 있습니다.

## 결과 (Consequences)

### 긍정적 (Positive)
- 스키마 하나로 타입 정의 + 런타임 검증을 동시에 해결 (DRY)
- SDD 스펙 → Zod 스키마 → 런타임 검증의 일관된 파이프라인
- Server Actions와 폼 검증에서 동일한 스키마 재사용
- TypeScript 타입 추론으로 컴파일 타임 오류 감소
- 간결하고 읽기 쉬운 검증 코드

### 부정적 (Negative)
- 추가 런타임 의존성 (번들 크기 약 13KB gzipped)
- 복잡한 검증 로직의 경우 Zod 스키마도 복잡해질 수 있음
- Zod API의 학습 비용 (하지만 TypeScript 개발자에게 직관적)
- 스펙 변경 시 Zod 스키마도 함께 업데이트해야 함
