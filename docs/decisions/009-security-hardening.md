# ADR-009: Security Hardening for Public Repository

## 상태 (Status)
Accepted

## 날짜 (Date)
2026-03-07

## 맥락 (Context)
Dawnbase 레포지토리를 private에서 public으로 전환하기로 결정했습니다. 포트폴리오 용도로 설계 과정과 코드를 공개하기 위함입니다. 공개 전환에 앞서 보안 점검을 실시하여 민감한 정보 노출, 보안 취약점, 그리고 공개 레포지토리에서의 모범 사례 준수 여부를 확인했습니다.

## 보안 점검 결과 (Security Review Findings)

### 발견된 이슈

| 심각도 | 이슈 | 조치 | 상태 |
|--------|------|------|------|
| HIGH | API 인증 미구현 (인증 없이 CRUD 가능) | Phase 4에서 Supabase Auth 도입 예정 | 추후 |
| HIGH | Git 히스토리에 개인 이메일 노출 | 소유자가 노출 허용 확인 | 수용 |
| MEDIUM | API 에러 응답에 내부 오류 상세 노출 (`error.message`) | 일반 에러 메시지로 교체 + 서버 로그로 이동 | **수정 완료** |
| MEDIUM | Rate limiting 미적용 | Phase 2 이후 미들웨어로 구현 예정 | 추후 |
| LOW | 보안 응답 헤더 미설정 | `next.config.ts`에 보안 헤더 추가 | **수정 완료** |
| LOW | `.env.example`에 `password` placeholder 사용 | 안전한 placeholder(`YOUR_DB_PASSWORD`)로 교체 | **수정 완료** |

### 즉시 조치하지 않은 항목에 대한 판단

- **API 인증**: 현재 Phase 1은 개발 단계로 mock 데이터를 사용하며, 실제 DB 연결과 프로덕션 배포 전에 인증이 구현될 예정 (Phase 4). 현재 단계에서는 리스크가 제한적
- **Rate limiting**: 프로덕션 배포 전에 미들웨어로 구현 예정. 현재는 로컬 개발 환경에서만 사용
- **개인 이메일**: 레포지토리 소유자(Dawn)가 공개를 명시적으로 허용

## 수행한 조치 (Actions Taken)

### 1. API 에러 메시지 내부 정보 제거
**파일:** `src/app/api/articles/route.ts`, `src/app/api/articles/[id]/route.ts`

**변경 전:**
```typescript
} catch (error) {
  return NextResponse.json(
    { error: "Failed to fetch articles", details: error instanceof Error ? error.message : "Unknown error" },
    { status: 500 },
  );
}
```

**변경 후:**
```typescript
} catch (error) {
  console.error("[GET /api/articles]", error);
  return NextResponse.json(
    { error: "Failed to fetch articles" },
    { status: 500 },
  );
}
```

**이유:** 프로덕션 환경에서 `error.message`에는 스택 트레이스, DB 연결 문자열, 내부 파일 경로 등 공격자에게 유용한 정보가 포함될 수 있습니다. 클라이언트에는 일반적인 에러 메시지만 반환하고, 상세 오류는 서버 로그(`console.error`)로 기록하여 디버깅에 활용합니다.

### 2. Credential Placeholder 개선
**파일:** `.env.example`, `README.md`

**변경 전:**
```
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

**변경 후:**
```
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
```

**이유:** `password`와 같은 실제 비밀번호로 오인될 수 있는 placeholder는 실수로 프로덕션에 그대로 사용될 위험이 있습니다. `YOUR_DB_PASSWORD`와 같이 명확히 교체가 필요한 형태로 변경하여 이러한 실수를 방지합니다.

### 3. 보안 응답 헤더 추가
**파일:** `next.config.ts`

추가된 헤더:

| 헤더 | 값 | 목적 |
|------|---|------|
| `X-DNS-Prefetch-Control` | `on` | DNS 프리페칭 활성화로 성능 향상 |
| `X-Frame-Options` | `SAMEORIGIN` | 클릭재킹(clickjacking) 공격 방지 |
| `X-Content-Type-Options` | `nosniff` | MIME 타입 스니핑 방지 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | 리퍼러 정보 누출 제한 |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | 불필요한 브라우저 API 접근 차단 |

**이유:** 이 헤더들은 OWASP에서 권장하는 HTTP 보안 헤더로, 일반적인 웹 취약점(클릭재킹, MIME 스니핑, 정보 누출)을 방지합니다. 공개 웹 애플리케이션의 기본적인 보안 조치입니다.

## 결정 (Decision)
위 보안 조치들을 즉시 적용하고, 나머지 이슈(인증, rate limiting)는 해당 Phase에서 처리합니다. 보안 점검은 주요 변경 시마다 반복 수행합니다.

## 결과 (Consequences)

### 긍정적 (Positive)
- 공개 레포지토리에서의 정보 유출 위험 감소
- OWASP 권장 보안 헤더 적용으로 기본 방어력 확보
- 에러 발생 시 내부 정보가 클라이언트에 노출되지 않음
- 보안 점검 프로세스가 문서화되어 향후 반복 가능

### 부정적 (Negative)
- API 인증이 아직 구현되지 않아 Phase 4까지는 인증 없는 상태 유지
- 상세 에러 정보가 클라이언트에 전달되지 않아 프론트엔드 디버깅 시 서버 로그 확인 필요
