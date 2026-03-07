# ADR-003: ORM - Drizzle ORM

## 상태 (Status)
Accepted

## 날짜 (Date)
2026-03-07

## 맥락 (Context)
Dawnbase는 TypeScript 기반 Next.js 애플리케이션으로, PostgreSQL(Supabase) 데이터베이스와의 상호작용을 위한 ORM 또는 쿼리 빌더가 필요합니다. ORM 선택은 타입 안전성, 개발자 경험, 번들 크기, 그리고 런타임 환경(Edge Runtime, Server Components)과의 호환성에 영향을 미칩니다.

## 고려한 옵션 (Options Considered)

### 1. **Prisma**
- 장점: 가장 큰 커뮤니티, 풍부한 문서, 직관적인 스키마 정의(schema.prisma), 자동 마이그레이션, Prisma Studio GUI
- 단점: 무거운 번들 크기(Engine Binary ~15MB), 코드 생성 단계 필요(`prisma generate`), Edge Runtime 제한적 지원, 쿼리 최적화 제어 어려움

### 2. **Drizzle ORM**
- 장점: 가벼운 번들 크기, SQL 수준의 쿼리 제어, 코드 생성 불필요, Edge Runtime 완전 호환, TypeScript-first 설계, Server Components와 자연스러운 통합
- 단점: Prisma 대비 작은 커뮤니티, 마이그레이션 관리가 더 수동적, 학습 자료가 상대적으로 적음

### 3. **Kysely**
- 장점: 타입 안전 쿼리 빌더, 매우 가벼움, SQL에 가까운 API
- 단점: ORM 기능 부족(relation mapping 없음), 마이그레이션 도구 미포함, 에코시스템이 작음

### 4. **Raw SQL (pg 라이브러리)**
- 장점: 완전한 SQL 제어, 추가 의존성 최소화
- 단점: 타입 안전성 수동 관리, 반복적인 보일러플레이트 코드, SQL 인젝션 위험 증가

## 결정 (Decision)
**Drizzle ORM**을 TypeScript ORM으로 선택합니다.

## 이유 (Rationale)

1. **가벼운 번들 크기**: Prisma의 Engine Binary(~15MB)와 달리, Drizzle은 추가 바이너리 없이 순수 TypeScript로 동작합니다. 이는 서버리스/Edge 환경에서의 cold start 시간을 크게 줄입니다.

2. **코드 생성 불필요**: Prisma는 스키마 변경 시마다 `prisma generate`를 실행해야 하지만, Drizzle은 TypeScript 스키마 정의가 곧 타입이므로 별도 코드 생성 단계가 없습니다. 이는 SDD 워크플로우에서 스키마 변경의 마찰을 줄입니다.

3. **SQL 수준 제어**: Drizzle의 쿼리 API는 SQL과 1:1로 대응되어, 생성되는 SQL을 예측하고 최적화하기 쉽습니다. 복잡한 쿼리(JOIN, 서브쿼리, CTE)도 자연스럽게 작성할 수 있습니다.

4. **Edge Runtime 호환**: Next.js의 Edge Runtime과 React Server Components에서 완전히 동작합니다. Vercel Edge Functions에서도 제약 없이 사용 가능합니다.

5. **TypeScript-first**: 스키마 정의부터 쿼리 결과까지 완전한 타입 추론을 제공하여, 런타임 오류를 컴파일 타임에 잡을 수 있습니다.

6. **Server Components 통합**: React Server Components에서 직접 데이터베이스 쿼리를 실행할 수 있어, 별도 API 레이어 없이 데이터 페칭이 가능합니다.

## 결과 (Consequences)

### 긍정적 (Positive)
- 서버리스/Edge 환경에서 빠른 cold start (작은 번들 크기)
- TypeScript 스키마가 곧 타입 정의 (코드 생성 불필요)
- SQL 수준의 쿼리 제어로 성능 최적화 용이
- Server Components에서 직접 DB 쿼리 가능
- SDD 워크플로우에서 스키마 변경의 마찰 최소화

### 부정적 (Negative)
- Prisma 대비 작은 커뮤니티와 적은 학습 자료
- 마이그레이션 관리가 더 수동적 (`drizzle-kit` 사용하지만 Prisma Migrate보다 덜 자동화)
- Prisma Studio 같은 GUI 도구 부재 (Drizzle Studio는 별도 실행)
- 복잡한 관계(relation) 매핑은 Prisma의 선언적 방식보다 더 명시적인 작성 필요
