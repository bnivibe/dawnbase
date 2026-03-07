# UI Spec: {ComponentName}

> **Phase**: {Phase N}
> **Status**: Draft | Review | Approved | Implementing | Implemented | Verified
> **Last Updated**: YYYY-MM-DD
> **File Path**: `src/components/{component-name}.tsx`

## Overview

{Explain what this UI component is and what role it plays}

## Wireframe

```
+--------------------------------------------------+
|                                                  |
|          ASCII wireframe or description          |
|                                                  |
+--------------------------------------------------+
```

## Component Structure

```
{ComponentName}/
  {ComponentName}.tsx       # Main component
  {SubComponent}.tsx        # Sub-component
```

## Props Definition

```typescript
interface {ComponentName}Props {
  /** Description */
  propName: type;
  /** Description (optional) */
  optionalProp?: type;
}
```

## State Management

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `stateName` | type | value | Description |

## Behavior Specifications

### {Behavior 1}
- Trigger: {What action triggers it}
- Behavior: {What happens}
- Result: {Final state}

### {Behavior 2}
- Trigger: {What action triggers it}
- Behavior: {What happens}
- Result: {Final state}

## Style Specifications

### Layout
- Placement: {flex/grid/absolute, etc.}
- Size: {width, height}
- Spacing: {padding, margin, gap}

### Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| < 768px (Mobile) | {Behavior description} |
| 768px - 1024px (Tablet) | {Behavior description} |
| > 1024px (Desktop) | {Behavior description} |

### Theme

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `{color}` | `{color}` |
| Text | `{color}` | `{color}` |
| Border | `{color}` | `{color}` |

## Accessibility (A11y)

- Keyboard navigation: {Support method}
- ARIA attributes: {Required aria attributes}
- Screen reader: {Considerations}

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `package` | Purpose of use |

## Changelog

| Date | Change | Reason |
|------|--------|--------|
| YYYY-MM-DD | Initial creation | Phase N spec |
