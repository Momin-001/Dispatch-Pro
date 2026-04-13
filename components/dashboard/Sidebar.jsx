"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut, ChevronDown } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";
import { getFilteredNav } from "./nav-config";

function NavItem({ item, pathname, onNavigate }) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children?.length > 0;
  const isActive = item.href === pathname;
  const isChildActive = hasChildren && item.children.some((c) => pathname.startsWith(c.href));

  if (hasChildren) {
    const expanded = open || isChildActive;
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isChildActive
              ? "bg-primary-dark text-white"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {item.icon && <item.icon className="size-[18px] shrink-0" />}
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 transition-transform",
              expanded && "rotate-180"
            )}
          />
        </button>

        {expanded && (
          <div className="relative ml-6 mt-2">
            {/* Vertical line */}
            <div className="absolute left-[3.5px] top-3.5 h-[calc(100%-28px)] w-px bg-muted-foreground/20" />

            <div className="flex flex-col gap-4">
              {item.children.map((child) => {
                const childActive = pathname.startsWith(child.href);

                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onNavigate}
                    className="relative flex items-center pl-6 text-sm"
                  >
                    {/* Dot aligned on line */}
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full",
                        childActive
                          ? "bg-primary-dark"
                          : "bg-muted-foreground/40"
                      )}
                    />

                    {/* Label */}
                    <span
                      className={cn(
                        childActive
                          ? "text-primary-dark font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {child.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary-dark text-white"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {item.icon && <item.icon className="size-[18px] shrink-0" />}
      <span>{item.label}</span>
    </Link>
  );
}

function SidebarContent({ onNavigate }) {
  const pathname = usePathname();
  const { user, hasPermission, logout } = useAuth();

  const items = getFilteredNav(user?.role, user?.status, hasPermission);

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-1 border-b border-border px-6">
        <span className="text-lg font-bold text-primary-dark">DISPATCH</span>
        <span className="text-lg font-bold text-secondary">PRO</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-[18px] shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 sticky top-0 border-r border-border bg-card lg:flex lg:flex-col">
        <SidebarContent onNavigate={() => { }} />
      </aside>

      {/* Mobile trigger — rendered inside the header via MobileSidebarTrigger */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg text-foreground hover:bg-muted lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </button>
        </SheetTrigger>

        <SheetContent side="left" className="w-64 p-0">
          <VisuallyHidden>
            <SheetTitle>Sidebar Navigation</SheetTitle>
            <SheetDescription>Dashboard sidebar navigation</SheetDescription>
          </VisuallyHidden>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}

export function MobileSidebarTrigger() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg text-foreground hover:bg-muted lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="size-5" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-0">
        <VisuallyHidden>
          <SheetTitle>Sidebar Navigation</SheetTitle>
          <SheetDescription>Dashboard sidebar navigation</SheetDescription>
        </VisuallyHidden>
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
