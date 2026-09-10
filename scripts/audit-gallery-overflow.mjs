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
  if (!clicked) {
    throw new Error("Visible 3D GALLERY navigation control missing");
  }
  await waitForEval(cdp, `location.pathname.endsWith('/gallery')`, 80, 100);
  await waitForEval(cdp, `!!document.querySelector('.trai-v54-grid')`, 80, 100);
  await sleep(650);

  const report = await cdp.eval(`(async () => {
    const grid = document.querySelector('.trai-v54-grid');
    const hologram = document.querySelector('.trai-v54-hologram');
    if (!grid || !hologram) return { missing: true };

    const root = document.documentElement;
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const round = value => Number(value.toFixed(2));
    const rectOf = element => {
      const rect = element.getBoundingClientRect();
      return {
        left: round(rect.left),
        right: round(rect.right),
        top: round(rect.top),
        bottom: round(rect.bottom),
        width: round(rect.width),
        height: round(rect.height)
      };
    };
    const scrollState = async () => {
      const startY = window.scrollY;
      window.scrollTo(200, startY);
      await wait(40);
      const forcedScrollX = window.scrollX;
      window.scrollTo(0, startY);
      await wait(40);
      return {
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
        innerWidth: window.innerWidth,
        overflow: Math.max(0, root.scrollWidth - root.clientWidth),
        forcedScrollX
      };
    };
    const snapshot = () => {
      const gridStyle = getComputedStyle(grid);
      const hologramStyle = getComputedStyle(hologram);
      return {
        root: {
          clientWidth: root.clientWidth,
          scrollWidth: root.scrollWidth,
          innerWidth: window.innerWidth,
          bodyWidth: round(document.body?.getBoundingClientRect().width || 0)
        },
        hologram: {
          rect: rectOf(hologram),
          computedWidth: hologramStyle.width,
          computedRight: hologramStyle.right,
          computedLeft: hologramStyle.left,
          contain: hologramStyle.contain,
          overflowX: hologramStyle.overflowX,
          clipPath: hologramStyle.clipPath,
          perspective: hologramStyle.perspective,
          inlineWidth: hologram.style.width || null,
          inlineRight: hologram.style.right || null
        },
        grid: {
          rect: rectOf(grid),
          width: gridStyle.width,
          height: gridStyle.height,
          animationName: gridStyle.animationName,
          backgroundImage: gridStyle.backgroundImage,
          contain: gridStyle.contain,
          overflowX: gridStyle.overflowX,
          clipPath: gridStyle.clipPath,
          transform: gridStyle.transform
        }
      };
    };
    const trial = async (name, apply) => {
      const gridCss = grid.style.cssText;
      const hologramCss = hologram.style.cssText;
      window.scrollTo(0, 0);
      await wait(60);
      apply();
      await wait(100);
      const state = await scrollState();
      const geometry = snapshot();
      grid.style.cssText = gridCss;
      hologram.style.cssText = hologramCss;
      await wait(100);
      return { name, state, geometry };
    };

    window.scrollTo(0, 0);
    await wait(120);
    const baselineGeometry = snapshot();
    const baselineScroll = await scrollState();

    const candidates = [];
    if (baselineScroll.overflow > 1 || baselineScroll.forcedScrollX > 1) {
      candidates.push(await trial('hide-grid', () => {
        grid.style.display = 'none';
      }));
      candidates.push(await trial('grid-no-transform', () => {
        grid.style.animation = 'none';
        grid.style.transform = 'translate(-50%, -50%)';
      }));
      candidates.push(await trial('grid-contain-paint', () => {
        grid.style.contain = 'paint';
      }));
      candidates.push(await trial('grid-clip-path', () => {
        grid.style.clipPath = 'inset(0)';
      }));
      candidates.push(await trial('hologram-clip-path', () => {
        hologram.style.clipPath = 'inset(0)';
      }));
      candidates.push(await trial('hologram-overflow-hidden', () => {
        hologram.style.overflow = 'hidden';
      }));
      candidates.push(await trial('hologram-no-perspective', () => {
        hologram.style.perspective = 'none';
      }));
      candidates.push(await trial('grid-overflow-hidden', () => {
        grid.style.overflow = 'hidden';
      }));
    }

    const samples = [];
    let maxOverflow = 0;
    let maxForcedScrollX = 0;
    const maxHeight = Math.min(
      Math.max(root.scrollHeight, document.body?.scrollHeight || 0),
      24000
    );
    const step = Math.max(240, Math.floor(window.innerHeight * .55));
    for (let y = 0; y <= maxHeight; y += step) {
      window.scrollTo(0, y);
      await wait(70);
      const overflow = Math.max(0, root.scrollWidth - root.clientWidth);
      const forced = await scrollState();
      maxOverflow = Math.max(maxOverflow, overflow);
      maxForcedScrollX = Math.max(maxForcedScrollX, forced.forcedScrollX);
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
                className:
                  typeof element.className === 'string' ? element.className : null,
                rect: {
                  left: round(rect.left),
                  right: round(rect.right),
                  width: round(rect.width)
                },
                position: style.position,
                width: style.width,
                maxWidth: style.maxWidth,
                overflowX: style.overflowX,
                contain: style.contain,
                clipPath: style.clipPath,
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
        forcedScrollX: forced.forcedScrollX,
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
        innerWidth: window.innerWidth,
        bodyWidth: round(document.body?.getBoundingClientRect().width || 0),
        hologramRect: rectOf(hologram),
        hologramInlineWidth: hologram.style.width || null,
        offenders
      });
    }

    window.scrollTo(0, 0);
    await wait(120);
    const finalScroll = await scrollState();
    const finalGeometry = snapshot();

    return {
      missing: false,
      baselineScroll,
      baselineGeometry,
      candidates,
      maxOverflow,
      maxForcedScrollX,
      finalOverflow: finalScroll.overflow,
      finalForcedScrollX: finalScroll.forcedScrollX,
      samples,
      finalGeometry
    };
  })()`);

  await fs.writeFile(
    "peoples-gallery-overflow-audit.json",
    JSON.stringify(report, null, 2)
  );
  console.log(`PEOPLES_GALLERY_DIAGNOSTICS=${JSON.stringify(report)}`);

  if (report.missing) {
    throw new Error("TRAI hologram/grid contract missing on gallery");
  }
  if (
    report.maxOverflow > 1 ||
    report.maxForcedScrollX > 1 ||
    report.finalOverflow > 1 ||
    report.finalForcedScrollX > 1
  ) {
    throw new Error(
      `Gallery horizontal overflow regression: ${JSON.stringify(report)}`
    );
  }

  const visual = report.finalGeometry;
  if (!visual.grid.animationName.includes("v54-grid-drift")) {
    throw new Error(
      `TRAI grid animation contract changed: ${visual.grid.animationName}`
    );
  }
  if (
    !visual.hologram.contain.includes("paint") ||
    visual.hologram.overflowX !== "clip"
  ) {
    throw new Error(
      `TRAI hologram containment contract missing: ${JSON.stringify(visual.hologram)}`
    );
  }

  console.log("PEOPLES_GALLERY_OVERFLOW=PASS");
} finally {
  cdp.close();
}
