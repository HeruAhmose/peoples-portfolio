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

const FULL_MS = 3800;
const SHORT_MS = 1600;
const NODE_GAP = 200;
const FIRST_NODE_AT = 220;

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

    let gl: WebGL2RenderingContext | WebGLRenderingContext | null =
      canvas.getContext("webgl2", {
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
    let isGL2 = !!gl;
    if (!gl) {
      gl = canvas.getContext("webgl", { antialias: false, alpha: false });
      isGL2 = false;
    }
    if (!gl) {
      setGlFailed(true);
      const t = window.setTimeout(finish, 2400);
      return () => window.clearTimeout(t);
    }

    const compile = (type: number, src: string) => {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.warn("[LatticeIgnition]", gl!.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, isGL2 ? VERT : VERT1);
    const fs = compile(gl.FRAGMENT_SHADER, isGL2 ? FRAG : FRAG1);
    if (!vs || !fs) {
      setGlFailed(true);
      const t = window.setTimeout(finish, 2400);
      return () => window.clearTimeout(t);
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setGlFailed(true);
      const t = window.setTimeout(finish, 2400);
      return () => window.clearTimeout(t);
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    // Some drivers only expose array uniforms under name[0]; ask for both.
    const uloc = (name: string) =>
      gl!.getUniformLocation(prog, name) ??
      gl!.getUniformLocation(prog, `${name}[0]`);

    const U = {
      res: uloc("u_res"),
      time: uloc("u_time"),
      prog: uloc("u_prog"),
      core: uloc("u_core"),
      beat: uloc("u_beat"),
      fade: uloc("u_fade"),
      ignite: uloc("u_ignite"),
      col: uloc("u_col"),
      gate: uloc("u_gate"),
    };

    const colors = new Float32Array(21);
    ORGANS.forEach((o, i) => {
      const [r, g, b] = hexToRgb(o.hex);
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    });
    gl.uniform3fv(U.col, colors);

    // Static for the life of the sequence: an organ either has a page here or
    // it opens outward. Set once rather than per frame.
    const gateFlags = new Float32Array(ORGANS.map(o => (o.route ? 1 : 0)));
    gl.uniform1fv(U.gate, gateFlags);

    // 2x on an integrated GPU is the usual cause of a soft frame rate here, and
    // the lattice is line work — it costs little visually to render at 1.5x.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl!.viewport(0, 0, canvas.width, canvas.height);
      gl!.uniform2f(U.res, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const ignite = new Float32Array(7);
    let start = 0;
    let lastLit = -1;

    const draw = (ts: number) => {
      if (!start) start = ts;
      const t = ts - start;
      const p = Math.min(t / total, 1);

      for (let i = 0; i < 7; i++) {
        const at = (FIRST_NODE_AT + i * NODE_GAP) * scale;
        const dur = 360 * scale;
        ignite[i] = easeOutCubic(Math.max(0, Math.min((t - at) / dur, 1)));
      }

      const nowLit = ignite.reduce((acc, v, i) => (v > 0.55 ? i : acc), -1);
      if (nowLit !== lastLit) {
        lastLit = nowLit;
        setLit(nowLit);
      }

      const coreAt = (FIRST_NODE_AT + 7 * NODE_GAP) * scale;
      const core = easeOutCubic(
        Math.max(0, Math.min((t - coreAt) / (420 * scale), 1))
      );
      const beat = easeInOutCubic(
        Math.max(0, Math.min((t - coreAt - 120 * scale) / (900 * scale), 1))
      );

      const wordAt = coreAt + 460 * scale;
      if (t > wordAt && stageRef.current === "lattice") {
        stageRef.current = "wordmark";
        setStage("wordmark");
      }

      const outAt = total - 900 * scale;
      const fade = t > outAt ? Math.max(0, 1 - (t - outAt) / (800 * scale)) : 1;

      gl!.uniform1f(U.time, t / 1000);
      gl!.uniform1f(U.prog, p);
      gl!.uniform1f(U.core, core);
      gl!.uniform1f(U.beat, beat);
      gl!.uniform1f(U.fade, fade);
      gl!.uniform1fv(U.ignite, ignite);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);

      if (t >= total) {
        finish();
        return;
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, total, scale, finish]);

  const current = lit >= 0 ? ORGANS[lit] : null;

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{
        background: "#050607",
        opacity: stage === "out" ? 0 : 1,
        transition: "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Opening sequence"
    >
      {!glFailed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          aria-hidden="true"
        />
      )}

      {/* CSS-only fallback if the GPU refuses the context. */}
      {glFailed && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="lattice-fallback-core" />
        </div>
      )}

      {/* Organ labels, pinned to their node on the ring. */}
      <div
        className="absolute inset-0 pointer-events-none hidden sm:block"
        aria-hidden="true"
      >
        {ORGANS.map((o, i) => {
          const angle = RING_ANGLES[i];
          const rr = 0.62;
          const x = 50 + Math.cos(angle) * rr * 42;
          const y = 50 + Math.sin(angle) * rr * 42;
          const on = lit >= i;
          const right = Math.cos(angle) > 0.15;
          const centered = Math.abs(Math.cos(angle)) <= 0.15;
          return (
            <div
              key={o.num}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(${centered ? "-50%" : right ? "18px" : "calc(-100% - 18px)"}, -50%)`,
                textAlign: centered ? "center" : right ? "left" : "right",
                opacity: on ? 1 : 0,
                filter: on ? "blur(0px)" : "blur(3px)",
                transition: "opacity 520ms ease-out, filter 520ms ease-out",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  color: `${o.hex}aa`,
                }}
              >
                {o.num} · {o.role.toUpperCase()}
                {!o.route && (
                  <span style={{ opacity: 0.75 }}> · OPENS OUT</span>
                )}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-hero, system-ui, sans-serif)",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  color: "#f3eddf",
                  marginTop: 2,
                  whiteSpace: "nowrap",
                }}
              >
                {o.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Small screens: one organ at a time, centered under the lattice. */}
      <div
        className="absolute inset-x-0 bottom-32 sm:hidden text-center px-8"
        aria-hidden="true"
      >
        {current && (
          <>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.22em",
                color: `${current.hex}cc`,
              }}
            >
              {current.num} · {current.role.toUpperCase()}
            </div>
            <div
              style={{
                fontFamily: "var(--font-hero, system-ui, sans-serif)",
                fontSize: 15,
                color: "#f3eddf",
                marginTop: 4,
              }}
            >
              {current.name}
            </div>
          </>
        )}
      </div>

      {/* Wordmark resolves once the circuit closes. */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6"
        aria-hidden="true"
        style={{
          opacity: stage === "lattice" ? 0 : 1,
          transform: stage === "lattice" ? "translateY(10px)" : "none",
          transition:
            "opacity 900ms ease-out, transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.2rem, 11vw, 7.5rem)",
            fontWeight: 300,
            letterSpacing: "0.24em",
            lineHeight: 1,
            color: "#f3eddf",
            textShadow: "0 0 60px rgba(214,163,58,0.35)",
            marginRight: "-0.24em",
          }}
        >
          TRAI
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.6rem, 1.5vw, 0.72rem)",
            letterSpacing: "0.4em",
            color: "rgba(214,163,58,0.75)",
            marginTop: 22,
            marginRight: "-0.4em",
            textAlign: "center",
          }}
        >
          ONE REGENERATIVE ORGANISM
        </div>
      </div>

      {/* Skip. Always reachable, never in the way. */}
      <button
        ref={skipRef}
        onClick={finish}
        className="absolute bottom-8 right-8 z-10 px-4 py-2 text-[10px] tracking-[0.28em] uppercase transition-colors"
        style={{
          fontFamily: "var(--font-mono)",
          color: "rgba(243,237,223,0.4)",
          border: "1px solid rgba(214,163,58,0.22)",
          background: "rgba(5,6,7,0.4)",
          backdropFilter: "blur(6px)",
        }}
        aria-label="Skip the opening sequence"
      >
        Skip
      </button>
    </div>
  );
}

export default LatticeIgnition;
