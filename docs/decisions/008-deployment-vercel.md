# ADR-008: Deployment - Vercel

## 상태 (Status)
Accepted

## 날짜 (Date)
2026-03-07

## 맥락 (Context)
Dawnbase는 Phase 4에서 외부 사용자가 접근할 수 있는 프로덕션 환경으로 배포될 예정입니다. 배포 플랫폼은 Next.js 애플리케이션의 모든 기능(SSR, SSG, ISR, Server Actions, Edge Functions 등)을 지원해야 하며, CI/CD 파이프라인, 프리뷰 배포, 모니터링 등의 DevOps 기능도 필요합니다.

배포 플랫폼의 선택은 성능, 비용, 운영 복잡성, 그리고 개발 워크플로우에 영향을 미칩니다.

## 고려한 옵션 (Options Considered)

### 1. **Vercel**
- 장점: Next.js 공식 플랫폼, 자동 배포(Git push), 무료 Hobby 티어, Edge Functions, Image Optimization, Analytics, PR 프리뷰 배포, 자동 HTTPS
- 단점: Vendor lock-in, Hobby 티어 제한(100GB bandwidth, 100 deployments/day), 서버리스 함수 실행 시간 제한

### 2. **AWS (Amplify / ECS / Lambda)**
- 장점: 가장 유연한 인프라, 무제한 확장성, 모든 서비스 통합 가능
- 단점: 높은 운영 복잡성, 설정에 많은 시간 소요, Next.js 기능 완전 지원을 위한 추가 작업, 비용 예측 어려움

### 3. **Cloudflare Pages**
- 장점: 글로벌 CDN, 매우 빠른 Edge 성능, 관대한 무료 티어
- 단점: Next.js 호환성 제한(일부 기능 미지원), Node.js 런타임 제한(Workers 환경), 에코시스템이 Vercel보다 작음

### 4. **Netlify**
- 장점: 좋은 DX, 자동 배포, 무료 티어, 폼 처리 내장
- 단점: Next.js 지원이 Vercel보다 뒤처짐, SSR 성능이 Vercel보다 낮음, 일부 Next.js 기능 미지원

### 5. **Self-hosted (Docker)**
- 장점: 완전한 제어, Vendor lock-in 없음, 비용 예측 가능
- 단점: 서버 관리 부담, CI/CD 직접 구축, SSL/도메인/스케일링 모두 수동, 운영 비용(시간)이 높음

## 결정 (Decision)
**Vercel**을 배포 플랫폼으로 선택합니다.

## 이유 (Rationale)

1. **Next.js 공식 플랫폼**: Vercel은 Next.js를 만든 회사의 플랫폼으로, Next.js의 모든 기능(SSR, SSG, ISR, Server Actions, Middleware, Edge Functions, Image Optimization)을 네이티브하게 지원합니다. 다른 플랫폼에서는 일부 기능이 제한되거나 추가 설정이 필요합니다.

2. **자동 배포**: GitHub 저장소와 연결하면 Git push만으로 자동 배포됩니다. 별도 CI/CD 파이프라인을 구축할 필요가 없습니다.

3. **PR 프리뷰 배포**: PR을 생성하면 자동으로 프리뷰 URL이 생성되어, 코드 리뷰 시 실제 동작을 확인할 수 있습니다. SDD 워크플로우에서 스펙 검증에 매우 유용합니다.

4. **무료 Hobby 티어**: 개인 프로젝트에 충분한 무료 티어를 제공합니다 (100GB bandwidth, 서버리스 함수 실행, 자동 HTTPS, 커스텀 도메인).

5. **Edge Functions**: Vercel의 Edge Network를 통해 사용자에게 가장 가까운 위치에서 서버리스 함수를 실행할 수 있어, 글로벌 사용자에게 빠른 응답 시간을 제공합니다.

6. **Analytics & Web Vitals**: 내장된 Analytics와 Web Vitals 모니터링으로 성능을 추적하고 최적화할 수 있습니다.

7. **마이그레이션 가능성**: Vercel에 종속되더라도, Next.js의 `standalone` 빌드 옵션으로 Docker 이미지를 생성하여 다른 플랫폼으로 마이그레이션할 수 있습니다.

## 결과 (Consequences)

### 긍정적 (Positive)
- Next.js의 모든 기능을 최적의 성능으로 사용 가능
- Git push 기반 자동 배포로 DevOps 오버헤드 최소화
- PR 프리뷰 배포로 코드 리뷰 및 스펙 검증 효율화
- 무료 티어로 초기 비용 없이 시작 가능
- 글로벌 Edge Network로 빠른 응답 시간
- 내장 Analytics/Monitoring으로 성능 추적

### 부정적 (Negative)
- Vercel 플랫폼에 대한 vendor lock-in (단, standalone 빌드로 마이그레이션 가능)
- Hobby 티어 제한 초과 시 Pro 플랜($20/month) 필요
- 서버리스 함수 실행 시간 제한 (Hobby: 10초, Pro: 60초)
- Vercel 서비스 장애 시 배포 및 프리뷰에 영향
- 복잡한 백엔드 로직이 필요한 경우 서버리스 아키텍처의 제약을 받을 수 있음
