import { useEffect } from "react";
import { motion } from "framer-motion";
import { HolographicText } from "@/components/AdvancedVisuals";
import TechMinutesDashboard from "@/components/TechMinutesDashboard";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";
import {
  HORACE_KING_LIFESPAN,
  TECHBRIDGE_ROLLOUT,
  TECHBRIDGE_SPAN_IMPACT_URL,
} from "@shared/siteFacts";

interface CommunityImpactProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function CommunityImpact({
  activeSection,
}: CommunityImpactProps) {
  const isActive = activeSection === "community";
  const { logSectionView } = usePortfolioAnalytics();
  useEffect(() => {
    logSectionView("community");
  }, [logSectionView]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl">
            <HolographicText className="font-bold">
              COMMUNITY IMPACT
            </HolographicText>
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl">
            Building bridges of access, dignity, and opportunity — free,
            human-centered digital help at community sites across the Triangle.
            Walk in. Get help. Cross the bridge.
          </p>
        </motion.div>
      </section>

      {/* Mission Statement */}
      <section className="container mx-auto px-4 py-12 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            THE MISSION
          </h2>
          <p className="text-foreground/80 text-lg leading-relaxed mb-6">
            TechBridge Collective addresses the digital divide in North Carolina
            through a three-pillar model: weekly help desk services with paid
            Digital Navigators, H.K. AI triage for 24/7 guidance, and
            TechMinutes® impact reporting.
          </p>
          <p className="text-foreground/80 text-lg leading-relaxed">
            Pilot-to-scale targets are published as{" "}
            <strong>SPAN-verified projections</strong> on the live site: Year{" "}
            {TECHBRIDGE_ROLLOUT.year1Hubs} pilot hubs (
            {TECHBRIDGE_ROLLOUT.year1PilotSites.join(" · ")}),{" "}
            {TECHBRIDGE_ROLLOUT.year1Navigators} paid Digital Navigators; Year{" "}
            {TECHBRIDGE_ROLLOUT.year2Hubs} hubs and a{" "}
            <strong>
              ~{TECHBRIDGE_ROLLOUT.year2ResidentsSom.toLocaleString()}-resident
            </strong>{" "}
            serviceable-market (SOM) goal, with{" "}
            {TECHBRIDGE_ROLLOUT.investmentNote} (per that page). See{" "}
            <a
              href={TECHBRIDGE_SPAN_IMPACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              techbridge-collective.org/impact
            </a>{" "}
            for the source of record.
          </p>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-8">OUR DNA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🔄",
                title: "Consistency over Novelty",
                description: "We show up. Every week. Same time, same place.",
              },
              {
                icon: "🤝",
                title: "Human-First Technology",
                description: "H.K. triages; humans deliver.",
              },
              {
                icon: "📊",
                title: "Measured Impact",
                description:
                  "Every interaction becomes a TechMinute®. We measure what matters.",
              },
              {
                icon: "🏢",
                title: "Low-Lift Partnerships",
                description:
                  "Host provides space. TechBridge provides everything else.",
              },
              {
                icon: "💰",
                title: "Paid Navigators",
                description:
                  "No volunteers. Paid staff show up, stay trained, and don't churn.",
              },
              {
                icon: "🔒",
                title: "Privacy by Design",
                description:
                  "No PII. No credential access. We guide; we don't control.",
              },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                className="p-6 rounded border border-border bg-card hover:border-primary transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-foreground/80">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* TechMinutes Dashboard */}
      <section className="container mx-auto border-t border-border px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            IMPACT DASHBOARD
          </h2>
          <p className="mb-8 max-w-3xl text-sm text-muted-foreground">
            The charts below are an <strong>illustrative simulation</strong> in
            the spirit of{" "}
            <a
              href="https://techbridge-collective.org/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              techbridge-collective.org/dashboard
            </a>
            —not aggregated live hub totals. Scenario names and minute counts
            for Maria, James, Dorothy, and Carlos match{" "}
            <strong>SPAN §5.3</strong> examples on{" "}
            <a
              href={TECHBRIDGE_SPAN_IMPACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              /impact
            </a>
            .
          </p>
          <TechMinutesDashboard isActive={isActive} />
        </motion.div>
      </section>

      {/* Hub Network */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            HUB NETWORK
          </h2>
          <p className="mb-8 max-w-3xl text-xs font-mono tracking-wide text-muted-foreground">
            Partner names and phases align with{" "}
            <a
              href={TECHBRIDGE_SPAN_IMPACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              techbridge-collective.org/impact
            </a>{" "}
            (SPAN-verified projections).
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                name: TECHBRIDGE_ROLLOUT.year1PilotSites[0],
                location: "Durham, NC",
                status: "YEAR 1 PILOT",
                hours: "4–8 hrs/wk (target)",
              },
              {
                name: TECHBRIDGE_ROLLOUT.year1PilotSites[1],
                location: "Raleigh, NC",
                status: "YEAR 1 PILOT",
                hours: "4–8 hrs/wk (target)",
              },
              {
                name: TECHBRIDGE_ROLLOUT.year2ExpansionExamples[0],
                location: "Durham, NC",
                status: "YEAR 2 EXPANSION",
                hours: "TBD",
              },
              {
                name: TECHBRIDGE_ROLLOUT.year2ExpansionExamples[1],
                location: "Raleigh, NC",
                status: "YEAR 2 EXPANSION",
                hours: "TBD",
              },
              {
                name: TECHBRIDGE_ROLLOUT.year2ExpansionExamples[2],
                location: "Triangle, NC",
                status: "YEAR 2 EXPANSION",
                hours: "TBD",
              },
            ].map((hub, idx) => (
              <motion.div
                key={idx}
                className="p-6 rounded border border-border bg-card hover:border-primary transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-foreground mb-2">{hub.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {hub.location}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-primary">
                    {hub.status}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {hub.hours}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* H.K. AI Overview */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-3xl"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            H.K. AI TRIAGE
          </h2>
          <p className="text-foreground/80 mb-6">
            Named for Horace King ({HORACE_KING_LIFESPAN}), the bridge builder
            who connected communities across the American South — as summarized
            on{" "}
            <a
              href="https://techbridge-collective.org/get-help"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              techbridge-collective.org/get-help
            </a>
            . On the{" "}
            <a
              href="https://techbridge-collective.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              TechBridge Collective
            </a>{" "}
            model, H.K. is 24/7 triage between visits — step-by-step guidance,
            portal navigation, smart escalation, and no credential collection.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Step-by-step guidance", emoji: "📋" },
              { label: "Portal navigation", emoji: "🗺️" },
              { label: "Smart escalation", emoji: "🎯" },
              { label: "24/7 availability", emoji: "⏰" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-4 p-4 rounded border border-border bg-card"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + idx * 0.05 }}
              >
                <span className="text-3xl">{feature.emoji}</span>
                <span className="text-foreground font-semibold">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Cross the Bridge?
          </h2>
          <p className="text-foreground/80 mb-8">
            Whether you need help with digital access, want to host a hub, or
            are interested in partnership opportunities, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-wrap sm:flex-row gap-4 justify-center">
            <a
              href="https://techbridge-collective.org/get-help"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-primary text-background hover:bg-primary/80 rounded font-mono text-sm tracking-widest transition-colors text-center"
            >
              GET HELP NOW
            </a>
            <a
              href="https://techbridge-collective.org/host-a-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-primary text-primary hover:bg-primary/10 rounded font-mono text-sm tracking-widest transition-colors text-center"
            >
              HOST A HUB
            </a>
            <a
              href="https://techbridge-collective.org/about"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-primary text-primary hover:bg-primary/10 rounded font-mono text-sm tracking-widest transition-colors text-center"
            >
              OUR STORY
            </a>
            <a
              href="https://calendly.com/aitconsult22/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-border text-foreground hover:border-primary rounded font-mono text-sm tracking-widest transition-colors text-center"
            >
              BOOK A PILOT CALL
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
