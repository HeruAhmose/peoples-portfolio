import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface AMCVisualizationProps {
  isActive: boolean;
}

function withAlpha(hex: string, alphaHex: string): string {
  const h = hex.replace("#", "");
  if (h.length === 6) return `#${h}${alphaHex}`;
  return hex;
}

export default function AMCVisualization({ isActive }: AMCVisualizationProps) {
  const reduceMotion = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let time = 0;
    let ro: ResizeObserver | undefined;

    const resize = () => {
      const w = Math.max(1, wrap.clientWidth);
      const h = Math.max(1, wrap.clientHeight);
      const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paintFrame = (t: number) => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w < 2 || h < 2) return;

      ctx.fillStyle = "rgba(10, 14, 39, 0.12)";
      ctx.fillRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;
      const orbitR = Math.min(w, h) * 0.22;

      const constituents = [
        { color: "#ffd700", angle: t * 0.5 },
        { color: "#00d9ff", angle: t * 0.7 + Math.PI / 2 },
        { color: "#ff00ff", angle: t * 0.6 + Math.PI },
        {
          color: "#00ff88",
          angle: t * 0.8 + (3 * Math.PI) / 2,
        },
      ];

      constituents.forEach(constituent => {
        const x = centerX + Math.cos(constituent.angle) * orbitR;
        const y = centerY + Math.sin(constituent.angle) * orbitR;

        ctx.fillStyle = constituent.color;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = withAlpha(constituent.color, "66");
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = withAlpha(constituent.color, "33");
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      });

      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fill();

      const rings = [0.12, 0.22, 0.32].map(f => Math.min(w, h) * f);
      rings.forEach((radius, idx) => {
        ctx.strokeStyle = `rgba(255, 215, 0, ${0.32 - idx * 0.09})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      const dopantCount = 8;
      const innerR = Math.min(w, h) * 0.14;
      for (let i = 0; i < dopantCount; i++) {
        const angle =
          (t * 1.2 + (i / dopantCount) * Math.PI * 2) % (Math.PI * 2);
        const x = centerX + Math.cos(angle) * innerR;
        const y = centerY + Math.sin(angle) * innerR;

        ctx.fillStyle = "#ff00ff";
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#ff00ff66";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = "#e0e0e0";
      ctx.font = "bold clamp(11px, 2.5vw, 14px) monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        "ARCHITECTED MULTI-MODAL COUPLING",
        centerX,
        Math.max(28, h * 0.08)
      );
      ctx.font = "clamp(10px, 2vw, 12px) monospace";
      ctx.fillStyle = "#a0a0a0";
      ctx.fillText(
        "Hemp • Quartz • Tourmaline • Magnetite • Rare-Earth Dopants",
        centerX,
        Math.max(46, h * 0.12)
      );
    };

    resize();
    ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) {
        paintFrame(0);
      }
    });
    ro.observe(wrap);

    if (reduceMotion) {
      paintFrame(0);
      return () => {
        ro?.disconnect();
        cancelAnimationFrame(animationId);
      };
    }

    const animate = () => {
      time += 0.012;
      paintFrame(time);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      ro?.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, [isActive, reduceMotion]);

  return (
    <motion.div
      ref={wrapRef}
      className="w-full min-h-[min(50vh,480px)] h-[min(50vh,480px)] rounded-lg border border-primary neon-border overflow-hidden bg-background/50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none block h-full w-full"
      />
    </motion.div>
  );
}
