#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";

const sleep = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

// This harness talks only to the loopback services started by the Pages
// workflow. Keeping its network target and output locations closed prevents a
// caller from turning the audit into an SSRF or arbitrary-file-write surface.
const cdpEndpoint = "http://127.0.0.1:9222";
const baseUrl = new URL("http://127.0.0.1:4173/peoples-portfolio/");
const reportPath = "peoples-browser-audit.json";
const captureDirectory = "peoples-browser-captures";
const capturePaths = Object.freeze({
  "desktop-home": "peoples-browser-captures/desktop-home.png",
  "mobile-hk": "peoples-browser-captures/mobile-hk.png",
  "desktop-gallery-search":
    "peoples-browser-captures/desktop-gallery-search.png",
});

const routes = [
  {
    path: "materials",
    required: [
      "MATERIAL SCIENCE",
      "Bio-derived multifunctional composites for self-powered sensing",
      "integrated performance remains unvalidated",
      "ILLUSTRATIVE COUPLING GRAPH",
    ],
  },
  {
    path: "community",
    required: [
      "COMMUNITY IMPACT",
      "walk-in services are not yet operating",
      "SPAN planning projections",
      "DETERMINISTIC H.K. TRIAGE",
    ],
  },
  {
    path: "research",
    required: [
      "RESEARCH LAB",
      "Preprint — Not peer reviewed",
      "No system-level performance data are reported",
    ],
  },
  {
    path: "gallery",
    required: [
      "PROJECT GALLERY",
      "PUBLIC WORK",
      "EVIDENCE STATE",
      "Planned model · not operating",
    ],
  },
  {
    path: "timeline",
    required: [
      "FOUNDER JOURNEY",
      "public, human-authorized cybersecurity interface demo",
      "It is not yet operating",
      "seven independently viable, mutually reinforcing organs",
    ],
  },
];

const viewports = [
  { name: "desktop", width: 1440, height: 1000, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];

const report = {
  baseUrl: baseUrl.href,
  startedAt: new Date().toISOString(),
  checks: [],
  failures: [],
  runtimeIssues: [],
};

let socket;
let sequence = 0;
let activeCheck = "startup";
const pending = new Map();
const requestUrls = new Map();

function recordFailure(check, message, detail) {
  const failure = { check, message };
  if (detail !== undefined) failure.detail = detail;
  report.failures.push(failure);
}

function sameOrigin(url) {
  try {
    return new URL(url).origin === baseUrl.origin;
  } catch {
    return false;
  }
}

function connectSocket(webSocketDebuggerUrl) {
  socket = new WebSocket(webSocketDebuggerUrl);
  socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const waiter = pending.get(message.id);
      if (!waiter) return;
      pending.delete(message.id);
      if (message.error)
        waiter.reject(new Error(JSON.stringify(message.error)));
      else waiter.resolve(message.result);
      return;
    }

    const { method, params = {} } = message;
    if (method === "Network.requestWillBeSent") {
      requestUrls.set(params.requestId, params.request?.url || "");
    } else if (method === "Network.responseReceived") {
      const status = Number(params.response?.status || 0);
      const url = params.response?.url || "";
      if (status >= 400 && sameOrigin(url)) {
        report.runtimeIssues.push({
          check: activeCheck,
          type: "http",
          status,
          url,
        });
      }
    } else if (method === "Network.loadingFailed") {
      const url = requestUrls.get(params.requestId) || "";
      const reason = params.errorText || "unknown";
      if (
        sameOrigin(url) &&
        !params.canceled &&
        !/ERR_ABORTED|blocked by client/i.test(reason)
      ) {
        report.runtimeIssues.push({
          check: activeCheck,
          type: "network",
          reason,
          url,
        });
      }
    } else if (method === "Runtime.exceptionThrown") {
      report.runtimeIssues.push({
        check: activeCheck,
        type: "exception",
        detail:
          params.exceptionDetails?.exception?.description ||
          params.exceptionDetails?.text ||
          "Runtime exception",
      });
    } else if (
      method === "Runtime.consoleAPICalled" &&
      params.type === "error"
    ) {
      report.runtimeIssues.push({
        check: activeCheck,
        type: "console.error",
        detail: (params.args || [])
          .map(argument => argument.value ?? argument.description ?? "")
          .join(" ")
          .slice(0, 1000),
      });
    }
  });
  return new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
}

function send(method, params = {}) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result?.exceptionDetails) {
    throw new Error(
      result.exceptionDetails.exception?.description ||
        result.exceptionDetails.text ||
        "Evaluation failed"
    );
  }
  return result?.result?.value;
}

async function waitFor(description, expression, timeout = 12000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return;
    await sleep(125);
  }
  throw new Error(`Timed out waiting for ${description}`);
}

async function setViewport(viewport) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });
  await send(
    "Emulation.setTouchEmulationEnabled",
    viewport.mobile ? { enabled: true, maxTouchPoints: 5 } : { enabled: false }
  );
}

async function navigate(path) {
  const url = new URL(path ? `${path}/` : "", baseUrl).href;
  const result = await send("Page.navigate", { url });
  if (result?.errorText)
    throw new Error(`Navigation failed: ${result.errorText}`);
  await waitFor(
    `React route ${path || "/"}`,
    `document.readyState === "complete" &&
      (document.getElementById("root")?.childElementCount || 0) > 0 &&
      (document.body?.innerText || "").length > 40`
  );
  await sleep(450);
}

async function visibleButton(label) {
  return evaluate(`(() => {
    const button = [...document.querySelectorAll("button")].find(candidate =>
      candidate.textContent?.trim() === ${JSON.stringify(label)} &&
      candidate.getClientRects().length > 0
    );
    return Boolean(button);
  })()`);
}

async function clickButton(label) {
  const clicked = await evaluate(`(() => {
    const button = [...document.querySelectorAll("button")].find(candidate =>
      candidate.textContent?.trim() === ${JSON.stringify(label)} &&
      candidate.getClientRects().length > 0
    );
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`Visible button not found: ${label}`);
}

async function visibleDialog(label) {
  return evaluate(`Boolean(
    document.querySelector('[role="dialog"][aria-label=${JSON.stringify(label)}]')
      ?.getClientRects().length
  )`);
}

async function sweepPage() {
  return evaluate(`(async () => {
    let maxOverflow = 0;
    const limit = Math.min(
      Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0),
      24000
    );
    const step = Math.max(360, Math.floor(window.innerHeight * 0.78));
    for (let y = 0; y <= limit; y += step) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 40));
      maxOverflow = Math.max(
        maxOverflow,
        document.documentElement.scrollWidth - window.innerWidth,
        (document.body?.scrollWidth || 0) - window.innerWidth
      );
    }
    window.scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 100));
    return maxOverflow;
  })()`);
}

async function snapshot() {
  const raw = await evaluate(`JSON.stringify((() => {
    const overflow = Math.max(
      0,
      document.documentElement.scrollWidth - window.innerWidth,
      (document.body?.scrollWidth || 0) - window.innerWidth
    );
    const overflowElements = [...document.querySelectorAll("body *")]
      .map(node => {
        const rect = node.getBoundingClientRect();
        return {
          tag: node.tagName,
          className: typeof node.className === "string" ? node.className.slice(0, 180) : "",
          text: (node.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 100),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width)
        };
      })
      .filter(item => item.right > window.innerWidth + 2 || item.left < -2)
      .sort((a, b) =>
        Math.max(b.right - window.innerWidth, -b.left) -
        Math.max(a.right - window.innerWidth, -a.left)
      )
      .slice(0, 12);
    return {
      url: location.href,
      title: document.title,
      text: (document.body?.innerText || "").slice(0, 60000),
      rootChildren: document.getElementById("root")?.childElementCount || 0,
      h1: [...document.querySelectorAll("h1")]
        .map(node => node.innerText.trim())
        .filter(Boolean),
      overflow,
      overflowElements,
      brokenImages: [...document.images]
        .filter(image => image.complete && image.naturalWidth === 0)
        .map(image => ({ src: image.currentSrc || image.src, alt: image.alt })),
      unbasedInternalLinks: [...document.querySelectorAll("a[href]")]
        .map(anchor => ({ raw: anchor.getAttribute("href"), resolved: anchor.href }))
        .filter(link => {
          if (!link.raw || !link.raw.startsWith("/")) return false;
          const resolved = new URL(link.resolved);
          return resolved.origin === location.origin &&
            !resolved.pathname.startsWith(${JSON.stringify(baseUrl.pathname)});
        }),
      errorOverlay: Boolean(
        document.querySelector("vite-error-overlay, #webpack-dev-server-client-overlay")
      ),
      applicationError: /Application error|Something went wrong|Unexpected Application Error/i
        .test(document.body?.innerText || "")
    };
  })())`);
  return JSON.parse(raw);
}

function validateSnapshot(check, page, required, sweptOverflow = 0) {
  if (page.rootChildren <= 0) recordFailure(check, "React root is empty");
  if (page.text.length < 120) {
    recordFailure(check, "Primary content is unexpectedly sparse", page.text);
  }
  for (const phrase of required) {
    if (!page.text.toLowerCase().includes(phrase.toLowerCase())) {
      recordFailure(check, `Required primary content missing: ${phrase}`, {
        h1: page.h1,
      });
    }
  }
  const overflow = Math.max(page.overflow, sweptOverflow);
  if (overflow > 2) {
    recordFailure(check, `Horizontal overflow: ${overflow}px`, {
      h1: page.h1,
      elements: page.overflowElements,
    });
  }
  if (page.brokenImages.length) {
    recordFailure(check, "Broken image content", page.brokenImages);
  }
  if (page.unbasedInternalLinks.length) {
    recordFailure(
      check,
      "Internal link escapes the configured Pages base",
      page.unbasedInternalLinks
    );
  }
  if (page.errorOverlay || page.applicationError) {
    recordFailure(check, "Application error surface is visible", {
      errorOverlay: page.errorOverlay,
      applicationError: page.applicationError,
    });
  }
}

async function capture(name) {
  const capturePath = capturePaths[name];
  if (!capturePath) throw new Error(`Unsupported capture name: ${name}`);
  const result = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  mkdirSync(captureDirectory, { recursive: true });
  writeFileSync(capturePath, result.data, "base64");
}

function completeCheck(check, page, issueStart, sweptOverflow = 0) {
  const routeIssues = report.runtimeIssues.slice(issueStart);
  if (routeIssues.length) {
    recordFailure(check, "Runtime or same-origin network errors", routeIssues);
  }
  report.checks.push({
    check,
    status: report.failures.some(failure => failure.check === check)
      ? "failed"
      : "passed",
    h1: page.h1,
    overflow: Math.max(page.overflow, sweptOverflow),
    images: page.brokenImages.length,
    runtimeIssues: routeIssues.length,
  });
}

async function auditRootDesktop() {
  const check = "desktop:/ user-paced intro";
  activeCheck = check;
  const issueStart = report.runtimeIssues.length;
  await setViewport(viewports[0]);
  await navigate("");

  const introLabel = "Peoples Portfolio cinematic introduction";
  if (!(await visibleDialog(introLabel))) {
    recordFailure(check, "Cinematic intro did not appear");
  }
  if (!(await visibleButton("Skip intro"))) {
    recordFailure(check, "Intro has no visible Skip intro control");
  }
  const initialStep = await evaluate(`JSON.stringify({
    step: document.querySelector('[role="dialog"]')?.getAttribute('data-peoples-intro-step'),
    text: document.querySelector('[role="dialog"]')?.innerText || ""
  })`);
  await sleep(3000);
  const heldStep = await evaluate(`JSON.stringify({
    step: document.querySelector('[role="dialog"]')?.getAttribute('data-peoples-intro-step'),
    text: document.querySelector('[role="dialog"]')?.innerText || ""
  })`);
  if (!heldStep || heldStep !== initialStep) {
    recordFailure(check, "Intro advanced or changed without user input", {
      initialStep,
      heldStep,
    });
  }

  for (const label of [
    "Ignite the lattice",
    "Reveal TRAI",
    "Enter portfolio",
  ]) {
    await clickButton(label);
    await sleep(label === "Enter portfolio" ? 750 : 180);
  }
  await waitFor(
    "intro to close after explicit entry",
    `!document.querySelector('[role="dialog"][aria-label="${introLabel}"]')`
  );

  const sweptOverflow = await sweepPage();
  const page = await snapshot();
  validateSnapshot(
    check,
    page,
    [
      "JONATHAN PEOPLES",
      "one living Sovereignty Stack",
      "Mandate of Mistrust",
      "EIN obtained",
    ],
    sweptOverflow
  );
  await capture("desktop-home");
  completeCheck(check, page, issueStart, sweptOverflow);
}

async function auditRootMobileAndHk() {
  const check = "mobile:/ intro, H.K., focus";
  activeCheck = check;
  const issueStart = report.runtimeIssues.length;
  await setViewport(viewports[1]);
  await evaluate("sessionStorage.clear()");
  await navigate("");

  const introLabel = "Peoples Portfolio cinematic introduction";
  if (!(await visibleDialog(introLabel))) {
    recordFailure(check, "Mobile cinematic intro did not appear");
  }
  if (!(await visibleButton("Skip intro"))) {
    recordFailure(check, "Mobile Skip intro control is missing");
  }
  const stepBefore = await evaluate(
    `document.querySelector('[role="dialog"]')?.getAttribute('data-peoples-intro-step')`
  );
  await sleep(1800);
  const stepAfter = await evaluate(
    `document.querySelector('[role="dialog"]')?.getAttribute('data-peoples-intro-step')`
  );
  if (!stepAfter || stepAfter !== stepBefore) {
    recordFailure(check, "Mobile intro advanced without user input", {
      stepBefore,
      stepAfter,
    });
  }
  await clickButton("Skip intro");
  await waitFor(
    "mobile intro to close",
    `!document.querySelector('[role="dialog"][aria-label="${introLabel}"]')`
  );

  const opened = await evaluate(`(() => {
    const launcher = document.querySelector('button[aria-label="Open H.K. Assistant"]');
    if (!launcher || !launcher.getClientRects().length) return false;
    launcher.click();
    return true;
  })()`);
  if (!opened) {
    recordFailure(check, "Named H.K. launcher is missing or not visible");
  } else {
    await waitFor(
      "H.K. dialog",
      `Boolean(document.querySelector('[role="dialog"][aria-label="H.K. portfolio assistant"]')?.getClientRects().length)`
    );
    await sleep(150);
    const hk = JSON.parse(
      await evaluate(`JSON.stringify((() => {
        const dialog = document.querySelector('[role="dialog"][aria-label="H.K. portfolio assistant"]');
        const rect = dialog.getBoundingClientRect();
        return {
          text: dialog.innerText,
          rect: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom },
          focusInside: dialog.contains(document.activeElement),
          activeLabel: document.activeElement?.getAttribute('aria-label') || ""
        };
      })())`)
    );
    if (!/verified public record/i.test(hk.text)) {
      recordFailure(check, "H.K. does not expose its evidence boundary");
    }
    if (!hk.focusInside) {
      recordFailure(
        check,
        "Focus did not enter the H.K. dialog",
        hk.activeLabel
      );
    }
    if (
      hk.rect.left < -1 ||
      hk.rect.right > viewports[1].width + 1 ||
      hk.rect.top < -1 ||
      hk.rect.bottom > viewports[1].height + 1
    ) {
      recordFailure(check, "H.K. dialog exceeds the mobile viewport", hk.rect);
    }

    const entered = await evaluate(`(() => {
      const input = document.querySelector('input[aria-label="Ask H.K. about the portfolio"]');
      if (!input) return false;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      setter?.call(input, 'Is TechBridge operating?');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    })()`);
    if (!entered) recordFailure(check, "H.K. input is missing");
    await sleep(100);
    const sent = await evaluate(`(() => {
      const button = document.querySelector('button[aria-label="Send message to H.K."]');
      if (!button || button.disabled) return false;
      button.click();
      return true;
    })()`);
    if (!sent) {
      recordFailure(check, "H.K. message could not be submitted");
    } else {
      await waitFor(
        "bounded H.K. response",
        `/Designed · not yet operating/i.test(document.querySelector('[role="dialog"][aria-label="H.K. portfolio assistant"]')?.innerText || "")`
      );
    }
    await capture("mobile-hk");

    await send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "Escape",
      code: "Escape",
      windowsVirtualKeyCode: 27,
    });
    await send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key: "Escape",
      code: "Escape",
      windowsVirtualKeyCode: 27,
    });
    await waitFor(
      "H.K. dialog to close with Escape",
      `!document.querySelector('[role="dialog"][aria-label="H.K. portfolio assistant"]')`
    );
    await sleep(100);
    const focusReturned = await evaluate(
      `document.activeElement?.getAttribute("aria-label") === "Open H.K. Assistant"`
    );
    if (!focusReturned) {
      recordFailure(check, "Focus did not return to the H.K. launcher");
    }
  }

  const sweptOverflow = await sweepPage();
  const page = await snapshot();
  validateSnapshot(
    check,
    page,
    ["JONATHAN PEOPLES", "one living Sovereignty Stack"],
    sweptOverflow
  );
  completeCheck(check, page, issueStart, sweptOverflow);
}

async function auditGalleryInteraction(check) {
  const searched = await evaluate(`(() => {
    const input = document.querySelector('input[aria-label="Search projects"]');
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    setter?.call(input, 'TechBridge');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  if (!searched) {
    recordFailure(check, "Gallery search control is missing");
    return;
  }
  await waitFor(
    "gallery search result",
    `/Showing\\s+1\\s+of\\s+6/i.test(document.body?.innerText || "")`
  );
  const text = await evaluate("document.body?.innerText || ''");
  if (
    !/TechBridge Collective/i.test(text) ||
    !/not yet operating/i.test(text)
  ) {
    recordFailure(
      check,
      "Gallery search did not expose bounded TechBridge result"
    );
  }
  await capture("desktop-gallery-search");
}

async function auditRoute(route, viewport) {
  const check = `${viewport.name}:/${route.path}`;
  activeCheck = check;
  const issueStart = report.runtimeIssues.length;
  await setViewport(viewport);
  await navigate(route.path);

  if (await visibleDialog("Peoples Portfolio cinematic introduction")) {
    recordFailure(check, "Root cinematic intro blocked a direct route");
  }
  const sweptOverflow = await sweepPage();
  let page = await snapshot();
  validateSnapshot(check, page, route.required, sweptOverflow);

  if (route.path === "gallery" && viewport.name === "desktop") {
    await auditGalleryInteraction(check);
    page = await snapshot();
  }
  completeCheck(check, page, issueStart, sweptOverflow);
}

async function main() {
  let target;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const targets = await fetch(`${cdpEndpoint}/json`).then(response => {
      if (!response.ok) {
        throw new Error(`CDP target request failed: ${response.status}`);
      }
      return response.json();
    });
    target = targets.find(
      candidate => candidate.type === "page" && candidate.webSocketDebuggerUrl
    );
    if (target) break;
    await sleep(250);
  }
  if (!target?.webSocketDebuggerUrl) {
    throw new Error("Browser page target not found");
  }

  await connectSocket(target.webSocketDebuggerUrl);
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");

  await auditRootDesktop();
  await auditRootMobileAndHk();
  for (const viewport of viewports) {
    for (const route of routes) await auditRoute(route, viewport);
  }

  const apiLeaks = [...requestUrls.values()].filter(url =>
    /\/api\/trpc/.test(url)
  );
  if (apiLeaks.length) {
    recordFailure(
      "static runtime",
      "Static build attempted server-only tRPC requests",
      apiLeaks
    );
  }

  report.finishedAt = new Date().toISOString();
  report.summary = {
    checks: report.checks.length,
    passed: report.checks.filter(check => check.status === "passed").length,
    failed: report.failures.length,
    runtimeIssues: report.runtimeIssues.length,
  };
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(report.summary));

  if (report.failures.length) {
    console.error(JSON.stringify(report.failures, null, 2));
    process.exitCode = 1;
  }
  socket.close();
}

main().catch(error => {
  report.finishedAt = new Date().toISOString();
  recordFailure(
    activeCheck,
    "Audit process failed",
    String(error?.stack || error)
  );
  report.summary = {
    checks: report.checks.length,
    passed: report.checks.filter(check => check.status === "passed").length,
    failed: report.failures.length,
    runtimeIssues: report.runtimeIssues.length,
  };
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.error(error);
  process.exitCode = 1;
});
