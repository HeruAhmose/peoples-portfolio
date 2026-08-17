import {
  COOKIE_NAME,
  OAUTH_STATE_COOKIE_NAME,
  OAUTH_STATE_TTL_MS,
  ONE_YEAR_MS,
} from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import type { Express, Request, Response } from "express";
import { randomBytes, timingSafeEqual } from "node:crypto";
import * as db from "../db";
import {
  getOAuthStateCookieOptions,
  getSessionCookieOptions,
} from "./cookies";
import { ENV } from "./env";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

function getOAuthCallbackUrl(): string {
  if (!ENV.frontendUrl) {
    throw new Error("FRONTEND_URL is required for OAuth");
  }
  return new URL("/api/oauth/callback", ENV.frontendUrl).toString();
}

function getOAuthPortalUrl(): URL {
  if (!ENV.oAuthPortalUrl || !ENV.appId || !ENV.oAuthServerUrl) {
    throw new Error("OAuth runtime configuration is incomplete");
  }

  const portal = new URL(ENV.oAuthPortalUrl);
  const isLocalHttp =
    portal.protocol === "http:" &&
    ["localhost", "127.0.0.1", "::1"].includes(portal.hostname);
  if (
    (portal.protocol !== "https:" && !isLocalHttp) ||
    portal.username ||
    portal.password ||
    portal.search ||
    portal.hash
  ) {
    throw new Error("VITE_OAUTH_PORTAL_URL must be a trusted web origin");
  }

  return new URL("/app-auth", portal);
}

function statesMatch(expected: string | undefined, supplied: string): boolean {
  if (!expected) return false;
  const expectedBytes = Buffer.from(expected, "utf8");
  const suppliedBytes = Buffer.from(supplied, "utf8");
  return (
    expectedBytes.length === suppliedBytes.length &&
    timingSafeEqual(expectedBytes, suppliedBytes)
  );
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/login", (req: Request, res: Response) => {
    try {
      const state = randomBytes(32).toString("base64url");
      const redirectUri = getOAuthCallbackUrl();
      const portalUrl = getOAuthPortalUrl();

      portalUrl.searchParams.set("appId", ENV.appId);
      portalUrl.searchParams.set("redirectUri", redirectUri);
      portalUrl.searchParams.set("state", state);
      portalUrl.searchParams.set("type", "signIn");

      res.cookie(OAUTH_STATE_COOKIE_NAME, state, {
        ...getOAuthStateCookieOptions(req),
        maxAge: OAUTH_STATE_TTL_MS,
      });
      res.redirect(302, portalUrl.toString());
    } catch (error) {
      console.error("[OAuth] Login initialization failed", error);
      res.status(503).json({ error: "OAuth is not configured" });
    }
  });

  app.get(
    "/api/oauth/callback",
    async (req: Request, res: Response) => {
      const code = getQueryParam(req, "code");
      const state = getQueryParam(req, "state");
      const cookies = parseCookieHeader(req.headers.cookie ?? "");
      const expectedState = cookies[OAUTH_STATE_COOKIE_NAME];
      const stateCookieOptions = getOAuthStateCookieOptions(req);

      res.clearCookie(OAUTH_STATE_COOKIE_NAME, stateCookieOptions);

      if (!code || !state || !statesMatch(expectedState, state)) {
        res.status(400).json({ error: "Invalid OAuth callback state" });
        return;
      }

      try {
        const redirectUri = getOAuthCallbackUrl();
        const tokenResponse = await sdk.exchangeCodeForToken(code, redirectUri);
        const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

        if (!userInfo.openId) {
          res.status(400).json({ error: "openId missing from user info" });
          return;
        }

        await db.upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: new Date(),
        });

        const sessionToken = await sdk.createSessionToken(userInfo.openId, {
          name: userInfo.name || "",
          expiresInMs: ONE_YEAR_MS,
        });

        res.cookie(COOKIE_NAME, sessionToken, {
          ...getSessionCookieOptions(req),
          maxAge: ONE_YEAR_MS,
        });

        res.redirect(302, "/");
      } catch (error) {
        console.error("[OAuth] Callback failed", error);
        res.status(500).json({ error: "OAuth callback failed" });
      }
    }
  );
}
