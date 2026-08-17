import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import {
  defineConfig,
  type Plugin,
  type PluginOption,
  type ViteDevServer,
} from "vite";

const PROJECT_ROOT = import.meta.dirname;
const DEV_LOG_DIR = path.join(PROJECT_ROOT, ".peoples-dev-logs");
const OBSERVER_SOURCE = path.join(
  PROJECT_ROOT,
  "tooling",
  "peoples-dev-observer.js"
);
const MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
const TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
const MAX_REQUEST_BYTES = 256 * 1024;
const OBSERVER_ENDPOINT = "/__peoples_dev__/telemetry";
const OBSERVER_SCRIPT = "/__peoples_dev__/observer.js";

type TelemetrySource = "console" | "network" | "session";

type TelemetryPayload = {
  version?: unknown;
  consoleLogs?: unknown;
  networkRequests?: unknown;
  sessionEvents?: unknown;
};

function ensureDevLogDir() {
  if (!fs.existsSync(DEV_LOG_DIR)) {
    fs.mkdirSync(DEV_LOG_DIR, { recursive: true });
  }
}

function trimLogFile(logPath: string) {
  try {
    if (
      !fs.existsSync(logPath) ||
      fs.statSync(logPath).size <= MAX_LOG_SIZE_BYTES
    ) {
      return;
    }

    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines: string[] = [];
    let keptBytes = 0;

    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}\n`, "utf-8");
      if (keptBytes + lineBytes > TRIM_TARGET_BYTES) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }

    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
    // Development telemetry is best-effort and must not affect app execution.
  }
}

function writeTelemetry(source: TelemetrySource, entries: unknown[]) {
  if (entries.length === 0) return;

  ensureDevLogDir();
  const logPath = path.join(DEV_LOG_DIR, `${source}.jsonl`);
  const lines = entries.map(entry =>
    JSON.stringify({ at: new Date().toISOString(), entry })
  );
  fs.appendFileSync(logPath, `${lines.join("\n")}\n`, "utf-8");
  trimLogFile(logPath);
}

function readTelemetryEntries(value: unknown): unknown[] {
  return Array.isArray(value) ? value.slice(0, 500) : [];
}

function handleTelemetryPayload(payload: TelemetryPayload) {
  writeTelemetry("console", readTelemetryEntries(payload.consoleLogs));
  writeTelemetry("network", readTelemetryEntries(payload.networkRequests));
  writeTelemetry("session", readTelemetryEntries(payload.sessionEvents));
}

function peoplesDevObserverPlugin(): Plugin {
  return {
    name: "peoples-dev-observer",

    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") return html;

      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: { src: OBSERVER_SCRIPT, defer: true },
            injectTo: "head",
          },
        ],
      };
    },

    configureServer(server: ViteDevServer) {
      server.middlewares.use(OBSERVER_SCRIPT, (req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") return next();

        try {
          const source = fs.readFileSync(OBSERVER_SOURCE, "utf-8");
          res.writeHead(200, {
            "Content-Type": "text/javascript; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
          });
          res.end(req.method === "HEAD" ? undefined : source);
        } catch (error) {
          server.config.logger.error(
            `Unable to serve Peoples dev observer: ${String(error)}`
          );
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Development observer unavailable");
        }
      });

      server.middlewares.use(OBSERVER_ENDPOINT, (req, res, next) => {
        if (req.method !== "POST") return next();

        let body = "";
        let receivedBytes = 0;
        let rejected = false;

        req.on("data", chunk => {
          if (rejected) return;
          const text = chunk.toString();
          receivedBytes += Buffer.byteLength(text, "utf-8");

          if (receivedBytes > MAX_REQUEST_BYTES) {
            rejected = true;
            res.writeHead(413, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: "Payload too large" }));
            return;
          }

          body += text;
        });

        req.on("end", () => {
          if (rejected) return;

          try {
            const parsed = JSON.parse(body) as unknown;
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
              throw new Error("Telemetry payload must be an object");
            }

            handleTelemetryPayload(parsed as TelemetryPayload);
            res.writeHead(200, {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
            });
            res.end(JSON.stringify({ success: true }));
          } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(error) }));
          }
        });
      });
    },
  };
}

function configuredDevHosts(): string[] {
  const extraHosts = (process.env.PEOPLES_VITE_ALLOWED_HOSTS ?? "")
    .split(",")
    .map(host => host.trim())
    .filter(Boolean);

  return Array.from(new Set(["localhost", "127.0.0.1", ...extraHosts]));
}

const isStaticPagesBuild = process.env.PEOPLES_STATIC_PAGES === "true";

const plugins: PluginOption[] = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  ...(isStaticPagesBuild ? [] : [peoplesDevObserverPlugin()]),
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("recharts")) return "recharts";
          if (id.includes("@tanstack/react-query")) return "query";
          if (id.includes("@trpc")) return "trpc";
          if (id.includes("@radix-ui")) return "radix";
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: configuredDevHosts(),
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
