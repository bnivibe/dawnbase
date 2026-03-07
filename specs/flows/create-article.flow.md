# User Flow: 아티클 생성

> **Phase**: Phase 1
> **Status**: Approved
> **Last Updated**: 2026-03-07

## 개요

사용자가 새 아티클을 작성하고 저장(Draft) 또는 발행(Publish)하는 엔드투엔드 플로우입니다. 사이드바 또는 아티클 목록에서 시작하여, 작성 폼을 거쳐 아티클 상세 페이지로 리다이렉트되는 전체 과정을 정의합니다.

## 전제 조건

- 애플리케이션이 정상적으로 로드되어 있어야 합니다
- Article 데이터베이스 테이블이 존재해야 합니다
- Phase 1에서는 인증 없이 누구나 아티클을 생성할 수 있습니다

## 플로우 다이어그램

```
[사이드바 또는 아티클 목록]
    |
    | "New Article" 버튼 클릭
    v
[/articles/new 페이지로 이동]
    |
    v
[아티클 작성 폼 표시]
    |
    | title 입력 (필수)
    | content 입력 (마크다운, 필수)
    | excerpt 입력 (선택)
    v
[사용자 액션 선택]
    |
    +--- "Save Draft" 클릭 ---------> [POST /api/articles, status: draft]
    |                                      |
    +--- "Publish" 클릭 ------------> [POST /api/articles, status: published]
                                           |
                              +------------+------------+
                              |                         |
                         (성공: 201)               (실패: 400/500)
                              |                         |
                              v                         v
                  [/articles/[id] 리다이렉트]    [에러 토스트 표시]
                              |                         |
                              v                         v
                  [성공 토스트 표시]            [폼 유지, 입력값 보존]
```

## 단계별 상세

### Step 1: "New Article" 버튼 클릭

| 항목 | 내용 |
|------|------|
| **페이지** | 아무 페이지 (사이드바는 모든 페이지에 존재) |
| **사용자 액션** | 사이드바의 "New Article" 버튼 또는 아티클 목록 페이지(`/articles`)의 "New Article" 버튼 클릭 |
| **시스템 반응** | `/articles/new` 경로로 클라이언트 사이드 네비게이션 |
| **성공 조건** | 아티클 작성 폼이 표시됨 |
| **실패 처리** | 네비게이션 실패 시 없음 (클라이언트 사이드 라우팅) |

**"New Article" 버튼 위치**:
- 사이드바: Articles 네비게이션 항목 우측에 `+` 아이콘 버튼 (사이드바 접힘 시 숨김)
- 아티클 목록 페이지: 헤더 영역 우측에 "New Article" 버튼 (+ 아이콘 + 텍스트)

### Step 2: 아티클 작성 폼 작성

| 항목 | 내용 |
|------|------|
| **페이지** | `/articles/new` |
| **사용자 액션** | 폼 필드에 내용 입력 |
| **시스템 반응** | 실시간 유효성 피드백 (클라이언트 사이드) |
| **성공 조건** | title과 content가 모두 입력됨 |
| **실패 처리** | 필수 필드 미입력 시 submit 버튼 비활성화 + 인라인 에러 메시지 |

**폼 필드 상세**:

| Field | Label | Type | Required | Placeholder | Validation |
|-------|-------|------|----------|-------------|------------|
| `title` | 제목 | `<input type="text">` | Yes | "아티클 제목을 입력하세요" | 1-200자 |
| `content` | 내용 | `<textarea>` (Phase 1) | Yes | "마크다운으로 작성하세요..." | 1자 이상 |
| `excerpt` | 요약 | `<textarea rows={2}>` | No | "비워두면 본문에서 자동 생성됩니다" | 0-300자 |

**폼 레이아웃**:
```
+--------------------------------------------------+
| <- Back to Articles              New Article      |
+--------------------------------------------------+
|                                                  |
| 제목 *                                            |
| [                                          ]     |
|                                                  |
| 내용 * (Markdown)                                 |
| [                                          ]     |
| [                                          ]     |
| [                                          ]     |
| [                                          ]     |
| [              (auto-resize)               ]     |
|                                                  |
| 요약 (비워두면 자동 생성)                           |
| [                                          ]     |
| [                                          ]     |
|                                                  |
| 0/300                                            |
|                                                  |
|              [Save Draft]   [Publish]            |
+--------------------------------------------------+
```

**클라이언트 사이드 유효성 검사**:
- title 입력 후 blur 시: 비어있으면 "제목을 입력해주세요" 에러
- title 200자 초과 시: "제목은 200자 이하여야 합니다" 에러 + 글자 수 카운터 빨간색
- content 비어있는 상태로 submit 시: "내용을 입력해주세요" 에러
- excerpt 300자 초과 시: "요약은 300자 이하여야 합니다" 에러 + 글자 수 카운터 빨간색

### Step 3: 저장 액션 (Draft 또는 Publish)

| 항목 | 내용 |
|------|------|
| **페이지** | `/articles/new` |
| **사용자 액션** | "Save Draft" 또는 "Publish" 버튼 클릭 |
| **시스템 반응** | API 호출, 로딩 상태 표시, 결과에 따른 처리 |
| **성공 조건** | API 201 Created 응답 |
| **실패 처리** | 에러 토스트 + 폼 유지 |

**"Save Draft" 버튼**:
- 스타일: secondary (outline) 버튼
- 동작: `POST /api/articles` with `{ ...formData, status: 'draft' }`

**"Publish" 버튼**:
- 스타일: primary 버튼
- 동작: `POST /api/articles` with `{ ...formData, status: 'published' }`

**로딩 상태**:
- 버튼 클릭 즉시 두 버튼 모두 `disabled` 처리
- 클릭된 버튼에 spinner 표시 + 텍스트 변경 ("Saving..." / "Publishing...")
- 폼 필드도 `disabled` 처리

### Step 4: 성공 처리

| 항목 | 내용 |
|------|------|
| **페이지** | `/articles/new` -> `/articles/[id]` |
| **사용자 액션** | 없음 (자동) |
| **시스템 반응** | 성공 토스트 표시 + 아티클 상세 페이지로 리다이렉트 |
| **성공 조건** | 아티클 상세 페이지가 정상 표시됨 |
| **실패 처리** | 리다이렉트 실패 시 토스트에 아티클 링크 포함 |

**성공 토스트 메시지**:
- Draft 저장: "아티클이 저장되었습니다" (info 스타일)
- Publish: "아티클이 발행되었습니다" (success 스타일)

**리다이렉트**:
- `router.push(/articles/${article.id})` 사용
- 리다이렉트 후 사이드바의 최근 아티클 목록 자동 갱신

### Step 5: 실패 처리

| 항목 | 내용 |
|------|------|
| **페이지** | `/articles/new` (유지) |
| **사용자 액션** | 에러 확인 후 수정 또는 재시도 |
| **시스템 반응** | 에러 토스트 표시, 로딩 상태 해제, 폼 입력값 보존 |
| **성공 조건** | 사용자가 에러를 확인하고 수정할 수 있는 상태 |
| **실패 처리** | - |

**에러 토스트 메시지**:

| HTTP Status | 토스트 메시지 | 스타일 |
|-------------|-------------|--------|
| 400 (Validation) | "입력값을 확인해주세요" + 각 필드 인라인 에러 표시 | error |
| 500 | "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." | error |
| Network Error | "네트워크 연결을 확인해주세요." | error |

## 관련 UI 컴포넌트

| Component | Spec | Role |
|-----------|------|------|
| `Sidebar` | [layout.spec.md](../ui/layout.spec.md) | "New Article" 버튼 제공 |
| `ArticleForm` | Phase 1 구현 | 아티클 작성/수정 폼 |
| `Toast` | Phase 1 구현 | 성공/에러 알림 표시 |

## 관련 API

| Endpoint | Spec | Purpose |
|----------|------|---------|
| `POST /api/articles` | [articles-api.spec.md](../api/articles-api.spec.md) | 아티클 생성 |
| `GET /api/articles` | [articles-api.spec.md](../api/articles-api.spec.md) | 최근 아티클 목록 (사이드바 갱신용) |

## 에러 시나리오

### 네트워크 오류
- **원인**: 인터넷 연결 끊김 또는 서버 다운
- **감지**: `fetch` 호출 시 `TypeError` (network error)
- **사용자 피드백**: "네트워크 연결을 확인해주세요." 에러 토스트
- **복구 방법**: 연결 복구 후 동일 버튼 재클릭 (폼 입력값 보존됨)

### 서버 검증 실패
- **원인**: 클라이언트 검증을 통과했지만 서버 검증에서 실패 (예: slug 중복 처리 실패)
- **감지**: API 400 응답
- **사용자 피드백**: "입력값을 확인해주세요." 에러 토스트 + 서버에서 반환된 필드별 에러 표시
- **복구 방법**: 에러 필드 수정 후 재시도

### 서버 내부 오류
- **원인**: DB 오류, 예기치 않은 서버 에러
- **감지**: API 500 응답
- **사용자 피드백**: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." 에러 토스트
- **복구 방법**: 잠시 후 재시도 (폼 입력값 보존됨)

## 엣지 케이스

1. **빈 제목으로 submit**: 클라이언트 사이드에서 차단. Submit 버튼은 title과 content 모두 입력되었을 때만 활성화.
2. **매우 긴 마크다운 콘텐츠**: content 필드에 길이 제한 없음. textarea는 auto-resize. API에서는 DB 제한까지 허용.
3. **동일 제목 아티클 생성**: slug 자동 생성 시 중복 처리. "my-article" -> "my-article-1" -> "my-article-2" 등.
4. **빠른 더블 클릭**: 첫 클릭 즉시 버튼 disabled 처리로 중복 요청 방지.
5. **브라우저 뒤로 가기**: 아티클 저장 성공 후 뒤로 가기 시 `/articles/new` 폼은 빈 상태로 초기화.
6. **페이지 이탈 경고**: 폼에 내용이 입력된 상태에서 다른 페이지로 이동 시 "작성 중인 내용이 있습니다. 정말 나가시겠습니까?" 확인 다이얼로그 표시 (`beforeunload` 이벤트 + Next.js router event).
7. **excerpt에 마크다운 입력**: excerpt는 plain text로 취급. 마크다운 문법이 입력되어도 그대로 저장 (렌더링 시 plain text로 표시).

## 상태 관리 (Client)

```typescript
// 폼 상태
interface ArticleFormState {
  title: string;
  content: string;
  excerpt: string;
  errors: {
    title?: string;
    content?: string;
    excerpt?: string;
  };
  isSubmitting: boolean;
  submitAction: 'draft' | 'publish' | null;
}

// 초기 상태
const initialState: ArticleFormState = {
  title: '',
  content: '',
  excerpt: '',
  errors: {},
  isSubmitting: false,
  submitAction: null,
};
```

## 성공/완료 기준

- [ ] "New Article" 버튼이 사이드바와 아티클 목록에 모두 존재한다
- [ ] `/articles/new` 경로에서 작성 폼이 표시된다
- [ ] title과 content가 모두 입력되어야 submit 버튼이 활성화된다
- [ ] 클라이언트 사이드 유효성 검사가 동작한다 (빈 값, 길이 제한)
- [ ] "Save Draft" 클릭 시 status=draft로 아티클이 생성된다
- [ ] "Publish" 클릭 시 status=published로 아티클이 생성된다
- [ ] 생성 성공 시 아티클 상세 페이지로 리다이렉트된다
- [ ] 성공/에러 토스트가 적절히 표시된다
- [ ] 에러 발생 시 폼 입력값이 보존된다
- [ ] submit 중 버튼이 disabled 처리되어 중복 요청이 방지된다
- [ ] 폼 작성 중 페이지 이탈 시 확인 다이얼로그가 표시된다

## 변경 이력

| Date | Change | Reason |
|------|--------|--------|
| 2026-03-07 | 최초 작성 | Phase 1 아티클 생성 플로우 스펙 |
