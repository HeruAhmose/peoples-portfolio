import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ORGANS, RING_ANGLES } from "@/lib/organism";

/**
 * LatticeIgnition — the entrance sequence.
 *
 * The intro is diagrammatic rather than decorative. Seven nodes ignite in
 * anatomical order; each fires a signal along the ring edge to the next; when
 * the circuit closes the core lights and a single beat travels outward. By the
 * time it ends the visitor has already been told what the seven organs are and
 * what order they run in, so the site's structure is legible before they scroll.
 *
 * Falls back cleanly: WebGL2 → WebGL1 → CSS-only. Honors prefers-reduced-motion
 * by skipping to a still frame. Skippable at any point with click, key or the
 * visible control.
 */

const FULL_MS = 4600;
const SHORT_MS = 1950;
const NODE_GAP = 235;
const FIRST_NODE_AT = 280;

const VERT = `#version 300 es
in vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform float u_prog;
uniform float u_ignite[7];
uniform vec3  u_col[7];
uniform float u_core;
uniform float u_beat;
uniform float u_fade;
/* 1.0 = this organ has a page in the gate, 0.0 = it opens into the estate. */
uniform float u_gate[7];

out vec4 fragColor;

const float PI  = 3.14159265359;
const float TAU = 6.28318530718;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float sdSeg(vec2 p, vec2 a, vec2 b){
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

float segT(vec2 p, vec2 a, vec2 b){
  vec2 pa = p - a, ba = b - a;
  return clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
}

vec2 nodePos(int i){
  float a = -PI * 0.5 + (float(i) / 7.0) * TAU;
  return vec2(cos(a), sin(a)) * 0.62;
}

/* Hexagonal carbon matrix — the substrate everything else stands on. */
float hexEdge(vec2 uv, float scale){
  uv *= scale;
  vec2 r = vec2(1.0, 1.7320508);
  vec2 h = r * 0.5;
  vec2 a = mod(uv, r) - h;
  vec2 b = mod(uv - h, r) - h;
  vec2 gv = dot(a, a) < dot(b, b) ? a : b;
  vec2 q = abs(gv);
  float d = max(dot(q, normalize(vec2(1.0, 1.7320508))), q.x);
  return 0.5 - d;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  float r = length(uv);

  vec3 col = vec3(0.0);

  /* Void with a faint lapis depth so black never reads as flat. */
  col += vec3(0.012, 0.020, 0.032) * (1.0 - smoothstep(0.0, 1.05, r));

  /* Substrate: the carbon matrix breathes in early, then recedes. */
  float matrixAmt = smoothstep(0.02, 0.30, u_prog) * (1.0 - smoothstep(0.55, 0.92, u_prog));
  float he = hexEdge(uv + vec2(0.0, u_time * 0.008), 9.0);
  float hexLine = smoothstep(0.030, 0.004, he);
  float matrixFall = 1.0 - smoothstep(0.15, 0.95, r);
  col += vec3(0.36, 0.46, 0.60) * hexLine * matrixAmt * matrixFall * 0.085;

  /* Ring edges. Each edge lights only when both of its nodes are live. */
  for (int i = 0; i < 7; i++){
    /* GLSL ES 1.00 has no integer % operator, so wrap by hand. */
    int j = i + 1;
    if (j > 6) j = 0;
    vec2 a = nodePos(i);
    vec2 b = nodePos(j);
    float d = sdSeg(uv, a, b);
    float live = min(u_ignite[i], u_ignite[j]);
    vec3 ec = mix(u_col[i], u_col[j], segT(uv, a, b));

    /* Static conductor once both ends are lit. */
    col += ec * smoothstep(0.0045, 0.0, d) * live * 0.85;
    col += ec * smoothstep(0.055, 0.0, d) * live * 0.10;

    /* Signal: fires from i to j while j is coming up. */
    float travel = clamp(u_ignite[j] * 1.35, 0.0, 1.0);
    float t = segT(uv, a, b);
    float head = smoothstep(0.10, 0.0, abs(t - travel)) * step(0.001, u_ignite[i]);
    float tail = smoothstep(0.30, 0.0, clamp(travel - t, 0.0, 1.0)) * step(t, travel);
    float sig = (head * 1.4 + tail * 0.35) * (1.0 - smoothstep(0.0, 1.0, travel));
    col += ec * smoothstep(0.010, 0.0, d) * sig * 1.6;
  }

  /* Nodes, and the spokes that carry the return path back to the core.
     Folded into one pass: two loops over the same seven positions cost twice
     the trigonometry for no visual difference. */
  for (int i = 0; i < 7; i++){
    vec2 p = nodePos(i);
    float d = length(uv - p);

    float ds = sdSeg(uv, p, vec2(0.0));
    col += u_col[i] * smoothstep(0.0030, 0.0, ds) * u_core * 0.30;
    float g = u_ignite[i];
    float flare = exp(-d * 44.0) * g;
    float halo  = exp(-d * 9.0) * g * 0.30;
    float ringD = abs(d - 0.028 - 0.010 * g);
    float ring  = smoothstep(0.0030, 0.0, ringD) * g;

    /* A doorway is a ring with a gap in it. Organs that live in the gate close
       their ring; organs that open into the estate carry an aperture facing
       radially outward, away from the core — the opening points where the
       visitor would travel. */
    vec2  outward = normalize(p);
    vec2  rel     = normalize(uv - p + vec2(1e-6));
    float facing  = dot(rel, outward);          /* 1.0 directly outward */
    float aperture = smoothstep(0.72, 0.95, facing);
    ring *= mix(1.0 - aperture, 1.0, u_gate[i]);

    /* The aperture glows: light spills out of the opening. */
    float spill = aperture * exp(-d * 16.0) * g * (1.0 - u_gate[i]);

    col += u_col[i] * (flare * 1.25 + halo + ring * 0.9 + spill * 0.55);
  }

  /* Core: the flywheel. */
  float cd = length(uv);
  col += vec3(0.98, 0.80, 0.36) * exp(-cd * 34.0) * u_core * 1.5;
  col += vec3(0.90, 0.66, 0.28) * exp(-cd * 7.0) * u_core * 0.22;

  /* One beat, travelling out. */
  float beatR = u_beat * 1.25;
  float beat = smoothstep(0.055, 0.0, abs(cd - beatR)) * (1.0 - smoothstep(0.0, 1.0, u_beat));
  col += vec3(0.95, 0.74, 0.32) * beat * 0.55;

  /* Chromatic bleed at the edges — glass, not lens flare. */
  float edge = smoothstep(0.45, 1.05, r);
  col.r *= 1.0 + edge * 0.06;
  col.b *= 1.0 + edge * 0.10;

  /* Vignette. */
  col *= 1.0 - smoothstep(0.42, 1.15, r) * 0.85;

  /* Grain: keeps gradients from banding on wide gamut displays. */
  col += (noise(gl_FragCoord.xy * 1.7 + u_time * 60.0) - 0.5) * 0.020;

  col *= u_fade;
  fragColor = vec4(max(col, 0.0), 1.0);
}`;

/* WebGL1 fallback — same picture, fewer instructions. */
const VERT1 = `attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos,0.0,1.0); }`;
const FRAG1 = FRAG.replace("#version 300 es\n", "")
  .replace("out vec4 fragColor;", "")
  .replace(/fragColor/g, "gl_FragColor");

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

interface Props {
  onComplete: () => void;
  /** Short form for repeat visits inside the same session. */
  brief?: boolean;
}

export function LatticeIgnition({ onComplete, brief = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const rafRef = useRef(0);
  const doneRef = useRef(false);
  const [lit, setLit] = useState(-1);
  const [stage, setStage] = useState<"lattice" | "wordmark" | "out">("lattice");
  const stageRef = useRef<"lattice" | "wordmark" | "out">("lattice");
  const [glFailed, setGlFailed] = useState(false);

  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const total = reduced ? 1200 : brief ? SHORT_MS : FULL_MS;
  const scale = total / FULL_MS;

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    cancelAnimationFrame(rafRef.current);
    stageRef.current = "out";
    setStage("out");
    window.setTimeout(onComplete, 620);
  }, [onComplete]);

  /* The overlay covers the page, so focus its only control immediately. */
  useEffect(() => {
    skipRef.current?.focus({ preventScroll: true });
  }, []);

  /* Skip on any deliberate input. */
  useEffect(() => {
    const skip = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key === "Tab") return;
      finish();
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
    };
  }, [finish]);

  useEffect(() => {
    if (reduced) {
      setLit(6);
      stageRef.current = "wordmark";
      setStage("wordmark");
      const t = window.setTimeout(finish, 1200);
      return () => window.clearTimeout(t);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    }) as WebGL2RenderingContext | WebGLRenderingContext | null;
    let webgl2 = Boolean(gl);
    if (!gl) {
      gl = canvas.getContext("webgl", {
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
      webgl2 = false;
    }
    if (!gl) {
      setGlFailed(true);
      return;
    }

    const compile = (type: number, src: string) => {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        throw new Error(gl!.getShaderInfoLog(shader) ?? "Shader compilation failed");
      }
      return shader;
    };

    try {
      const program = gl.createProgram()!;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, webgl2 ? VERT : VERT1));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, webgl2 ? FRAG : FRAG1));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? "Program link failed");
      }
      gl.useProgram(program);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(program, "a_pos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(program, "u_res");
      const uTime = gl.getUniformLocation(program, "u_time");
      const uProg = gl.getUniformLocation(program, "u_prog");
      const uIgnite = gl.getUniformLocation(program, "u_ignite[0]");
      const uCol = gl.getUniformLocation(program, "u_col[0]");
      const uCore = gl.getUniformLocation(program, "u_core");
      const uBeat = gl.getUniformLocation(program, "u_beat");
      const uFade = gl.getUniformLocation(program, "u_fade");
      const uGate = gl.getUniformLocation(program, "u_gate[0]");

      const colors = ORGANS.flatMap(o => hexToRgb(o.color));
      const gates = ORGANS.map(o => (o.internalPath ? 1 : 0));
      const start = performance.now();

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.floor(innerWidth * dpr);
        canvas.height = Math.floor(innerHeight * dpr);
        canvas.style.width = `${innerWidth}px`;
        canvas.style.height = `${innerHeight}px`;
        gl!.viewport(0, 0, canvas.width, canvas.height);
      };
      resize();
      window.addEventListener("resize", resize);

      const draw = (now: number) => {
        const elapsed = now - start;
        const prog = Math.min(elapsed / total, 1);
        const ignites = ORGANS.map((_, i) =>
          Math.max(0, Math.min(1, (elapsed - (FIRST_NODE_AT + i * NODE_GAP) * scale) / (360 * scale)))
        );
        const newestLit = ignites.reduce((highest, value, i) => (value > 0.65 ? i : highest), -1);
        setLit(current => (current === newestLit ? current : newestLit));

        const coreStart = (FIRST_NODE_AT + 6 * NODE_GAP + 330) * scale;
        const core = Math.max(0, Math.min(1, (elapsed - coreStart) / (460 * scale)));
        const beatStart = coreStart + 420 * scale;
        const beat = Math.max(0, Math.min(1, (elapsed - beatStart) / (820 * scale)));
        const wordmarkStart = total * 0.68;
        if (elapsed >= wordmarkStart && stageRef.current === "lattice") {
          stageRef.current = "wordmark";
          setStage("wordmark");
        }
        const fade = prog < 0.86 ? 1 : 1 - easeInOutCubic((prog - 0.86) / 0.14);

        gl!.uniform2f(uRes, canvas.width, canvas.height);
        gl!.uniform1f(uTime, elapsed / 1000);
        gl!.uniform1f(uProg, prog);
        gl!.uniform1fv(uIgnite, new Float32Array(ignites));
        gl!.uniform3fv(uCol, new Float32Array(colors));
        gl!.uniform1f(uCore, easeOutCubic(core));
        gl!.uniform1f(uBeat, beat);
        gl!.uniform1f(uFade, fade);
        gl!.uniform1fv(uGate, new Float32Array(gates));
        gl!.drawArrays(gl.TRIANGLES, 0, 3);

        if (prog < 1 && !doneRef.current) rafRef.current = requestAnimationFrame(draw);
        else if (!doneRef.current) finish();
      };
      rafRef.current = requestAnimationFrame(draw);

      return () => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener("resize", resize);
      };
    } catch {
      setGlFailed(true);
    }
  }, [finish, reduced, scale, total]);

  useEffect(() => {
    if (!glFailed || reduced) return;
    const timers = ORGANS.map((_, i) =>
      window.setTimeout(() => setLit(i), (FIRST_NODE_AT + i * NODE_GAP) * scale)
    );
    const wordmark = window.setTimeout(() => {
      stageRef.current = "wordmark";
      setStage("wordmark");
    }, total * 0.68);
    const complete = window.setTimeout(finish, total);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(wordmark);
      window.clearTimeout(complete);
    };
  }, [finish, glFailed, reduced, scale, total]);

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden bg-[#03060b] transition-opacity duration-[620ms] ${stage === "out" ? "pointer-events-none opacity-0" : "opacity-100"}`}
      role="dialog"
      aria-modal="true"
      aria-label="TRAI organism ignition"
    >
      {!glFailed && !reduced && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />}

      {(glFailed || reduced) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-[min(78vw,620px)] w-[min(78vw,620px)]">
            <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
            {ORGANS.map((organ, i) => {
              const angle = (RING_ANGLES[i] * Math.PI) / 180;
              const radius = 36;
              const left = 50 + Math.cos(angle) * radius;
              const top = 50 + Math.sin(angle) * radius;
              const active = i <= lit;
              return (
                <div
                  key={organ.id}
                  className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-500"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    borderColor: active ? organ.color : "rgba(255,255,255,.12)",
                    background: active ? `${organ.color}55` : "rgba(255,255,255,.02)",
                    boxShadow: active ? `0 0 28px ${organ.color}55` : "none",
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative mt-[min(56vw,430px)] text-center">
          <div
            className={`transition-all duration-700 ${stage === "wordmark" ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
          >
            <p className="font-mono text-[9px] tracking-[0.44em] text-cyan-200/60 md:text-[10px]">
              SEVEN ORGANS /// ONE REGENERATIVE SYSTEM
            </p>
            <p className="mt-2 font-display text-xl font-semibold tracking-[0.12em] text-white/90 md:text-2xl">
              TRAI ORGANISM
            </p>
          </div>
        </div>
      </div>

      <button
        ref={skipRef}
        type="button"
        onClick={finish}
        className="absolute bottom-6 right-6 z-20 rounded-md border border-white/15 bg-black/35 px-3 py-2 font-mono text-[9px] tracking-[0.22em] text-white/60 backdrop-blur-sm transition-colors hover:border-cyan-300/35 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
      >
        SKIP INTRO
      </button>
    </div>
  );
}
