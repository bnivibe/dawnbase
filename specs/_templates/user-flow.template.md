# User Flow: {FlowName}

> **Phase**: {Phase N}
> **Status**: Draft | Review | Approved | Implementing | Implemented | Verified
> **Last Updated**: YYYY-MM-DD

## Overview

{Explain what this user flow is and what goal it achieves}

## Prerequisites

- {Condition 1 that must be met before starting the flow}
- {Condition 2 that must be met before starting the flow}

## Flow Diagram

```
[Start State]
    |
    v
[Step 1: Action] --> (Failure) --> [Error Handling]
    |
    v (Success)
[Step 2: Action] --> (Failure) --> [Error Handling]
    |
    v (Success)
[Completion State]
```

## Step-by-Step Details

### Step 1: {Action Name}

| Item | Details |
|------|---------|
| **Page** | {Page path} |
| **User Action** | {What the user does} |
| **System Response** | {What the system does} |
| **Success Condition** | {Condition to proceed to the next step} |
| **Failure Handling** | {How failures are handled} |

### Step 2: {Action Name}

| Item | Details |
|------|---------|
| **Page** | {Page path} |
| **User Action** | {What the user does} |
| **System Response** | {What the system does} |
| **Success Condition** | {Condition to proceed to the next step} |
| **Failure Handling** | {How failures are handled} |

## Related UI Components

| Component | Spec | Role |
|-----------|------|------|
| `{ComponentName}` | [{spec link}]({path}) | {Role} |

## Related APIs

| Endpoint | Spec | Purpose |
|----------|------|---------|
| `{METHOD} /api/{path}` | [{spec link}]({path}) | {Purpose} |

## Error Scenarios

### {Error Scenario 1}
- **Cause**: {What triggers this error}
- **Detection**: {How the error is detected}
- **User Feedback**: {How the user is notified}
- **Recovery**: {How to return to a normal state}

## Edge Cases

1. {Edge case 1}: {How it is handled}
2. {Edge case 2}: {How it is handled}

## Success/Completion Criteria

- [ ] {Verifiable completion condition 1}
- [ ] {Verifiable completion condition 2}
- [ ] {Verifiable completion condition 3}

## Changelog

| Date | Change | Reason |
|------|--------|--------|
| YYYY-MM-DD | Initial creation | Phase N spec |
