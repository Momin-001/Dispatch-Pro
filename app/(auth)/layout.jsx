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
    '/signup': {
      title: "Join the Future of Freight Management",
      subtitle:
        "Create your account and get instant access to our comprehensive logistics platform.",
      features: [
        "Free account - no credit card required",
        "Access to all platform features",
        "24/7 customer support",
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
  }

    return (
        <AuthLayoutComponent title={authData[pathname].title} subtitle={authData[pathname].subtitle} features={authData[pathname].features}>
            {children}
        </AuthLayoutComponent>
    )
}