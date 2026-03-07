# ADR-002: Database - PostgreSQL via Supabase

## 상태 (Status)
Accepted

## 날짜 (Date)
2026-03-07

## 맥락 (Context)
Dawnbase는 지식 아티클을 저장, 조회, 검색하는 데이터 영속성 계층이 필요합니다. 현재는 단일 사용자 기반으로 시작하지만, Phase 4에서 인증 및 다중 사용자 지원을 목표로 하고 있습니다. 또한 Phase 2에서 전문 검색(Full-text Search) 기능이 필요합니다.

데이터베이스 선택은 스키마 설계, 쿼리 성능, 확장성, 그리고 추가 기능(인증, 실시간, 스토리지) 지원에 영향을 미칩니다.

## 고려한 옵션 (Options Considered)

### 1. **SQLite**
- 장점: 서버리스, 설정 불필요, 단일 파일 DB, 빠른 읽기 성능, 임베디드 가능
- 단점: 동시 쓰기 제한, 내장 인증/실시간 기능 없음, 전문 검색 제한적, 클라우드 배포 시 별도 설정 필요

### 2. **PostgreSQL via Supabase**
- 장점: 풀 PostgreSQL 기능, 내장 인증(Auth), 실시간 구독, 스토리지, REST/GraphQL API 자동 생성, 강력한 전문 검색(tsvector), 무료 티어로 시작 가능
- 단점: 외부 서비스 의존, 네트워크 레이턴시, 무료 티어 제한(500MB DB, 1GB 스토리지)

### 3. **MongoDB**
- 장점: 유연한 스키마, JSON 네이티브, 수평 확장 용이
- 단점: 관계형 데이터에 부적합(아티클 간 관계, 카테고리-태그 등), 트랜잭션 지원 제한적, Drizzle ORM 미지원

### 4. **Firebase (Firestore)**
- 장점: 실시간 동기화, Google 에코시스템, 인증 내장
- 단점: NoSQL 제약, 복잡한 쿼리 제한, 비용 예측 어려움, vendor lock-in이 매우 강함

## 결정 (Decision)
**PostgreSQL via Supabase**를 데이터베이스로 선택합니다.

## 이유 (Rationale)

1. **미래 확장성**: 단일 사용자로 시작하지만 다중 사용자를 목표로 하므로, Supabase의 내장 인증(Auth) 시스템으로 Phase 4에서 별도 인증 서비스 구축 없이 확장할 수 있습니다.

2. **전문 검색 지원**: Phase 2의 핵심 기능인 전문 검색을 PostgreSQL의 `tsvector`/`tsquery`로 네이티브하게 구현할 수 있습니다. 별도 검색 엔진(Elasticsearch 등)을 도입할 필요가 없습니다.

3. **실시간 기능**: Supabase Realtime을 통해 향후 협업 편집이나 실시간 알림 기능을 쉽게 추가할 수 있습니다.

4. **통합 플랫폼**: Auth, Database, Storage, Edge Functions를 하나의 플랫폼에서 제공하므로, 여러 서비스를 조합하는 복잡성을 줄일 수 있습니다.

5. **무료 티어**: 500MB 데이터베이스, 1GB 스토리지, 50,000 MAU 인증을 무료로 사용할 수 있어 초기 개발과 프로토타이핑에 충분합니다.

6. **PostgreSQL 표준**: Supabase는 표준 PostgreSQL 위에 구축되어 있으므로, 필요 시 다른 PostgreSQL 호스팅 서비스(AWS RDS, Neon 등)로 마이그레이션이 비교적 용이합니다.

## 결과 (Consequences)

### 긍정적 (Positive)
- Auth, Realtime, Storage를 무료로 활용하여 개발 비용과 복잡성 절감
- PostgreSQL의 강력한 전문 검색으로 Phase 2 구현 단순화
- 표준 SQL 기반으로 ORM(Drizzle) 연동이 자연스러움
- Row Level Security(RLS)로 데이터 접근 제어 가능
- 대시보드 UI로 데이터 관리 및 디버깅 용이

### 부정적 (Negative)
- 외부 서비스 의존으로 인한 네트워크 레이턴시 발생
- Supabase 서비스 장애 시 애플리케이션에 직접적 영향
- 무료 티어 제한 초과 시 유료 전환 필요 ($25/month Pro plan)
- 로컬 개발 환경에서 Supabase CLI 또는 로컬 PostgreSQL 설정 필요
