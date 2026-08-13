import { ORGAN_FACTS, type OrganKey } from "../../../shared/organismFacts";
import { observable } from "@trpc/server/observable";
import type { TRPCLink } from "@trpc/client";
import type { AppRouter } from "../../../server/routers";

/**
 * staticLink — lets the site work on GitHub Pages, where there is no server.
 *
 * The Pages build has no Express behind it, so every tRPC call would fail:
 * H.K. would sit dead, and an auth error would bounce the visitor toward an
 * OAuth portal that is not there. This link answers from local fixtures instead.
 *
 * Gated on BASE_URL rather than a new env var. The Pages workflow builds with
 * `--base /peoples-portfolio/`; the dev server and the server build both use
 * "/". So a non-root base means "this is the static deployment" without
 * touching vite.config.ts or the workflow.
 *
 * Nothing here invents a credential or a claim. H.K.'s answers come from the
 * verified record; unknown procedures resolve empty rather than throwing.
 */

export const STATIC_MODE =
  typeof import.meta.env.BASE_URL === "string" &&
  import.meta.env.BASE_URL !== "/";

interface Entry {
  match: RegExp;
  answer: string;
}

function organStatus(key: OrganKey): string {
  return ORGAN_FACTS[key].status;
}

const HK_KNOWLEDGE: Entry[] = [
  {
    match: /patent|claim|filed|provisional/i,
    answer: `The hemp-carbon matrix work is recorded in the verified facts layer as ${organStatus("tamerian")}. Public presentation intentionally omits the application number and nonpublic filing detail.`,
  },
  {
    match: /tamerian|material|composite|carbon|pyrolysis|skeleton/i,
    answer:
      "Tamerian Materials is the skeleton of the architecture — a hemp-derived carbon composite pyrolysed at 700-1400\u00b0C, targeting piezoelectric output of 50-500 \u00b5W/cm\u00b2 and thermoelectric ZT of 1.0-2.5. Quantum coherence above 500 ns at room temperature is a stated hypothesis, not a confirmed measurement. See the Materials Science page or the live Tamerian world at https://tamerian-materials.com/.",
  },
  {
    match: /melange|saffron|blue.?gold|beverage|drink|\bphi\b|cbd|thc|heart/i,
    answer: `True Melange Φ is the heart. ${organStatus("true-melange")}. First product is Blue-Gold Daily, a 12 oz can with 28 mg Affron® saffron at ISO 3632 Category I. Hemp content is hempseed oil and hemp seed protein only — no CBD, no THC. It has no internal page on this site yet; the live True Melange / Blue Gold world is at https://heruahmose.github.io/blue-gold-daily/layers.html.`,
  },
  {
    match: /califia|cyber|secur|\bai\b|brain|threat|attack/i,
    answer: `Queen Califia is the cognitive organ — an autonomous cybersecurity platform on Flask and React with three cores: Cyber, Identity and Markets. ${organStatus("queen-califia")}. A working demo stands at queencalifia-cyberai.web.app.`,
  },
  {
    match: /techbridge|navigator|hub|digital divide|horace|community|hands/i,
    answer: `TechBridge Collective is designed as community technology hubs staffed by paid Digital Navigators — two hubs and four Navigators in year one. It is named for Horace King, the enslaved master bridge builder. ${organStatus("techbridge")}. See the Community Impact page.`,
  },
  {
    match: /foundation|nonprofit|508|charit|give|donat|lymphatic/i,
    answer: `The Peoples Foundation is the regenerative organ. ${organStatus("peoples-foundation")}. It is designed to receive defined allocations from the ventures and return them to community programs.`,
  },
  {
    match: /mela nation|logistic|mobility|delivery|vessel/i,
    answer: `Mela Nation is the circulatory organ — last-mile logistics and supply-chain resilience for underserved routes. ${organStatus("mela-nation")}.`,
  },
  {
    match: /melanina|apparel|clothing|fashion|hemp wear|\bskin\b/i,
    answer: `MeLaNiNa is the identity organ — hemp apparel and cultural expression, with employee-ownership pathways in the design. ${organStatus("melanina")}.`,
  },
  {
    match:
      /founder|jonathan|\bjon\b|peoples|who (are|is) you|navy|veteran|background|career/i,
    answer:
      "Jonathan Peoples is a U.S. Navy veteran based in Concord, North Carolina, holding CompTIA A+ and Tech+ among 14+ certifications. He is the founder and inventor across all seven ventures. The Founder Journey page has the timeline.",
  },
  {
    match:
      /contact|reach|email|call|meeting|hire|invest|talk|touch|connect|book|schedule|phone|speak/i,
    answer: "Direct line: aitconsult22@gmail.com or (216) 307-0174.",
  },
  {
    match: /trai|organism|seven|organ|architecture|flywheel|sovereign/i,
    answer:
      "TRAI — the Tamerian Renaissance Alliance Initiative — treats seven ventures as organs of one organism: Skeleton, Heart, Brain, Vessels, Skin, Hands, Lymphatic. Value generated across them returns through The Peoples Foundation and funds the substrate again. Two organs have a page on this site so far; the opening sequence names all seven.",
  },
];

const HK_FALLBACK =
  "I hold the verified record for TRAI — the patent filing, the seven organs, entity status and contact routes. Ask me about any of those. For anything outside it, reach Jonathan directly at aitconsult22@gmail.com.";

export function hkAnswer(question: string): string {
  return HK_KNOWLEDGE.find(e => e.match.test(question))?.answer ?? HK_FALLBACK;
}

export function extractPrompt(input: unknown): string {
  const q = (input ?? {}) as Record<string, unknown>;
  const directPrompt = q.message ?? q.question ?? q.prompt ?? q.input;
  if (typeof directPrompt === "string") return directPrompt;

  if (Array.isArray(q.messages)) {
    for (let i = q.messages.length - 1; i >= 0; i -= 1) {
      const candidate = q.messages[i];
      if (!candidate || typeof candidate !== "object") continue;

      const message = candidate as Record<string, unknown>;
      if (message.role !== "user" || typeof message.content !== "string")
        continue;

      return message.content;
    }
  }

  return "";
}

function fixture(path: string, input: unknown): unknown {
  const q = (input ?? {}) as Record<string, unknown>;
  switch (path) {
    /* Nobody is signed in on a static deploy, and that is fine. */
    case "auth.me":
      return null;
    case "auth.logout":
      return { success: true };

    case "hk.chat":
    case "ai.chat": {
      const text = hkAnswer(extractPrompt(q));
      return {
        answer: text,
        response: text,
        message: text,
        content: text,
        reply: text,
        sources: [],
        model: "H.K. static guide",
      };
    }

    /* No analytics sink on a static host; accept and drop. */
    case "portfolio.logEvent":
      return { success: true };

    default:
      return null;
  }
}

export const staticLink: TRPCLink<AppRouter> = () => {
  return ({ op }) =>
    observable(observer => {
      const timer = window.setTimeout(() => {
        try {
          observer.next({
            result: { type: "data", data: fixture(op.path, op.input) },
          });
          observer.complete();
        } catch (err) {
          observer.error(err as never);
        }
      }, 90); // a beat of latency so skeletons render rather than flash
      return () => window.clearTimeout(timer);
    });
};
