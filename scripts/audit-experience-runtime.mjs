import fs from "node:fs/promises";

const CDP_HTTP = process.env.PEOPLES_CDP_URL || "http://127.0.0.1:9222";
const BASE =
  process.env.PEOPLES_BASE_URL || "http://127.0.0.1:4173/peoples-portfolio/";
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
      if (msg.id && this.pending.has(msg.id)) {
        const pending = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error
          ? pending.reject(new Error(JSON.stringify(msg.error)))
          : pending.resolve(msg.result);
      }
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
      throw new Error(result.exceptionDetails.text || "evaluation failed");
    }
    return result.result.value;
  }
  close() {
    this.ws?.close();
  }
}

async function waitForEval(cdp, expression, attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    if (await cdp.eval(expression)) return true;
    await sleep(100);
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
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `(() => {
      const Native = window.AudioContext || window.webkitAudioContext;
      window.__peoplesAudioProbe = { contexts: 0, oscillators: 0 };
      if (Native) {
        const Wrapped = new Proxy(Native, {
          construct(Target, args) {
            const ctx = new Target(...args);
            window.__peoplesAudioProbe.contexts++;
            const nativeOscillator = ctx.createOscillator.bind(ctx);
            ctx.createOscillator = (...oscArgs) => {
              window.__peoplesAudioProbe.oscillators++;
              return nativeOscillator(...oscArgs);
            };
            return ctx;
          }
        });
        window.AudioContext = Wrapped;
        if (window.webkitAudioContext) window.webkitAudioContext = Wrapped;
      }
      const nativeRaf = window.requestAnimationFrame.bind(window);
      window.__peoplesMotionProbe = { callbacks: 0 };
      window.requestAnimationFrame = callback => nativeRaf(time => {
        window.__peoplesMotionProbe.callbacks++;
        return callback(time);
      });
    })();`,
  });

  await cdp.send("Page.navigate", { url: BASE });
  await sleep(900);

  const introStart = await cdp.eval(`(() => ({
    probe: window.__peoplesAudioProbe,
    motion: window.__peoplesMotionProbe,
    introStep: document.querySelector('[data-peoples-intro-step]')?.dataset.peoplesIntroStep,
    canvas: !!document.querySelector('[data-peoples-intro-step] canvas'),
    mounted: document.documentElement.dataset.peoplesAppMounted,
    overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
  }))()`);
  const validIntroStart = ["1", "2"].includes(introStart.introStep);
  if (
    introStart.probe.contexts !== 0 ||
    introStart.probe.oscillators !== 0 ||
    !validIntroStart ||
    introStart.mounted !== "true" ||
    introStart.overflow > 1
  ) {
    throw new Error(`intro contract ${JSON.stringify(introStart)}`);
  }

  const rafBefore = introStart.motion.callbacks;
  await sleep(300);
  const rafAfter = await cdp.eval(`window.__peoplesMotionProbe.callbacks`);
  if (introStart.canvas && rafAfter <= rafBefore) {
    throw new Error(
      `LatticeIgnition motion loop did not advance: ${rafBefore} -> ${rafAfter}`
    );
  }

  await cdp.eval(
    `document.querySelector('button[aria-label="Skip the opening sequence"]')?.click(); true`
  );
  await waitForEval(
    cdp,
    `!!document.querySelector('[data-peoples-sound]')`,
    60
  );
  await sleep(150);

  const initial = await cdp.eval(`(() => {
    const b = document.querySelector('[data-peoples-sound]');
    return {
      state: b?.dataset.peoplesSound,
      pressed: b?.getAttribute('aria-pressed'),
      probe: window.__peoplesAudioProbe,
      mounted: document.documentElement.dataset.peoplesAppMounted,
      overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
    };
  })()`);
  if (
    initial.state !== "off" ||
    initial.pressed !== "false" ||
    initial.probe.contexts !== 0 ||
    initial.probe.oscillators !== 0 ||
    initial.mounted !== "true" ||
    initial.overflow > 1
  ) {
    throw new Error(`initial contract ${JSON.stringify(initial)}`);
  }

  await cdp.eval(
    `document.querySelector('[data-peoples-sound]')?.click(); true`
  );
  await sleep(220);
  const afterEnable = await cdp.eval(`(() => ({
    state: document.querySelector('[data-peoples-sound]')?.dataset.peoplesSound,
    probe: window.__peoplesAudioProbe
  }))()`);
  if (
    afterEnable.state !== "on" ||
    afterEnable.probe.contexts < 1 ||
    afterEnable.probe.oscillators < 1
  ) {
    throw new Error(
      `sound did not explicitly enable ${JSON.stringify(afterEnable)}`
    );
  }

  const beforeNav = afterEnable.probe.oscillators;
  await cdp.eval(
    `([...document.querySelectorAll('nav button')].find(button => button.textContent.includes('3D GALLERY')))?.click(); true`
  );
  await sleep(650);
  const afterNav = await cdp.eval(`(() => ({
    path: location.pathname,
    probe: window.__peoplesAudioProbe
  }))()`);
  if (
    afterNav.probe.contexts < 1 ||
    afterNav.probe.oscillators <= beforeNav ||
    !afterNav.path.endsWith("/gallery")
  ) {
    throw new Error(
      `navigation SFX/route failed ${JSON.stringify({ beforeNav, afterNav })}`
    );
  }

  await cdp.eval(
    `document.querySelector('[data-peoples-sound]')?.click(); true`
  );
  await sleep(150);
  const mutedBefore = await cdp.eval(`window.__peoplesAudioProbe.oscillators`);
  await cdp.eval(
    `document.querySelector('button[aria-label="Open H.K. Assistant"]')?.click(); true`
  );
  await sleep(250);
  const mutedAfter = await cdp.eval(`window.__peoplesAudioProbe.oscillators`);
  if (mutedAfter !== mutedBefore) {
    throw new Error(`mute failed ${mutedBefore}->${mutedAfter}`);
  }

  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await cdp.send("Page.navigate", { url: BASE });
  await sleep(900);
  const reducedIntro = await cdp.eval(`(() => ({
    media: matchMedia('(prefers-reduced-motion: reduce)').matches,
    intro: !!document.querySelector('[data-peoples-intro-step]'),
    canvas: !!document.querySelector('[data-peoples-intro-step] canvas'),
    probe: window.__peoplesAudioProbe
  }))()`);
  if (
    !reducedIntro.media ||
    reducedIntro.canvas ||
    reducedIntro.probe.contexts !== 0
  ) {
    throw new Error(
      `reduced-motion intro contract ${JSON.stringify(reducedIntro)}`
    );
  }

  if (reducedIntro.intro) {
    await cdp.eval(
      `document.querySelector('button[aria-label="Skip the opening sequence"]')?.click(); true`
    );
  }
  await waitForEval(
    cdp,
    `!!document.querySelector('[data-peoples-sound]')`,
    60
  );
  await sleep(150);
  const reduced = await cdp.eval(`(() => ({
    media: matchMedia('(prefers-reduced-motion: reduce)').matches,
    sound: document.querySelector('[data-peoples-sound]')?.dataset.peoplesSound,
    probe: window.__peoplesAudioProbe,
    overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
    broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src)
  }))()`);
  if (
    !reduced.media ||
    reduced.sound !== "off" ||
    reduced.probe.contexts !== 0 ||
    reduced.overflow > 1 ||
    reduced.broken.length
  ) {
    throw new Error(
      `reduced-motion/layout contract ${JSON.stringify(reduced)}`
    );
  }

  const report = {
    introStart,
    motion: { before: rafBefore, after: rafAfter },
    initial,
    afterEnable,
    navigation: { before: beforeNav, after: afterNav },
    muted: { before: mutedBefore, after: mutedAfter },
    reducedIntro,
    reduced,
    failures: 0,
  };
  await fs.writeFile(
    "peoples-experience-audit.json",
    JSON.stringify(report, null, 2)
  );
  console.log("PEOPLES_EXPERIENCE_RUNTIME=PASS");
  console.log(JSON.stringify(report));
} finally {
  cdp.close();
}
