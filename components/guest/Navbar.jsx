"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/drivers", label: "Drivers" },
  { href: "/dispatchers", label: "Dispatchers" },
  { href: "/shippers", label: "Shippers" },
  { href: "/blogs", label: "Blogs" },
  { href: "/faqs", label: "FAQ" },
  { href: "/about-us", label: "About" },
  { href: "/contact-us", label: "Contact" },
];

const CTA_CONFIG = [
  { match: "/drivers", label: "Apply Now", href: "/signup" },
  { match: "/dispatchers", label: "Join our Team", href: "/signup" },
  { match: "/shippers", label: "Get Started", href: "/signup" },
  { match: "/blogs", label: "Get Started", href: "/signup" },
  { match: "/faqs", label: "Get Started", href: "/signup" },
  { match: "/about-us", label: "Get Started", href: "/signup" },
  { match: "/contact-us", label: "Get Started", href: "/signup" },
  { match: "/", label: "Sign Up", href: "/signup" },
];

function getCTA(pathname) {
  const match = CTA_CONFIG.find((item) => pathname.startsWith(item.match));
  return match || { label: "Sign Up", href: "/signup" };
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoading } = useAuth();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 w-full bg-black/20 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center text-lg font-bold tracking-tight sm:text-xl"
          aria-label="Dispatch Pro home"
        >
          <span className="text-background">DISPATCH</span>
          <span className="text-secondary">PRO</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-6 lg:flex lg:gap-8">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-background/90 lg:text-base",
                    isActive ? "text-secondary" : "text-background"
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: Sign In + CTA + Mobile Trigger */}
        <div className="flex shrink-0 items-center gap-2">
          {isLoading ? (
            <Loader2 className="size-6 animate-spin text-secondary" />
          ) : user ? (
            <Button variant="destructive" size="lg" asChild className="hidden sm:inline-flex">
              <Link href={`/${user.role.toLowerCase()}`}>
                <User className="size-4" /> Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="lg" asChild className="hidden sm:inline-flex">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button variant="destructive" size="lg" asChild className="hidden sm:inline-flex">
                <Link href={getCTA(pathname).href}>{getCTA(pathname).label}</Link>
              </Button>
            </>
          )}

          {/* Mobile Sheet */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>

            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-lg text-background hover:bg-background/10 lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="size-6" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="top"
              className="bg-primary-dark/95 backdrop-blur-md border-none px-4 pt-16 pb-6"
            >
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Main site navigation links</SheetDescription>
              </VisuallyHidden>
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map(({ href, label }) => {
                  const isActive = pathname === href;
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-background/10 text-secondary"
                            : "text-background hover:bg-background/10"
                        )}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}

                <li className="mt-2 flex flex-col gap-2 border-t border-background/20 pt-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="size-6 animate-spin text-secondary" />
                    </div>
                  ) : user ? (
                    <Button variant="destructive" size="lg" asChild className="w-full">
                      <Link href={`/${user.role.toLowerCase()}`} onClick={() => setMobileOpen(false)}>
                        <User className="size-4" /> Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Link
                        href="/signin"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg px-4 py-3 text-center text-sm font-medium text-background hover:bg-background/10"
                      >
                        Sign In
                      </Link>
                      <Button variant="destructive" size="lg" asChild className="w-full">
                        <Link href={getCTA(pathname).href} onClick={() => setMobileOpen(false)}>
                          {getCTA(pathname).label}
                        </Link>
                      </Button>
                    </>
                  )}
                </li>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}