# ADR-004: Styling - Tailwind CSS + shadcn/ui

## Status
Accepted

## Date
2026-03-07

## Context
Dawnbase requires a knowledge wiki-style UI with clean layouts, readable typography, dark/light theme support, and accessibility (a11y). The styling solution affects development speed, design consistency, customization flexibility, and maintainability.

## Options Considered

### 1. **CSS Modules**
- Pros: Close to CSS standard, automatic scope isolation, no separate runtime
- Cons: Requires significant manual work for design system construction, no component library, complex theme switching

### 2. **Tailwind CSS + shadcn/ui**
- Pros: Fast styling with utility-first approach, accessible components from shadcn/ui (built on Radix UI), copy-paste approach (not a dependency) enables full customization, CSS variable-based dark mode, excellent VS Code IntelliSense
- Cons: HTML can become lengthy (class enumeration), requires learning Tailwind utility classes

### 3. **Styled-components (CSS-in-JS)**
- Pros: Powerful dynamic styling, component-level scoping, theme provider
- Cons: Runtime overhead, incompatible with Server Components, increased bundle size, potential conflicts with React 18+ streaming SSR

### 4. **MUI (Material UI)**
- Pros: Highly polished component library, Material Design guidelines, rich features
- Cons: Very large bundle size, fixed Material Design aesthetic, difficult customization, CSS-in-JS runtime issues

## Decision
**Tailwind CSS + shadcn/ui** is selected as the styling solution.

## Rationale

1. **Utility-first rapid development**: Using Tailwind CSS utility classes enables styling directly within JSX without writing separate CSS files, resulting in fast development speed.

2. **shadcn/ui accessibility**: shadcn/ui is built on top of Radix UI Primitives, providing built-in accessibility including keyboard navigation, screen reader support, and ARIA attributes.

3. **Copy-paste approach**: shadcn/ui adds components via copy-paste rather than as an npm package. This means you directly own the source code, enabling full customization and immunity to external library breaking changes.

4. **Built-in dark mode support**: Dark/light mode switching can be easily implemented using Tailwind CSS's `dark:` modifier and the CSS variable-based theme system.

5. **Server Components compatibility**: Tailwind CSS compiles to pure CSS without runtime JavaScript, making it fully compatible with React Server Components.

6. **VS Code DX**: The Tailwind CSS IntelliSense extension provides auto-completion, class previews, and linting, delivering an excellent developer experience.

## Consequences

### Positive
- Fast UI development speed (instant styling with utility classes)
- Highly accessible components (shadcn/ui built on Radix UI)
- Full customization possible (source code ownership)
- Easy dark/light mode implementation
- No runtime overhead (build-time CSS generation)
- Full compatibility with Server Components

### Negative
- Long class name enumeration in HTML may reduce readability (mitigated by component abstraction)
- Initial learning cost for the Tailwind utility class system
- shadcn/ui components must be manually added/managed (mitigated by CLI tools)
- Design system consistency must be maintained by developers (leveraging tailwind.config)
