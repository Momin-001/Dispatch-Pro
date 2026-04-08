'use client';
import { usePathname } from "next/navigation";
import { AuthLayoutComponent } from "@/components/guest/Auth/Auth-Layout";

export default function AuthLayout({ children }) {
    const pathname = usePathname();

 const authData = {
    '/signin': {
      title: "Welcome Back to Your Command Center",
      subtitle:
        "Manage your loads, track shipments, and optimize logistics operations all in one place.",
      features: [
        "Real-time load tracking & updates",
        "Instant communication with dispatch",
        "Secure document management",
      ],
    },
    '/forget-password': {
      title: "Forgot Your Password?",
      subtitle:
        "No worries! We'll send you reset instructions to get you back on the road.",
      features: [
        "Quick & secure password reset",
        "Email verification for security",
        "Back to work in minutes",
      ],
    },
    '/set-password': {
      title: "Set Your Password",
      subtitle:
        "Create a secure password to activate your DispatchPro account.",
      features: [
        "Secure password creation",
        "One-time setup link",
        "Get started in minutes",
      ],
    },
  }

  const page = authData[pathname] || authData['/signin'];

    return (
        <AuthLayoutComponent title={page.title} subtitle={page.subtitle} features={page.features}>
            {children}
        </AuthLayoutComponent>
    )
}