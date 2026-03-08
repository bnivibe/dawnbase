# User Flow: Article Creation

> **ARCHIVED**: This flow is superseded by the Claude Content Pipeline. See specs/flows/claude-content-pipeline.flow.md

> **Phase**: Phase 1
> **Status**: Archived
> **Last Updated**: 2026-03-08

## Overview

An end-to-end flow where the user writes a new article and saves it as Draft or publishes it. The flow starts from the sidebar or article list, goes through the creation form, and redirects to the article detail page.

## Prerequisites

- The application must be properly loaded
- The Article database table must exist
- In Phase 1, anyone can create articles without authentication

## Flow Diagram

```
[Sidebar or Article List]
    |
    | Click "New Article" button
    v
[Navigate to /articles/new page]
    |
    v
[Display article creation form]
    |
    | Enter title (required)
    | Enter content (markdown, required)
    | Enter excerpt (optional)
    v
[User action selection]
    |
    +--- Click "Save Draft" ---------> [POST /api/articles, status: draft]
    |                                      |
    +--- Click "Publish" ------------> [POST /api/articles, status: published]
                                           |
                              +------------+------------+
                              |                         |
                         (Success: 201)            (Failure: 400/500)
                              |                         |
                              v                         v
                  [Redirect to /articles/[id]]   [Show error toast]
                              |                         |
                              v                         v
                  [Show success toast]          [Keep form, preserve input]
```

## Step-by-Step Details

### Step 1: Click "New Article" Button

| Item | Details |
|------|---------|
| **Page** | Any page (sidebar exists on all pages) |
| **User Action** | Click the "New Article" button in the sidebar or on the article list page (`/articles`) |
| **System Response** | Client-side navigation to `/articles/new` route |
| **Success Condition** | Article creation form is displayed |
| **Failure Handling** | None for navigation failure (client-side routing) |

**"New Article" Button Locations**:
- Sidebar: `+` icon button to the right of the Articles navigation item (hidden when sidebar is collapsed)
- Article list page: "New Article" button (+ icon + text) at the top right of the header area

### Step 2: Fill Out Article Creation Form

| Item | Details |
|------|---------|
| **Page** | `/articles/new` |
| **User Action** | Enter content in form fields |
| **System Response** | Real-time validation feedback (client-side) |
| **Success Condition** | Both title and content are entered |
| **Failure Handling** | Submit button disabled when required fields are empty + inline error messages |

**Form Field Details**:

| Field | Label | Type | Required | Placeholder | Validation |
|-------|-------|------|----------|-------------|------------|
| `title` | Title | `<input type="text">` | Yes | "Enter article title" | 1-200 chars |
| `content` | Content | `<textarea>` (Phase 1) | Yes | "Write in markdown..." | 1+ chars |
| `excerpt` | Summary | `<textarea rows={2}>` | No | "Leave empty to auto-generate from content" | 0-300 chars |

**Form Layout**:
```
+--------------------------------------------------+
| <- Back to Articles              New Article      |
+--------------------------------------------------+
|                                                  |
| Title *                                          |
| [                                          ]     |
|                                                  |
| Content * (Markdown)                             |
| [                                          ]     |
| [                                          ]     |
| [                                          ]     |
| [                                          ]     |
| [              (auto-resize)               ]     |
|                                                  |
| Summary (leave empty to auto-generate)           |
| [                                          ]     |
| [                                          ]     |
|                                                  |
| 0/300                                            |
|                                                  |
|              [Save Draft]   [Publish]            |
+--------------------------------------------------+
```

**Client-Side Validation**:
- On title blur when empty: "Please enter a title" error
- When title exceeds 200 chars: "Title must be 200 characters or less" error + red character counter
- When submitting with empty content: "Please enter content" error
- When excerpt exceeds 300 chars: "Summary must be 300 characters or less" error + red character counter

### Step 3: Save Action (Draft or Publish)

| Item | Details |
|------|---------|
| **Page** | `/articles/new` |
| **User Action** | Click "Save Draft" or "Publish" button |
| **System Response** | API call, loading state display, handling based on result |
| **Success Condition** | API 201 Created response |
| **Failure Handling** | Error toast + form preserved |

**"Save Draft" Button**:
- Style: secondary (outline) button
- Action: `POST /api/articles` with `{ ...formData, status: 'draft' }`

**"Publish" Button**:
- Style: primary button
- Action: `POST /api/articles` with `{ ...formData, status: 'published' }`

**Loading State**:
- Immediately disable both buttons on click
- Show spinner on the clicked button + change text ("Saving..." / "Publishing...")
- Disable form fields as well

### Step 4: Success Handling

| Item | Details |
|------|---------|
| **Page** | `/articles/new` -> `/articles/[id]` |
| **User Action** | None (automatic) |
| **System Response** | Show success toast + redirect to article detail page |
| **Success Condition** | Article detail page displays correctly |
| **Failure Handling** | Include article link in toast if redirect fails |

**Success Toast Messages**:
- Draft save: "Article has been saved" (info style)
- Publish: "Article has been published" (success style)

**Redirect**:
- Uses `router.push(/articles/${article.id})`
- After redirect, automatically refresh the recent articles list in the sidebar

### Step 5: Failure Handling

| Item | Details |
|------|---------|
| **Page** | `/articles/new` (preserved) |
| **User Action** | Review error and correct or retry |
| **System Response** | Show error toast, release loading state, preserve form input values |
| **Success Condition** | User can see the error and make corrections |
| **Failure Handling** | - |

**Error Toast Messages**:

| HTTP Status | Toast Message | Style |
|-------------|---------------|-------|
| 400 (Validation) | "Please check your input" + show inline errors for each field | error |
| 500 | "A server error occurred. Please try again later." | error |
| Network Error | "Please check your network connection." | error |

## Related UI Components

| Component | Spec | Role |
|-----------|------|------|
| `Sidebar` | [layout.spec.md](../ui/layout.spec.md) | Provides the "New Article" button |
| `ArticleForm` | Phase 1 implementation | Article creation/editing form |
| `Toast` | Phase 1 implementation | Success/error notification display |

## Related APIs

| Endpoint | Spec | Purpose |
|----------|------|---------|
| `POST /api/articles` | [articles-api.spec.md](../api/articles-api.spec.md) | Article creation |
| `GET /api/articles` | [articles-api.spec.md](../api/articles-api.spec.md) | Recent articles list (for sidebar refresh) |

## Error Scenarios

### Network Error
- **Cause**: Internet connection lost or server down
- **Detection**: `TypeError` (network error) when calling `fetch`
- **User Feedback**: "Please check your network connection." error toast
- **Recovery**: Re-click the same button after connection is restored (form input values preserved)

### Server Validation Failure
- **Cause**: Passed client validation but failed server validation (e.g., slug duplicate handling failure)
- **Detection**: API 400 response
- **User Feedback**: "Please check your input." error toast + display field-specific errors returned by server
- **Recovery**: Fix the error fields and retry

### Server Internal Error
- **Cause**: DB error, unexpected server error
- **Detection**: API 500 response
- **User Feedback**: "A server error occurred. Please try again later." error toast
- **Recovery**: Retry after a moment (form input values preserved)

## Edge Cases

1. **Submit with empty title**: Blocked on client-side. Submit button is only enabled when both title and content are entered.
2. **Very long markdown content**: No length limit on the content field. Textarea auto-resizes. API allows up to the DB limit.
3. **Creating article with duplicate title**: Handled during slug auto-generation. "my-article" -> "my-article-1" -> "my-article-2", etc.
4. **Rapid double-click**: Prevents duplicate requests by immediately disabling the button on first click.
5. **Browser back navigation**: After successful article save, navigating back shows the `/articles/new` form reset to empty state.
6. **Page departure warning**: When navigating away with content entered in the form, a confirmation dialog "You have unsaved content. Are you sure you want to leave?" is shown (`beforeunload` event + Next.js router event).
7. **Markdown in excerpt**: Excerpt is treated as plain text. Even if markdown syntax is entered, it is saved as-is (displayed as plain text when rendered).

## State Management (Client)

```typescript
// Form state
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

// Initial state
const initialState: ArticleFormState = {
  title: '',
  content: '',
  excerpt: '',
  errors: {},
  isSubmitting: false,
  submitAction: null,
};
```

## Success/Completion Criteria

- [ ] "New Article" button exists in both the sidebar and article list
- [ ] Article creation form is displayed at the `/articles/new` route
- [ ] Submit button is only enabled when both title and content are entered
- [ ] Client-side validation works (empty values, length limits)
- [ ] Clicking "Save Draft" creates an article with status=draft
- [ ] Clicking "Publish" creates an article with status=published
- [ ] On successful creation, redirects to the article detail page
- [ ] Success/error toasts are displayed appropriately
- [ ] Form input values are preserved on error
- [ ] Buttons are disabled during submission to prevent duplicate requests
- [ ] Confirmation dialog is shown when leaving the page while form is being filled

## Changelog

| Date | Change | Reason |
|------|--------|--------|
| 2026-03-07 | Initial creation | Phase 1 article creation flow spec |
