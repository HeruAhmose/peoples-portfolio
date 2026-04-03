import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** 2D canvas fill/stroke from #RRGGBB */
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map(c => c + c)
          .join("")
      : h;
  if (full.length !== 6) return `rgba(255, 215, 0, ${alpha})`;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export const ParticleBackground = ({
  className = "fixed inset-0",
}: {
  className?: string;
}) => {
  const reduceMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : globalThis.innerWidth;
      const h = parent ? parent.clientHeight : globalThis.innerHeight;
      canvas.width = Math.max(1, w);
      canvas.height = Math.max(1, h);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    let ro: ResizeObserver | undefined;
    if (canvas.parentElement) {
      ro = new ResizeObserver(() => resizeCanvas());
      ro.observe(canvas.parentElement);
    }

    const drawStaticField = () => {
      resizeCanvas();
      ctx.fillStyle = "rgba(10, 14, 39, 0.75)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const n = 36;
      for (let i = 0; i < n; i++) {
        const x = ((i * 47) % 100) / 100;
        const y = ((i * 73) % 100) / 100;
        ctx.fillStyle = hexToRgba(i % 2 === 0 ? "#ffd700" : "#00d9ff", 0.22);
        ctx.beginPath();
        ctx.arc(x * canvas.width, y * canvas.height, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (reduceMotion) {
      drawStaticField();
      return () => {
        ro?.disconnect();
        window.removeEventListener("resize", resizeCanvas);
      };
    }

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 100 + 50,
          maxLife: 150,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? "#ffd700" : "#00d9ff",
        });
      }
    };

    initParticles();

    const animate = () => {
      ctx.fillStyle = "rgba(10, 14, 39, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.life < 0) {
          return false;
        }

        const alpha = (p.life / p.maxLife) * 0.6;
        ctx.fillStyle = hexToRgba(p.color, alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        particlesRef.current.forEach(p2 => {
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.strokeStyle = `rgba(255, 215, 0, ${(1 - distance / 100) * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        return true;
      });

      if (particlesRef.current.length < 50 && Math.random() > 0.7) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: 150,
          maxLife: 150,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? "#ffd700" : "#00d9ff",
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none z-0 ${className}`}
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(10,14,39,0.35) 0%, rgba(5,7,20,0.92) 100%)",
      }}
    />
  );
};

/** Gradient “hologram” text via `background-clip: text` (see `.holographic-text` in index.css). */
export const HolographicText = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      className={`holographic-text ${className}`}
      initial={{
        opacity: reduceMotion ? 1 : 0,
        filter: reduceMotion ? "blur(0px)" : "blur(4px)",
      }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: reduceMotion ? 0 : 0.85 }}
    >
      {children}
    </motion.span>
  );
};

export const GlitchText = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={`relative ${className}`}
      animate={
        reduceMotion
          ? false
          : {
              textShadow: [
                "0 0 0 #ffd700, 0 0 0 #00d9ff",
                "2px 2px 0 #ffd700, -2px -2px 0 #00d9ff",
                "-2px 2px 0 #ffd700, 2px -2px 0 #00d9ff",
                "0 0 0 #ffd700, 0 0 0 #00d9ff",
              ],
            }
      }
      transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
    >
      {children}
    </motion.div>
  );
};

export const NeuralNetwork = () => {
  const reduceMotion = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number }>
  >([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nodeCount = 15;

    const initNodes = (w: number, h: number) => {
      nodesRef.current = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
      }));
    };

    const resize = () => {
      const w = Math.max(1, wrap.clientWidth);
      const h = Math.max(280, Math.min(420, wrap.clientHeight || 320));
      const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodesRef.current.length === 0) initNodes(w, h);
    };

    const drawGraph = (move: boolean) => {
      const w = Math.max(1, wrap.clientWidth);
      const h = Math.max(280, Math.min(420, wrap.clientHeight || 320));
      if (nodesRef.current.length === 0) initNodes(w, h);
      ctx.fillStyle = "rgba(10, 14, 39, 0.22)";
      ctx.fillRect(0, 0, w, h);

      nodesRef.current.forEach((node, i) => {
        if (move) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0 || node.x > w) node.vx *= -1;
          if (node.y < 0 || node.y > h) node.vy *= -1;
        }

        nodesRef.current.forEach((other, j) => {
          if (i < j) {
            const dx = other.x - node.x;
            const dy = other.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              ctx.strokeStyle = `rgba(0, 217, 255, ${(1 - distance / 150) * 0.5})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        });

        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 215, 0, 0.3)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) {
        drawGraph(false);
      }
    });
    ro.observe(wrap);

    if (reduceMotion) {
      drawGraph(false);
      return () => {
        ro.disconnect();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }

    const animate = () => {
      drawGraph(true);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      ro.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [reduceMotion]);

  return (
    <div
      ref={wrapRef}
      className="w-full min-h-[280px] h-[min(40vh,420px)] rounded border border-primary/30 bg-card"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none block h-full w-full rounded"
      />
    </div>
  );
};

export const AnimatedGradientBorder = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      style={{
        background:
          "linear-gradient(45deg, #ffd700, #00d9ff, #ff00ff, #ffd700)",
        backgroundSize: "300% 300%",
        padding: "2px",
        borderRadius: "8px",
      }}
    >
      <div className="bg-background rounded">{children}</div>
    </motion.div>
  );
};

export const FloatingElement = ({
  children,
  duration = 4,
  delay = 0,
}: {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export const PulseGlow = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          "0 0 20px rgba(255, 215, 0, 0.3)",
          "0 0 40px rgba(0, 217, 255, 0.5)",
          "0 0 20px rgba(255, 215, 0, 0.3)",
        ],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
};
