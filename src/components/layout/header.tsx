"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileSidebarContent } from "@/components/layout/sidebar";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4">
      {/* Mobile menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="md:hidden" />
          }
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <MobileSidebarContent />
        </SheetContent>
      </Sheet>

      {/* Title */}
      <div className="flex-1">
        <h1 className="text-sm font-medium text-muted-foreground">
          {"Dawn's Knowledge Base"}
        </h1>
      </div>

      {/* Search placeholder */}
      <Input
        placeholder="Search coming in Phase 2..."
        disabled
        className="hidden w-64 sm:block"
      />

      {/* Theme toggle */}
      <ThemeToggle />
    </header>
  );
}
