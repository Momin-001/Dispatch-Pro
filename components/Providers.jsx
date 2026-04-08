"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth-context";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        {children}
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </ThemeProvider>
  );
}
