import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_COOKIE = "dispatch_access";

const AUTH_PAGES = ["/signin", "/forget-password", "/set-password"];

const DASHBOARD_PREFIXES = [
  "/admin",
  "/driver",
  "/dispatcher",
  "/shipper",
  "/owner_operator",
];

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  admin: "/admin",
  driver: "/driver",
  dispatcher: "/dispatcher",
  shipper: "/shipper",
  owner_operator: "/owner_operator",
};
const API_ROLE_PREFIXES: Record<string, string> = {
  admin: "/api/admin",
  driver: "/api/driver",
  dispatcher: "/api/dispatcher",
  shipper: "/api/shipper",
  owner_operator: "/api/owner_operator",
};

async function verifyAccessToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const user = token ? await verifyAccessToken(token) : null;

  const isDashboardRoute = DASHBOARD_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));

  const isApiRoute = pathname.startsWith("/api");

  // =========================
  // 🔐 API ROUTE PROTECTION
  // =========================
  if (isApiRoute) {
    // Not logged in
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check role-based API access
    const allowedApiPrefix = API_ROLE_PREFIXES[user.role];

    if (allowedApiPrefix && !pathname.startsWith(allowedApiPrefix)) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }
  // Protected dashboard routes — redirect to signin if not authenticated
  if (isDashboardRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // Dashboard route — block if user tries to access another role's dashboard
  if (isDashboardRoute && user) {
    const allowedPrefix = ROLE_DASHBOARD_MAP[user.role];
    if (allowedPrefix && !pathname.startsWith(allowedPrefix)) {
      const url = request.nextUrl.clone();
      url.pathname = allowedPrefix;
      return NextResponse.redirect(url);
    }
  }

  // Auth pages — redirect to dashboard if already logged in
  if (isAuthPage && user) {
    const dashboardPath = ROLE_DASHBOARD_MAP[user.role] || "/";
    const url = request.nextUrl.clone();
    url.pathname = dashboardPath;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/driver/:path*",
    "/dispatcher/:path*",
    "/shipper/:path*",
    "/owner_operator/:path*",
    "/signin",
    "/forget-password",
    "/set-password",
  ],
};
