"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar placeholder — will be built per-role later */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <span className="text-lg font-bold text-primary-dark">DISPATCH</span>
          <span className="text-lg font-bold text-secondary">PRO</span>
        </div>
        <nav className="p-4">
          <p className="text-sm text-muted-foreground">
            Logged in as <span className="font-semibold text-foreground">{user?.role}</span>
          </p>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar placeholder */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <h1 className="text-sm font-semibold text-foreground">
            {user?.fullName}
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
