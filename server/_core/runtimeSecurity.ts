import { ENV } from "./env";
import { resolveTrustedOAuthOrigin } from "./trustedOrigins";

const MIN_SECRET_BYTES = 32;
const KNOWN_PLACEHOLDERS = new Set([
  "change-me-in-production",
  "changeme",
  "secret",
  "jwt-secret",
]);

function isLocalHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function validateFrontendUrl(raw: string): void {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("FRONTEND_URL must be an absolute URL");
  }

  if (url.username || url.password || url.search || url.hash) {
    throw new Error("FRONTEND_URL must not contain credentials, query parameters, or a fragment");
  }

  const isLocalHttp = url.protocol === "http:" && isLocalHostname(url.hostname);
  if (url.protocol !== "https:" && !isLocalHttp) {
    throw new Error("FRONTEND_URL must use HTTPS outside local development");
  }
}

export function validateRuntimeSecurityConfiguration(): void {
  if (!ENV.isProduction) return;

  const secret = ENV.cookieSecret.trim();
  if (
    Buffer.byteLength(secret, "utf8") < MIN_SECRET_BYTES ||
    KNOWN_PLACEHOLDERS.has(secret.toLowerCase())
  ) {
    throw new Error(
      `JWT_SECRET must be a non-placeholder secret of at least ${MIN_SECRET_BYTES} bytes in production`
    );
  }

  const oauthValues = [
    ENV.appId,
    ENV.oAuthServerUrl,
    ENV.oAuthPortalUrl,
    ENV.frontendUrl,
  ];
  const configuredOauthValues = oauthValues.filter(value => value.trim().length > 0);

  if (configuredOauthValues.length > 0 && configuredOauthValues.length !== oauthValues.length) {
    throw new Error(
      "OAuth requires VITE_APP_ID, OAUTH_SERVER_URL, VITE_OAUTH_PORTAL_URL, and FRONTEND_URL together"
    );
  }

  if (ENV.ownerOpenId && !ENV.appId) {
    throw new Error("OWNER_OPEN_ID requires VITE_APP_ID so admin sessions remain application-bound");
  }

  if (ENV.oAuthServerUrl) {
    resolveTrustedOAuthOrigin(ENV.oAuthServerUrl);
  }

  if (ENV.frontendUrl) {
    validateFrontendUrl(ENV.frontendUrl);
  }
}
