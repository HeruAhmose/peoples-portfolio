import fs from "node:fs/promises";

const CDP_HTTP = "http://127.0.0.1:9222";
const BASE = "http://127.0.0.1:4173/peoples-portfolio/";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class CDP {
  constructor(url) {
    this.url = url;
    this.id = 0;
    this.pending = new Map();
  }
  async open() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", event => {
      const msg = JSON.parse(event.data);
      if (!msg.id || !this.pending.has(msg.id)) return;
      const waiter = this.pending.get(msg.id);
      this.pending.delete(msg.id);
      msg.error
        ? waiter.reject(new Error(JSON.stringify(msg.error)))
        : waiter.resolve(msg.result);
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      throw new Error(
        result.exceptionDetails.exception?.description ||
          result.exceptionDetails.text ||
          "Runtime.evaluate failed"
      );
    }
    return result.result.value;
  }
  close() {
    this.ws?.close();
  }
}

async function waitForEval(cdp, expression, attempts = 100, delay = 100) {
  for (let i = 0; i < attempts; i++) {
    if (await cdp.eval(expression)) return true;
    await sleep(delay);
  }
  throw new Error(`Timed out waiting for browser condition: ${expression}`);
}

const targets = await (await fetch(`${CDP_HTTP}/json/list`)).json();
const target = targets.find(item => item.type === "page");
if (!target?.webSocketDebuggerUrl) throw new Error("No Chrome page target");
const cdp = new CDP(target.webSocketDebuggerUrl);
await cdp.open();

try {
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await cdp.send("Page.navigate", { url: BASE });
  await waitForEval(
    cdp,
    `document.readyState === "complete" && (document.body?.innerText || "").length > 20`,
    120,
    100
  );
  await sleep(900);

  const skipPresent = await cdp.eval(
    `!!document.querySelector('button[aria-label="Skip the opening sequence"]')`
  );
  if (skipPresent) {
    await cdp.eval(
      `document.querySelector('button[aria-label="Skip the opening sequence"]')?.click(); true`
    );
  }
  await waitForEval(
    cdp,
    `!!document.querySelector('[data-peoples-sound]')`,
    80,
    100
  );

  const clicked = await cdp.eval(`(() => {
    const button = [...document.querySelectorAll('nav button')].find(node =>
      (node.textContent || '').includes('3D GALLERY') && node.getClientRects().length > 0
    );
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!clicked)
    throw new Error("Visible 3D GALLERY navigation control missing");
  await waitForEval(cdp, `location.pathname.endsWith('/gallery')`, 80, 100);
  await waitForEval(cdp, `!!document.querySelector('.trai-v54-grid')`, 80, 100);
  await sleep(650);

  const report = await cdp.eval(`(async () => {
    const grid = document.querySelector('.trai-v54-grid');
    const hologram = document.querySelector('.trai-v54-hologram');
    if (!grid || !hologram) return { missing: true };
    const gridStyle = getComputedStyle(grid);
    const hologramStyle = getComputedStyle(hologram);
    const samples = [];
    let maxOverflow = 0;
    const maxHeight = Math.min(
      Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0),
      24000
    );
    const step = Math.max(240, Math.floor(window.innerHeight * .55));
    for (let y = 0; y <= maxHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 70));
      const root = document.documentElement;
      const overflow = Math.max(0, root.scrollWidth - root.clientWidth);
      maxOverflow = Math.max(maxOverflow, overflow);
      const offenders = overflow > 1
        ? [...document.querySelectorAll('*')]
            .map((element, index) => {
              const rect = element.getBoundingClientRect();
              if (rect.right <= root.clientWidth + 1 && rect.left >= -1) return null;
              const style = getComputedStyle(element);
              return {
                index,
                tag: element.tagName,
                id: element.id || null,
                className: typeof element.className === 'string' ? element.className : null,
                rect: {
                  left: Number(rect.left.toFixed(2)),
                  right: Number(rect.right.toFixed(2)),
                  width: Number(rect.width.toFixed(2))
                },
                position: style.position,
                width: style.width,
                maxWidth: style.maxWidth,
                overflowX: style.overflowX,
                contain: style.contain,
                transform: style.transform
              };
            })
            .filter(Boolean)
            .sort((a, b) => {
              const excessA = Math.max(-a.rect.left, a.rect.right - root.clientWidth, 0);
              const excessB = Math.max(-b.rect.left, b.rect.right - root.clientWidth, 0);
              return excessB - excessA;
            })
            .slice(0, 12)
        : [];
      samples.push({
        y,
        overflow,
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
        innerWidth: window.innerWidth,
        bodyWidth: document.body?.getBoundingClientRect().width || 0,
        offenders
      });
    }
    window.scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 120));
    return {
      missing: false,
      maxOverflow,
      finalOverflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      samples,
      visual: {
        gridWidth: gridStyle.width,
        gridHeight: gridStyle.height,
        animationName: gridStyle.animationName,
        backgroundImage: gridStyle.backgroundImage,
        hologramOpacity: hologramStyle.opacity,
        hologramMixBlendMode: hologramStyle.mixBlendMode,
        contain: hologramStyle.contain,
        overflowX: hologramStyle.overflowX
      }
    };
  })()`);

  await fs.writeFile(
    "peoples-gallery-overflow-audit.json",
    JSON.stringify(report, null, 2)
  );

  if (report.missing)
    throw new Error("TRAI hologram/grid contract missing on gallery");
  if (report.maxOverflow > 1 || report.finalOverflow > 1) {
    throw new Error(
      `Gallery horizontal overflow regression: ${JSON.stringify(report)}`
    );
  }
  if (!report.visual.animationName.includes("v54-grid-drift")) {
    throw new Error(
      `TRAI grid animation contract changed: ${report.visual.animationName}`
    );
  }
  if (
    !report.visual.contain.includes("paint") ||
    report.visual.overflowX !== "clip"
  ) {
    throw new Error(
      `TRAI hologram containment contract missing: ${JSON.stringify(report.visual)}`
    );
  }

  console.log("PEOPLES_GALLERY_OVERFLOW=PASS");
  console.log(JSON.stringify(report));
} finally {
  cdp.close();
}
