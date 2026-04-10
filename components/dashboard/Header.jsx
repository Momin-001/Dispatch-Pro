"use client";

import { User, Bell } from "lucide-react";
import { MobileSidebarTrigger } from "./Sidebar";

export function DashboardHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-end border-b border-border bg-card px-4 sm:px-6">
      {/* Right: notification + user */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-full bg-primary-dark text-white transition-colors hover:bg-primary-dark/90"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute -right-0.5 -top-0.5 flex size-2.5 rounded-full border-2 border-card bg-destructive" />
        </button>

        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full bg-primary-dark text-white transition-colors hover:bg-primary-dark/90"
          aria-label="User menu"
        >
          <User className="size-4" />
        </button>
      </div>
    </header>
  );
}
