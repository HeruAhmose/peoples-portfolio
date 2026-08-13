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
    expect(hkAnswer("What is the Peoples Foundation status?")).toContain(
      "EIN obtained · exemption pending"
    );
  });

  it("projects the canonical TechBridge maturity", () => {
    expect(hkAnswer("Is TechBridge operating?")).toContain(
      "Designed · not yet operating"
    );
  });
});
