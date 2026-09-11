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

  if (
    await cdp.eval(
      `!!document.querySelector('button[aria-label="Skip the opening sequence"]')`
    )
  ) {
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

  const transient = await cdp.eval(`(async () => {
    const root = document.documentElement;
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const round = value => Number(Number(value || 0).toFixed(2));
    const forceScrollX = async () => {
      const y = window.scrollY;
      window.scrollTo(200, y);
      await wait(8);
      const x = window.scrollX;
      window.scrollTo(0, y);
      await wait(8);
      return x;
    };
    const labelTarget = target => {
      try {
        if (target instanceof Element) {
          const cls = typeof target.className === 'string'
            ? target.className.trim().replace(/\\s+/g, '.')
            : '';
          return target.tagName.toLowerCase() + (target.id ? '#' + target.id : '') + (cls ? '.' + cls : '');
        }
        if (target?.element instanceof Element) {
          const element = target.element;
          return 'pseudo:' + String(target.pseudoElement || '') + ':' + element.tagName.toLowerCase();
        }
      } catch {}
      return target ? String(target) : null;
    };
    const viewTransitionAnimations = () => document.getAnimations({ subtree: true })
      .filter(animation => {
        const effect = animation.effect;
        const pseudo = effect?.pseudoElement || effect?.target?.pseudoElement || '';
        return String(pseudo).includes('view-transition');
      });
    const activeAnimations = () => document.getAnimations({ subtree: true })
      .filter(animation => animation.playState !== 'finished' && animation.playState !== 'idle')
      .map(animation => {
        const effect = animation.effect;
        const timing = effect?.getComputedTiming?.() || {};
        return {
          animationName: animation.animationName || null,
          playState: animation.playState,
          currentTime: round(animation.currentTime),
          duration: typeof timing.duration === 'number' ? round(timing.duration) : String(timing.duration || ''),
          target: labelTarget(effect?.target),
          pseudoElement: effect?.pseudoElement || effect?.target?.pseudoElement || null
        };
      })
      .filter(item =>
        item.animationName?.includes('trai') ||
        item.pseudoElement?.includes('view-transition') ||
        item.target?.includes('trai') ||
        item.target?.includes('aurora')
      );
    const pulseState = () => [...document.querySelectorAll('.trai-v5-internal-pulse')].map(element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        animationName: style.animationName,
        transform: style.transform,
        opacity: style.opacity,
        rect: {
          left: round(rect.left),
          right: round(rect.right),
          width: round(rect.width)
        }
      };
    });
    const offenders = () => [...document.querySelectorAll('body *')]
      .map(element => {
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return null;
        if (rect.right <= root.clientWidth + 1 && rect.left >= -1) return null;
        const style = getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') return null;
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id || null,
          className: typeof element.className === 'string' ? element.className.slice(0, 160) : null,
          left: round(rect.left),
          right: round(rect.right),
          width: round(rect.width),
          position: style.position,
          transform: style.transform
        };
      })
      .filter(Boolean)
      .slice(0, 30);
    const withHidden = async selector => {
      const nodes = [...document.querySelectorAll(selector)];
      const previous = nodes.map(node => ({
        node,
        value: node.style.getPropertyValue('display'),
        priority: node.style.getPropertyPriority('display')
      }));
      nodes.forEach(node => node.style.setProperty('display', 'none', 'important'));
      await wait(4);
      const x = await forceScrollX();
      previous.forEach(({ node, value, priority }) => {
        if (value) node.style.setProperty('display', value, priority);
        else node.style.removeProperty('display');
      });
      await wait(4);
      return { count: nodes.length, forcedScrollX: x };
    };

    const started = performance.now();
    const samples = [];
    let canceledViewTransition = false;
    for (let i = 0; i < 12; i++) {
      const forcedScrollX = await forceScrollX();
      const sample = {
        elapsed: round(performance.now() - started),
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
        overflow: Math.max(0, root.scrollWidth - root.clientWidth),
        forcedScrollX,
        traiV5Internal: root.dataset.traiV5Internal || null,
        pulses: pulseState(),
        animations: activeAnimations()
      };
      if (forcedScrollX > 1) {
        sample.offenders = offenders();
        sample.ab = {
          pulseHidden: await withHidden('.trai-v5-internal-pulse'),
          auroraHidden: await withHidden('.afro-aurora-veil'),
          hologramHidden: await withHidden('.trai-v54-hologram'),
          transitionHidden: await withHidden('.trai-v5-transition')
        };
        const pseudoAnimations = viewTransitionAnimations();
        if (!canceledViewTransition && pseudoAnimations.length > 0) {
          const names = pseudoAnimations.map(animation => animation.animationName || null);
          pseudoAnimations.forEach(animation => animation.cancel());
          canceledViewTransition = true;
          await wait(20);
          sample.ab.viewTransitionCanceled = {
            count: pseudoAnimations.length,
            names,
            forcedScrollX: await forceScrollX(),
            scrollWidth: root.scrollWidth,
            clientWidth: root.clientWidth
          };
        }
      }
      samples.push(sample);
      await wait(50);
    }
    return {
      samples,
      canceledViewTransition,
      maxOverflow: Math.max(...samples.map(item => item.overflow)),
      maxForcedScrollX: Math.max(...samples.map(item => item.forcedScrollX))
    };
  })()`);
  console.log(`PEOPLES_GALLERY_TRANSIENT_AUDIT=${JSON.stringify(transient)}`);

  await sleep(150);

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
    const measure = async () => {
      const y = window.scrollY;
      const scrollWidth = root.scrollWidth;
      const clientWidth = root.clientWidth;
      window.scrollTo(200, y);
      await wait(25);
      const forcedScrollX = window.scrollX;
      window.scrollTo(0, y);
      await wait(25);
      return {
        clientWidth,
        scrollWidth,
        overflow: Math.max(0, scrollWidth - clientWidth),
        forcedScrollX,
        gridRect: rectOf(grid)
      };
    };
    const animation = grid.getAnimations().find(item => {
      const name = getComputedStyle(grid).animationName;
      return name.includes('v54-grid-drift') && item.effect;
    });
    if (!animation) return { missingAnimation: true };

    const originalPlayState = animation.playState;
    const originalTime = animation.currentTime;
    animation.pause();
    const timing = animation.effect.getTiming();
    const duration = Number(timing.duration);
    const phases = [];
    for (let phase = 0; phase < duration; phase += 900) {
      animation.currentTime = phase;
      await wait(45);
      phases.push({ phase, ...(await measure()) });
    }

    if (originalTime !== null) animation.currentTime = originalTime;
    if (originalPlayState === 'running') animation.play();
    await wait(80);

    window.scrollTo(0, 0);
    const gridStyle = getComputedStyle(grid);
    const hologramStyle = getComputedStyle(hologram);
    return {
      missing: false,
      duration,
      phaseSweep: {
        phases,
        maxOverflow: Math.max(...phases.map(item => item.overflow)),
        maxForcedScrollX: Math.max(...phases.map(item => item.forcedScrollX))
      },
      geometry: {
        root: {
          clientWidth: root.clientWidth,
          scrollWidth: root.scrollWidth,
          innerWidth: window.innerWidth,
          bodyWidth: round(document.body?.getBoundingClientRect().width || 0)
        },
        hologram: {
          rect: rectOf(hologram),
          width: hologramStyle.width,
          contain: hologramStyle.contain,
          overflowX: hologramStyle.overflowX,
          inlineWidth: hologram.style.width || null,
          inlineRight: hologram.style.right || null
        },
        grid: {
          rect: rectOf(grid),
          width: gridStyle.width,
          height: gridStyle.height,
          animationName: gridStyle.animationName,
          contain: gridStyle.contain,
          backgroundImage: gridStyle.backgroundImage
        }
      }
    };
  })()`);

  const combined = { transient, ...report };
  await fs.writeFile(
    "peoples-gallery-overflow-audit.json",
    JSON.stringify(combined, null, 2)
  );
  console.log(`PEOPLES_GALLERY_PHASE_AUDIT=${JSON.stringify(report)}`);

  if (report.missing || report.missingAnimation) {
    throw new Error(
      `TRAI hologram/grid contract missing: ${JSON.stringify(report)}`
    );
  }
  if (
    transient.maxOverflow > 1 ||
    transient.maxForcedScrollX > 1 ||
    report.phaseSweep.maxOverflow > 1 ||
    report.phaseSweep.maxForcedScrollX > 1
  ) {
    throw new Error(
      `Gallery horizontal overflow regression: ${JSON.stringify(combined)}`
    );
  }
  if (!report.geometry.grid.animationName.includes("v54-grid-drift")) {
    throw new Error(
      `TRAI grid animation contract changed: ${report.geometry.grid.animationName}`
    );
  }
  if (
    !report.geometry.hologram.contain.includes("paint") ||
    report.geometry.hologram.overflowX !== "clip"
  ) {
    throw new Error(
      `TRAI hologram containment contract missing: ${JSON.stringify(report.geometry.hologram)}`
    );
  }
  if (!report.geometry.grid.contain.includes("paint")) {
    throw new Error(
      `TRAI grid paint containment missing: ${JSON.stringify(report.geometry.grid)}`
    );
  }
  if (
    report.geometry.grid.width !== "1296px" ||
    report.geometry.grid.height !== "1296px"
  ) {
    throw new Error(
      `TRAI grid geometry changed: ${JSON.stringify(report.geometry.grid)}`
    );
  }

  console.log("PEOPLES_GALLERY_OVERFLOW=PASS");
} finally {
  cdp.close();
}
