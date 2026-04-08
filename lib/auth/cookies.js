import { serialize } from "cookie";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: "lax",
  path: "/",
};

export const ACCESS_COOKIE = "dispatch_access";

export function setAuthCookies(response, accessToken) {
  const accessCookie = serialize(ACCESS_COOKIE, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60, // 1 hour
  });

  response.headers.append("Set-Cookie", accessCookie);

  return response;
}

export function clearAuthCookies(response) {
  const clearAccess = serialize(ACCESS_COOKIE, "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });

  response.headers.append("Set-Cookie", clearAccess);

  return response;
}
