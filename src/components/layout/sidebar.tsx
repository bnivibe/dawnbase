"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  FolderTree,
  Search,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const COLLAPSED_KEY = "dawnbase-sidebar-collapsed";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Articles", href: "/articles", icon: FileText },
  { label: "Categories", href: "/categories", icon: FolderTree, disabled: true },
  { label: "Search", href: "/search", icon: Search, disabled: true },
];

function useCollapsed() {
  const subscribe = useCallback((callback: () => void) => {
    const handler = (e: StorageEvent) => {
      if (e.key === COLLAPSED_KEY) callback();
    };
    window.addEventListener("storage", handler);
    // Also listen for custom events for same-tab updates
    window.addEventListener(COLLAPSED_KEY, callback);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener(COLLAPSED_KEY, callback);
    };
  }, []);

  const getSnapshot = useCallback(
    () => localStorage.getItem(COLLAPSED_KEY) === "true",
    []
  );

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function setCollapsed(value: boolean) {
  localStorage.setItem(COLLAPSED_KEY, String(value));
  window.dispatchEvent(new Event(COLLAPSED_KEY));
}

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useCollapsed();

  function toggleCollapsed() {
    setCollapsed(!collapsed);
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        "hidden h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-200 md:flex",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-14 items-center border-b px-4",
          collapsed ? "justify-center" : "gap-2"
        )}
      >
        <BookOpen className="size-5 shrink-0" />
        {!collapsed && (
          <span className="text-base font-semibold">Dawnbase</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          const linkContent = (
            <Link
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                item.disabled && "pointer-events-none opacity-40",
                collapsed && "justify-center px-0"
              )}
              aria-disabled={item.disabled}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && (
                <span>
                  {item.label}
                  {item.disabled && " (Phase 2)"}
                </span>
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger
                  render={<div />}
                >
                  {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.label}
                  {item.disabled && " (Phase 2)"}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href}>{linkContent}</div>;
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t p-2">
        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={toggleCollapsed}
          className={cn("mt-1 w-full", collapsed ? "" : "justify-start gap-2")}
        >
          {collapsed ? (
            <PanelLeft className="size-4" />
          ) : (
            <>
              <PanelLeftClose className="size-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}

/** Mobile sidebar content (for use inside Sheet) */
export function MobileSidebarContent() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <BookOpen className="size-5" />
        <span className="text-base font-semibold">Dawnbase</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                item.disabled && "pointer-events-none opacity-40"
              )}
              aria-disabled={item.disabled}
            >
              <Icon className="size-4" />
              <span>
                {item.label}
                {item.disabled && " (Phase 2)"}
              </span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
