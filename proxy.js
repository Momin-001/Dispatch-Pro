import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { parse } from "cookie";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";
import { ROLE_DASHBOARD_MAP, ROLE_API_MAP } from "@/lib/helpers";
import { JWT_SECRET } from "@/lib/constants";

const AUTH_ROUTES = ["/signin", "/forget-password", "/set-password"];

const DASHBOARD_ROUTES = ["/admin", "/driver", "/dispatcher", "/shipper", "/owner_operator"];

async function verifyAccessToken(token) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  let user = null;
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    user = await verifyAccessToken(token);
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies[ACCESS_COOKIE];
  if (token) {
    user = await verifyAccessToken(token);
  }

  const isDashboardRoute = DASHBOARD_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isApiRoute = pathname.startsWith("/api");

  // =========================
  // 🔐 API ROUTE PROTECTION
  // =========================

  if (isApiRoute) {
    // Not logged in
    if (!user) {
      return NextResponse.json({ message: "Unauthorized or Session Expired. Please log in to continue." }, { status: 401 });
    }

    // Check role-based API access
    const allowedApiPrefix = ROLE_API_MAP[user.role];

    if (allowedApiPrefix && !pathname.startsWith(allowedApiPrefix)) {
      return NextResponse.json({ message: "Forbidden: You don't have access to this resource" }, { status: 403 });
    }
    return NextResponse.next();
  }

  // =========================
  // 🔐 DASHBOARD ROUTE PROTECTION
  // =========================

  // Protected dashboard routes — redirect to signin if not authenticated
  if (isDashboardRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("reason", "unauthorized");
    return NextResponse.redirect(url);
  }

  // Dashboard route — block if user tries to access another role's dashboard
  if (isDashboardRoute && user) {
    const dashboardRoute = ROLE_DASHBOARD_MAP[user.role];
    if (dashboardRoute && !pathname.startsWith(dashboardRoute)) {
      const url = request.nextUrl.clone();
      url.pathname = dashboardRoute;
      return NextResponse.redirect(url);
    }
  }

  // Auth pages — redirect to dashboard if already logged in
  if (isAuthRoute && user) {
    const dashboardRoute = ROLE_DASHBOARD_MAP[user.role] || "/";
    const url = request.nextUrl.clone();
    url.searchParams.delete("reason");
    url.pathname = dashboardRoute;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",

    "/driver/:path*",
    "/api/driver/:path*",

    "/dispatcher/:path*",
    "/api/dispatcher/:path*",

    "/shipper/:path*",
    "/api/shipper/:path*",

    "/owner_operator/:path*",
    "/api/owner_operator/:path*",

    "/api/verification/:path*",
    
    "/signin",
    "/forget-password",
    "/set-password",
  ],
};
