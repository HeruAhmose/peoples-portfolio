import express, { type Express, type Request } from "express";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import { isIP } from "node:net";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

const HTML_SHELL_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const HTML_SHELL_RATE_LIMIT_MAX_REQUESTS = 120;

function getHtmlShellRateLimitKey(req: Request): string {
  if (process.env.RENDER === "true") {
    const renderClientIp = req.get("cf-connecting-ip")?.trim();

    if (renderClientIp && isIP(renderClientIp)) {
      return ipKeyGenerator(renderClientIp);
    }
  }

  const requestIp = req.ip?.trim();

  if (requestIp && isIP(requestIp)) {
    return ipKeyGenerator(requestIp);
  }

  return "unknown-client";
}

const htmlShellRateLimiter = rateLimit({
  windowMs: HTML_SHELL_RATE_LIMIT_WINDOW_MS,
  limit: HTML_SHELL_RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: getHtmlShellRateLimitKey,
  message: "Too many page requests; please try again shortly.",
});

export async function setupVite(app: Express, server: Server) {
  const configuredServer =
    viteConfig && typeof viteConfig === "object" && "server" in viteConfig
      ? viteConfig.server
      : undefined;

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: {
      ...(configuredServer ?? {}),
      middlewareMode: true,
      hmr: { server },
    },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use(htmlShellRateLimiter);
  app.use(async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // Always reload index.html so development edits are reflected immediately.
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      next(error);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));
  app.use(htmlShellRateLimiter);

  // Fall through to index.html if the file does not exist.
  app.use((_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
