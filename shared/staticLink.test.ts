import { describe, expect, it } from "vitest";
import { extractPrompt, hkAnswer } from "../client/src/lib/staticLink";

describe("static H.K. prompt extraction (regression)", () => {
  it("accepts direct scalar prompts", () => {
    expect(extractPrompt({ message: "What is TRAI?" })).toBe("What is TRAI?");
    expect(extractPrompt({ question: "What is Tamerian?" })).toBe(
      "What is Tamerian?"
    );
  });

  it("extracts the newest user message from H.K. conversation history", () => {
    expect(
      extractPrompt({
        messages: [
          { role: "user", content: "First question" },
          { role: "assistant", content: "First answer" },
          { role: "user", content: "What is TRAI?" },
        ],
      })
    ).toBe("What is TRAI?");
  });

  it("ignores assistant-only or malformed history", () => {
    expect(
      extractPrompt({
        messages: [
          { role: "assistant", content: "No user prompt" },
          null,
          "bad",
        ],
      })
    ).toBe("");
  });
});

describe("static H.K. public claim projection (regression)", () => {
  it("does not emit the provisional application number", () => {
    const answer = hkAnswer("Tell me about the patent filing");
    expect(answer).toContain("U.S. provisional filed");
    expect(answer).not.toMatch(/63\/?934/i);
  });

  it("projects the canonical Foundation status", () => {
    const answer = hkAnswer("What is the Peoples Foundation status?");
    expect(answer).toContain("Operating under §508(c)(1)(A)");
    expect(answer).toContain("not a claim of an IRS determination letter");
    expect(answer).not.toContain("exemption pending");
  });

  it("projects the canonical TechBridge maturity", () => {
    expect(hkAnswer("Is TechBridge operating?")).toContain(
      "Designed · not yet operating"
    );
  });

  it("states the organism doctrine without collapsing TRAI into a portfolio", () => {
    const answer = hkAnswer("What is the Mandate of Mistrust in TRAI?");
    expect(answer).toContain("one living Sovereignty Stack");
    expect(answer).toContain("Mandate of Mistrust");
    expect(answer).toContain("not a holding company");
  });

  it("states the Tamerian position with an evidence boundary", () => {
    const answer = hkAnswer("What is Tamerian Materials?");
    expect(answer).toContain(
      "bio-derived multifunctional composites for self-powered sensing"
    );
    expect(answer).toContain(
      "complete-system performance remains to be validated"
    );
    expect(answer).toContain(
      "full lifecycle carbon impact still requires measurement"
    );
  });
});
