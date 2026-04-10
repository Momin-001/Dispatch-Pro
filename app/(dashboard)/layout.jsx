"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";

export default function DashboardLayout({ children }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isVerificationPage = pathname?.endsWith("/verification");

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    const role = user.role.toLowerCase();
    const isApproved = user.status === "approved";

    if (!isApproved && !isVerificationPage) {
      router.replace(`/${role}/verification`);
    }

    if (isApproved && isVerificationPage) {
      router.replace(`/${role}`);
    }
  }, [isLoading, isAuthenticated, user, isVerificationPage, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Unauthenticated — redirect to signin is handled elsewhere
  if (!isAuthenticated) return null;

  // Approved user trying to access verification — redirect pending
  if (user.status === "approved" && isVerificationPage) return null;

  // Unapproved user trying to access dashboard — redirect pending
  if (user.status !== "approved" && !isVerificationPage) return null;
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#F9FAFB] p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
