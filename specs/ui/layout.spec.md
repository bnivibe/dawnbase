# UI Spec: App Shell Layout

> **Phase**: Phase 1
> **Status**: Implementing
> **Last Updated**: 2026-03-07
> **File Path**: `src/components/layout/`

## Overview

Defines the overall layout of the Dawnbase application. Uses an App Shell pattern consisting of a collapsible sidebar, header, and main content area. Supports dark/light mode, and on mobile the sidebar converts to a hamburger menu.

## Wireframe

### Desktop (>= 768px)

```
+-------+--------------------------------------------------+
| SIDE  | HEADER                                           |
| BAR   |  [Search(Phase2)]    [Theme Toggle] "Dawn's KB"  |
|       +--------------------------------------------------+
| Logo  |                                                  |
| Dawn  |                                                  |
| base  |                MAIN CONTENT AREA                 |
|       |                                                  |
| Nav:  |              (center, responsive)                |
| - Dash|                                                  |
| - Arti|                                                  |
| - Cate|                                                  |
|  (Ph2)|                                                  |
| - Sear|                                                  |
|  (Ph2)|                                                  |
|       |                                                  |
| Recent|                                                  |
| - art1|                                                  |
| - art2|                                                  |
| - art3|                                                  |
|       |                                                  |
| [<<]  |                                                  |
+-------+--------------------------------------------------+
```

### Sidebar Collapsed (Desktop)

```
+----+-----------------------------------------------------+
| IC | HEADER                                              |
| ON |  [Search(Phase2)]    [Theme Toggle] "Dawn's KB"     |
| S  +-----------------------------------------------------+
|    |                                                     |
| D  |                                                     |
| A  |                 MAIN CONTENT AREA                   |
| C  |                                                     |
| S  |                                                     |
|    |                                                     |
|[>>]|                                                     |
+----+-----------------------------------------------------+
```

### Mobile (< 768px)

```
+--------------------------------------------------+
| HEADER                                           |
|  [Hamburger]  "Dawn's KB"    [Theme Toggle]      |
+--------------------------------------------------+
|                                                  |
|                                                  |
|              MAIN CONTENT AREA                   |
|              (full width)                        |
|                                                  |
|                                                  |
+--------------------------------------------------+

--- When Hamburger is Clicked (Overlay) ---

+--------------------------------------------------+
| SIDEBAR OVERLAY              [X Close]           |
| Logo: Dawnbase                                   |
|                                                  |
| Navigation:                                      |
|   Dashboard                                      |
|   Articles                                       |
|   Categories (Phase 2)                           |
|   Search (Phase 2)                               |
|                                                  |
| Recent Articles:                                 |
|   - Article Title 1                              |
|   - Article Title 2                              |
|   - Article Title 3                              |
+--------------------------------------------------+
```

## Component Structure

```
src/components/layout/
  AppShell.tsx              # Overall layout wrapper
  Sidebar.tsx               # Sidebar (navigation + recent articles)
  Header.tsx                # Top header bar
  MainContent.tsx           # Main content wrapper
  ThemeToggle.tsx           # Dark/light mode toggle button
  SidebarNavItem.tsx        # Sidebar navigation item
  RecentArticlesList.tsx    # Recent articles quick link list
```

## Component Details

### AppShell

Top-level layout component. Used in `src/app/layout.tsx`.

```typescript
interface AppShellProps {
  children: React.ReactNode;
}
```

### Sidebar

```typescript
interface SidebarProps {
  isAdmin?: boolean; // passed from server layout, controls admin button visibility
}
```

**State Management**:

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `isCollapsed` | boolean | `false` | Sidebar collapsed state (desktop) |
| `isMobileOpen` | boolean | `false` | Mobile overlay visibility state |

**Navigation Items**:

| Label | Icon | Path | Phase | Description |
|-------|------|------|-------|-------------|
| Dashboard | `LayoutDashboard` | `/` | 1 | Dashboard (home) |
| Articles | `FileText` | `/articles` | 1 | Article list |
| Categories | `FolderTree` | `/categories` | 2 | Category management (shown as disabled) |
| Search | `Search` | `/search` | 2 | Search (shown as disabled) |

- Phase 2 items are displayed in the navigation in Phase 1 but styled as disabled with `opacity-50 pointer-events-none`
- The item corresponding to the current route is highlighted with `bg-accent` background + bold text

**Bottom Section** (below nav, above collapse toggle):

| State | Button | Icon | Action |
|-------|--------|------|--------|
| `isAdmin: false` | Admin | `LogIn` | Navigate to `/admin/login` |
| `isAdmin: true` | Logout | `LogOut` | Submit `logoutAction` (form POST) |

- In collapsed mode, only the icon is shown (no label)
- `isAdmin` is determined server-side in the layout and passed as a prop

**Recent Articles Quick Links**:
- Displays up to 5 recently created/modified articles
- Each item shows the title (max 30 chars, truncated if exceeded) and a status badge
- Clicking navigates to the article detail page
- Hidden when in `isCollapsed` state

### Header

```typescript
interface HeaderProps {
  // No props - handled internally
}
```

**Components**:
- **Left**: Mobile hamburger button (shown only at < 768px)
- **Center/Left**: Search bar placeholder (activated in Phase 2, shown as disabled input in Phase 1)
- **Right**: Theme toggle button + "Dawn's Knowledge Base" text

### ThemeToggle

Dark/light mode switch button.

```typescript
// Uses next-themes
interface ThemeToggleProps {
  // No props - uses next-themes useTheme hook
}
```

- Light mode: Shows Sun icon (click to switch to dark)
- Dark mode: Shows Moon icon (click to switch to light)
- Uses system theme as default (`defaultTheme="system"`)
- Smooth transition on switch (`transition-colors duration-200`)

## Behavior Specifications

### Sidebar Collapse/Expand (Desktop)

- **Trigger**: Click the collapse button at the bottom of the sidebar (`<<` / `>>`)
- **Behavior**:
  - Collapsed: Sidebar width 240px -> 64px, text labels hidden, icons only displayed
  - Expanded: Sidebar width 64px -> 240px, text labels displayed
  - Recent articles section: hidden when collapsed, shown when expanded
- **Result**: `isCollapsed` state toggle, saved to `localStorage` to persist across page refreshes
- **Animation**: `transition-all duration-300 ease-in-out`

### Mobile Sidebar Open/Close

- **Trigger (open)**: Click the hamburger icon in the header
- **Trigger (close)**: Click the overlay background, click the X button, or click a navigation item
- **Behavior**: Slide-in/out overlay from the left + semi-transparent background
- **Result**: `isMobileOpen` state toggle
- **Animation**: `transform translateX` + `transition duration-300`
- **Accessibility**: Lock `body` scroll when overlay is open, close with `ESC` key

### Theme Switch

- **Trigger**: Click the ThemeToggle button
- **Behavior**: Calls `setTheme` from `next-themes`
- **Result**: Switches the entire app's color scheme
- **Storage**: Auto-saved to `localStorage` (built into next-themes)

## Style Specifications

### Layout

```
AppShell: flex flex-row h-screen w-screen overflow-hidden
  Sidebar: flex flex-col h-full (w-60 | w-16) border-r
  RightArea: flex flex-col flex-1 overflow-hidden
    Header: flex items-center h-14 border-b px-4
    MainContent: flex-1 overflow-y-auto p-6
```

### Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| < 768px (Mobile) | Sidebar hidden, switches to hamburger menu, overlay mode. Main content full width. |
| 768px - 1024px (Tablet) | Sidebar collapsed by default (icons only), can be expanded. Main content adaptive. |
| > 1024px (Desktop) | Sidebar expanded by default (240px), can be collapsed. Main content with generous margins. |

### Theme Colors

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| App background | `white` | `zinc-950` |
| Sidebar background | `gray-50` | `zinc-900` |
| Sidebar border | `gray-200` | `zinc-800` |
| Header background | `white` | `zinc-950` |
| Header border | `gray-200` | `zinc-800` |
| Navigation text | `gray-700` | `zinc-300` |
| Navigation active background | `gray-100` | `zinc-800` |
| Navigation active text | `gray-900` | `zinc-100` |
| Navigation hover background | `gray-100` | `zinc-800/50` |
| Logo text | `gray-900` | `zinc-100` |
| Main content background | `white` | `zinc-950` |
| General text | `gray-900` | `zinc-100` |
| Disabled items | `gray-400` | `zinc-600` |

### Sidebar Dimensions

| Property | Expanded | Collapsed |
|----------|----------|-----------|
| Width | 240px (`w-60`) | 64px (`w-16`) |
| Padding | `p-4` | `p-2` |
| Logo area height | 56px (`h-14`) | 56px (`h-14`) |
| Nav item height | 40px (`h-10`) | 40px (`h-10`) |
| Nav item gap | 4px (`gap-1`) | 4px (`gap-1`) |

### Header Dimensions

| Property | Value |
|----------|-------|
| Height | 56px (`h-14`) |
| Padding | `px-4` |
| Search Bar Width | `max-w-md` (Phase 2) |

## Accessibility (A11y)

- **Keyboard navigation**: Tab key moves through sidebar -> header -> main content in order
- **ARIA attributes**:
  - Sidebar: `role="navigation"`, `aria-label="Main navigation"`
  - Sidebar toggle button: `aria-expanded={!isCollapsed}`, `aria-label="Toggle sidebar"`
  - Mobile overlay: `role="dialog"`, `aria-modal="true"`
  - Theme toggle: `aria-label="Toggle dark mode"`
  - Current page navigation: `aria-current="page"`
- **Screen reader**: Phase 2 disabled items in navigation have `aria-disabled="true"` added
- **Reduced motion**: Respects `prefers-reduced-motion` media query, disables animations

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `next-themes` | Dark/light mode switching management |
| `lucide-react` | Icons (LayoutDashboard, FileText, FolderTree, Search, Sun, Moon, Menu, X, ChevronsLeft, ChevronsRight) |

## Implementation Notes

### File Structure

```
src/
  app/
    layout.tsx          # ThemeProvider + AppShell wrapping
    page.tsx            # Dashboard page
  components/
    layout/
      AppShell.tsx
      Sidebar.tsx
      Header.tsx
      MainContent.tsx
      ThemeToggle.tsx
      SidebarNavItem.tsx
      RecentArticlesList.tsx
  lib/
    constants.ts        # Navigation item definitions
```

### layout.tsx Structure

```tsx
// src/app/layout.tsx
import { ThemeProvider } from 'next-themes';
import { AppShell } from '@/components/layout/AppShell';

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### localStorage Keys

| Key | Value | Description |
|-----|-------|-------------|
| `dawnbase-sidebar-collapsed` | `"true"` / `"false"` | Sidebar collapsed state |
| `theme` | `"light"` / `"dark"` / `"system"` | Theme setting (managed by next-themes) |

## Changelog

| Date | Change | Reason |
|------|--------|--------|
| 2026-03-07 | Initial creation | Phase 1 app shell layout spec |
