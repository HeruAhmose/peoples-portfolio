import type { CookieOptions, Request } from "express";

function isSecureRequest(req: Request): boolean {
  return process.env.NODE_ENV === "production" || req.protocol === "https";
}

type SecurityCookieOptions = Pick<
  CookieOptions,
  "httpOnly" | "path" | "sameSite" | "secure"
>;

export function getSessionCookieOptions(req: Request): SecurityCookieOptions {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: isSecureRequest(req),
  };
}

export function getOAuthStateCookieOptions(
  req: Request
): SecurityCookieOptions {
  return {
    httpOnly: true,
    path: "/api/oauth",
    sameSite: "lax",
    secure: isSecureRequest(req),
  };
}
