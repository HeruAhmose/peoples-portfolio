import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { config as loadEnv } from "dotenv";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { createServer } from "http";
import net from "net";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { ENV } from "./env";
import { registerOAuthRoutes } from "./oauth";
import { validateRuntimeSecurityConfiguration } from "./runtimeSecurity";
import { serveStatic, setupVite } from "./vite";

loadEnv();
loadEnv({ path: ".env.local", override: true });

const API_BODY_LIMIT = "1mb";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

function applySecurityHeaders(
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), geolocation=(), microphone=(), payment=(), usb=()"
  );
  res.setHeader(
    "Content-Security-Policy",
    "base-uri 'self'; frame-ancestors 'none'; object-src 'none'"
  );
  if (ENV.isProduction) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000");
  }
  next();
}

const apiRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 180,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many API requests; please try again shortly.",
});

const assistantRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: req => !req.path.includes("hk.chat"),
  message: "Assistant request limit reached; please try again shortly.",
});

const inquiryRateLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: req => !req.path.includes("portfolio.submitInquiry"),
  message: "Inquiry request limit reached; please try again later.",
});

async function startServer() {
  validateRuntimeSecurityConfiguration();

  const app = express();
  const server = createServer(app);

  app.disable("x-powered-by");
  app.use(applySecurityHeaders);
  app.use(express.json({ limit: API_BODY_LIMIT }));
  app.use(
    express.urlencoded({
      limit: API_BODY_LIMIT,
      extended: true,
      parameterLimit: 100,
    })
  );
  app.use("/api", apiRateLimiter);

  registerOAuthRoutes(app);

  app.use("/api/trpc", assistantRateLimiter, inquiryRateLimiter);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(error => {
  console.error("Server startup failed", error);
  process.exitCode = 1;
});
