"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/drivers", label: "Drivers" },
  { href: "/dispatchers", label: "Dispatchers" },
  { href: "/shippers", label: "Shippers" },
  { href: "/blogs", label: "Blogs" },
  { href: "/faqs", label: "FAQ" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
] 

const CTA_CONFIG = [
  {
    match: "/drivers",
    label: "Apply Now",
    href: "/signup",
  },
  {
    match: "/dispatchers",
    label: "Join our Team",
    href: "/signup",
  },
  {
    match: "/shippers",
    label: "Get Started",
    href: "/signup",
  },
  {
    match: "/blogs",
    label: "Get Started",
    href: "/signup",
  },
  {
    match: "/faqs",
    label: "Get Started",
    href: "/signup",
  },
  {
    match: "/about-us",
    label: "Get Started",
    href: "/signup",
  },
  {
    match: "/contact-us",
    label: "Get Started",
    href: "/signup",
  },
  {
    match: "/",
    label: "Sign Up",
    href: "/signup",
  },
];


function getCTA(pathname) {
  const match = CTA_CONFIG.find((item) =>
    pathname.startsWith(item.match)
  );

  return match || {
    label: "Sign Up",
    href: "/signup",
  };
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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

        {/* Desktop nav links - center */}
        <ul className="hidden items-center gap-6 md:flex md:gap-4 lg:gap-8">
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

        {/* Right: Sign In + CTA */}
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="lg" asChild className="hidden sm:inline-flex">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button variant="destructive" size="lg" asChild className="hidden sm:inline-flex">
            <Link href={getCTA(pathname).href}>{getCTA(pathname).label}</Link>
          </Button>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg text-background hover:bg-background/10 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div
        className={cn(
          "absolute left-0 right-0 top-16 overflow-hidden bg-primary-dark/95 backdrop-blur-md transition-[max-height,opacity] duration-300 ease-out md:hidden",
          mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="flex flex-col gap-1 px-4 py-4">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive ? "bg-background/10 text-secondary" : "text-background hover:bg-background/10"
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
          <li className="mt-2 flex flex-col gap-2 border-t border-background/20 pt-4">
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
          </li>
        </ul>
      </div>
    </header>
  );
}
