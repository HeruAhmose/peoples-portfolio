import { describe, expect, it } from "vitest";
import {
  ORGAN_FACTS,
  publicFactFor,
  type EvidenceRegister,
} from "./organismFacts";
import { ORGANS } from "../client/src/lib/organism";
import { HK_SYSTEM_CONTEXT } from "./hkSystemContext";
import { TAMERIAN_PATENT } from "./siteFacts";

describe("public-safe organism facts", () => {
  it("contains exactly seven canonical organ facts", () => {
    expect(Object.keys(ORGAN_FACTS)).toHaveLength(7);
  });

  it("separates evidence from maturity", () => {
    const evidence = new Set<EvidenceRegister>([
      "verified",
      "operational",
      "planned",
    ]);

    for (const fact of Object.values(ORGAN_FACTS)) {
      expect(evidence.has(fact.evidence)).toBe(true);
      expect(fact.maturity.length).toBeGreaterThan(0);
      expect(fact.status.length).toBeGreaterThan(0);
    }
  });

  it("keeps evidence references opaque and unique", () => {
    const refs = Object.values(ORGAN_FACTS).map(f => f.evidenceRef);
    expect(new Set(refs).size).toBe(7);
    for (const ref of refs) expect(ref).toMatch(/^verified-facts:[a-z0-9-]+$/);
  });

  it("keeps the provisional serial out of the public projection", () => {
    const serialized = JSON.stringify(ORGAN_FACTS);
    expect(serialized).not.toMatch(/63\/?934/i);
    expect(publicFactFor("tamerian").status).toBe("U.S. provisional filed");
  });

  it("drives every client organ status from the canonical fact table", () => {
    for (const organ of ORGANS) {
      const fact = publicFactFor(organ.key);
      expect(organ.status).toBe(fact.status);
      expect(organ.claim).toBe(fact.claim);
      expect(organ.evidence).toBe(fact.evidence);
      expect(organ.maturity).toBe(fact.maturity);
      expect(organ.evidenceRef).toBe(fact.evidenceRef);
    }
  });

  it("pins the portzip3 accuracy refinements without exposing serial detail", () => {
    expect(publicFactFor("true-melange").status).toBe(
      "Formulation set · entity pending"
    );
    expect(publicFactFor("mela-nation").status).toBe(
      "EIN filed · early development"
    );
    expect(publicFactFor("melanina").status).toBe(
      "EIN filed · early development"
    );
    expect(publicFactFor("techbridge").status).toBe(
      "Designed · not yet operating"
    );
    expect(publicFactFor("peoples-foundation").status).toBe(
      "EIN obtained · exemption pending"
    );
  });

  it("keeps every public patent projection on the canonical safe status", () => {
    const legacyApplicationLabel = ["U.S.", "App.", "No."].join(" ");

    expect(TAMERIAN_PATENT.publicStatus).toBe(publicFactFor("tamerian").status);
    expect(JSON.stringify(TAMERIAN_PATENT)).not.toMatch(/63\/?934/i);
    expect(JSON.stringify(TAMERIAN_PATENT)).not.toContain("applicationNo");
    expect(HK_SYSTEM_CONTEXT).toContain("U.S. provisional filed");
    expect(HK_SYSTEM_CONTEXT).not.toMatch(/63\/?934/i);
    expect(HK_SYSTEM_CONTEXT).not.toContain(legacyApplicationLabel);
  });
});
