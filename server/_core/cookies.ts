import type { CookieOptions, Request } from "express";

type SecurityCookieOptions = Pick<
  CookieOptions,
  "httpOnly" | "path" | "sameSite" | "secure"
>;

export function getSessionCookieOptions(_req: Request): SecurityCookieOptions {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
  };
}

export function getOAuthStateCookieOptions(
  _req: Request
): SecurityCookieOptions {
  return {
    httpOnly: true,
    path: "/api/oauth",
    sameSite: "lax",
    secure: true,
  };
}
