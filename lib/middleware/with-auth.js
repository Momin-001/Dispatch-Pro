import { parse } from "cookie";
import { verifyToken } from "@/lib/auth/jwt";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";
import { errorResponse } from "@/lib/response.handle";

/**
 * Extracts and verifies the JWT from the request.
 * Checks Authorization header first (mobile), then falls back to cookie (web).
 * Returns the decoded payload or null.
 */
function extractUser(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    return verifyToken(token);
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies[ACCESS_COOKIE];
  if (token) {
    return verifyToken(token);
  }

  return null;
}

/**
 * Higher-order function that wraps an API route handler with authentication.
 * Attaches `request.user` with the decoded JWT payload ({ userId, role }).
 * Returns 401 if no valid token is found.
 */
export function withAuth(handler) {
  return async (request, context) => {
    const user = extractUser(request);

    if (!user) {
      return errorResponse("Session expired. Please log in again.", 401);
    }

    request.user = user;
    return handler(request, context);
  };
}
