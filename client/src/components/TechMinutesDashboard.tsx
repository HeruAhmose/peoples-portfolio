import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TECHBRIDGE_SPAN_IMPACT_URL } from "@shared/siteFacts";

interface TechMinutesDashboardProps {
  isActive: boolean;
}

/** Illustrative trajectory only — not live hub aggregates (see /impact on TechBridge). */
const impactData = [
  { month: "M1", minutes: 240, residents: 32 },
  { month: "M2", minutes: 380, residents: 52 },
  { month: "M3", minutes: 520, residents: 78 },
  { month: "M4", minutes: 680, residents: 95 },
  { month: "M5", minutes: 890, residents: 128 },
  { month: "M6", minutes: 1200, residents: 165 },
];

const categoryData = [
  { category: "Education", minutes: 340, color: "#ffd700" },
  { category: "Workforce", minutes: 280, color: "#00d9ff" },
  { category: "Health", minutes: 220, color: "#ff00ff" },
  { category: "Housing", minutes: 160, color: "#00ff88" },
];

export default function TechMinutesDashboard({
  isActive,
}: TechMinutesDashboardProps) {
  const [animatedStats, setAnimatedStats] = useState({
    totalMinutes: 0,
    residentsServed: 0,
    averageResolution: 0,
  });

  useEffect(() => {
    if (!isActive) return;

    /* Demo totals only — SPAN Year 1/2 targets are on techbridge-collective.org/impact */
    const targets = {
      totalMinutes: 3710,
      residentsServed: 550,
      averageResolution: 87,
    };

    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setAnimatedStats({
        totalMinutes: Math.floor(targets.totalMinutes * progress),
        residentsServed: Math.floor(targets.residentsServed * progress),
        averageResolution: Math.floor(targets.averageResolution * progress),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isActive]);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
      transition={{ duration: 0.6 }}
    >
      <p className="rounded-lg border border-cyan-500/20 bg-background/40 px-3 py-2 text-center font-mono text-[10px] leading-relaxed tracking-wide text-muted-foreground md:text-xs">
        ILLUSTRATIVE DEMO · Not operational data · Confirm targets on{" "}
        <a
          href={TECHBRIDGE_SPAN_IMPACT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-2 hover:underline"
        >
          techbridge-collective.org/impact
        </a>
      </p>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            label: "TOTAL TECHMINUTES (SAMPLE)",
            value: animatedStats.totalMinutes,
            suffix: "",
          },
          {
            label: "RESIDENTS (SAMPLE)",
            value: animatedStats.residentsServed,
            suffix: "",
          },
          {
            label: "RESOLUTION RATE (SAMPLE)",
            value: animatedStats.averageResolution,
            suffix: "%",
          },
        ].map((metric, idx) => (
          <motion.div
            key={idx}
            className="p-6 rounded border border-primary bg-card neon-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <p className="text-xs font-mono text-muted-foreground tracking-widest mb-2">
              {metric.label}
            </p>
            <motion.div className="text-4xl font-bold text-primary neon-text">
              {metric.value.toLocaleString()}
              <span className="text-2xl">{metric.suffix}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Over Time */}
        <motion.div
          className="p-6 rounded border border-border bg-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="mb-1 font-bold text-foreground">
            IMPACT TRAJECTORY (ILLUSTRATIVE)
          </h3>
          <p className="mb-4 text-xs text-muted-foreground">
            Months labeled M1–M6 = demo sequence, not calendar claims.
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={impactData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 215, 0, 0.1)"
              />
              <XAxis dataKey="month" stroke="rgba(224, 224, 224, 0.5)" />
              <YAxis stroke="rgba(224, 224, 224, 0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10, 14, 39, 0.9)",
                  border: "1px solid #ffd700",
                  borderRadius: "4px",
                }}
                labelStyle={{ color: "#e0e0e0" }}
              />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="#ffd700"
                strokeWidth={2}
                dot={{ fill: "#ffd700", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          className="p-6 rounded border border-border bg-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-4 font-bold text-foreground">
            CATEGORY BREAKDOWN (SAMPLE MIX)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 215, 0, 0.1)"
              />
              <XAxis dataKey="category" stroke="rgba(224, 224, 224, 0.5)" />
              <YAxis stroke="rgba(224, 224, 224, 0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10, 14, 39, 0.9)",
                  border: "1px solid #ffd700",
                  borderRadius: "4px",
                }}
                labelStyle={{ color: "#e0e0e0" }}
              />
              <Bar dataKey="minutes" fill="#ffd700" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Impact Stories */}
      <motion.div
        className="p-6 rounded border border-border bg-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="mb-1 font-bold text-foreground">
          IMPACT STORIES (SPAN §5.3 SCENARIOS)
        </h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Same vignettes and durations published on{" "}
          <a
            href={TECHBRIDGE_SPAN_IMPACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-2 hover:underline"
          >
            techbridge-collective.org/impact
          </a>{" "}
          (plus Keisha on /get-help).
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            {
              name: "Maria",
              category: "EDUCATION",
              story:
                "Locked out of child’s school portal — access restored (SPAN §5.3).",
              time: "18 min",
            },
            {
              name: "James",
              category: "WORKFORCE",
              story:
                "VA job application timing out — session protocol per SPAN §5.3.",
              time: "35 min",
            },
            {
              name: "Dorothy",
              category: "HEALTH",
              story:
                "Telehealth setup / video calling — first appointment booked (SPAN §5.3).",
              time: "40 min",
            },
            {
              name: "Carlos",
              category: "HOUSING",
              story:
                "Housing document upload failing — resolved with scanner workflow (SPAN §5.3).",
              time: "22 min",
            },
            {
              name: "Keisha",
              category: "EDUCATION",
              story:
                "FAFSA verification stalled — guided through verification flow (TechBridge /get-help scenario).",
              time: "45 min",
            },
          ].map((story, idx) => (
            <motion.div
              key={idx}
              className="p-4 rounded border border-border bg-background"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-foreground">{story.name}</h4>
                  <p className="text-xs font-mono text-primary">
                    {story.category}
                  </p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {story.time}
                </span>
              </div>
              <p className="text-sm text-foreground/80">{story.story}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        className="p-4 rounded border border-border bg-card text-sm text-foreground/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="font-mono text-xs text-muted-foreground mb-2">
          MISSION STATEMENT
        </p>
        <p>
          TechBridge Collective builds bridges of access, dignity, and
          opportunity through human-centered digital help at Triangle community
          sites (
          <a
            href="https://techbridge-collective.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            techbridge-collective.org
          </a>
          ). Every TechMinute® represents a life changed — a parent
          reconnecting with their child&apos;s education, a veteran rebuilding
          their career, a senior accessing healthcare.
        </p>
      </motion.div>
    </motion.div>
  );
}
