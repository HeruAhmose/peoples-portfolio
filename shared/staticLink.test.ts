import { describe, expect, it } from "vitest";
import { extractPrompt } from "../client/src/lib/staticLink";

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
